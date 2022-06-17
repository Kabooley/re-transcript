/***********************************************************
static content script


機能：
    1. Udemy講義ページのトランスクリプト機能がONになっているか検知する
    2. Udemy講義ページの字幕の言語が英語になっているか検知する
    3. 1, 2を調査して必要に応じてbackground scriptへ送信する

Injectタイミング:
    動的content scriptとして、
    Udemyの講義ページURLへマッチするwebページにおいて、
    POPUP上の実行ボタンが押されたらinjectされる

通信に関して：
    single message passing機能でbackground.jsと通信する


handlerOfControlbar()でコントロールバー上のクリックイベントを監視する
moControlbarでコントロールバー上でトランスクリプト・トグルボタンが現れたか消えたかを監視する


************************************************************/

/**********************************************************
 * content script
 *
 * Functionality:
 * 1. Watch if Transcript is turning on.
 * 2. Watch if subtitle language is English.
 * 3. Send result of 1 and 2 to background script.
 *
 * Watch control bar on Udemy movie container to detect click event on it.
 * This content script will be injected dynamically.
 *
 * *********************************************************/

import * as selectors from '../utils/selectors';
import {
    iMessage,
    iResponse,
    extensionNames,
    orderNames,
} from '../utils/constants';
import { sendMessagePromise, repeatActionPromise } from '../utils/helpers';
import { DomManipulationError, uError } from '../Error/Error';

//
// --- GLOBALS ---------------------------------------------------
//

const INTERVAL_TIME = 500;
// Delay to wait finish event.
const DELAY_AFTER_EVENT = 200;
let moControlbar: MutationObserver = null;
let controlbar: HTMLElement = null;

//
// --- CHROME API LISTENERS -------------------------------------
//

/**
 * Message Handler
 *
 * @param {iMessage} message
 * @param {function} sendResponse:
 * Invoke this function to response. The function is required.
 * @return {boolean} - MUST RETURN TRUE TO RUN sendResponse asynchronously.
 *
 *  1. sendStatus:
 *   Survey the subtitle language is English or not,
 *   and Transcript is open or not.
 *
 *  2. reset
 *    Run initialize() and respond result.
 *
 *  3. isPageIncludingMovie
 *    Survey the page is including Movie container or not.
 *
 *  4. turnOff
 *    Disconnect MutationObserver and remove event listener from Controlbar
 * */
chrome.runtime.onMessage.addListener(
    (
        message: iMessage,
        sender,
        sendResponse: (response: iResponse) => void
    ): boolean => {
        const { from, order, to } = message;
        const response: iResponse = {
            from: extensionNames.contentScript,
            to: from,
        };
        if (to !== extensionNames.contentScript) return;

        // ORDERS:
        if (order && order.length) {
            // SEND STATUS
            if (order.includes(orderNames.sendStatus)) {
                //
                try {
                    const isEnglish: boolean = isSubtitleEnglish();
                    let isOpen: boolean = false;
                    const toggle: HTMLElement =
                        document.querySelector<HTMLElement>(
                            selectors.controlBar.transcript.toggleButton
                        );
                    if (!toggle) isOpen = false;
                    else isOpen = isTranscriptOpen();

                    response.language = isEnglish;
                    response.isTranscriptDisplaying = isOpen;
                    // response.success = true;
                    response.complete = true;
                } catch (err) {
                    // response.success = false;
                    response.error = err;
                    response.complete = false;
                } finally {
                    sendResponse(response);
                }
            }
            // RESET
            if (order.includes(orderNames.reset)) {
                handlerOfReset()
                    .then(() => {
                        response.success = true;
                        response.complete = true;
                    })
                    .catch((e: uError) => {
                        console.error(e.message);
                        response.success = false;
                        response.complete = false;
                        response.error = e;
                    })
                    .finally(() => {
                        sendResponse(response);
                    });
            }

            // Require to make sure the page is including movie container or not.
            if (order.includes(orderNames.isPageIncludingMovie)) {
                repeatCheckQueryAcquired(selectors.videoContainer, true)
                    .then((r: boolean) => {
                        response.isPageIncludingMovie = r;
                        response.complete = true;
                    })
                    .catch((err) => {
                        console.error(err);
                        response.complete = false;
                        response.error = err;
                    })
                    .finally(() => {
                        sendResponse(response);
                    });
            }
            // TURN OFF
            if (order.includes(orderNames.turnOff)) {
                moControlbar.disconnect();
                controlbar.removeEventListener('click', handlerOfControlbar);
                // moControlbar and controlbar should be null?
                response.complete = true;
                sendResponse(response);
            }
        }
        return true;
    }
);

/**
 *  Sends status of injected page to background.
 *
 * @param order:
 * @param {boolean} isOpened - True as Transcript is open.
 * @param {boolean} isEnglish - True as subtitle language is English.
 * */
const sendToBackground = async (order: {
    isOpened?: boolean;
    isEnglish?: boolean;
}): Promise<void> => {
    const { isOpened, isEnglish } = order;
    const m: iMessage = {
        from: extensionNames.contentScript,
        to: extensionNames.background,
    };

    if (isOpened !== undefined) {
        m['isTranscriptDisplaying'] = isOpened;
    }
    if (isEnglish !== undefined) {
        m['language'] = isEnglish;
    }

    await sendMessagePromise(m);
};

//
// ---- MAJOUR HANDLERS -----------------------------------------
//

/**
 * Handler of RESET order.
 *
 * Invoke initialize().
 * */
const handlerOfReset = async (): Promise<void> => {
    try {
        await initialize();
    } catch (e) {
        throw e;
    }
};

/**
 *  Handler of Click Event on Controlbar
 *
 * @param {PointEvent} ev
 *
 *
 * setTimeout() callback will be fired after click event has been done immediately.
 *
 * */
const handlerOfControlbar = function (ev: PointerEvent): void {
    //
    // Get DOMs among click event.
    const path: EventTarget[] = ev.composedPath();
    // DOM: toggle button of Transcript
    const transcriptToggle: HTMLElement = document.querySelector<HTMLElement>(
        selectors.controlBar.transcript.toggleButton
    );
    // Toggle button of theater mode.
    const theaterToggle: HTMLElement = document.querySelector<HTMLElement>(
        selectors.controlBar.theatre.theatreToggle
    );
    // Menu of Closed Caption
    const ccPopupMenu: HTMLElement = document.querySelector<HTMLElement>(
        selectors.controlBar.cc.menuListParent
    );

    // Callback will be run after Click event has done.
    setTimeout(function () {
        // If either toggle button clicked...
        // Check Transcript toggle button is exist.
        // If exist, invoke isTranscriptOpen().
        // If no, send result to background script.
        if (path.includes(transcriptToggle) || path.includes(theaterToggle)) {
            let result: boolean;
            const t: HTMLElement = document.querySelector<HTMLElement>(
                selectors.controlBar.transcript.toggleButton
            );
            if (!t) result = false;
            else result = isTranscriptOpen();
            sendToBackground({ isOpened: result });
        }
        // If click event has happend in cc popup menu,
        // find out if the subtitle language has been changed,
        // or if subtitle setting has been changed.
        if (path.includes(ccPopupMenu)) {
            if (isItSelectLanguageMenu()) {
                const r: boolean = isSubtitleEnglish();
                sendToBackground({ isEnglish: r });
            }
        }
    }, DELAY_AFTER_EVENT);
};

//
// --- SURVEY METHODS --------------------------------------------
//

/**
 * Check Transcript is opened or not.
 *
 * @returns {boolean}: true for open, false for not open.
 *
 * Get DOM everytime this function invoked.
 * */
const isTranscriptOpen = (): boolean => {
    const toggleButton: HTMLElement = document.querySelector<HTMLElement>(
        selectors.controlBar.transcript.toggleButton
    );
    return toggleButton.getAttribute('aria-expanded') === 'true' ? true : false;
};

/****************************************************
 * Check Subtitle language is English or not.
 *
 * Get DOM everytime this function invoked.
 *
 * @returns {boolean}: True as it's English, false as not.
 * @throws {DomManipulationError} : When dom acquisition failes.
 * Exception might be happen when selector is not matches.
 *
 *
 * checkButtons: CCポップアップメニューのリスト要素で、button要素。選択中であるかどうかの属性を含み、その順番を取得する。
 *
 * menuList: 上記button要素の子要素である。innertTextにメニューに表示されている文字列を含む。字幕の言語や字幕設定などの文字列。
 * 先の順番を基にmenuListのなかの要素のinenrTextをしらべて選択中の言を特定する
 *
 * TODO: Fix: 上記要素のうち言語と関係ないもの(字幕設定など)もリストに含まれているので
 * その時は無視するようにする
 *
 */
const isSubtitleEnglish = (): boolean => {
    const listParent: HTMLElement = document.querySelector<HTMLElement>(
        selectors.controlBar.cc.menuListParent
    );
    const checkButtons: NodeListOf<HTMLElement> =
        listParent.querySelectorAll<HTMLElement>(
            // TODO: change selector to `selectors.controlBar.cc.checkButtons
            selectors.controlBar.cc.menuCheckButtons
        );
    const menuList: NodeListOf<HTMLElement> =
        listParent.querySelectorAll<HTMLElement>(
            selectors.controlBar.cc.menuList
        );

    if (!listParent || !checkButtons || !menuList)
        throw new DomManipulationError('Failed to manipulate DOM');

    // 1. メニューリストのうちどの言語が選択中なのか調べる
    // 選択中であるかどうかを示す属性のbooleanをチェックして
    // trueであったときの順番を記憶する
    let counter: number = 0;
    let i: number = null;
    const els: HTMLElement[] = Array.from<HTMLElement>(checkButtons);
    for (const btn of els) {
        if (btn.getAttribute('aria-checked') === 'true') {
            i = counter;
            break;
        }
        counter++;
    }
    if (!i) {
        throw new Error(
            'Error: [isSubtitleEnglish()] Something went wrong but No language is selected'
        );
    }

    // 2. 1でしらべた順番にある要素の中のinnerTextから選択中の言語を特定する
    const currentLanguage: string = Array.from(menuList)[i].innerText;
    // NOTE: TEST -------------------------------------
    if (currentLanguage.includes('字幕設定')) {
    }
    // ----------------------------------------------------
    if (currentLanguage.includes('English') || currentLanguage.includes('英語'))
        return true;
    else return false;
};

//
// --- OBSERVER METHODS -----------------------------------------
//

// コントロールバーの子要素だけ追加されたのか削除されたのか知りたいので
// childListだけtrueにする
const config: MutationObserverInit = {
    attributes: false,
    childList: true,
    subtree: false,
};

/*
    NOTE: JavaScript Tips: NodeからElementを取得して、datasetを取得する方法

    record.removedNodes.forEach((node) => {
        
        
        
        
            node.childNodes[0].parentElement.firstElementChild
        );
        
            node.childNodes[0].parentElement.firstElementChild
                .attributes
        );
        
            node.childNodes[0].parentElement.firstElementChild.getAttribute(
                'data-purpose'
            )
        );
*/
const moCallback = (mr: MutationRecord[]): void => {
    let guard: boolean = false;
    mr.forEach((record) => {
        if (record.type === 'childList' && !guard) {
            // NOTE: MutationRecord[0]だけしらべればいいので1週目だけでループを止める
            // じゃぁforEach()を使うなという話ではあるけど...
            guard = true;

            // Added Nodes
            record.addedNodes.forEach((node) => {
                const dataPurpose: string =
                    node.childNodes[0].parentElement.firstElementChild.getAttribute(
                        'data-purpose'
                    );
                if (dataPurpose && dataPurpose === 'transcript-toggle') {
                    sendToBackground({ isOpened: isTranscriptOpen() });
                }
            });

            // Removed Nodes
            record.removedNodes.forEach((node) => {
                // これで取得できた！！！
                const dataPurpose: string =
                    node.childNodes[0].parentElement.firstElementChild.getAttribute(
                        'data-purpose'
                    );
                if (dataPurpose && dataPurpose === 'transcript-toggle') {
                    sendToBackground({ isOpened: false });
                }
            });
        }
    });
};

//
// ---- OTHER METHODS -------------------------------------------
//

/************************************************
 *
 * 与えられたselectorからDOMが存在するかしらべて
 * 真偽値を返す
 */
const investTheElementIncluded = (selector: string): boolean => {
    const e: HTMLElement = document.querySelector<HTMLElement>(selector);
    return e ? true : false;
};

/**************************************************
 * Repeat checking if DOM has been acquired.
 * @param {string} selector : selector for dom about to acquire.
 * @param {boolean} timeoutAsResolve: If true, then timeout will not occure error.
 * @return {boolean} : Return boolean result. True as dom acquired. False as not.
 *
 * */
const repeatCheckQueryAcquired = async (
    selector: string,
    timeoutAsResolve: boolean = false
): Promise<boolean> => {
    try {
        return await repeatActionPromise(
            function () {
                return investTheElementIncluded(selector);
            },
            timeoutAsResolve,
            100,
            10
        );
    } catch (e) {
        throw e;
    }
};

/*************************************************
 * Repeat to try query dom by given selector.
 * @param {string} selector: Selector for dom about to acquire.
 * @return {promise} represents HTMLElement as success.
 * @throws {DomManipulationError}
 *
 * repeatCheckQueryAcquired()でDOMが現れるまで待つ
 * 現れたらDOMを取得して返す
 *
 * 現れないでタイムアウトなら例外を投げる
 * */
const repeatQuerySelector = async (selector: string): Promise<HTMLElement> => {
    try {
        await repeatCheckQueryAcquired(selector);
        return document.querySelector<HTMLElement>(selector);
    } catch (err) {
        throw new DomManipulationError(
            `DomManipulationError: Could not get DOM by selector ${selector}`
        );
    }
};

/***
 * 表示中のCC popup menuが、
 * 「字幕言語選択画面」なのか「字幕設定画面」なのか判定する
 *
 * このCSSセレクタで取得できる要素があれば前者
 * nullなら後者という判定になる
 *
 * NOTE: CC popup menu上でのonClickイベント時には必ず呼び出すこと
 * */
const isItSelectLanguageMenu = (): boolean => {
    const menu: HTMLElement = document.querySelector<HTMLElement>(
        'div.control-bar-dropdown--menu--2bFbL.control-bar-dropdown--menu-dark--3cSQg > ul[data-purpose="captions-dropdown-menu"] > li[role="none"] > ul[aria-label="字幕"] > button'
    );
    return menu ? true : false;
};

/*****************************************
 *  Initialize for detecting injected page status.
 *
 *  set up controlbar click event listener.
 *  set up MutationObserver of controlbar.
 * */
const initialize = async (): Promise<void> => {
    try {
        // いったんMutationObserverを停止してから...
        if (moControlbar) moControlbar.disconnect();
        moControlbar = null;
        moControlbar = new MutationObserver(moCallback);
        // controlbarのDOMを再取得
        if (controlbar)
            controlbar.removeEventListener('click', handlerOfControlbar);
        controlbar = null;
        controlbar = await repeatQuerySelector(selectors.transcript.controlbar);
        controlbar.addEventListener('click', handlerOfControlbar);
        // 再度、更新済のDOMに対してMutationObserverを設置する
        moControlbar.observe(controlbar, config);
    } catch (err) {
        if (err instanceof DomManipulationError)
            console.error(`DomManipulationError: ${err.message}`);
        throw err;
    }
};

/**
 * Entry Point
 *
 * */
(function () {
    initialize().catch((e) => {
        chrome.runtime.sendMessage({
            from: extensionNames.contentScript,
            to: extensionNames.background,
            success: false,
            error: e,
        });
    });
})();

//
// --- LEGACY CODE ---------------------------------------------
//

// const initialize = async (): Promise<void> => {
//
//   try {
//     // Set up listeners

//     const w: number = document.documentElement.clientWidth;
//     if (w > TOGGLE_VANISH_BOUNDARY) {
//       const toggleButton: HTMLElement = document.querySelector<HTMLElement>(
//         selectors.controlBar.transcript.toggleButton
//       );
//       toggleButton.addEventListener(
//         "click",
//         transcriptToggleButtonHandler,
//         false
//       );
//       isWindowTooSmall = false;
//     } else {
//       isWindowTooSmall = true;
//     }

//     window.addEventListener("resize", function () {
//       clearTimeout(timerQueue);
//       timerQueue = setTimeout(onWindowResizeHandler, RESIZE_TIMER);
//     });

//     const ccButton: HTMLElement = document.querySelector<HTMLElement>(
//       selectors.controlBar.cc.popupButton
//     );
//     ccButton.addEventListener("click", ccPopupButtonHandler, true);
//
//   } catch (err) {
//     console.error(err.message);
//   }
// };

// -- LEGACY CODE -----------------------------------------------

// THESE selectors MOVED TO './constansInContentScrip/ts'
// 12/28
//
// const _selectors = {
//     controlBar: {
//         // "closed captioning"
//         cc: {
//             // 字幕メニューpopupボタン
//             popupButton: "button[data-purpose='captions-dropdown-button']",
//             // textContentで取得できる言語を取得可能
//             //   languageList:
//             //     "button.udlite-btn.udlite-btn-large.udlite-btn-ghost.udlite-text-sm.udlite-block-list-item.udlite-block-list-item-small.udlite-block-list-item-neutral > div.udlite-block-list-item-content",
//             //
//             // 言語リストを取得するには一旦languageButtonsを取得してからそれからquerySelectorする
//             // いらないかも
//             menuCheckButtons: 'button',
//             menuList: '.udlite-block-list-item-content',
//             menuListParent:
//                 "ul[role='menu'][data-purpose='captions-dropdown-menu']",
//             // 上記のセレクタのラッパーボタン。
//             // 属性`aria-checked`で選択されているかどうかわかる
//             checkButtons:
//                 'button.udlite-btn.udlite-btn-large.udlite-btn-ghost.udlite-text-sm.udlite-block-list-item.udlite-block-list-item-small.udlite-block-list-item-neutral',
//         },
//         transcript: {
//             toggleButton: "button[data-purpose='transcript-toggle']",
//         },
//     },
//     sectionTitle: 'div.udlite-text-md.video-viewer--title-overlay--OoQ6e',
// };

// const initialize = (): void => {
//     // Set up transcript check
//     const isOpen: boolean = isTranscriptOpen();
//     sendToBackground({ isOpened: isOpen });
//     const e: HTMLElement = document.querySelector<HTMLElement>(
//         SELECTORS.controlBar.transcript.toggleButton
//     );
//     e.addEventListener('click', transcriptToggleButtonHandler, false);
//     // Set up language check
//     const isEnglish: boolean = isSubtitleEnglish();
//     sendToBackground({ isEnglish: isEnglish });
//     const b: HTMLElement = document.querySelector<HTMLElement>(
//         SELECTORS.controlBar.cc.popupButton
//     );
//     b.addEventListener('click', ccPopupButtonHandler, true);
//     // Send section title to background
//     sendTitle();
// };

/**
 * Callback of ClickEvent on CC Popup BUTTON
 *
 * Check if ClosedCaption Popup menu is opened.
 * If it's opened, then add onClick event listener to document
 * to detect subtitle change.
 *
 * NOTE: 変化タイミングの誤差のため"aria-expanded"がfalseの時にイベントリスナを取り付ける
 * */
// const ccPopupButtonHandler = (ev: MouseEvent): void => {
//     // popupメニューが開かれているかチェック
//     // 開かれているならclickリスナをメニューラッパーとdocumentに着ける
//     // とにかく
//     // メニューの外側をクリックしたらすべてのリスナをremoveする
//
//     // is it opening?
//     const e: HTMLElement = document.querySelector<HTMLElement>(
//         selectors.controlBar.cc.popupButton
//     );

//     // aria-expanded === trueのときになぜかfalseを返すので
//     // 反対の結果を送信する
//     if (e.getAttribute('aria-expanded') !== 'true') {
//         // CC popupメニューが表示された
//         document.removeEventListener('click', ccPopupMenuClickHandler, true);
//         document.addEventListener('click', ccPopupMenuClickHandler, true);
//     }
// };
/**
 * ブラウザウィンドウがX軸方向に境界線をまたいだときだけ機能する
 *
 * */
// const onWindowResizeHandler = (ev): void => {
//     const w: number = document.documentElement.clientWidth;
//
//     // When window shrinks less than the boundary
//     // Then send status.
//     if (w < TOGGLE_VANISH_BOUNDARY && !isWindowTooSmall) {
//
//         isWindowTooSmall = true;
//         // windowサイズが小さくなりすぎると、トグルボタンのDOMは消えるから
//         // イベントリスナはremoveする必要がないけど、
//         // 念のため
//         const toggleButton: HTMLElement = document.querySelector<HTMLElement>(
//             selectors.controlBar.transcript.toggleButton
//         );
//         if (!toggleButton) {
//             sendToBackground({ isOpened: false });
//         }
//     }
//     // When window bend over vanish boundary
//     // Then reset toggle button to add listener.
//     if (w >= TOGGLE_VANISH_BOUNDARY && isWindowTooSmall) {
//
//         isWindowTooSmall = false;
//         const toggleButton: HTMLElement = document.querySelector<HTMLElement>(
//             selectors.controlBar.transcript.toggleButton
//         );
//         toggleButton.addEventListener(
//             'click',
//             transcriptToggleButtonHandler,
//             false
//         );
//     }
// };

/**
 * Callback of ClickEvent on toggle button of Transcript.
 *
 * NOTE: When click event fired, "aria-expanded" is not change its value yet.
 * So if this get true, then take that as "aria-expanded" about to be false.
 * */
// const transcriptToggleButtonHandler = (ev?: MouseEvent): void => {
//     const latest: HTMLElement = document.querySelector<HTMLElement>(
//         selectors.controlBar.transcript.toggleButton
//     );

//     // "aria-expanded"変更直前の値なので反対を返す
//     latest.getAttribute('aria-expanded') === 'true'
//         ? sendToBackground({ isOpened: false })
//         : sendToBackground({ isOpened: true });

// Transcriptが消えるブラウザウィンドウX軸の境界値
// const TOGGLE_VANISH_BOUNDARY: number = 584;
// Transcriptがブラウザサイズによって消えているのかどうか
// let isWindowTooSmall: boolean;
// windowのonResizeイベント発火遅延用
// let timerQueue: NodeJS.Timeout = null;

// /**
//  * Callback of ClickEvent on CC Popup MENU
//  *
//  * If user click outside of menu,
//  * check subtitle has been changed.
//  * If so, notify to background and remove listener from document.
//  * Click inside do nothing.
//  * */
//  const ccPopupMenuClickHandler = (ev: PointerEvent): void => {
//
//   const menu: HTMLElement = document.querySelector<HTMLElement>(
//       selectors.controlBar.cc.menuListParent
//   );

//   const path: EventTarget[] = ev.composedPath();
//   if (path.includes(menu)) {
//       // menuの内側でclickが発生した
//       // 何もしない
//
//   } else {
//
//       // menuの外側でclickが発生した
//       // 字幕が変更されたかチェックして結果を送信する
//       const r: boolean = isSubtitleEnglish();
//       sendToBackground({ isEnglish: r });
//       document.removeEventListener('click', ccPopupMenuClickHandler, true);
//   }
// };

// /****
//  * @param {selector} string : Selector for DOM about to capture.
//  * @return {promise} HTMLElement : Resolved when matched, rejected when times out or not matched.
//  *
//  * 取得元のwebページがローディング中などでなかなかすぐにDOMがロードされないときとかに使う
//  * 指定のDOMが取得できるまで、繰り返し取得を試みる
//  * １０回取得を試みても取得できなかったらnullを返す
//  * */
//  const repeatQueryDom = async (selector: string): Promise<HTMLElement> => {
//     return new Promise((resolve, reject): void => {
//         let intervalId: NodeJS.Timer;
//         let counter: number = 10;

//         intervalId = setInterval(function () {
//             if (counter <= 0) {
//                 // Failed
//
//                 clearInterval(intervalId);
//                 reject(null);
//             }

//
//             const e: HTMLElement = document.querySelector(selector);
//             if (e) {
//                 // Succeed
//
//                 clearInterval(intervalId);
//                 resolve(e);
//             } else counter--;
//         }, INTERVAL_TIME);
//     });
// };

// /************************************************
//  * alert() on injected page.
//  *
//  * */
// const displayAlert = (message: string): void => {
//     alert(message);
// }

// const isSubtitleEnglish = (): boolean => {
//   const listParent: HTMLElement = document.querySelector<HTMLElement>(
//     selectors.controlBar.cc.menuListParent
//   );
//   const checkButtons: NodeListOf<HTMLElement> =
//     listParent.querySelectorAll<HTMLElement>(
//       // TODO: selectors.controlBar.cc.checkButtonsに変更してテスト
//       selectors.controlBar.cc.menuCheckButtons
//     );
//   const menuList: NodeListOf<HTMLElement> =
//     listParent.querySelectorAll<HTMLElement>(selectors.controlBar.cc.menuList);

//   if (!listParent || !checkButtons || !menuList)
//     throw new DomManipulationError("Failed to manipulate DOM");

//   // 1. メニューリストのうちどの言語が選択中なのか調べる
//   // 選択中であるかどうかを示す属性のbooleanをチェックして
//   // trueであったときの順番を記憶する
//   let counter: number = 0;
//   let i: number = null;
//   const els: HTMLElement[] = Array.from<HTMLElement>(checkButtons);
//   for (const btn of els) {
//     if (btn.getAttribute("aria-checked") === "true") {
//       i = counter;
//       break;
//     }
//     counter++;
//   }
//   if (!i) {
//     throw new Error(
//       "Error: [isSubtitleEnglish()] Something went wrong but No language is selected"
//     );
//   }

//   // 2. 1でしらべた順番にある要素の中のinnerTextから選択中の言語を特定する
//   const currentLanguage: string = Array.from(menuList)[i].innerText;
//   // NOTE: TEST -------------------------------------
//   if(currentLanguage.includes("字幕設定")) {
//
//   }
//   // ----------------------------------------------------
//   if (currentLanguage.includes("English") || currentLanguage.includes("英語"))
//     return true;
//   else return false;
// };
