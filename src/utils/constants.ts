/**************************************************
 * CONSTANTS which are common in application.
 *
 *
 * ************************************************/
import { iModel } from '../background/annotations';
import { uError } from '../Error/Error';

// Valid URL pattern.
export const urlPattern: RegExp = /https:\/\/www.udemy.com\/course\/*/gm;

//
// --- RELATED TO MESSAGE PASSING -------------
//

// message passingで利用する拡張機能名称
export const extensionNames = {
    popup: 'popup',
    contentScript: 'contentScript',
    controller: 'controller',
    captureSubtitle: 'captureSubtitle',
    background: 'background',
} as const;

// message passingで利用する共通order名称
export const orderNames = {
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
} as const;

type et = typeof extensionNames;
type on = typeof orderNames;

export type extensionsTypes = keyof et;
export type orderTypes = keyof on;

// interface of sendResponse parameter
export interface iResponse {
    // from: extensionsTypes;
    from?: extensionsTypes;
    to?: extensionsTypes;
    // 取得した字幕データ
    subtitles?: subtitle_piece[];
    order?: orderTypes[];
    activated?: boolean;
    language?: boolean;
    title?: string;
    // sendResponseを送信するときに必須
    complete?: boolean;
    // Udemy講義ページのURLかどうかの判定
    correctUrl?: boolean;
    // 何かしらの成功を示す
    success?: boolean;
    // 失敗の理由を示す
    failureReason?: string;
    // ExTranscriptが展開されたかどうか
    isExTranscriptDeployed?: boolean;
    // Udemy講義ページでトランスクリプトが表示されているかどうか
    isTranscriptDisplaying?: boolean;
    // Is page including movie container?
    isPageIncludingMovie?: boolean;

    // NOTE: いらないかも
    // chrome.tabs.Tab info will be included
    tabInfo?: chrome.tabs.Tab;
    // state popup requires.
    state?: { [Property in keyof iModel]?: iModel[Property] };

    error?: uError;
    // alert message
    alertMessage?: string;
}

// interface of message parameter
export interface iMessage extends iResponse {
    // from, toは必須とする
    from: extensionsTypes;
    to: extensionsTypes;
}

//
// --- OTHERS -----------------------------------
//

// Subtitle object interface
export interface subtitle_piece {
    index: number;
    subtitle: string;
}

// --- RELATED TO background.ts --------------

// Key for chrome.storage.local in background.ts
export const _key_of_model_state__ = '_key_of_model_state__@&%8=8';
export const _key_of_localstorage__ = '__key__of_local_storage__@&%8=8';

export const copies = {};

// TODO: まだlocalStorageにこの情報が残っているかも...
// const _key_of_localstorage__ = "__key__of_local_storage__";

// --- RELATED TO controller.ts -----------------

// transcript要素はwinodwサイズが975px以下の時にdashboardへ以上でsidebarへ移動する
// export const RESIZE_BOUNDARY: number = 975;
export const RESIZE_BOUNDARY: number = 963;
// window onResize時の反応遅延速度
export const RESIZE_TIMER: number = 100;

export const positionStatus = {
    sidebar: 'sidebar',
    noSidebar: 'noSidebar',
} as const;

type typeof_positionStatus = typeof positionStatus;
export type keyof_positionStatus = keyof typeof_positionStatus;

// Template message for alert.
// export const messageTemplate = {
//     appCannotExecute:
//         'Problem occured that the extension not being able to run. Please turn off the extension or reload the page.',
//     letPagePrepare:
//         'Please turn on Transcript and choose English for subtitle language.',
// };

export const messageTemplate = {
    appCannotExecute:
        '[re-transcript] 拡張機能が実行不可能なエラーが起こりました。お手数ですが拡張機能をOFFにして展開中のページをリロードしてください。',
    letPagePrepare:
        '[re-transcript] トランスクリプトと字幕表示をONにして、字幕言語を英語にしてから再度実行してください。',
};

// Used in Model, Events, Attributes, controller
//
// Accept part of T property or all of T either.
export type iProps<T> = { [Property in keyof T]?: T[Property] };
// callbacks which gets parameter with type iProps.
export type Callback<T> = (prop: iProps<T>) => void;
