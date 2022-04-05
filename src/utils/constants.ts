/**************************************************
 * constants
 * ________________________________________________
 *
 * ************************************************/

import { iModel } from "../background/annotations";
import { uError } from "../Error/Error";

export const _key_of_model_state__ = "_key_of_model_state__@&%8=8";

export const urlPattern: RegExp = /https:\/\/www.udemy.com\/course\/*/gm;

export const extensionStatus = {
  working: "working",
  notWorking: "notWorking",
  idle: "idle",
} as const;

export const extensionNames = {
  popup: "popup",
  contentScript: "contentScript",
  controller: "controller",
  captureSubtitle: "captureSubtitle",
  background: "background",
} as const;

//
// Updated
//
export const orderNames = {
  // // Inject content script order
  // injectCaptureSubtitleScript: 'injectCaptureSubtitleScript',
  // injectExTranscriptScript: 'injectExTranscriptScript',
  // From background to contentScript
  sendStatus: "sendStatus",
  // from controller to background
  sendSubtitles: "sendSubtitles",
  // order to disconnect port
  disconnect: "disconnect",

  // from popup inquire the url is correct
  inquireUrl: "inquireUrl",
  // from popup, run process
  run: "run",
  // reset content script
  reset: "reset",
  // Turn Off ExTranscript
  turnOff: "turnOff",
  // something succeeded
  success: "success",
  // NOTE: new added
  // Is the page moved to text page?
  isPageIncludingMovie: "isPageIncludingMovie",
  // NOTE: new added
  // Alert
  alert: "alert",
} as const;

// Subtitle object interface
export interface subtitle_piece {
  index: number;
  subtitle: string;
}

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

  // NOTE: new added
  error?: uError;
  // NOTE: new added
  // alert message
  alertMessage?: string;

  // --- DUPLICATED ----
  // disconnect?: boolean;
  // completed?: boolean;
  // RUN orderに対して、展開がすべて完了したらtrue
  // successDeployment?: boolean;
  // message?: any;
}

// interface of message parameter
export interface iMessage extends iResponse {
  // from, toは必須とする
  from: extensionsTypes;
  to: extensionsTypes;
}

// --- constants for controller.js -------------------------------

// // To pass to setTimeout
// export const TEN_SEC: number = 10000;

// transcript要素はwinodwサイズが975px以下の時にdashboardへ以上でsidebarへ移動する
export const RESIZE_BOUNDARY: number = 975;

// sidebarのwidthは2通りあって、
// 975px < w =< 1182pxだと300px, w > 1182pxで25%
export const SIDEBAR_WIDTH_BOUNDARY: number = 1182;

// window onResize時の反応遅延速度
export const RESIZE_TIMER: number = 100;

export const SIGNAL = {
  widthStatus: {
    wideview: true,
    middleview: false,
  },
};

export const positionStatus = {
  sidebar: "sidebar",
  noSidebar: "noSidebar",
} as const;

export const viewStatusNames = {
  wideView: "wideView",
  middleView: "middleView",
} as const;

type typeof_positionStatus = typeof positionStatus;
type typeof_viewStatus = typeof viewStatusNames;
export type keyof_positionStatus = keyof typeof_positionStatus;
export type keyof_viewStatus = keyof typeof_viewStatus;

// ---- ABOUT PORT ----------------------------------

export const port_names = {
  _requiring_subtitles: "_port_name_require_subtitles",
  _injected_contentScript: "_port_name_injected_contentScript",
};

// // Usage
// type _order = orderTypes[];

// const oo: _order = [
//   orderNames.sendStatus, orderNames.disconnect
// ];

// console.log(oo);

// const messageHandler = (m: iMessage): void => {
//   const { from, to, order } = m;
//   // もしもorderプロパティが含まれていて、中身があれば
//   if (order && order.length) {
//     console.log("there is order");
//     //
//     // この時点だとorderが何者かわからないみたいだからincludes()メソッドなんて使えないよ
//     // というエラーが出る
//     // でも使えた
//     // codesandboxでは
//     if (order.includes(orderNames.sendStatus)) {
//       console.log("SEND STATUS");
//     }
//     if (order.includes(orderNames.disconnect)) {
//       console.log("DISCONNECT");
//     }
//   }
// };

// messageHandler({
//   from: "background",
//   to: "content script",
//   order: [
//     orderNames.sendStatus, orderNames.disconnect
//   ]
// });

// messageHandler({
//   from: "background",
//   to: "content script",
//   order: []
// });

// messageHandler({
//   from: "background",
//   to: "content script"
// });

/*
## 変数がいくつかの特定の値を持つように強制する方法

https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types

```TypeScript

// -- example 1 --

let x: "hello" = "hello";
// OK
x = "hello";
// ...
x = "howdy";
// Type '"howdy"' is not assignable to type '"hello"'.

// -- example 2 --

function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello, world", "left");
printText("G'day, mate", "centre");
Argument of type '"centre"' is not assignable to parameter of type '"left" | "right" | "center"'.
```

https://typescript-jp.gitbook.io/deep-dive/type-system/literal-types



*/
