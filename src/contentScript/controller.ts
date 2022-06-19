/*********************************************************
 * CONTROLLER
 *
 * Controller of ExTranscript.
 *
 * Features:
 * - Communicate with background script.
 * - Generate ExTranscript or disappear it by following background script order.
 * - Receive retouched subtitles passively and then pass it to ExTranscript View.
 * - Watch browser resize and scroll to display views appropriately for the situation.
 * - Has Models
 *
 * */
import * as selectors from '../utils/selectors';
import {
    extensionNames,
    iMessage,
    iResponse,
    orderNames,
    subtitle_piece,
    RESIZE_BOUNDARY,
    RESIZE_TIMER,
    positionStatus,
    keyof_positionStatus,
} from '../utils/constants';
import MutationObserver_ from '../utils/MutationObserver_';
import { ExTranscriptModel, SubtitleModel } from '../model/ExTranscriptModel';
import { Callback } from '../utils/constants';
import { Dashboard } from '../view/Dashboard';
import { Sidebar } from '../view/Sidebar';

//
// ----- GLOBALS -----------------------------------------
//
chrome.runtime.sendMessage;

// ----- Annotations -------------------------------------

// Annotations of sStatus.
export interface iController {
    // 本家Transcriptのポジション2通り
    position: keyof_positionStatus;
    // 本家Transcriptでハイライトされている字幕の要素の順番
    highlight: number;
    // ExTranscriptの字幕要素のうち、いまハイライトしている要素の順番
    ExHighlight: number;
    // _subtitlesのindexプロパティからなる配列
    indexList: number[];
    // 自動スクロール機能が展開済かどうか
    isAutoscrollInitialized: boolean;
    // ブラウザサイズが小さすぎる状態かどうか
    isWindowTooSmall: boolean;
    // Udemyの自動スクロール機能がONかOFFか
    isAutoscrollOn: boolean;
}

// Annotation of sSubtitles.
export interface iSubtitles {
    subtitles: subtitle_piece[];
}

// Base object of sStatus.
const statusBase: iController = {
    // NOTE: position, viewの初期値は意味をなさず、
    // すぐに変更されることが前提である
    position: null,
    highlight: null,
    ExHighlight: null,
    indexList: null,
    isAutoscrollInitialized: false,
    isWindowTooSmall: false,
    isAutoscrollOn: false,
};

// Base object of sSubtitles
const subtitleBase: iSubtitles = {
    subtitles: [],
};

// Models
let model: ExTranscriptModel;
let mSubtitles: SubtitleModel;
// Views
let sidebar: Sidebar;
let dashboard: Dashboard;

// ウィンドウが小さすぎてトランスクリプトが表示されなくなる境界値
const MINIMUM_BOUNDARY = 600;
let timerQueue: NodeJS.Timeout = null;
let transcriptListObserver: MutationObserver_ = null;

// Config of MutationObserver for auto high light.
const moConfig: MutationObserverInit = {
    attributes: true,
    childList: false,
    subtree: false,
    attributeOldValue: true,
} as const;

/**
 * Callback of MutationObserver for auto high light.
 *
 * @param {MutationObserver_} this -
 * @param {MutationRecord[]} mr - MutationObserverが発火したときに受け取るAPI既定の引数
 *
 * guard: 以下の理由で設けている変数
 *
 * NOTE: Udemyの字幕はまったく同じ字幕要素が2個も3個も生成されている
 *
 * つまりまったく同じ要素が同時に複数存在する状況が発生してしまっている
 * 多分バグだけど、同じ要素が何個も生成されてしまうとリスナが何度も
 * 反応してしまう可能性がある
 *
 * */
const moCallback = function (
    this: MutationObserver_,
    mr: MutationRecord[]
): void {
    let guard: boolean = false;
    mr.forEach((record: MutationRecord) => {
        if (
            record.type === 'attributes' &&
            record.attributeName === 'class' &&
            record.oldValue === '' &&
            !guard
        ) {
            guard = true;
            try {
                updateHighlightIndexes();
                // updateExTranscriptHighlight();
                // scrollToHighlight();
            } catch (e) {
                chrome.runtime.sendMessage({
                    from: extensionNames.controller,
                    to: extensionNames.background,
                    error: e,
                });
            }
        }
    });
};

//
// --- CHROME LISTENERS ----------------------------------------
//

/**
 * Chrome API: on message handler.
 *
 * @return {boolean} - Return true to indicate that it will respond asynchronously.
 *
 * Always run sendResponse in finally block so that send error to background script.
 * */
chrome.runtime.onMessage.addListener(
    async (
        message: iMessage,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: iResponse) => void
    ): Promise<boolean> => {
        const { from, to, order, ...rest } = message;
        if (to !== extensionNames.controller) return;
        const response: iResponse = { from: to, to: from };

        if (order && order.length) {
            if (order.includes(orderNames.reset)) {
                try {
                    handlerOfReset();
                    response.complete = true;
                } catch (e) {
                    response.error = e;
                    response.complete = false;
                } finally {
                    sendResponse(response);
                }
            }
            if (order.includes(orderNames.turnOff)) {
                try {
                    handlerOfTurnOff();
                    response.success = true;
                    response.complete = true;
                } catch (e) {
                    response.success = false;
                    response.error = e;
                    response.complete = false;
                } finally {
                    sendResponse(response);
                }
            }
        }
        // 字幕データが送られてきたら
        if (rest.subtitles) {
            try {
                mSubtitles.set({ subtitles: rest.subtitles });
                response.success = true;
                response.complete = true;
            } catch (e) {
                response.success = false;
                response.error = e;
                response.complete = false;
            } finally {
                sendResponse(response);
            }
        }
        return true;
    }
);

//
// --- VIEW METHODS ------------------------------------------
//

/**
 * Insert sidebar ExTranscript
 * And clear previous ExTranscript.
 * */
const renderSidebar = (): void => {
    const { subtitles } = mSubtitles.get();
    dashboard.clear();
    sidebar.render(subtitles);
    // sidebarの時だけに必要
    window.addEventListener('scroll', onWindowScrollHandler);
};

/**
 * Insert bttom ExTranscript
 * And clear previoud ExTranscript.
 * */
const renderBottomTranscript = (): void => {
    const { subtitles } = mSubtitles.get();
    sidebar.clear();
    dashboard.render(subtitles);
    // noSidebarの時は不要
    window.removeEventListener('scroll', onWindowScrollHandler);
};

//
// --- HANDLERS ----------------------------------------------
//

/**
 * Handler of Turning off ExTranscript.
 *
 * */
const handlerOfTurnOff = (): void => {
    // REMOVAL Listeners
    window.removeEventListener('resize', reductionOfwindowResizeHandler);
    window.removeEventListener('scroll', onWindowScrollHandler);

    // CLEAR ExTranscript
    const { position } = model.get();
    if (position === positionStatus.sidebar) {
        sidebar.clear();
    } else {
        dashboard.clear();
    }

    // REMOVAL MutationObserver
    transcriptListObserver.disconnect();

    // RESET ({ ...statusBase });
    model.set({ ...statusBase });
    mSubtitles.set({ ...subtitleBase });
};

/**
 * Handler of Reset ExTranscript.
 *
 * */
const handlerOfReset = (): void => {
    handlerOfTurnOff();

    // NOTE: 以下はEntry Pointの後半の処理と同じである
    const w: number = document.documentElement.clientWidth;
    const s: keyof_positionStatus =
        w > RESIZE_BOUNDARY ? positionStatus.sidebar : positionStatus.noSidebar;
    model.set({ position: s });

    window.addEventListener('resize', reductionOfwindowResizeHandler);
    resetAutoscrollCheckboxListener();
};

/**
 * Window onScroll handler.
 *
 * When window scrolled,
 * update ExTranscript top position, and
 * update ExTranscript content height.
 * */
const onWindowScrollHandler = (): void => {
    const header: HTMLElement = document.querySelector<HTMLElement>(
        selectors.header
    );
    const headerHeight: number = parseInt(
        window.getComputedStyle(header).height.replace('px', '')
    );
    const y: number = window.scrollY;
    y < headerHeight
        ? sidebar.updateContentTop(headerHeight - y)
        : sidebar.updateContentTop(0);
    sidebar.updateContentHeight();
};

/**
 * Window onResize handler.
 *
 * If window clientWidth straddle the MINIMUM_BOUNDARY, update state.
 * If window clientWidth straddle the RESIZE_BOUNDARY, update state.
 *
 * */
const onWindowResizeHandler = (): void => {
    const w: number = document.documentElement.clientWidth;
    const { position, isWindowTooSmall } = model.get();

    //  MINIMUM_BOUNDARYの境界値をまたいだ時は何もしない
    if (w < MINIMUM_BOUNDARY && !isWindowTooSmall) {
        model.set({ isWindowTooSmall: true });
        return;
    }
    if (w > MINIMUM_BOUNDARY && isWindowTooSmall) {
        model.set({ isWindowTooSmall: false });
    }

    // ブラウザの幅がRESIZE_BOUNDARYを上回るとき
    // Transcriptをsidebarに設置する
    if (w > RESIZE_BOUNDARY && position !== positionStatus.sidebar)
        model.set({ position: positionStatus.sidebar });

    // ブラウザの幅がRESIZE＿BOUNDARYを下回るとき
    // Transcriptを動画下部に表示する
    if (w <= RESIZE_BOUNDARY && position !== positionStatus.noSidebar)
        model.set({ position: positionStatus.noSidebar });

    // 最新のpositionを取得してから
    if (model.get().position === 'sidebar') sidebar.updateContentHeight();
};

/**
 * Reduction of onWindowResizeHandler()
 *
 * Delays reaction of window resize.
 * */
const reductionOfwindowResizeHandler = (): void => {
    clearTimeout(timerQueue);
    timerQueue = setTimeout(onWindowResizeHandler, RESIZE_TIMER);
};

//
// ----- METHODS RELATED TO AUTO SCROLL & HIGHLIGHT --------------------
//

/**
 * Initialize sStatus.indexList
 *
 * sSubtitles.subtitlesのindex番号からなる配列を
 * sStatus.indexListとして保存する
 *
 * */
const initializeIndexList = (): void => {
    const { subtitles } = mSubtitles.get();
    const indexes: number[] = subtitles.map((s) => s.index);
    model.set({ indexList: indexes });
};

/**
 * Returns the index number if the list contains passed element.
 *
 * @param {NodeListOf<Element>} from - List of subtitles data.
 * @param {Element} lookFor - Check whether the element is contained in the array.
 * @return {number} - Return index number of passed element in passed array.
 * NOTE: -1 as element was not contained.
 *
 * @throws {Error}
 * If "lookFor" param was null, then an exception is thrown to prevent next step.
 *
 * TODO: -1を返す以外の方法ないかしら
 * もしくは-1をenumでラベル付けにするとか
 * */
/**
 * 例外発生検証結果：
 * 1. lookForがnullでfromが空でない配列だと、-1を返して、例外は発生しない
 * 2. 逆にfromがnullだとTypeErrorがgetElementIndexOfList()で発生する
 *
 *  */
const getElementIndexOfList = (
    from: NodeListOf<Element>,
    lookFor: Element
): number => {
    var num: number = 0;
    for (const el of Array.from(from)) {
        if (el === lookFor) return num;
        num++;
    }
    return -1;
};

/**
 * Update sStatus.highlight index number everytime transcriptListObserver has been observed.
 *
 * Save index number of latest highlighted element in Transcript.
 *
 * @throws {SyntaxError}:
 * SyntaxError possibly occures if DOM unable to caught.
 * @throws {RangeError}:
 * Thrown if getElementIndexOfList() returned -1 not to steps next.
 *
 * */
const updateHighlightIndexes = (): void => {
    // １．本家のハイライト要素を取得して、その要素群の中での「順番」を保存する
    const nextHighlight: Element = document.querySelector<Element>(
        selectors.transcript.highlight
    );
    const list: NodeListOf<HTMLSpanElement> = document.querySelectorAll(
        selectors.transcript.transcripts
    );
    const next: number = getElementIndexOfList(list, nextHighlight);
    if (next < 0) throw new RangeError('Returned value is out of range.');
    model.set({ highlight: next });
};

/**
 * Highlight ExTranscript element based on sStatus.ExHighlight.
 *
 * Invoked by updateExHighlight().
 *
 * TODO: (対応)currentもnextもnullであってはならない場面でnullだとsyntaxerrorになる
 * */
const highlightExTranscript = (): void => {
    // 次ハイライトする要素のdata-idの番号
    const { ExHighlight, position } = model.get();
    const next: HTMLElement =
        position === positionStatus.sidebar
            ? document.querySelector<HTMLElement>(
                  `${selectors.EX.sidebarCueContainer}[data-id="${ExHighlight}"]`
              )
            : document.querySelector<HTMLElement>(
                  `${selectors.EX.dashboardTranscriptCueContainer}[data-id="${ExHighlight}"]`
              );
    // 現在のハイライト要素
    const current: HTMLElement =
        position === positionStatus.sidebar
            ? document.querySelector<HTMLElement>(
                  `${selectors.EX.sidebarCueContainer}${selectors.EX.highlight}`
              )
            : document.querySelector<HTMLElement>(
                  `${selectors.EX.dashboardTranscriptCueContainer}${selectors.EX.highlight}`
              );
    if (!current) {
        //   初期化時

        next.classList.add(selectors.EX.highlight.slice(1));
    } else {
        //   更新時
        const currentIndex: number = parseInt(current.getAttribute('data-id'));

        // もしも変わらないなら何もしない
        if (currentIndex === ExHighlight) {
            return;
        }
        // 更新ならば、前回のハイライト要素を解除して次の要素をハイライトさせる
        else {
            current.classList.remove(selectors.EX.highlight.slice(1));
            next.classList.add(selectors.EX.highlight.slice(1));
        }
    }
};

/**
 * Scroll to Highlight Element on ExTranscript
 *
 * Make ExTranscript subtitle panel scroll to latest highlighted element.
 *
 * - sStatus.isAutoscrollOnがfalseならば何もしない
 *
 * - スクロール方法は3通り
 *
 * ExTranscriptのコンテンツ・パネル要素、現在のハイライト字幕要素の、
 * getBoundingClientRect()を取得する
 * getBoudingClientRect()はviewportの左上を基準とするので...
 * その要素がviewport上のどこにあるのかと、ウィンドウがスクロールしている場合に影響を受ける
 *
 * そのため、
 *
 * 1. ハイライト要素がコンテンツ・パネル要素よりも上にあるとき
 * 2. ハイライト要素がコンテンツ・パネル要素よりも下にいるときで、なおかつハイライト要素のy座標が正であるとき
 * 3. ２の場合で、ただしハイライト要素のy座標が負であるとき
 *
 * の3通りに沿って、コンテンツ・パネル要素のscrollTopプロパティを調整する
 *
 * - Element.scrollTopの値で調整する
 *
 * Element.scrollTop
 * 要素はスクロール可能であるならば実際の上辺の位置と表示領域の上辺は異なり
 * scrollTopはこの差を出力する
 *
 * スクロールバーが最も上にあるならばscrollTopは0、
 * スクロールしているならば表示領域上辺と要素の上辺の差を出力する
 * そして必ず正の値である
 *
 * - ハイライト要素はコンテンツ・パネルの表示領域の上辺から100px下に表示される
 *
 * TODO: marginTopを加味した計算方法が正しいのか確認
 * */
const scrollToHighlight = (): void => {
    // そのたびにいまハイライトしている要素を取得する
    const { ExHighlight, position, isAutoscrollOn } = model.get();
    if (!isAutoscrollOn) return;

    const current: HTMLElement =
        position === positionStatus.sidebar
            ? document.querySelector<HTMLElement>(
                  `${selectors.EX.sidebarCueContainer}[data-id="${ExHighlight}"]`
              )
            : document.querySelector<HTMLElement>(
                  `${selectors.EX.dashboardTranscriptCueContainer}[data-id="${ExHighlight}"]`
              );
    const panel: HTMLElement =
        position === positionStatus.sidebar
            ? document.querySelector(selectors.EX.sidebarContent)
            : document.querySelector(selectors.EX.dashboardTranscriptPanel);

    const panelRect: DOMRect = panel.getBoundingClientRect();
    const currentRect: DOMRect = current.getBoundingClientRect();

    const marginTop: number = 100;
    if (currentRect.y > panelRect.y) {
        const distance: number = currentRect.y - panelRect.y;
        panel.scrollTop = distance + panel.scrollTop - marginTop;
    } else {
        if (currentRect.y > 0) {
            const distance: number = panelRect.y - currentRect.y;
            panel.scrollTop = panel.scrollTop - distance - marginTop;
        } else {
            const distance = panelRect.y + Math.abs(currentRect.y);
            panel.scrollTop = panel.scrollTop - distance - marginTop;
        }
    }
};

/**
 * Reset MutationObserver API for detect scroll system.
 *
 * Reset based on sStatus.isAutroscrollInitialized.
 *
 * Udemyの自動スクロール機能と同じ機能をセットアップする関数
 *
 * NOTE: Udemyの字幕はまったく同じ字幕要素が2個も3個も生成されている
 *
 * つまりまったく同じ要素が同時に複数存在する状況が発生してしまっている
 * 多分バグだけど、同じ要素が何個も生成されてしまうとリスナが何度も
 * 反応してしまう可能性がある
 * MutationObserverのコールバック関数にはこれを避けるための仕組みを設けている
 *
 *
 *
 * */
const resetDetectScroll = (): void => {
    const { isAutoscrollInitialized } = model.get();
    if (!isAutoscrollInitialized) {
        // 初期化処理
        // 一旦リセットしてから
        if (transcriptListObserver) {
            transcriptListObserver.disconnect();
            transcriptListObserver = null;
        }
        //   NodeListOf HTMLSpanElement
        const transcriptList: NodeListOf<Element> = document.querySelectorAll(
            selectors.transcript.transcripts
        );
        transcriptListObserver = new MutationObserver_(
            moCallback,
            moConfig,
            transcriptList
        );
        transcriptListObserver.observe();

        model.set({ isAutoscrollInitialized: true });
    } else {
        // リセット処理: targetを変更するだけ
        transcriptListObserver.disconnect();
        //   NodeListOf HTMLSpanElement
        const transcriptList: NodeListOf<Element> = document.querySelectorAll(
            selectors.transcript.transcripts
        );
        transcriptListObserver._target = transcriptList;
        transcriptListObserver.observe();
    }
};

//
// --- OTHER LISTENERS -----------------------------------
//

/**
 * Handler of click event on auto scroll check box.
 * Update sStatus.isAutoscrollOn value by checking `checked` value.
 * */
const autoscrollCheckboxClickHandler = (): void => {
    setTimeout(function () {
        const cb: HTMLInputElement = document.querySelector(
            selectors.transcript.autoscroll
        );
        model.set({ isAutoscrollOn: cb.checked });
    }, 100);
};

/**
 * Reset listener for click event on autoscroll checkbox.
 *
 * NOTE: Element A may not be retrieved because the selector does not match. Not only the element is not exist.
 * So might miss the selector has been updated.
 * */
const resetAutoscrollCheckboxListener = (): void => {
    const cb: HTMLInputElement = document.querySelector(
        selectors.transcript.autoscroll
    );
    if (!cb) return;
    model.set({ isAutoscrollOn: cb.checked });
    cb.removeEventListener('click', autoscrollCheckboxClickHandler);
    cb.addEventListener('click', autoscrollCheckboxClickHandler);
};

//
// --- UPDATE STATE METHODS -----------------------------------
//

/**
 *  Update subtitles rendering.
 *
 * 常にExTranscript viewを再レンダリングさせる
 *
 * sStatus.positionがnull
 * またはprop.subtitlesがundefinedであるときは無視する
 *
 *
 * NOTE: prop.positionがnullであるならば即ちExTranscriptは非表示であるという前提にある
 * */
const updateSubtitle: Callback<iSubtitles> = (prop): void => {
    const { position } = model.get();
    if (!position || prop.subtitles === undefined) return;

    position === positionStatus.sidebar
        ? renderSidebar()
        : renderBottomTranscript();
    // TODO: 以下の初期化を外部化したい
    initializeIndexList();
    resetDetectScroll();
};

/**
 * Update ExTranscript Position
 *
 * 常にExTranscript viewを再レンダリングする
 *
 * props.positionがundefinedまたはnullのときは無視する
 *
 * NOTE: prop.positionがnullであるならば即ちExTranscriptは非表示であるという前提にある
 * */
const updatePosition: Callback<iController> = (prop): void => {
    const { position } = prop;
    if (position === undefined || !position) return;

    position === positionStatus.sidebar
        ? renderSidebar()
        : renderBottomTranscript();

    // TODO: 以下の初期化を外部化したい
    resetDetectScroll();
    resetAutoscrollCheckboxListener();
};

/**
 * Invoked when sStatus.highlight changed.
 *
 * Actually, update sStatus.ExHighlight based on updated sStatus.highlight.
 *
 * */
const updateHighlight: Callback<iController> = (prop): void => {
    const { isAutoscrollInitialized, indexList } = model.get();

    if (prop.highlight === undefined || !isAutoscrollInitialized) return;

    // ExTranscriptのハイライト要素の番号を保存する
    const next: number = prop.highlight;
    if (indexList.includes(next)) {
        model.set({ ExHighlight: next });
    } else {
        // 一致するindexがない場合
        // currentHighlightの番号に最も近い、currentHighlightより小さいindexをsetする
        let prev: number = null;
        for (let i of indexList) {
            if (i > next) {
                model.set({ ExHighlight: prev });
                break;
            }
            prev = i;
        }
    }
};

/**
 * Invoked when sStatus.ExHighlight changed.
 *
 * Triggers highlightExTranscript() everytime sStatus.ExHighlight changed.
 *
 * */
const updateExHighlight: Callback<iController> = (prop): void => {
    const { isAutoscrollInitialized } = model.get();
    if (prop.ExHighlight === undefined || !isAutoscrollInitialized) return;

    highlightExTranscript();
    scrollToHighlight();
};

/**
 * Entry Point
 *
 * */
(function (): void {
    // Models
    model = ExTranscriptModel.build(statusBase);
    mSubtitles = SubtitleModel.build(subtitleBase);

    // Views
    sidebar = new Sidebar(
        selectors.EX,
        selectors.EX.sidebarParent,
        selectors.EX.sidebarWrapper,
        'sidebar-template-@9999'
    );
    dashboard = new Dashboard(
        selectors.EX,
        selectors.EX.noSidebarParent,
        selectors.EX.dashboardTranscriptWrapper,
        'dashboard-template-@9999'
    );

    // Registration event handler
    model.on('change', updatePosition);
    model.on('change', updateHighlight);
    model.on('change', updateExHighlight);
    mSubtitles.on('change', updateSubtitle);

    // 初期のExTranscriptの展開場所に関するステータスを取得する
    const w: number = document.documentElement.clientWidth;
    const s: keyof_positionStatus =
        w > RESIZE_BOUNDARY ? positionStatus.sidebar : positionStatus.noSidebar;
    model.set({ position: s });

    model.set({ isWindowTooSmall: w < MINIMUM_BOUNDARY ? true : false });

    window.removeEventListener('resize', reductionOfwindowResizeHandler);
    window.addEventListener('resize', reductionOfwindowResizeHandler);
    // 自動スクロールチェック状態監視リスナ
    resetAutoscrollCheckboxListener();
})();
