/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Error/Error.ts":
/*!****************************!*\
  !*** ./src/Error/Error.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ErrorBase": () => (/* binding */ ErrorBase),
/* harmony export */   "DomManipulationError": () => (/* binding */ DomManipulationError),
/* harmony export */   "PageStatusNotReadyError": () => (/* binding */ PageStatusNotReadyError)
/* harmony export */ });
class Err {
    constructor(message) {
        this.message = message;
        this.name = 'Error';
    }
}
class ErrorBase extends Err {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
class DomManipulationError extends ErrorBase {
    constructor(message) {
        super(message);
        this.name = 'DomManipulationError';
    }
}
/***********
 * Among contentScript.js
 * Thrown if subtitle is not English, or Transcript is not opened
 * */
class PageStatusNotReadyError extends ErrorBase {
    constructor(message) {
        super(message);
        this.name = 'PageStatusNotReadyError';
    }
}


/***/ }),

/***/ "./src/utils/constants.ts":
/*!********************************!*\
  !*** ./src/utils/constants.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "urlPattern": () => (/* binding */ urlPattern),
/* harmony export */   "extensionNames": () => (/* binding */ extensionNames),
/* harmony export */   "orderNames": () => (/* binding */ orderNames),
/* harmony export */   "_key_of_model_state__": () => (/* binding */ _key_of_model_state__),
/* harmony export */   "_key_of_localstorage__": () => (/* binding */ _key_of_localstorage__),
/* harmony export */   "copies": () => (/* binding */ copies),
/* harmony export */   "RESIZE_BOUNDARY": () => (/* binding */ RESIZE_BOUNDARY),
/* harmony export */   "RESIZE_TIMER": () => (/* binding */ RESIZE_TIMER),
/* harmony export */   "positionStatus": () => (/* binding */ positionStatus),
/* harmony export */   "messageTemplate": () => (/* binding */ messageTemplate)
/* harmony export */ });
// Valid URL pattern.
const urlPattern = /https:\/\/www.udemy.com\/course\/*/gm;
//
// --- RELATED TO MESSAGE PASSING -------------
//
// message passingで利用する拡張機能名称
const extensionNames = {
    popup: 'popup',
    contentScript: 'contentScript',
    controller: 'controller',
    captureSubtitle: 'captureSubtitle',
    background: 'background',
};
// message passingで利用する共通order名称
const orderNames = {
    // From background to contentScript
    sendStatus: 'sendStatus',
    // from controller to background
    sendSubtitles: 'sendSubtitles',
    // from popup, run process
    run: 'run',
    // reset content script
    reset: 'reset',
    // Turn Off ExTranscript
    turnOff: 'turnOff',
    // something succeeded
    success: 'success',
    // Is the page moved to text page?
    isPageIncludingMovie: 'isPageIncludingMovie',
    // Alert
    alert: 'alert',
};
// --- RELATED TO background.ts --------------
// Key for chrome.storage.local in background.ts
const _key_of_model_state__ = '_key_of_model_state__@&%8=8';
const _key_of_localstorage__ = '__key__of_local_storage__@&%8=8';
const copies = {};
// TODO: まだlocalStorageにこの情報が残っているかも...
// const _key_of_localstorage__ = "__key__of_local_storage__";
// --- RELATED TO controller.ts -----------------
// transcript要素はwinodwサイズが975px以下の時にdashboardへ以上でsidebarへ移動する
// export const RESIZE_BOUNDARY: number = 975;
const RESIZE_BOUNDARY = 963;
// window onResize時の反応遅延速度
const RESIZE_TIMER = 100;
const positionStatus = {
    sidebar: 'sidebar',
    noSidebar: 'noSidebar',
};
const messageTemplate = {
    appCannotExecute: '[拡張機能:Re Transcript] 拡張機能が実行不可能なエラーが起こりました。お手数ですが拡張機能をOFFにして展開中のページをリロードしてください。',
    letPagePrepare: '[拡張機能:Re Transcript] トランスクリプトと字幕表示をONにして、字幕言語を英語にしてから再度実行してください。',
};


/***/ }),

/***/ "./src/utils/helpers.ts":
/*!******************************!*\
  !*** ./src/utils/helpers.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "deepCopier": () => (/* binding */ deepCopier),
/* harmony export */   "sendMessageToTabsPromise": () => (/* binding */ sendMessageToTabsPromise),
/* harmony export */   "sendMessagePromise": () => (/* binding */ sendMessagePromise),
/* harmony export */   "tabQuery": () => (/* binding */ tabQuery),
/* harmony export */   "exciseBelowHash": () => (/* binding */ exciseBelowHash),
/* harmony export */   "repeatActionPromise": () => (/* binding */ repeatActionPromise),
/* harmony export */   "delay": () => (/* binding */ delay)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
// Returns deep copied data.
const deepCopier = (data) => {
    return JSON.parse(JSON.stringify(data));
};
/**
 * Promise will be solved when receiver returns response with { complete: true } object.
 *
 * If there is not { complete: true } object, then it throws exception.
 *
 * This is different from sendMessagePromise().
 * */
const sendMessageToTabsPromise = (tabId, message) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        chrome.tabs.sendMessage(tabId, message, (response) => __awaiter(void 0, void 0, void 0, function* () {
            const { complete } = response, rest = __rest(response, ["complete"]);
            complete
                ? resolve(rest)
                : reject('Send message to tabs went something wrong');
        }));
    }));
});
/**
 * Promise will be solved when receiver returns response with { complete: true } object.
 *
 * If there is not { complete: true } object, then it throws exception.
 *
 * This is different from sendMessageToTabsPromise().
 * */
const sendMessagePromise = (message) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        chrome.runtime.sendMessage(message, (response) => __awaiter(void 0, void 0, void 0, function* () {
            const { complete } = response, rest = __rest(response, ["complete"]);
            if (complete)
                resolve(rest);
            else
                reject();
        }));
    }));
});
/**
 * Returns Tab info of tab that active and last time focused
 *
 * @return {chrome.tabs.Tab[0]} - Returns first Tab info unless it gets multiple tabs info.
 * */
const tabQuery = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const w = yield chrome.windows.getCurrent();
        const tabs = yield chrome.tabs.query({
            active: true,
            currentWindow: true,
            lastFocusedWindow: true,
        });
        return tabs[0];
    }
    catch (err) {
        console.error(err.message);
    }
});
// Returns strings without after "#" charactor.
const exciseBelowHash = (url) => {
    return url.indexOf('#') < 0 ? url : url.slice(0, url.indexOf('#'));
};
/*********************
 * Repeat given async callback function.
 *
 * @param {action} Function:
 * the function that will be executed repeatedly.
 * NOTE: Function must returns boolean.
 * @param {timesoutResolve} boolean: true to allow this function to return false.
 * @param {times} number: Number that how many times repeat.
 * Default to 10.
 * @param {interval} number: Microseconds that repeat interval.
 * Default to 200.
 * @return {Promise} Promise objects represents boolean. True as matched, false as no-matched.
 * @throws
 *
 * Ref：https://stackoverflow.com/questions/61908676/convert-setinterval-to-promise
 *
 * Ref：https://levelup.gitconnected.com/how-to-turn-settimeout-and-setinterval-into-promises-6a4977f0ace3
 * */
const repeatActionPromise = (action, timeoutAsResolve = false, interval = 200, times = 10) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        let intervalId;
        let triesLeft = times;
        intervalId = setInterval(function () {
            return __awaiter(this, void 0, void 0, function* () {
                if (yield action()) {
                    clearInterval(intervalId);
                    // 正常な終了としてtrueを返す
                    resolve(true);
                }
                else if (triesLeft <= 1 && timeoutAsResolve) {
                    clearInterval(intervalId);
                    // 正常な終了でfalseを返す
                    resolve(false);
                }
                else if (triesLeft <= 1 && !timeoutAsResolve) {
                    clearInterval(intervalId);
                    // 例外エラーとしてcatchされる
                    reject();
                }
                triesLeft--;
            });
        }, interval);
    });
});
/****************
 * Wrapper of setTimeout with given function.
 *
 *
 * */
const delay = (action, timer) => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            const r = action();
            resolve(r);
        }, timer);
    });
};
// --- USAGE EXAMPLE --------------------------------------
// const randomMath = (): boolean => {
//   return Math.random() * 0.8 > 400 ? true : false;
// }
// const repeatQuerySelector = async (): Promise<boolean> => {
//   try {
//     // 第二引数をfalseにすると、ループで一度もマッチしなかった場合、例外エラーになる
//     // なので例外エラーにしたくなくて、falseも受け取りたいときは
//     // 第二引数をtrueにすること
//       const r: boolean = await repeatActionPromise(
//           function(): boolean {return randomMath()}, true
//       );
//       return r;
//   }
//   catch(err) {
//
//       // console.error(`Error: Could not query dom. ${err.message}`)
//       throw err;
//   }
// }
// (async function() {
//   const res = await repeatQuerySelector();
//
//
// })();


/***/ }),

/***/ "./src/utils/selectors.ts":
/*!********************************!*\
  !*** ./src/utils/selectors.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "videoContainer": () => (/* binding */ videoContainer),
/* harmony export */   "header": () => (/* binding */ header),
/* harmony export */   "transcript": () => (/* binding */ transcript),
/* harmony export */   "controlBar": () => (/* binding */ controlBar),
/* harmony export */   "EX": () => (/* binding */ EX)
/* harmony export */ });
/***************************************************
 * SELECTORS
 *
 * Including:
 * - Ud*my elements selectors.
 * - re-transcript generated elements selectors.
 *
 * **************************************************/
// --- Selectors related to Transcript ---------------------------
// Ud*my講義ページが動画ページならこのセレクタが一致する
// テキストページとかなら一致しない
const videoContainer = 'div.video-viewer--container--23VX7';
// new added. Ud*myページのNavbarヘッダ
const header = '.header--header--3k4a7';
const transcript = {
    // HTMLSpanElement which is Highlight as current subtitle on movie.
    highlight: 'span.transcript--highlight-cue--1bEgq',
    // NodeListOf<HTMLSpanElement> which are list of subtitle element.
    transcripts: 'div.transcript--cue-container--wu3UY p.transcript--underline-cue--3osdw span',
    // top element of side bar
    noSidebar: 'div.app--no-sidebar--1naXE',
    sidebar: 'div.has-sidebar',
    // High level element of Movie element
    movieContainer: 'div.app--curriculum-item--2GBGE',
    // Movie Replay button
    replayButton: "button[data-purpose='video-play-button-initial']",
    // Controlbar
    controlbar: "div.control-bar--control-bar--MweER[data-purpose='video-controls']",
    // Footer of Transcript when it is sidebar.
    footerOfSidebar: '.transcript--autoscroll-wrapper--oS-dz',
    // new added. 自動スクロールチェックボックス
    // AutoScroll Checkbox
    autoscroll: "[name='autoscroll-checkbox']",
};
// --- Selectors related to control bar. -------------------------
const controlBar = {
    // "closed captioning"
    cc: {
        // 字幕メニューpopupボタン
        popupButton: "button[data-purpose='captions-dropdown-button']",
        // textContentで取得できる言語を取得可能
        //   languageList:
        //     "button.udlite-btn.udlite-btn-large.udlite-btn-ghost.udlite-text-sm.udlite-block-list-item.udlite-block-list-item-small.udlite-block-list-item-neutral > div.udlite-block-list-item-content",
        //
        // 言語リストを取得するには一旦languageButtonsを取得してからそれからquerySelectorする
        // いらないかも
        menuCheckButtons: 'button',
        menuList: '.udlite-block-list-item-content',
        menuListParent: "ul[role='menu'][data-purpose='captions-dropdown-menu']",
        // 上記のセレクタのラッパーボタン。
        // 属性`aria-checked`で選択されているかどうかわかる
        checkButtons: 'button.udlite-btn.udlite-btn-large.udlite-btn-ghost.udlite-text-sm.udlite-block-list-item.udlite-block-list-item-small.udlite-block-list-item-neutral',
    },
    transcript: {
        toggleButton: "button[data-purpose='transcript-toggle']",
    },
    theatre: {
        theatreToggle: "button[data-purpose='theatre-mode-toggle-button']",
    },
};
// --- Selectors related ex-transcript -----------------------
const EX = {
    // Ud*my page-specific selector
    sidebarParent: '.app--content-column--HC_i1',
    noSidebarParent: '.app--dashboard-content--r2Ce9',
    movieContainer: '.app--body-container',
    // 独自selector `ex--`を接頭辞とする
    // sidebar ex-transcript selectors
    sidebarWrapper: '.ex-sidebar__column',
    sidebarSection: '.ex-sidebar__sidebar',
    sidebarHeader: '.ex-sidebar__header',
    sidebarContent: '.ex-sidebar__content',
    sidebarContentPanel: '.ex-transcript__panel',
    sidebarCueContainer: '.ex-transcript__cue-container',
    // recently added. '.ex-transcript__cue-container'の子要素のparagraphのclass名
    sidebarCue: '.ex-transcript__cue',
    // recently added. .ex-transcript__cue'の子要素のspan要素のdata-purposeの指定値
    sidebarCueSpan: 'ex-transcript__cue--text',
    sidebarFooter: '.ex-sidebar__footer',
    // sidebar width in case more than SIDEBAR_WIDTH_BOUNDARY
    wideView: '.ex--sidebar--wideview',
    // sidebar width in case less than SIDEBAR_WIDTH_BOUNDARY
    middleView: '.ex--sidebar--middleview',
    // bottom ex-transcript selectors
    dashboardTranscriptWrapper: '.ex-dashboard-transcript__wrapper',
    dashboardTranscriptHeader: '.ex-dashboard-transcript__header',
    dashboardTranscriptPanel: '.ex-dashboard-transcript__transcript--panel',
    dashboardTranscriptCueContainer: '.ex-dashboard-transcript__transcript--cue-container',
    dashboardTranscriptCue: '.ex-dashboard-transcript__transcript--cue',
    // data-purpose
    dashboardTranscriptCueText: 'ex--dashboard-cue-text',
    dashboardTranscriptBottom: '.ex-dashboard-transcript__footer',
    // To Highlight Transcriot Cue Container
    highlight: '.--highlight',
    closeButton: '.btn__close',
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************************************!*\
  !*** ./src/contentScript/contentScript.ts ***!
  \********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_selectors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/selectors */ "./src/utils/selectors.ts");
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/constants */ "./src/utils/constants.ts");
/* harmony import */ var _utils_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/helpers */ "./src/utils/helpers.ts");
/* harmony import */ var _Error_Error__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Error/Error */ "./src/Error/Error.ts");
/**********************************************************
 * content script
 *
 * Functionality:
 * 1. Watch if Transcript is turning on.
 * 2. Watch if subtitle language is English.
 * 3. Send result of 1 and 2 to background script.
 *
 * Watch control bar on movie container to detect click event on it.
 * Watch toggle buttons on control bar appeared or dispappeared by using moControlbar.
 * This content script will be injected dynamically.
 * Communicate with background script by using single message passing.
 *
 * *********************************************************/
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




//
// --- GLOBALS ---------------------------------------------------
//
const INTERVAL_TIME = 500;
// Delay to wait finish event.
const DELAY_AFTER_EVENT = 200;
let moControlbar = null;
let controlbar = null;
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
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { from, order, to } = message;
    const response = {
        from: _utils_constants__WEBPACK_IMPORTED_MODULE_1__.extensionNames.contentScript,
        to: from,
    };
    if (to !== _utils_constants__WEBPACK_IMPORTED_MODULE_1__.extensionNames.contentScript)
        return;
    // ORDERS:
    if (order && order.length) {
        // SEND STATUS
        if (order.includes(_utils_constants__WEBPACK_IMPORTED_MODULE_1__.orderNames.sendStatus)) {
            //
            try {
                const isEnglish = isSubtitleEnglish();
                let isOpen = false;
                const toggle = document.querySelector(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.controlBar.transcript.toggleButton);
                if (!toggle)
                    isOpen = false;
                else
                    isOpen = isTranscriptOpen();
                response.language = isEnglish;
                response.isTranscriptDisplaying = isOpen;
                // response.success = true;
                response.complete = true;
            }
            catch (err) {
                // response.success = false;
                response.error = err;
                response.complete = false;
            }
            finally {
                sendResponse(response);
            }
        }
        // RESET
        if (order.includes(_utils_constants__WEBPACK_IMPORTED_MODULE_1__.orderNames.reset)) {
            handlerOfReset()
                .then(() => {
                response.success = true;
                response.complete = true;
            })
                .catch((e) => {
                console.error(e.message);
                response.success = false;
                response.complete = false;
                response.error = e;
            })
                .finally(() => {
                sendResponse(response);
            });
        }
        // Is the page including Movie Container?
        if (order.includes(_utils_constants__WEBPACK_IMPORTED_MODULE_1__.orderNames.isPageIncludingMovie)) {
            repeatCheckQueryAcquired(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.videoContainer, true)
                .then((r) => {
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
        if (order.includes(_utils_constants__WEBPACK_IMPORTED_MODULE_1__.orderNames.turnOff)) {
            moControlbar.disconnect();
            controlbar.removeEventListener('click', handlerOfControlbar);
            // moControlbar and controlbar should be null?
            response.complete = true;
            sendResponse(response);
        }
    }
    return true;
});
/**
 *  Sends status of injected page to background.
 *
 * @param order:
 * @param {boolean} isOpened - True as Transcript is open.
 * @param {boolean} isEnglish - True as subtitle language is English.
 * */
const sendToBackground = (order) => __awaiter(void 0, void 0, void 0, function* () {
    const { isOpened, isEnglish } = order;
    const m = {
        from: _utils_constants__WEBPACK_IMPORTED_MODULE_1__.extensionNames.contentScript,
        to: _utils_constants__WEBPACK_IMPORTED_MODULE_1__.extensionNames.background,
    };
    if (isOpened !== undefined) {
        m['isTranscriptDisplaying'] = isOpened;
    }
    if (isEnglish !== undefined) {
        m['language'] = isEnglish;
    }
    yield (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_2__.sendMessagePromise)(m);
});
//
// ---- MAJOUR HANDLERS -----------------------------------------
//
/**
 * Handler of RESET order.
 *
 * Invoke initialize().
 * */
const handlerOfReset = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield initialize();
    }
    catch (e) {
        throw e;
    }
});
/**
 *  Handler of Click Event on Controlbar
 *
 * @param {PointEvent} ev
 *
 *
 * setTimeout() callback will be fired after click event has been done immediately.
 *
 * */
const handlerOfControlbar = function (ev) {
    //
    // Get DOMs among click event.
    const path = ev.composedPath();
    // DOM: toggle button of Transcript
    const transcriptToggle = document.querySelector(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.controlBar.transcript.toggleButton);
    // Toggle button of theater mode.
    const theaterToggle = document.querySelector(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.controlBar.theatre.theatreToggle);
    // Menu of Closed Caption
    const ccPopupMenu = document.querySelector(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.controlBar.cc.menuListParent);
    // Callback will be run after Click event has done.
    setTimeout(function () {
        // If either toggle button clicked...
        // Check Transcript toggle button is exist.
        // If exist, invoke isTranscriptOpen().
        // If no, send result to background script.
        if (path.includes(transcriptToggle) || path.includes(theaterToggle)) {
            let result;
            const t = document.querySelector(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.controlBar.transcript.toggleButton);
            if (!t)
                result = false;
            else
                result = isTranscriptOpen();
            sendToBackground({ isOpened: result });
        }
        // If click event has happend in cc popup menu,
        // find out if the subtitle language has been changed,
        // or if subtitle setting has been changed.
        if (path.includes(ccPopupMenu)) {
            if (isItSelectLanguageMenu()) {
                const r = isSubtitleEnglish();
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
const isTranscriptOpen = () => {
    const toggleButton = document.querySelector(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.controlBar.transcript.toggleButton);
    return toggleButton.getAttribute('aria-expanded') === 'true' ? true : false;
};
/***
 * Is subtitle language is English?
 *
 *
 * @returns {boolean}: True as it's English, false as not.
 * @throws {DomManipulationError} : When dom acquisition failes.
 * Exception might be happen when selector is not matches.
 *
 * DOMs:
 * - listParent: Parent element of CC popup menu.
 * - checkButtons: Listed button elements on CC popup menu. It includes attributed that express selected or not.
 * - menuList: child elements of checkButtons's button element. The innerText includes languages that express subtitle languages.
 *
 * Process:
 * 1. Find out which language is selected by checking attribute boolean value.
 * 2. If it was true, save the counter of loop.
 * 3. Find out language by saved counter number.
 * 4. If it was English, then return true. (If no, return false).
 * */
const isSubtitleEnglish = () => {
    const listParent = document.querySelector(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.controlBar.cc.menuListParent);
    const checkButtons = listParent.querySelectorAll(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.controlBar.cc.menuCheckButtons);
    const menuList = listParent.querySelectorAll(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.controlBar.cc.menuList);
    if (!listParent || !checkButtons || !menuList)
        throw new _Error_Error__WEBPACK_IMPORTED_MODULE_3__.DomManipulationError('Failed to manipulate DOM');
    let counter = 0;
    let i = null;
    const els = Array.from(checkButtons);
    for (const btn of els) {
        if (btn.getAttribute('aria-checked') === 'true') {
            i = counter;
            break;
        }
        counter++;
    }
    if (!i) {
        throw new Error('Error: No language is selected or failed to retrieve DOM');
    }
    const currentLanguage = Array.from(menuList)[i].innerText;
    if (currentLanguage.includes('English') || currentLanguage.includes('英語'))
        return true;
    else
        return false;
};
//
// --- OBSERVER METHODS -----------------------------------------
//
const config = {
    attributes: false,
    childList: true,
    subtree: false,
};
/***
 * Watch controlbar
 * to find out transcript toggle button is appeared or disappeared.
 * Everytime appearing and disappearing, then let background script to know.
 *
 * */
const moCallback = (mr) => {
    let guard = false;
    mr.forEach((record) => {
        if (record.type === 'childList' && !guard) {
            guard = true;
            // Added Nodes
            record.addedNodes.forEach((node) => {
                const dataPurpose = node.childNodes[0].parentElement.firstElementChild.getAttribute('data-purpose');
                if (dataPurpose && dataPurpose === 'transcript-toggle') {
                    sendToBackground({ isOpened: isTranscriptOpen() });
                }
            });
            // Removed Nodes
            record.removedNodes.forEach((node) => {
                const dataPurpose = node.childNodes[0].parentElement.firstElementChild.getAttribute('data-purpose');
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
/***
 * Find out the element is exist which matches with passed selector.
 * @param {string} selector - Seletor that about to find out.
 * @return {boolean} - true as exist, false as not exist.
 * */
const investTheElementIncluded = (selector) => {
    const e = document.querySelector(selector);
    return e ? true : false;
};
/**************************************************
 * Repeat to run investTheElementIncluded function.
 *
 * @param {string} selector : selector for dom about to acquire.
 * @param {boolean} timeoutAsResolve: If true, then timeout will not occure error.
 * @return {boolean} : Return boolean result. True as dom acquired. False as not.
 *
 * */
const repeatCheckQueryAcquired = (selector, timeoutAsResolve = false) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_2__.repeatActionPromise)(function () {
            return investTheElementIncluded(selector);
        }, timeoutAsResolve, 100, 10);
    }
    catch (e) {
        throw e;
    }
});
/*************************************************
 * Repeat to try query dom by given selector.
 * @param {string} selector: Selector for dom about to acquire.
 * @return {promise} represents HTMLElement as success.
 * @throws {DomManipulationError}
 *
 * */
const repeatQuerySelector = (selector) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield repeatCheckQueryAcquired(selector);
        return document.querySelector(selector);
    }
    catch (err) {
        throw new _Error_Error__WEBPACK_IMPORTED_MODULE_3__.DomManipulationError(`Error: Could not retrieve DOM with the selector ${selector}`);
    }
});
/***
 * Determine what the CC popup menu is showing.
 *
 * Menu might be...
 * - "Select subtitle language"
 * - "Setting of subtitle"
 *
 * @return {boolean} - True as the menu is showing "Select subtitle language" menu. False as "Setting of subtitle" menu.
 *
 * NOTE: DO INVOKE THIS FUNCTION everytime onClick event happend on CC popup menu!
 * */
const isItSelectLanguageMenu = () => {
    const menu = document.querySelector('div.control-bar-dropdown--menu--2bFbL.control-bar-dropdown--menu-dark--3cSQg > ul[data-purpose="captions-dropdown-menu"] > li[role="none"] > ul[aria-label="字幕"] > button');
    return menu ? true : false;
};
/*****************************************
 *  Initialize for detecting injected page status.
 *
 *  set up controlbar click event listener.
 *  set up MutationObserver of controlbar.
 *
 * Among initialize process, stop MutationObserver.
 * And restart MutationObserver when done.
 * */
const initialize = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // For a moment stop MutationObserevr.
        if (moControlbar)
            moControlbar.disconnect();
        moControlbar = null;
        moControlbar = new MutationObserver(moCallback);
        // Retrieve controlbar DOM again.
        if (controlbar)
            controlbar.removeEventListener('click', handlerOfControlbar);
        controlbar = null;
        controlbar = yield repeatQuerySelector(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.transcript.controlbar);
        controlbar.addEventListener('click', handlerOfControlbar);
        // Restart MutationObserver with retrieved controlbar DOM.
        moControlbar.observe(controlbar, config);
    }
    catch (err) {
        if (err instanceof _Error_Error__WEBPACK_IMPORTED_MODULE_3__.DomManipulationError)
            console.error(`DomManipulationError: ${err.message}`);
        throw err;
    }
});
/**
 * Entry Point
 *
 * */
(function () {
    initialize().catch((e) => {
        chrome.runtime.sendMessage({
            from: _utils_constants__WEBPACK_IMPORTED_MODULE_1__.extensionNames.contentScript,
            to: _utils_constants__WEBPACK_IMPORTED_MODULE_1__.extensionNames.background,
            success: false,
            error: e,
        });
    });
})();

})();

/******/ })()
;
//# sourceMappingURL=contentScript.js.map