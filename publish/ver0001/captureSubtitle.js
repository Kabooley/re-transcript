/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
// Template message for alert.
// export const messageTemplate = {
//     appCannotExecute:
//         'Problem occured that the extension not being able to run. Please turn off the extension or reload the page.',
//     letPagePrepare:
//         'Please turn on Transcript and choose English for subtitle language.',
// };
const messageTemplate = {
    appCannotExecute: '[re-transcript] 拡張機能が実行不可能なエラーが起こりました。お手数ですが拡張機能をOFFにして展開中のページをリロードしてください。',
    letPagePrepare: '[re-transcript] トランスクリプトと字幕表示をONにして、字幕言語を英語にしてから再度実行してください。',
};


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
 * - Udemy elements selectors.
 * - re-transcript generated elements selectors.
 *
 * **************************************************/
// --- Selectors related to Transcript ---------------------------
// Udemy講義ページが動画ページならこのセレクタが一致する
// テキストページとかなら一致しない
const videoContainer = 'div.video-viewer--container--23VX7';
// new added. UdemyページのNavbarヘッダ
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
    // Udemy page-specific selector
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
/*!**********************************************!*\
  !*** ./src/contentScript/captureSubtitle.ts ***!
  \**********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_selectors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/selectors */ "./src/utils/selectors.ts");
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/constants */ "./src/utils/constants.ts");
/*********************************************************
 * Capture Subtitles
 *
 * Features:
 * 1. Retrieve subtitle data and retouch it at every request.
 * 2. Send retouched data to background script.
 *
 * Prerequisities:
 * The web page this script will be injected must has been DOM loaded already.
 *
 * This content script will be injected dynamically.
 * Exception error will be sent to background script.
 *
 * ********************************************************/


// --- chrome API Listener --------------------------------
/**
 * Accept `sendStatus` order.
 * */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { from, to, order } = message;
    if (to !== _utils_constants__WEBPACK_IMPORTED_MODULE_1__.extensionNames.captureSubtitle)
        return;
    const r = {
        from: _utils_constants__WEBPACK_IMPORTED_MODULE_1__.extensionNames.captureSubtitle,
        to: from,
    };
    if (order && order.length) {
        if (order.includes(_utils_constants__WEBPACK_IMPORTED_MODULE_1__.orderNames.sendSubtitles)) {
            try {
                const chunks = mainProcess();
                r.subtitles = chunks;
                r.complete = true;
            }
            catch (e) {
                r.complete = false;
                r.error = e;
            }
            finally {
                sendResponse(r);
            }
        }
    }
});
// -- Capture Methods -----------------------------------
/**********************************************
 * @return {subtitle_piece[]}
 * @throws {SyntaxError} - In case document.querySelectorAll fails to get DOM.
 *
 * */
const capturingSubtitle = () => {
    try {
        const spans = document.querySelectorAll(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.transcript.transcripts);
        const subtitles = Array.from(spans).map((span, index) => {
            return { index: index, subtitle: span.innerText.trim() };
        });
        return subtitles;
    }
    catch (e) {
        // Array.from(null)でSyntaxError. spansがnullだった可能性有
        throw e;
    }
};
/***
 * subtitle pieces to chunks
 *
 * @param {subtitle_piece[]} subtitles - Subtitle data just retrieved and not yet retouched.
 * @return {subtitle_piece[]} - Retouched subtitle data.
 *
 * Variables name:
 * - piece: An element in argument.
 * - block: Retouched element.
 *
 * Retouch process:
 *
 * ```
 *  const blocks = subtitles.map();
 * ```
 * 1. Keep push piece of subtitle into buff until its subtitle has period or question charactor at end of sentence.
 * 2. If subtitle has period or question charactor, then make buff turn to element of block.
 * 3. Then clear buff and go next.
 *
 * */
const subtitlesPiecesToBlocks = function (subtitles) {
    var buff = [];
    var index = null;
    const blocks = subtitles.map((subtitle) => {
        // Give index if buff is emptry to keep the block has same index at each element.
        if (buff.length === 0) {
            index = subtitle.index;
        }
        // If sentence is period or question, then return buff and index as object.
        // TODO: substr() is DEPRECATED.
        const s = subtitle.subtitle.trim().substr(-1, 1);
        if (s === '.' || s === '?') {
            const piece = {
                index: index,
                subtitle: [...buff, subtitle.subtitle].join(' '),
            };
            // Reset for next loop.
            buff = [];
            index = null;
            return piece;
        }
        else {
            // Keep pushing subtitle piece into buff until it has period or question charactor at end of sentence.
            buff.push(subtitle.subtitle);
        }
    });
    // Removing undefined element.
    return blocks.filter((block) => block !== undefined);
};
/**
 *  Main Process
 *
 * */
const mainProcess = () => {
    const subtitlePieces = capturingSubtitle();
    const chunks = subtitlesPiecesToBlocks(subtitlePieces);
    return chunks;
};

})();

/******/ })()
;
//# sourceMappingURL=captureSubtitle.js.map