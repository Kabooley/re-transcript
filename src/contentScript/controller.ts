/********************************************************
 * controller
 * ____________________________________________
 *
 * 本家Udemy講義ページのトランスクリプト機能と(ほぼ)同じものを生成する
 * 字幕データだけ、特別に生成された字幕データを取り扱う
 *
 * 機能：
 * - background scriptからの要請に応じてExTranscriptを展開または非表示にする
 * - 字幕データはbackground scriptから送信されしだい展開する
 * - ExTranscriptの表示の仕方は本家トランスクリプトと同様の動きになるように制御する機能
 * - ブラウザの横幅が小さくなりすぎたかどうかもこちらで計算する機能
 *  これによりonWindowResizeHandler()の一部が実行されないように制限をかける
 *  これはbackground scriptからのorderとonWindowResizeHandler()がバッティングするのを防ぐ
 * 　応急処置である
 *
 *
 * 制約：
 * - ExTranscriptの表示・非表示はbackground scriptの指示に従う
 * - 字幕データはこちらか要求しない
 *
 * NOTE:
 *
 * - 自動スクロール機能は本家の自動スクロール・チェックボックスを実装しない。
 * これは仕様とする
 *
 *
 * TODO: コード中の'TODO'を確認して修正のこと
 *
 *
 * *******************************************************/
import sidebarTranscriptView from './sidebarTranscriptView';
import bottomTranscriptView from './bottomTranscriptView';
import * as selectors from '../utils/selectors';
import {
    extensionNames,
    iMessage,
    iResponse,
    orderNames,
    subtitle_piece,
    RESIZE_BOUNDARY,
    SIDEBAR_WIDTH_BOUNDARY,
    RESIZE_TIMER,
    SIGNAL,
    positionStatus,
    viewStatusNames,
    keyof_viewStatus,
    keyof_positionStatus,
} from '../utils/constants';
import Observable from '../utils/Observable';
import State from '../utils/contentScript/State';
import MutationObserver_ from '../utils/MutationObserver_';
import { DomManipulationError } from '../Error/Error';
// import { sendMessagePromise } from "../utils/helpers";

//
// ----- GLOBALS -----------------------------------------
//

// ----- Annotations -------------------------------------
interface iController {
    // 本家Transcriptのポジション2通り
    position: keyof_positionStatus;
    // 本家Transcriptがsidebarであるときの表示のされ方2通り
    view: keyof_viewStatus;
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
}

// 字幕データはでかいので、毎回気軽に呼び出さないでほしい
// そのため別にしておく
interface iSubtitles {
    subtitles: subtitle_piece[];
}

const statusBase: iController = {
    // NOTE: position, viewの初期値は意味をなさず、
    // すぐに変更されることが前提である
    position: null,
    view: null,
    highlight: null,
    ExHighlight: null,
    indexList: null,
    isAutoscrollInitialized: false,
    isWindowTooSmall: false,
};

const subtitleBase: iSubtitles = {
    subtitles: [],
};

// ウィンドウが小さすぎてトランスクリプトが表示されなくなる境界値
const MINIMUM_BOUNDARY = 600;
let timerQueue: NodeJS.Timeout = null;
let sStatus: State<iController>;
let sSubtitles: State<iSubtitles>;
let transcriptListObserver: MutationObserver_ = null;

const moConfig: MutationObserverInit = {
    attributes: true,
    childList: false,
    subtree: false,
    attributeOldValue: true,
} as const;

/*************************************************************************
 * Callback for MutationObserver.
 *
 * guard: 以下の理由で設けている変数
 *
 * NOTE: Udemyの字幕はまったく同じ字幕要素が2個も3個も生成されている
 *
 * つまりまったく同じ要素が同時に複数存在する状況が発生してしまっている
 * 多分バグだけど、同じ要素が何個も生成されてしまうとリスナが何度も
 * 反応してしまう可能性がある
 *
 *
 * */
 const moCallback = function (
    this: MutationObserver_,
    mr: MutationRecord[]
  ): void {
    let guard: boolean = false;
    mr.forEach((record: MutationRecord) => {
      if (
        record.type === "attributes" &&
        record.attributeName === "class" &&
        record.oldValue === "" &&
        !guard
      ) {
        console.log("OBSERVED");
        guard = true;
        try {
          updateHighlightIndexes();
          updateExTranscriptHighlight();
          scrollToHighlight();
        }
        catch(e) {
          chrome.runtime.sendMessage({
            from: extensionNames.controller,
            to: extensionNames.background,
            error: e
          });
        }
      }
    });
  };
  
//
// --- CHROME LISTENERS ----------------------------------------
//

/***************************************************************
 * On Message Handler
 *
 * @return {boolean} Return true to indicate that it will respond asynchronously.
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

        console.log('[controller] CONTROLLER GOT MESSAGE');

        if (order && order.length) {
            if (order.includes(orderNames.reset)) {
                console.log('[controller] order: RESET');
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
                console.log('[controller] order: TURN OFF ExTranscript');
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
            console.log('[controller] Got subtitles');
            try {
                sSubtitles.setState({ subtitles: rest.subtitles });
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

/************************************************
 * Insert sidebar ExTranscript
 * And clear previoud ExTranscript.
 * */
const renderSidebarTranscript = (): void => {
    console.log('[controller] Rerender sidebar ExTranscript');
    const { subtitles } = sSubtitles.getState();
    bottomTranscriptView.clear();
    sidebarTranscriptView.clear();
    sidebarTranscriptView.render(subtitles);
    sidebarTranscriptView.updateContentHeight();
    // sidebarの時だけに必要
    window.addEventListener('scroll', onWindowScrollHandler);
};

/************************************************
 * Insert bttom ExTranscript
 * And clear previoud ExTranscript.
 * */
const renderBottomTranscript = (): void => {
    console.log('[controller] Rerender bottom ExTranscript');

    const { subtitles } = sSubtitles.getState();
    sidebarTranscriptView.clear();
    bottomTranscriptView.clear();
    bottomTranscriptView.render(subtitles);
    // noSidebarの時は不要
    window.removeEventListener('scroll', onWindowScrollHandler);
};

//
// --- HANDLERS ----------------------------------------------
//

/************************************************
 * Reduction of onWindowResizeHandler()
 *
 * Delays reaction of window resize.
 * */
const reductionOfwindowResizeHandler = (): void => {
    clearTimeout(timerQueue);
    timerQueue = setTimeout(onWindowResizeHandler, RESIZE_TIMER);
};

/************************************************
 * Handler of Turning off ExTranscript.
 *
 *
 * */
const handlerOfTurnOff = (): void => {
    console.log('[controller] handlerOfTurnOff()');

    // REMOVAL Listeners
    window.removeEventListener('resize', reductionOfwindowResizeHandler);
    window.removeEventListener('scroll', onWindowScrollHandler);

    // CLEAR ExTranscript
    const { position } = sStatus.getState();
    if (position === positionStatus.sidebar) {
        sidebarTranscriptView.clear();
    } else {
        bottomTranscriptView.clear();
    }

    // REMOVAL MutationObserver
    transcriptListObserver.disconnect();

    // RESET State
    sStatus.setState({ ...statusBase });
    sSubtitles.setState({ ...subtitleBase });
};

/**************************************************
 * Handler of Reset ExTranscript.
 *
 *
 * */
const handlerOfReset = (): void => {
    console.log('[controller] handlerOfReset()');

    handlerOfTurnOff();

    // NOTE: 以下はMAINの後半の処理と同じである
    const w: number = document.documentElement.clientWidth;
    const s: keyof_positionStatus =
        w > RESIZE_BOUNDARY ? positionStatus.sidebar : positionStatus.noSidebar;
    sStatus.setState({ position: s });

    if (s === positionStatus.sidebar) {
        sStatus.setState({
            view:
                w > SIDEBAR_WIDTH_BOUNDARY
                    ? viewStatusNames.wideView
                    : viewStatusNames.middleView,
        });
    }

    window.addEventListener('resize', reductionOfwindowResizeHandler);
};

/**********************************************************
 * OnScroll handler for sidebar ExTranscript.
 *
 * */
const onWindowScrollHandler = (): void => {
    console.log('[controller] onWindowScrollHandler()');
    const y: number = window.scrollY;
    y < 56
        ? sidebarTranscriptView.updateContentTop(56 - y)
        : sidebarTranscriptView.updateContentTop(0);
};

/*************************************************************
 * window onResize handler.
 *
 * Checks...
 * If window clientWidth straddle the MINIMUM_BOUNDARY, update state.
 * If window clientWidth straddle the RESIZE_BOUNDARY, update state.
 * If ExTranscript is sidebar, check if window clientWidth straddble
 * the SIDEBAR_WIDTH_BOUNDARY to update view state.
 * */
const onWindowResizeHandler = (): void => {
    console.log('[controller] onWindowResizeHandler()');

    const w: number = document.documentElement.clientWidth;
    const { position, view, isWindowTooSmall } = sStatus.getState();

    //  MINIMUM_BOUNDARYの境界値をまたいだ時は何もしない
    if (w < MINIMUM_BOUNDARY && !isWindowTooSmall) {
        sStatus.setState({ isWindowTooSmall: true });
        return;
    }
    if (w > MINIMUM_BOUNDARY && isWindowTooSmall) {
        sStatus.setState({ isWindowTooSmall: false });
        return;
    }

    // ブラウザの幅がRESIZE_BOUNDARYを上回るとき
    // Transcriptをsidebarに設置する
    if (w > RESIZE_BOUNDARY && position !== positionStatus.sidebar) {
        sStatus.setState({ position: positionStatus.sidebar });
        sStatus.setState({ view: viewStatusNames.middleView });

        // 同時に、sidebar時のTranscriptの表示方法の変更
        sStatus.setState({
            view:
                w > SIDEBAR_WIDTH_BOUNDARY
                    ? viewStatusNames.wideView
                    : viewStatusNames.middleView,
        });
    }

    // ブラウザの幅がRESIZE＿BOUNDARYを下回るとき
    // Transcriptを動画下部に表示する
    if (w < RESIZE_BOUNDARY && position !== positionStatus.noSidebar) {
        sStatus.setState({ position: positionStatus.noSidebar });
    }

    // Transcriptがsidebarの時、
    // 2通りある表示方法を決定する
    if (position === positionStatus.sidebar) {
        sidebarTranscriptView.updateContentHeight();
        if (view === viewStatusNames.middleView && w > SIDEBAR_WIDTH_BOUNDARY) {
            // sidebar widthを300pxから25%へ
            sStatus.setState({ view: viewStatusNames.wideView });
        }
        if (view === viewStatusNames.wideView && w < SIDEBAR_WIDTH_BOUNDARY) {
            // sideba widthを25%から300pxへ
            sStatus.setState({ view: viewStatusNames.middleView });
        }
    }
};

//
// ----- METHODS RELATED TO AUTO SCROLL -----------------------------
//

/***********************************************************************
 * Initialize sStatus.indexList
 *
 * sSubtitles.subtitlesのindex番号からなる配列を
 * sStatus.indexListとして保存する
 *
 * */
const initializeIndexList = (): void => {
    console.log('[controller] initializeIndexList()');
    const { subtitles } = sSubtitles.getState();
    const indexes: number[] = subtitles.map((s) => s.index);
    sStatus.setState({ indexList: indexes });
};

/************************************************************************
 * Returns the index number if the list contains an element.
 *
 * @param {NodeListOf<Element>} from: List of subtitles data.
 * @param {Element} lookFor: Check whether the element is contained in the array.
 * @return {number} Return -1 as element was not contained.
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
    console.log('[controller] getElementIndexOfList()');
    var num: number = 0;
    for (const el of Array.from(from)) {
        if (el === lookFor) return num;
        num++;
    }
    // NOTE: ありえない値　一致するものがなかった場合
    return -1;
};

/*********************************************************************
 * Update sStatus.ExHighlight.
 * Invoked by MutationObserver
 * when Udemy highlighted element changed.
 *
 * 1. Get latest original highlighted element index.
 * 2. Check if the index number includes in sStaus.indexList.
 *    If not included,
 *    Sets the index closest to the current index number
 *    that is less than the "current highlight.
 *
 * NOTE: ExTranscript index list is different from Original index list.
 *
 * この関数はsStatus.ExHighlightを更新するための関数
 * sStatus更新内容をもとにレンダリング要素を更新するのは以下の関数で行う
 * updateExTranscriptHighlight()
 *
 * @throws {SyntaxError}:
 * SyntaxError possibly occures if DOM unable to caught.
 * @throws {RangeError}:
 * Thrown if getElementIndexOfList() returned -1 not to steps next.
 * 
 * 
 * */
const updateHighlightIndexes = (): void => {
    console.log('[controller] updateHighlightIndexes()');
    // １．本家のハイライト要素を取得して、その要素群の中での「順番」を保存する
    const nextHighlight: Element = document.querySelector<Element>(
        selectors.transcript.highlight
    );
    const list: NodeListOf<HTMLSpanElement> = document.querySelectorAll(
        selectors.transcript.transcripts
    );
    const next: number = getElementIndexOfList(list, nextHighlight);
    if(next < 0) throw new RangeError("Returned value is out of range.");

    sStatus.setState({ highlight: next });

    // 2. 1で取得した「順番」がstate._subtitlesのindexと一致するか比較して、
    // ExTranscriptのハイライト要素の番号を保存する
    const { indexList } = sStatus.getState();
    if (indexList.includes(next)) {
        sStatus.setState({ ExHighlight: next });
    } else {
        // 一致するindexがない場合
        // currentHighlightの番号に最も近い、currentHighlightより小さいindexをsetする
        let prev: number = null;
        for (let i of indexList) {
            if (i > next) {
                sStatus.setState({ ExHighlight: prev });
                break;
            }
            prev = i;
        }
    }
};

/***************************************************************************
 * Update ExTranscript highlighted element.
 * Invoked by MutationObserver
 * just after updateHighlightIndexes().
 *
 * Update based on sStatus.ExHighlight.
 *
 * TODO: (対応)currentもnextもnullであってはならない場面でnullだとsyntaxerrorになる
 * */
const updateExTranscriptHighlight = (): void => {
    console.log('[controller] updateExTranscriptHighlight()');
    // 次ハイライトする要素のdata-idの番号
    const { ExHighlight, position } = sStatus.getState();
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
        console.log('---- INITIALIZE -----');
        next.classList.add(selectors.EX.highlight.slice(1));
        console.log(next);
    } else {
        //   更新時
        const currentIndex: number = parseInt(current.getAttribute('data-id'));

        // もしも変わらないなら何もしない
        if (currentIndex === ExHighlight) {
            console.log('--- NO UPDATE ---');
            return;
        }
        // 更新ならば、前回のハイライト要素を解除して次の要素をハイライトさせる
        else {
            console.log('--- UPDATE ---');
            current.classList.remove(selectors.EX.highlight.slice(1));
            next.classList.add(selectors.EX.highlight.slice(1));
            console.log(next);
        }
    }
};

/********************************************************************
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
 * TODO: DOM transcriptList が取得できなくてもスルーされちゃうかも？
 *
 * 確認：`new MutationObserver()`の時にnullを渡したらSyntaxErrorになるかな？
 *
 * ***/
const resetDetectScroll = (): void => {
    console.log('[controller] reset Autro Scroll System');

    const { isAutoscrollInitialized } = sStatus.getState();
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

        sStatus.setState({ isAutoscrollInitialized: true });
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

/*****************************************************************
 * Scroll to Highlight
 *
 * Make ExTranscript subtitle panel scroll to latest highlighted element.
 *
 * TODO: (対応) DOMが取得できなかったらSyntaxErrorが発生する
 * */
const scrollToHighlight = (): void => {
    console.log('[controller] scrollToHighlight()');

    // そのたびにいまハイライトしている要素を取得する
    const { ExHighlight, position } = sStatus.getState();
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

    console.log(`currentRect.y: ${currentRect.y}`);
    console.log(`panelRect.y: ${panelRect.y}`);

    if (currentRect.y > panelRect.y) {
        const distance: number = currentRect.y - panelRect.y;
        panel.scrollTop = distance + panel.scrollTop;
    } else {
        if (currentRect.y > 0) {
            const distance: number = panelRect.y - currentRect.y;
            panel.scrollTop = panel.scrollTop - distance;
        } else {
            const distance = panelRect.y + Math.abs(currentRect.y);
            panel.scrollTop = panel.scrollTop - distance;
        }
    }
};

//
// --- UPDATE METHODS -----------------------------------
//

/**
 *  Update subtitles rendering.
 *
 * 常に受け取った字幕データ通りに再レンダリングさせる
 * 同時に、
 *
 * */
const updateSubtitle = (prop, prev): void => {
    if (prop.subtitles === undefined) return;

    // 字幕データのアップデート
    const { position, view } = sStatus.getState();
    if (position === 'sidebar') {
        renderSidebarTranscript();
        sidebarTranscriptView.updateContentHeight();
        view === 'middleView'
            ? sidebarTranscriptView.updateWidth(SIGNAL.widthStatus.middleview)
            : sidebarTranscriptView.updateWidth(SIGNAL.widthStatus.wideview);
    }
    if (position === 'noSidebar') {
        renderBottomTranscript();
    }

    initializeIndexList();
    resetDetectScroll();
};

const updatePosition = (prop, prev): void => {
    const { position } = prop;
    if (position === undefined) return;

    if (position === 'sidebar') renderSidebarTranscript();
    else if (position === 'noSidebar') renderBottomTranscript();
    // 必須：自動スクロール機能のリセット
    resetDetectScroll();
};

const updateSidebarView = (prop, prev): void => {
    const { view } = prop;
    if (view === undefined) return;

    if (view === 'middleView')
        sidebarTranscriptView.updateWidth(SIGNAL.widthStatus.middleview);
    else if (view === 'wideView')
        sidebarTranscriptView.updateWidth(SIGNAL.widthStatus.wideview);
};

// NOTE: リファクタリング未定...
// const updateHighlight = (prop, prev): void => {
//   const { highlight } = prop;
//   if (highlight === undefined) return;
//   console.log("[controller] UPDATED Highlight");
// };

// NOTE: リファクタリング未定...
// const updateExHighlight = (prop, prev): void => {
//   const { highlight } = prop;
//   if (highlight === undefined) return;
//   console.log("[controller] UPDATED ExHighlight");
// };

/******************************************************
 * Entry Point
 *
 * */
(function (): void {
    console.log('[controller] Initializing...');

    const oStatus: Observable<iController> = new Observable<iController>();
    const oSubtitle: Observable<iSubtitles> = new Observable<iSubtitles>();
    sStatus = new State(statusBase, oStatus);
    sSubtitles = new State(subtitleBase, oSubtitle);

    sSubtitles.observable.register(updateSubtitle);
    sStatus.observable.register(updatePosition);
    sStatus.observable.register(updateSidebarView);
    //   TODO: (未定)下記update関数が機能するようにリファクタリングするかも...
    //   sStatus.observable.register(updateHighlight);
    //   sStatus.observable.register(updateExHighlight);

    // 初期のExTranscriptの展開場所に関するステータスを取得する
    const w: number = document.documentElement.clientWidth;
    const s: keyof_positionStatus =
        w > RESIZE_BOUNDARY ? positionStatus.sidebar : positionStatus.noSidebar;
    sStatus.setState({ position: s });

    if (s === positionStatus.sidebar) {
        sStatus.setState({
            view:
                w > SIDEBAR_WIDTH_BOUNDARY
                    ? viewStatusNames.wideView
                    : viewStatusNames.middleView,
        });
    }

    sStatus.setState({ isWindowTooSmall: w < MINIMUM_BOUNDARY ? true : false });

    window.removeEventListener('resize', reductionOfwindowResizeHandler);
    window.addEventListener('resize', reductionOfwindowResizeHandler);
})();

//
// ---- LEGACY ----------------------------------------
//

// const init = async (): Promise<void> => {
//   try {
//     await sendMessagePromise({
//       from: extensionNames.controller,
//       to: extensionNames.background,
//       activated: true,
//     });
//     const temporary = state.loadSubtitles();
//     console.log(temporary);
//     const w: number = document.documentElement.clientWidth;
//     const s: keyof_positionStatus =
//       w > RESIZE_BOUNDARY
//         ? positionStatus.sidebar
//         : positionStatus.noSidebar;
//     state.setState({ position: s });
//     if (s === positionStatus.sidebar) {
//       renderSidebarTranscript();
//       sidebarTranscriptView.updateContentHeight();
//       if (w > SIDEBAR_WIDTH_BOUNDARY) {
//         state.setState({ view: viewStatusNames.wideView });
//         sidebarTranscriptView.updateWidth(SIGNAL.widthStatus.wideview);
//       } else {
//         state.setState({ view: viewStatusNames.middleView });
//         sidebarTranscriptView.updateWidth(SIGNAL.widthStatus.middleview);
//       }
//     } else {
//       renderBottomTranscript();
//     }

//     window.addEventListener("resize", function () {
//       clearTimeout(timerQueue);
//       timerQueue = setTimeout(onWindowResizeHandler, RESIZE_TIMER);
//     });

//     // --- ここまでで初期化完了 ---
//     // ViewにLoading画面を表示させる

//     // subtitlesをViewに表示準備できたら
//     // ViewのLoading画面を終了させる
//   } catch (err) {
//     if (err === chrome.runtime.lastError) {
//       console.error(err.message);
//     } else {
//       console.log(err);
//     }
//   }
// };
//
// init();

// /*
//     movieContainerClickHandler
//     _____________________________________
//     Udemyの講義ページで動画が再生開始したかどうかを判断する
//     これは一時停止かどうかではなく
//     ページのリロード時などに動画の上にリプレイボタンが表示されているかどうかである

//     リプレイボタン要素がなければ再生中という判断である

//     再生が始まったら初めて自動スクロール機能をセットできる

//     ...とおもったらclickイベントでbuttonがなくなったかチェックしようと思ったら
//     clickイベントが終わってからじゃにとbuttonは消去されないので
//     clickイベント中だと確認できない

//     MutationObserverつかうしかない？

// */
// const movieReplayClickHandler = (ev: PointerEvent): void => {
//   console.log("[controller] Movie clicked");
//   const movieContainer: HTMLElement = document.querySelector<HTMLElement>(
//     selectors.movieContainer
//   );
//   movieContainer.removeEventListener("click", movieReplayClickHandler);
//   //   set up auto scroll handling
//   //   initializeDetecting();
//   resetDetectScroll();
// };

// /*
//     resetDetectScroll()
//     ______________________________________

//     本家のハイライトされている字幕が、
//     自動スクロール機能で移り変わるたびに反応するオブザーバを生成する

//     12/7:
//     欲しいタイミングで発火していないみたい
//     _callbackの内容をMutationRecordを精査することで条件分岐させること

//     まず、Udemyは同じ字幕を2，3回繰り返し生成してしまうみたいで
//     つまりまったく同じ要素が同時に複数存在する状況が発生されてしまっている

//     これに伴って
//     MutationObserverのMutationRecordも複数ある要素のすべてを記録するので
//     1度だけ行いたい処理を2回以上行わなくてはならない危険性がある

//     これを避けるためにisItDoneで処理が既に完了しているのかどうかを確認するようにしている

// */
// const resetDetectScroll = (): void => {
//   const _callback = (mr: MutationRecord[]): void => {
//     console.log("observed");
//     var isItDone: boolean = false;
//     mr.forEach((record: MutationRecord) => {
//       if (
//         record.type === "attributes" &&
//         record.attributeName === "class" &&
//         record.oldValue === "" &&
//         !isItDone
//       ) {
//         // oldValueには""の時と、"ranscript--highlight-cue--1bEgq"の両方の時がある
//         // "ranscript--highlight-cue--1bEgq"をoldValueで受け取るときは
//         // ハイライトのclassをその要素からremoveしたときと考えて
//         // その時は何もしない
//         // 処理は1度だけになるように
//         console.log("-- observer executed --");
//         isItDone = true;
//         updateHighlightIndexes();
//         updateExTranscriptHighlight();
//         scrollToHighlight();
//       }
//     });
//   };

//   const observer: MutationObserver = new MutationObserver(_callback);

//   const config: MutationObserverInit = {
//     attributes: true,
//     childList: false,
//     subtree: false,
//     attributeOldValue: true,
//   };

//   //   NodeListOf HTMLSpanElement
//   const transcriptList: NodeListOf<Element> = document.querySelectorAll(
//     selectors.transcript.transcripts
//   );
//   transcriptList.forEach((ts) => {
//     observer.observe(ts, config);
//   });
// };

//
//     movieContainerClickHandler
//     _____________________________________
//     Udemyの講義ページで動画が再生開始したかどうかを判断する
//     これは一時停止かどうかではなく
//     ページのリロード時などに動画の上にリプレイボタンが表示されているかどうかである

//     リプレイボタン要素がなければ再生中という判断である

//     再生が始まったら初めて自動スクロール機能をセットできる

//     ...とおもったらclickイベントでbuttonがなくなったかチェックしようと思ったら
//     clickイベントが終わってからじゃにとbuttonは消去されないので
//     clickイベント中だと確認できない

//     MutationObserverつかうしかない？

//
// const movieReplayClickHandler = (ev: PointerEvent): void => {
//   console.log("[controller] Movie clicked");
//   const movieContainer: HTMLElement = document.querySelector<HTMLElement>(
//     selectors.transcript.movieContainer
//   );
//   movieContainer.removeEventListener("click", movieReplayClickHandler);
//   //   set up auto scroll handling
//   //   initializeDetecting();
//   resetDetectScroll();
