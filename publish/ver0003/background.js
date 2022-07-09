/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/background/annotations.ts":
/*!***************************************!*\
  !*** ./src/background/annotations.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "progressBase": () => (/* binding */ progressBase),
/* harmony export */   "modelBase": () => (/* binding */ modelBase)
/* harmony export */ });
// base object for State<iProgress>
const progressBase = {
    isContentScriptInjected: false,
    isCaptureSubtitleInjected: false,
    isControllerInjected: false,
    isSubtitleCapturing: false,
    isSubtitleCaptured: false,
    isExTranscriptStructured: false,
};
// Base object that satisfies iModel.
const modelBase = {
    // contentScript.js has been injected or not.
    isContentScriptInjected: false,
    // captureSubtitles.js has been injected or not.
    isCaptureSubtitleInjected: false,
    // controller.js has been injected or not.
    isControllerInjected: false,
    // Subtitles data is capturing now or not.
    isSubtitleCapturing: false,
    // It is done capturing subtitles data or not.
    isSubtitleCaptured: false,
    // ExTranscript is structured or not.
    isExTranscriptStructured: false,
    // There is Transcript shown or not on the page.
    // Not means turining on or not.
    // If not shown, ExTranscript also not to be either.
    isTranscriptDisplaying: false,
    // Subtitle language is English or not.
    isEnglish: false,
    // Tab id that this extension is now running.
    tabId: null,
    // URL that this extension is now running.
    url: null,
    // Captured subtitles data.
    subtitles: null,
    // Tab info that this extension is now running.
    tabInfo: null,
};


/***/ }),

/***/ "./src/utils/Circulater.ts":
/*!*********************************!*\
  !*** ./src/utils/Circulater.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "circulater": () => (/* binding */ circulater)
/* harmony export */ });
/*************************************************
 * ここの内容はまるっきりrepeatPromise.tsの内容と同じかも...
 *
 * ***********************************************/
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/****************************************
 * circulater
 *
 * High order function that returns the function
 * which repeats given function until given times.
 *
 * @param {iCallbackOfCirculater} callback - Function that you want to iterate over.
 * @param {iConditionOfCirculater} conditon - Function that gives conditiobal branching to continue or terminate.
 * @param {number} until - Number how many times to repeat.
 * @return {iClosureOfCirculater<T>} - function which repeats given function until given times.
 *
 * resultが初期化されないのにreturnしているというエラーがでるかも
 * */
const circulater = function (callback, condition, until) {
    return function () {
        return __awaiter(this, void 0, void 0, function* () {
            // 予めループの外にresult変数を置いて
            let result;
            for (let i = 0; i < until; i++) {
                result = yield callback();
                if (condition(result))
                    return result;
            }
            // ループが終わってしまったら最後のresultを返せばいいのだが...
            // エラーを出すかも:
            // "TypeScriptがresultが初期化されないままなんだけど"
            //
            // 必ずresultはforループで初期化されるからってことを
            // TypeScriptへ伝えたいけど手段がわからん
            return result;
        });
    };
};
/// USAGE //////////////////////////////////////////////////////
// // 実際に実行したい関数
// const counter = async (times: number): Promise<boolean> => {
//   return new Promise((resolve, reject) => {
//     let timerId: number;
//     let num: number = 0;
//     timerId = setInterval(function () {
//
//       if (num >= times) {
//         clearInterval(timerId);
//         const random_boolean = Math.random() < 0.7;
//         resolve(random_boolean ? true : false);
//       } else num++;
//     }, 1000);
//   });
// };
// // circulaterへ渡すcallback関数
// //
// // 完全にハードコーディング
// //
// // 実際に実行したい関数へ渡さなくてはならない引数はここで渡すこと
// // 戻り値は任意であるが、condition関数のgenerics型と同じにすること
// const cb: iCallbackOfCirculater<boolean> = async (): Promise<boolean> => {
//   const n: boolean = await counter(7);
//
//   return n;
// };
// // circulaterへ渡すconditon関数
// //
// // 完全にハードコーディング
// //
// // circulaterへ渡す引数callbackの戻り値の型と同じ型をgenericsとして渡すこと
// const counterCondition: iConditionOfCirculater<iOp> = (
//   operand: iOp
// ): boolean => {
//
//   return operand ? true : false;
// };
// const counterLoop = circulater<boolean>(cb, counterCondition, 3);
// (async function () {
//   const r = await counterLoop();
//
// })();


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

/***/ "./src/utils/repeatPromise.ts":
/*!************************************!*\
  !*** ./src/utils/repeatPromise.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "repeatPromiseGenerator": () => (/* binding */ repeatPromiseGenerator)
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
/**
 * Generate funciton that repeats itself asynchronously.
 *
 * @param {number} interval - Milli sec time while interval.
 * @param {unknownAsyncCallback} callback - Function that will be run repeatedly.
 * @param {unknownConditionFunc} condition - Function that decides to continue or solved by check returned value from callback.
 * @param {number} upTo - Repeat up to this number.
 * @returns {}
 * */
const repeatPromiseGenerator = function (
// インターバル間隔
interval, 
// setIntervalへ渡すコールバック関数
callback, 
// callbackの戻り値を判定する関数
condition, 
// 何回繰り返すのか
upTo) {
    return function () {
        return new Promise((resolve, reject) => {
            let intervalId;
            let counter = 0;
            intervalId = setInterval(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    if (counter >= upTo) {
                        clearInterval(intervalId);
                        reject();
                        // reject時に返す値も予め用意できない
                    }
                    const result = yield callback();
                    if (condition(result)) {
                        clearInterval(intervalId);
                        resolve(result);
                    }
                    else
                        counter++;
                });
            }, interval);
        });
    };
};
// //
// // ---- USAGE --------------------------------------------------------------------
// // codesandboxで動作確認可能
// //
// type asyncUnknownFunc<T> = (...args: any[]) => Promise<T>;
// type unknownFunc<T> = (arg: T) => boolean;
// interface subtitle_piece {
//     subtitle: string;
// }
// const INTERVAL_TIME: number = 1000;
// // 繰り返し実行したい関数
// const callback_ = async (): Promise<subtitle_piece[]> => {
//     // returns promise
//     return [
//         { subtitle: 'this is subtitle' },
//         { subtitle: 'this is subtitle' },
//         { subtitle: 'this is subtitle' },
//         { subtitle: 'this is subtitle' },
//         { subtitle: 'this is subtitle' },
//         { subtitle: 'this is subtitle' },
//     ];
// };
// // 繰り返し実行したい関数の戻り値を検査して判定結果をbooleanで返す関数
// const condition_ = (operand: subtitle_piece[]): boolean => {
//     // condition check
//     // return result as boolean;
//     return Math.floor(Math.random() * 9) ? true : false;
// };
// (async function () {
//     try {
//         const repeactCaptureSubtitlesTenTimes = repeatPromiseGenerator<subtitle_piece[]>(
//             INTERVAL_TIME,
//             callback_,
//             condition_,
//             10
//         );
//         const result: subtitle_piece[] = await repeactCaptureSubtitlesTenTimes();
//
//     } catch (e) {
//         console.error(e);
//     }
// })();


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
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/constants */ "./src/utils/constants.ts");
/* harmony import */ var _utils_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/helpers */ "./src/utils/helpers.ts");
/* harmony import */ var _annotations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./annotations */ "./src/background/annotations.ts");
/* harmony import */ var _utils_Circulater__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/Circulater */ "./src/utils/Circulater.ts");
/* harmony import */ var _utils_repeatPromise__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/repeatPromise */ "./src/utils/repeatPromise.ts");
/**********************************************************
 * background.ts
 *
 * Background script as service worker in accordance with Manifest V3.
 *
 * UPDATE:
 *
 * - 2022/07/03: Fixed activation process.
 *  Modified HandlerOfPopupMessage and onRemoved handler.
 *
 * ********************************************************/
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





//
// --- GLOBALS -----------------------------------------------
//
const INTERVAL_TIME = 100;
//
// --- Chrome API Listeners ---------------------------------
//
/**
 * NO LONGER NEEDED...
 *
 * @callback
 * @param {chrome.runtime.InstalledDetails} details
 * - Represents details of install or update.
 *
 * */
// chrome.runtime.onInstalled.addListener(
//     (details: chrome.runtime.InstalledDetails): void => {
//         console.log("Extension 'Re Transcript' has been installed/updated.");
//     }
// );
/**
 * Monitor events of interest by filtering all events on the browser.
 *
 * NOTE: chrome.tabs.onUpdated.addListenerにはfiltering機能がない
 * なのでイベントの取捨選択はすべて条件分岐を追加して対処している
 *
 * 機能：
 *
 * 1. 次のイベントを無視する
 *
 * - 指定のURL以外のページのイベントすべて
 * - 拡張機能が展開済であるが、changeInfo.statusが'loading'ではない
 * - 拡張機能が展開済であるが、展開しているタブ以外に切り替わったとき
 * - ブラウザが閉じられた、タブが閉じられたときの対処はchrome.tabs.onRemoved.addListenerが請け負う
 *
 * 2. 次のイベントは監視する
 *
 * - 拡張機能が展開中のタブでリロードが起こった
 * - 拡張機能が展開中のタブが別のURLへ移動した
 * - 拡張機能が展開中のタブでURL末尾(#含まない)が更新された(次の講義動画に切り替わった)
 * - 拡張機能が展開中のタブでURL末尾(#含まない)が更新された(講義動画がないページに切り替わった)
 *
 *
 * 3. URLの比較は#以下を無視して行われる
 *
 * */
chrome.tabs.onUpdated.addListener((tabIdUpdatedOccured, changeInfo, Tab) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`on updated: ${changeInfo.status}`);
    const { url, tabId, isExTranscriptStructured } = yield state.get();
    try {
        // 拡張機能が未展開、changeInfo.statusがloadingでないなら無視する
        if (changeInfo.status !== 'loading' || !isExTranscriptStructured)
            return;
        // 拡張機能が展開済だとして、tabIdが展開済のtabId以外に切り替わったなら無視する
        if (tabIdUpdatedOccured !== tabId)
            return;
        // 展開中のtabId && chnageInfo.urlが講義ページ以外のURLならば
        // 拡張機能OFFの処理へ
        if (isExTranscriptStructured && tabIdUpdatedOccured === tabId) {
            // おなじURLでのリロードか？
            if (changeInfo.url === undefined) {
                // await state.set(modelBase);
                yield state.clearAll();
            }
            else if (!changeInfo.url.match(_utils_constants__WEBPACK_IMPORTED_MODULE_0__.urlPattern)) {
                // 講義ページ以外に移動した
                // await state.set(modelBase);
                yield state.clearAll();
            }
            // 展開中のtabIdである && changeInfo.urlが講義ページである
            // その上でURLが変化した
            // NOTE: Compare URL WITHOUT below hash.
            else if (changeInfo.url.match(_utils_constants__WEBPACK_IMPORTED_MODULE_0__.urlPattern) &&
                (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.exciseBelowHash)(changeInfo.url) !== (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.exciseBelowHash)(url)) {
                //NOTE: MUST Update URL. ページが切り替わったから
                yield state.set({ url: (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.exciseBelowHash)(changeInfo.url) });
                // 動画ページ以外に切り替わった？
                const res = yield (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.sendMessageToTabsPromise)(tabId, {
                    from: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.background,
                    to: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.contentScript,
                    order: [_utils_constants__WEBPACK_IMPORTED_MODULE_0__.orderNames.isPageIncludingMovie],
                });
                res.isPageIncludingMovie
                    ? // 次の動画に移った
                        yield handlerOfReset(tabIdUpdatedOccured, yield circulateCaptureSubtitles())
                    : // 動画を含まないページへ移った
                        yield handlerOfHide(tabIdUpdatedOccured);
            }
        }
    }
    catch (e) {
        alertHandler(tabId, _utils_constants__WEBPACK_IMPORTED_MODULE_0__.messageTemplate.appCannotExecute);
    }
}));
/**
 * Handler for onRemoved event.
 *
 * When tab or window closed,
 * restore background script state as its initial state.
 *
 * Of course there is no content script after this happens.
 * So no need to "turn off" content script.
 *
 * */
chrome.tabs.onRemoved.addListener((_tabId, removeInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tabId } = yield state.get();
        if (_tabId !== tabId)
            return;
        yield state.clearAll();
    }
    catch (err) {
        console.error(err);
    }
}));
/**
 * Handler of onMessage
 *
 * NOTE: MUST RETURN true.
 * */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.to !== _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.background)
        return;
    sortMessage(message, sender, sendResponse);
    return true;
});
//
// --- Message Handlers ----------------------------------------
//
/**
 * Sort message by sender.
 *
 * */
const sortMessage = (message, sender, sendResponse) => {
    switch (message.from) {
        case _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.popup:
            handlerOfPopupMessage(message, sender, sendResponse);
            break;
        case _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.contentScript:
            handlerOfContentScriptMessage(message, sender, sendResponse);
            break;
        case _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.captureSubtitle:
            handlerOfCaptureSubtitleMessage(message, sender, sendResponse);
            break;
        case _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.controller:
            handlerOfControllerMessage(message, sender, sendResponse);
            break;
    }
};
/**
 * Handler of message from popup script.
 *
 * Handler will receive three orders.
 *
 * 1. sendStatus: Respond current status of state to popup.
 * 2. run: Run extension.
 * 3. turnOff: Turn off extension.
 *
 * It is at the top of the processing stage
 * so that exception catching is possible
 * in case an exception occurs and
 * `finally` return response
 * unless exception occurs.
 * */
const handlerOfPopupMessage = (message, sender, sendResponse) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, order } = message, rest = __rest(message, ["from", "order"]);
    let response = {
        from: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.background,
        to: from,
    };
    if (order && order.length) {
        // SEND STATUS
        if (order.includes(_utils_constants__WEBPACK_IMPORTED_MODULE_0__.orderNames.sendStatus)) {
            try {
                const current = yield state.get();
                if (!Object.keys(current).length)
                    yield initialize();
                const { isSubtitleCapturing, isExTranscriptStructured } = yield state.get();
                response.state = {
                    isSubtitleCapturing: isSubtitleCapturing,
                    isExTranscriptStructured: isExTranscriptStructured,
                };
                response.complete = true;
            }
            catch (e) {
                response.complete = false;
                response.error = e;
                alertHandler((yield (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.tabQuery)()).id, _utils_constants__WEBPACK_IMPORTED_MODULE_0__.messageTemplate.appCannotExecute);
            }
            finally {
                sendResponse(response);
            }
        }
        // RUN
        /*
      - falseが返される理由
        字幕がONじゃない、トランスクリプトがONじゃない、字幕が英語じゃない
        
      - RUN処理中、起こりうる可能性がきわめて低い問題
        chrome.scripting.execute()中のエラー
        字幕が取得できない（条件がそろってから実行するから、取得できないのはおかしい）
        
      - 起こったら終了な問題(例外判定)
        DOMが取得できない（DOMの種類による）
        chrome.runtime.onInstalledが実行されていないことによる、stateの未初期化
    */
        if (order.includes(_utils_constants__WEBPACK_IMPORTED_MODULE_0__.orderNames.run)) {
            try {
                const r = yield handlerOfRun(rest.tabInfo);
                response.success = r;
                response.complete = true;
                if (!r) {
                    alertHandler((yield (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.tabQuery)()).id, _utils_constants__WEBPACK_IMPORTED_MODULE_0__.messageTemplate.letPagePrepare);
                }
            }
            catch (e) {
                response.complete = false;
                response.error = e;
                alertHandler((yield (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.tabQuery)()).id, _utils_constants__WEBPACK_IMPORTED_MODULE_0__.messageTemplate.appCannotExecute);
            }
            finally {
                sendResponse(response);
            }
        }
        // POPUP上のOFF操作による拡張機能のOFF命令
        if (order.includes(_utils_constants__WEBPACK_IMPORTED_MODULE_0__.orderNames.turnOff)) {
            try {
                yield handlerOfTurnOff();
                response.complete = true;
            }
            catch (e) {
                response.complete = false;
                response.error = e;
                alertHandler((yield (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.tabQuery)()).id, _utils_constants__WEBPACK_IMPORTED_MODULE_0__.messageTemplate.appCannotExecute);
            }
            finally {
                sendResponse(response);
            }
        }
    }
});
/**
 * Handler of message from contentScrip.js.
 *
 * contentScript sends status of page to embed.
 * Message will have up to two status.
 *
 * - Transcript is turning on or not.
 * - Subtitle language is English or not.
 *
 * Whichever is false, Extension turns off ExTranscript.
 * Both are true, then reset ExTranscript.
 * */
const handlerOfContentScriptMessage = (message, sender, sendResponse) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, order } = message, rest = __rest(message, ["from", "order"]);
    let response = {
        from: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.background,
        to: from,
    };
    const { isExTranscriptStructured, isTranscriptDisplaying, isEnglish, tabId, } = yield state.get();
    if (order && order.length) {
    }
    // ExTRanscriptを表示する条件が揃わなくなったとき...
    // if (!rest.isTranscriptDisplaying || !rest.language) {
    if ((rest.isTranscriptDisplaying !== undefined &&
        !rest.isTranscriptDisplaying) ||
        (rest.language !== undefined && !rest.language)) {
        try {
            // ExTranscriptを非表示にするかする
            // もしもトランスクリプトが表示中であったならば
            if (isExTranscriptStructured && isTranscriptDisplaying) {
                yield handlerOfHide(tabId);
            }
            // あとはStateを更新するだけ
            let s = {};
            if (rest.isTranscriptDisplaying !== undefined) {
                s['isTranscriptDisplaying'] = rest.isTranscriptDisplaying;
            }
            if (rest.language !== undefined) {
                s['isEnglish'] = rest.language;
            }
            yield state.set(s);
            response.complete = true;
        }
        catch (e) {
            response.complete = false;
            alertHandler((yield (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.tabQuery)()).id, _utils_constants__WEBPACK_IMPORTED_MODULE_0__.messageTemplate.appCannotExecute);
        }
        finally {
            sendResponse(response);
        }
    }
    // トランスクリプトが再表示されたとき...
    if (rest.isTranscriptDisplaying) {
        // ExTranscriptが非表示だったならば再表示させる
        if (isExTranscriptStructured && !isTranscriptDisplaying) {
            try {
                yield handlerOfReset(tabId, (yield state.get()).subtitles);
                yield state.set({ isTranscriptDisplaying: true });
                response.complete = true;
            }
            catch (e) {
                response.complete = false;
                alertHandler((yield (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.tabQuery)()).id, _utils_constants__WEBPACK_IMPORTED_MODULE_0__.messageTemplate.appCannotExecute);
            }
            finally {
                sendResponse(response);
            }
        }
    }
    // 字幕が英語を選択されたとき...
    if (rest.language) {
        // ExTranscriptが非表示だったならば再表示させる
        if (isExTranscriptStructured && !isEnglish) {
            try {
                yield handlerOfReset(tabId, (yield state.get()).subtitles);
                yield state.set({
                    isTranscriptDisplaying: true,
                    isEnglish: true,
                });
                response.complete = true;
            }
            catch (e) {
                response.complete = false;
                alertHandler((yield (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.tabQuery)()).id, _utils_constants__WEBPACK_IMPORTED_MODULE_0__.messageTemplate.appCannotExecute);
            }
            finally {
                sendResponse(response);
            }
        }
    }
});
/**
 * Handler of message from captureSubtitle.js.
 *
 * So far, there is no turnout unless exception happens.
 * */
const handlerOfCaptureSubtitleMessage = (message, sender, sendResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order } = message, rest = __rest(message, ["order"]);
        if (rest.error)
            throw rest.error;
    }
    catch (e) {
        alertHandler((yield (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.tabQuery)()).id, _utils_constants__WEBPACK_IMPORTED_MODULE_0__.messageTemplate.appCannotExecute);
    }
});
/**
 *  Handler of message from controller.js
 *
 * In case close button on ExTranscript is clicked,
 * then order "turnOff" will be sent.
 * */
const handlerOfControllerMessage = (message, sender, sendResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order } = message, rest = __rest(message, ["order"]);
        if (order && order.length) {
            if (order.includes(_utils_constants__WEBPACK_IMPORTED_MODULE_0__.orderNames.turnOff))
                yield handlerOfTurnOff();
        }
        if (rest.error)
            throw rest.error;
    }
    catch (e) {
        alertHandler((yield (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.tabQuery)()).id, _utils_constants__WEBPACK_IMPORTED_MODULE_0__.messageTemplate.appCannotExecute);
    }
});
//
// --- MAJOUR HANDLERS ------------------------------------------
//
/**
 * Handler of RUN order.
 *
 * @return {boolean} - true as success. false as failed. Not includes exception.
 * "false" does not mean that the application is not executable.
 * "false" mainly means that web page condition is not ready to run this application.
 * @throws - Exception means that application does not executable.
 *
 * To complete run, there are five phase in this handler.
 *
 * 1. Save tab info, url, tabId.
 * 2. Inject contentScript.ts to know page status.
 * 3. Inject captureSubtitle.ts to capture subtitle data.
 * 4. Inject controller.ts to controll ExTranscript.
 * 5. Send subtitle data to controller.ts to display new subtitles.
 *
 * NOTE: Too huge...
 * */
const handlerOfRun = (tabInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { url, id } = tabInfo;
        const { isContentScriptInjected, isCaptureSubtitleInjected, isControllerInjected, } = yield state.get();
        // Save valid url and current tab that extension popup opened.
        yield state.set({
            url: (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.exciseBelowHash)(url),
            tabId: id,
            tabInfo: tabInfo,
        });
        //<phase 2> inject contentScript.js
        const { tabId } = yield state.get();
        if (!isContentScriptInjected) {
            yield chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['contentScript.js'],
            });
            yield state.set({ isContentScriptInjected: true });
        }
        else {
            yield (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.sendMessageToTabsPromise)(tabId, {
                from: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.background,
                to: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.contentScript,
                order: [_utils_constants__WEBPACK_IMPORTED_MODULE_0__.orderNames.reset],
            });
        }
        const currentPageStatus = yield (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.sendMessageToTabsPromise)(tabId, {
            from: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.background,
            to: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.contentScript,
            order: [_utils_constants__WEBPACK_IMPORTED_MODULE_0__.orderNames.sendStatus],
        });
        yield state.set({
            isEnglish: currentPageStatus.language,
            isTranscriptDisplaying: currentPageStatus.isTranscriptDisplaying,
        });
        if (!currentPageStatus.language ||
            !currentPageStatus.isTranscriptDisplaying) {
            return false;
        }
        // <phase 3> inject captureSubtitle.js
        // 字幕データを取得する
        if (!isCaptureSubtitleInjected) {
            yield chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['captureSubtitle.js'],
            });
            yield state.set({ isCaptureSubtitleInjected: true });
        }
        // 字幕取得できるまで10回は繰り返す関数で取得する
        // NOTE: 戻り値が空の配列でも受け入れる
        const subtitles = yield circulateCaptureSubtitles();
        yield state.set({ subtitles: subtitles });
        // <phase 4> inject controller.js
        if (!isControllerInjected) {
            yield chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['controller.js'],
            });
            yield state.set({ isControllerInjected: true });
        }
        else {
            yield (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.sendMessageToTabsPromise)(tabId, {
                from: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.background,
                to: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.controller,
                order: [_utils_constants__WEBPACK_IMPORTED_MODULE_0__.orderNames.reset],
            });
        }
        const s = yield state.get();
        yield (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.sendMessageToTabsPromise)(tabId, {
            from: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.background,
            to: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.controller,
            subtitles: s.subtitles,
        });
        yield state.set({ isExTranscriptStructured: true });
        // NOTE: MUST RETURN TRUE
        return true;
    }
    catch (e) {
        console.error(e.message);
        throw e;
    }
});
/**
 * Handler of RESET
 *
 * ExTranscriptを再生成する
 *
 * 処理内容：
 *
 * - 各content scriptのリセット処理
 *  一度injectしたcontent scriptはプログラムで除去する手段はないため
 *
 * - controller.jsへ字幕データを渡す
 *
 * NOTE: 字幕データはこの関数の外部から取得する
 * */
const handlerOfReset = (tabId, subtitles) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield state.set({
            isTranscriptDisplaying: false,
            isSubtitleCaptured: false,
            isSubtitleCapturing: true,
        });
        yield resetEachContentScript(tabId);
        yield state.set({
            isSubtitleCaptured: true,
            isSubtitleCapturing: false,
            subtitles: subtitles,
        });
        yield (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.sendMessageToTabsPromise)(tabId, {
            from: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.background,
            to: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.controller,
            order: [_utils_constants__WEBPACK_IMPORTED_MODULE_0__.orderNames.reset],
        });
        yield (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.sendMessageToTabsPromise)(tabId, {
            from: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.background,
            to: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.controller,
            subtitles: subtitles,
        });
        yield state.set({
            isTranscriptDisplaying: true,
        });
    }
    catch (e) {
        throw e;
    }
});
/**
 * Handler of HIDE ExTranscript.
 *
 * NOTE: これは拡張機能をOFFにするハンドラではない
 * 実際には隠すのではなくて、ExTranscriptを消す処理を実行する
 * handlerOfTurnOff()と区別する
 *
 * そのためstateの値はほぼそのままである
 *
 * */
const handlerOfHide = (tabId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // stateの更新：
        yield state.set({
            isTranscriptDisplaying: false,
            isSubtitleCaptured: false,
            // subtitles: [],
        });
        // reset 処理: 各content scritpのリセットを実施する
        yield (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.sendMessageToTabsPromise)(tabId, {
            from: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.background,
            to: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.controller,
            order: [_utils_constants__WEBPACK_IMPORTED_MODULE_0__.orderNames.turnOff],
        });
    }
    catch (e) {
        console.error(e.message);
        throw e;
    }
});
/**
 * Handler of TURN OFF ExTranscript.
 *
 * 各content scriptを初期化する
 * stateを初期化する
 * ただしcontent scriptのinject状況だけstateに反映させておく
 * */
const handlerOfTurnOff = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tabId } = yield state.get();
        yield turnOffEachContentScripts(tabId);
        const { isContentScriptInjected, isCaptureSubtitleInjected, isControllerInjected, } = yield state.get();
        // content scriptのinject状況だけ反映させてstateを初期値に戻す
        yield state.set(Object.assign(Object.assign({}, _annotations__WEBPACK_IMPORTED_MODULE_2__.modelBase), { isContentScriptInjected: isContentScriptInjected, isCaptureSubtitleInjected: isCaptureSubtitleInjected, isControllerInjected: isControllerInjected }));
    }
    catch (e) {
        throw e;
    }
});
//
// ---- OTHER METHODS ----------------------------------------
//
/**
 * Reset each content script.
 *
 * contentScript.ts, controller.tsへリセット命令を発信する
 * 両scriptで完了の返信があった時点でリセット完了となる
 *
 * NOTE: turnOffEachContentScripts()と区別する
 * */
const resetEachContentScript = (tabId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contentScript = (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.sendMessageToTabsPromise)(tabId, {
            from: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.background,
            to: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.contentScript,
            order: [_utils_constants__WEBPACK_IMPORTED_MODULE_0__.orderNames.reset],
        });
        const controller = (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.sendMessageToTabsPromise)(tabId, {
            from: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.background,
            to: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.controller,
            order: [_utils_constants__WEBPACK_IMPORTED_MODULE_0__.orderNames.reset],
        });
        yield Promise.all([contentScript, controller]);
    }
    catch (e) {
        throw e;
    }
});
/**
 * Turn Off each content script.
 *
 * contentScript.ts, controller.tsへ初期化命令(TurnOff)を発信する
 * 両scriptで完了の返信があった時点でリセット完了となる
 *
 * NOTE: resetEachContentScripts()と区別する
 * */
const turnOffEachContentScripts = (tabId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contentScript = (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.sendMessageToTabsPromise)(tabId, {
            from: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.background,
            to: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.contentScript,
            order: [_utils_constants__WEBPACK_IMPORTED_MODULE_0__.orderNames.turnOff],
        });
        const controller = (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.sendMessageToTabsPromise)(tabId, {
            from: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.background,
            to: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.controller,
            order: [_utils_constants__WEBPACK_IMPORTED_MODULE_0__.orderNames.turnOff],
        });
        yield Promise.all([contentScript, controller]);
    }
    catch (e) {
        throw e;
    }
});
/***
 * Repeat subtitle acquisition 10 times.
 *
 * @returns function - Returns a function which repeats second argument callback function while given times or untile third argument function returns true.
 * */
const captureSubtitles = (0,_utils_repeatPromise__WEBPACK_IMPORTED_MODULE_4__.repeatPromiseGenerator)(INTERVAL_TIME, function () {
    return __awaiter(this, void 0, void 0, function* () {
        const { tabId } = yield state.get();
        const r = yield (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.sendMessageToTabsPromise)(tabId, {
            from: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.background,
            to: _utils_constants__WEBPACK_IMPORTED_MODULE_0__.extensionNames.captureSubtitle,
            order: [_utils_constants__WEBPACK_IMPORTED_MODULE_0__.orderNames.sendSubtitles],
        });
        return r.subtitles;
    });
}, function (data) {
    return data !== undefined && data.length ? true : false;
}, 10);
/**
 * circulateCaptureSubtitles
 *
 *
 * description:
 * captureSubtitles()を3回繰り返す関数
 * condition()の条件を満たせば即終了し、
 * repeactCaptureSubtitles()が取得した最後の戻り値を返す
 *
 * 埋め込みページのDOMローディングの時間がかかりすぎる場合に対処するための関数
 *
 * @returns function - Async function that repeats given function untile given times.
 * */
const circulateCaptureSubtitles = (0,_utils_Circulater__WEBPACK_IMPORTED_MODULE_3__.circulater)(captureSubtitles, (operand) => {
    return operand.length ? true : false;
}, 2);
/**
 * Alert
 *
 * Embeds alert function into content script.
 *
 * UPDATED:
 *  Add state.clearAll() to clear state object everytime exception thrown.
 */
const alertHandler = (tabId, msg) => {
    state.clearAll();
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: function (msg) {
            alert(msg);
        },
        args: [msg],
    });
};
/***
 * state module
 *
 *
 * This module never holds variables.
 * No matter background script unloaded or reloaded,
 * state never lose saved varibales.
 * */
const state = (function () {
    const _getLocalStorage = function (key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                chrome.storage.local.get(key, (s) => {
                    if (chrome.runtime.lastError)
                        reject(chrome.runtime.lastError);
                    resolve(s);
                });
            });
        });
    };
    return {
        // 本来ローカルストレージに保存しておくデータの一部だけでも
        // 保存することを可能とする
        //
        set: (prop) => __awaiter(this, void 0, void 0, function* () {
            try {
                const s = yield _getLocalStorage(_utils_constants__WEBPACK_IMPORTED_MODULE_0__._key_of_localstorage__);
                const newState = Object.assign(Object.assign({}, s[_utils_constants__WEBPACK_IMPORTED_MODULE_0__._key_of_localstorage__]), prop);
                yield chrome.storage.local.set({
                    [_utils_constants__WEBPACK_IMPORTED_MODULE_0__._key_of_localstorage__]: newState,
                });
            }
            catch (e) {
                throw e;
            }
        }),
        get: () => __awaiter(this, void 0, void 0, function* () {
            try {
                const s = yield _getLocalStorage(_utils_constants__WEBPACK_IMPORTED_MODULE_0__._key_of_localstorage__);
                return Object.assign({}, s[_utils_constants__WEBPACK_IMPORTED_MODULE_0__._key_of_localstorage__]);
            }
            catch (e) {
                throw e;
            }
        }),
        clearAll: () => __awaiter(this, void 0, void 0, function* () {
            try {
                // DEBUG: ----
                console.log('state: clear all');
                // --------------
                yield chrome.storage.local.remove(_utils_constants__WEBPACK_IMPORTED_MODULE_0__._key_of_localstorage__);
                const current = yield state.get();
            }
            catch (e) {
                throw e;
            }
        }),
    };
})();
/**
 * Always invoke this extension every first time the browser starts up.
 *
 *
 * */
const initialize = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        state.clearAll();
        yield state.set(_annotations__WEBPACK_IMPORTED_MODULE_2__.modelBase);
    }
    catch (err) {
        alertHandler((yield (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.tabQuery)()).id, _utils_constants__WEBPACK_IMPORTED_MODULE_0__.messageTemplate.appCannotExecute);
    }
});

})();

/******/ })()
;
//# sourceMappingURL=background.js.map