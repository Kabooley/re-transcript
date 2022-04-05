/***************************************************************
 * background.ts
 * _____________________________________________________________
 *
 * As service worker and Application Layer.
 *
 *
 * chrome.runtime.onInstalled: Stateを初期化してstateへ保存する
 *
 *
 *
 * Exception Handling 
 * ***************************************************************/

import {
  _key_of_model_state__,
  urlPattern,
  extensionStatus,
  orderNames,
  extensionsTypes,
  extensionNames,
  iMessage,
  subtitle_piece,
  iResponse,
} from "../utils/constants";
import {
  sendMessageToTabsPromise,
  tabsQuery,
  exciseBelowHash,
} from "../utils/helpers";
import { iModel, modelBase, iStateModule } from "./annotations";
import { alertMessages } from "../Error/templates";
import { circulater, iCallbackOfCirculater, iClosureOfCirculater, iConditionOfCirculater } from "../utils/Circulater";

//
// --- GLOBALS -----------------------------------------------
//

const INTERVAL_TIME = 100;
const KEY_LOCALSTORAGE = "__key__of_local_storage_";

//
// --- Chrome API Listeners ---------------------------------
//


/**
 * Set up state module and clear previous storage information that state use.
 * Set modelBase as initial value of state module.
 * 
 * @callback
 * @param {chrome.runtime.InstalledDetails} details
 * - Represents details of install or update.  
 * 
 * */ 
chrome.runtime.onInstalled.addListener(
  async (details: chrome.runtime.InstalledDetails): Promise<void> => {
    console.log(`[background] onInstalled: ${details.reason}`);
    try {
      state.clearAll();
      state.set(modelBase);
    } catch (err) {
      console.error(err.message);
      alert(alertMessages.failedOnInstall);
    }
  }
);

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
 *
 * */
chrome.tabs.onUpdated.addListener(
  async (
    tabIdUpdatedOccured: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    Tab: chrome.tabs.Tab
  ): Promise<void> => {
    // "https://www.udemy.com/course/*"以外のURLなら無視する
    const { url, tabId, isExTranscriptStructured } = await state.get();

    // 拡張機能が未展開、changeInfo.statusがloadingでないなら無視する
    if (changeInfo.status !== "loading" || !isExTranscriptStructured) return;

    // 拡張機能が展開済だとして、tabIdが展開済のtabId以外に切り替わったなら無視する
    // return;
    if (tabIdUpdatedOccured !== tabId) return;

    // 展開中のtabId && chnageInfo.urlがUdemy講義ページ以外のURLならば
    // 拡張機能OFFの処理へ
    if (isExTranscriptStructured && tabIdUpdatedOccured === tabId) {
      // おなじURLでのリロードか？
      if (changeInfo.url === undefined) {
        console.log("[background] Turn off extension because page reloaded");
        await state.set(modelBase);
      } else if (!changeInfo.url.match(urlPattern)) {
        // Udemy講義ページ以外に移動した
        console.log("[background] the page moved to invalid url");
        await state.set(modelBase);
      }

      // 展開中のtabIdである && changeInfo.urlが講義ページである
      // その上でURLが変化した
      // NOTE: Compare URL WITHOUT below hash.
      else if (
        changeInfo.url.match(urlPattern) &&
        exciseBelowHash(changeInfo.url) !== exciseBelowHash(url)
      ) {
        //NOTE: MUST Update URL. ページが切り替わったから
        console.log("[background] page moved");
        await state.set({ url: exciseBelowHash(changeInfo.url) });

        // 動画ページ以外に切り替わった？
        // TODO: sendMessageToTabsPromiseのスローするエラーのcatch
        const res: iResponse = await sendMessageToTabsPromise(tabId, {
          from: extensionNames.background,
          to: extensionNames.contentScript,
          order: [orderNames.isPageIncludingMovie],
        });

        res.isPageIncludingMovie
          ? // 次の動画に移った
            await handlerOfReset(tabIdUpdatedOccured, await circulateRepeatCaptureSubtitles())
          : // 動画を含まないページへ移った
            await handlerOfHide(tabIdUpdatedOccured);
      }
    }
  }
);

/**************
 *
 * When tab or window closed,
 * restore background script state as its initial state.
 *
 * NOTE: Of course there is no content script
 * No need to "turn off" content script.
 * */
chrome.tabs.onRemoved.addListener(
  async (
    _tabId: number,
    removeInfo: chrome.tabs.TabRemoveInfo
  ): Promise<void> => {
    try {
      const { tabId } = await state.get();
      if (_tabId !== tabId) return;
      await state.set(modelBase);
    } catch (err) {
      console.error(err);
    }
  }
);

/**
 * chrome.runtime.onMessage.addListener()
 * _________________________________________________
 *
 * */
chrome.runtime.onMessage.addListener(
  (
    message: iMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: iResponse) => void
  ): boolean => {
    if (message.to !== extensionNames.background) return;
    sortMessage(message, sender, sendResponse);

    // NOTE: MUST RETURN TRUE
    // If you wanna use asynchronous function.
    return true;
  }
);

/******
 *  sort message
 * ________________________________________________
 *
 *
 * */
const sortMessage = (
  message: iMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: iResponse) => void
): void => {
  switch (message.from) {
    case extensionNames.popup:
      handlerOfPopupMessage(message, sender, sendResponse);
      break;
    case extensionNames.contentScript:
      handlerOfContentScriptMessage(message, sender, sendResponse);
      break;
    case extensionNames.captureSubtitle:
      handlerOfCaptureSubtitleMessage(message, sender, sendResponse);
      break;
    case extensionNames.controller:
      handlerOfControllerMessage(message, sender, sendResponse);
      break;
  }
};

//
// --- Message Handlers ----------------------------------------
//

/*********************************************
 * Handler of message from POPUP
 *
 * TODO: response.errorを送信する必要があるかは未検討
 * 私見では必要ないのでは？
 * エラーを取得してどうするか考えるのはbackground scriptの役目であるから...
 * */
const handlerOfPopupMessage = async (
  message: iMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: iResponse) => void
): Promise<void> => {
  console.log("[background] Message from Popup");
  const { from, order, ...rest } = message;
  let response: iResponse = {
    from: extensionNames.background,
    to: from,
  };
  if (order && order.length) {
    // SEND STATUS
    if (order.includes(orderNames.sendStatus)) {
      try {
        const { isSubtitleCapturing, isExTranscriptStructured } =
          await state.get();
        response.state = {
          isSubtitleCapturing: isSubtitleCapturing,
          isExTranscriptStructured: isExTranscriptStructured,
        };
        response.complete = true;
      } catch (e) {
        // TODO: stateが取得できなかったときの挙動 alertだす
        response.complete = false;
        response.error = e;
      } finally {
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
    if (order.includes(orderNames.run)) {
      console.log("[background] RUN");
      try {
        // True as successfully done. False as page status is not ready.(Not error)
        const r: boolean = await handlerOfRun(rest.tabInfo);
        response.success = r ? true : false;
        response.complete = true;
        // TODO: ページ環境を実行できるものにしてくれとアラート
        if (!r)
          chrome.tabs.sendMessage(rest.tabInfo.id, {
            from: extensionNames.background,
            to: extensionNames.contentScript,
            order: orderNames.alert,
            alertMessage: alertMessages.pageIsNotReady,
          });
      } catch (e) {
        response.complete = false;
        response.error = e;
      } finally {
        sendResponse(response);
      }
    }

    // POPUP上のOFF操作による拡張機能のOFF命令
    if (order.includes(orderNames.turnOff)) {
      console.log("[background] TURN OFF ordered.");
      try {
        const { tabId } = await state.get();
        await turnOffEachContentScripts(tabId);
        const {
          isContentScriptInjected,
          isCaptureSubtitleInjected,
          isControllerInjected,
        } = await state.get();
        // content scriptのinject状況だけ反映させてstateを初期値に戻す
        await state.set({
          ...modelBase,
          isContentScriptInjected: isContentScriptInjected,
          isCaptureSubtitleInjected: isCaptureSubtitleInjected,
          isControllerInjected: isControllerInjected,
        });
        response.complete = true;
      } catch (e) {
        response.complete = false;
        response.error = e;
      } finally {
        sendResponse(response);
      }
    }
  }
};

/**************************************
 * Handler of message from contentScrip.js
 *
 * */
const handlerOfContentScriptMessage = async (
  message: iMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: iResponse) => void
): Promise<void> => {
  console.log("[background] Message from contentScript.js");
  const { from, order, ...rest } = message;
  let response: iResponse = {
    from: extensionNames.background,
    to: from,
  };
  const { isExTranscriptStructured, isTranscriptDisplaying, isEnglish, tabId } =
    await state.get();

  if (order && order.length) {
  }

  // ExTRanscriptを表示する条件が揃わなくなったとき...
  if (!rest.isTranscriptDisplaying || !rest.language) {
    try {
      // ExTranscriptを非表示にするかする
      // もしもトランスクリプトが表示中であったならば
      if (isExTranscriptStructured && isTranscriptDisplaying) {
        console.log("[background] Hide ExTranscript...");
        await handlerOfHide(tabId);
      }
      // あとはStateを更新するだけ
      let s = {};
      if (rest.isTranscriptDisplaying !== undefined) {
        s["isTranscriptDisplaying"] = rest.isTranscriptDisplaying;
      }
      if (rest.language !== undefined) {
        s["isEnglish"] = rest.language;
      }

      await state.set(s);
      response.complete = true;
    } catch (e) {
      response.complete = false;
    } finally {
      sendResponse(response);
    }
  }

  // トランスクリプトが再表示されたとき...
  if (rest.isTranscriptDisplaying) {
    // ExTranscriptが非表示だったならば再表示させる
    if (isExTranscriptStructured && !isTranscriptDisplaying) {
      try {
        await handlerOfReset(tabId, (await state.get()).subtitles);
        await state.set({ isTranscriptDisplaying: true });

        response.complete = true;
      } catch (e) {
        response.complete = false;
      } finally {
        sendResponse(response);
      }
    }
  }

  // 字幕が英語を選択されたとき...
  if (rest.language) {
    // ExTranscriptが非表示だったならば再表示させる
    if (isExTranscriptStructured && !isEnglish) {
      try {
        await handlerOfReset(tabId, (await state.get()).subtitles);
        await state.set({
          isTranscriptDisplaying: true,
          isEnglish: true,
        });
        response.complete = true;
      } catch (e) {
        response.complete = false;
      } finally {
        sendResponse(response);
      }
    }
  }
};

/**********************************************
 * Handler of message from captureSubtitle.js
 *
 *
 * */
const handlerOfCaptureSubtitleMessage = async (
  message: iMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: iResponse) => void
): Promise<void> => {
  try {
  } catch (e) {
    console.error(e.message);
  }
};

/**********************************************
 *  Handler of message from controller.js
 *
 * */
const handlerOfControllerMessage = async (
  message: iMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: iResponse) => void
): Promise<void> => {
  try {
  } catch (e) {
    console.error(e.message);
  }
};

//
// --- Order Handlers -------------------------------------------
//

/*****************************************************
 * Handler of RUN order.
 *
 *
 * */
const handlerOfRun = async (tabInfo: chrome.tabs.Tab): Promise<boolean> => {
  try {
    const { url, id } = tabInfo;
    const {
      isContentScriptInjected,
      isCaptureSubtitleInjected,
      isControllerInjected,
    } = await state.get();

    // Save valid url and current tab that extension popup opened.
    await state.set({
      url: exciseBelowHash(url),
      tabId: id,
      tabInfo: tabInfo,
    });

    //<phase 2> inject contentScript.js
    const { tabId } = await state.get();
    if (!isContentScriptInjected) {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["contentScript.js"],
      });
      await state.set({ isContentScriptInjected: true });
    } else {
      await sendMessageToTabsPromise(tabId, {
        from: extensionNames.background,
        to: extensionNames.contentScript,
        order: [orderNames.reset],
      });
    }

    const currentPageStatus = await sendMessageToTabsPromise(tabId, {
      from: extensionNames.background,
      to: extensionNames.contentScript,
      order: [orderNames.sendStatus],
    });
    await state.set({
      isEnglish: currentPageStatus.language,
      isTranscriptDisplaying: currentPageStatus.isTranscriptDisplaying,
    });
    if (
      !currentPageStatus.language ||
      !currentPageStatus.isTranscriptDisplaying
    ) {
      // TODO: RUNしたけどページステータスのせいで実行できないときの挙動の実装...alert()する
      return false;
    }

    // <phase 3> inject captureSubtitle.js
    // 字幕データを取得する
    if (!isCaptureSubtitleInjected) {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["captureSubtitle.js"],
      });
      await state.set({ isCaptureSubtitleInjected: true });
    }

    // 字幕取得できるまで10回は繰り返す関数で取得する
    // NOTE: 戻り値が空の配列でも受け入れる
    const subtitles: subtitle_piece[] = await circulateRepeatCaptureSubtitles();
    await state.set({ subtitles: subtitles });

    // <phase 4> inject controller.js
    if (!isControllerInjected) {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["controller.js"],
      });
      await state.set({ isControllerInjected: true });
    } else {
      await sendMessageToTabsPromise(tabId, {
        from: extensionNames.background,
        to: extensionNames.controller,
        order: [orderNames.reset],
      });
    }

    const s: iModel = await state.get();
    await sendMessageToTabsPromise(tabId, {
      from: extensionNames.background,
      to: extensionNames.controller,
      subtitles: s.subtitles,
    });
    await state.set({ isExTranscriptStructured: true });

    // NOTE: MUST RETURN TRUE
    return true;
  } catch (e) {
    console.error(e.message);
    // TODO: Errorの種類を確認して必要に応じて再スロー
    // TODO: stack traceを追跡できるならば、どこの段階でエラーが起こったのか取得できるので、
    // 段階に合わせてstateを初期化する
    // またはそんな面倒はすっ飛ばして、ページのリロードを強制させるか？
    throw e;
  }
};

/**************************************************
 * Handler of RESET
 *
 * ExTranscriptを再生成する
 * 本家トランスくリプトが表示されているかどうか、
 * 字幕が英語かどうかはこの関数内でチェックしない
 *
 * 処理内容：
 *
 * - 各 content scriptのリセット：
 * content scriptはinjectされたまま（というか除去する手段はない）
 * なのでcontent scriptの状態を変化させないといかん
 * contentScript.js リセット不要
 * captureSubtitle.js 要リセット
 * controller.js 要リセット
 *
 * - captureSubtitle.jsから字幕データを取得する
 *
 * - controller.jsへ字幕データを渡す
 *
 * */
// const handlerOfReset = async (tabId: number): Promise<void> => {
//   try {
//     console.log("[background] RESET Begin...");
//     // stateの更新：
//     await state.set({
//       isTranscriptDisplaying: false,
//       isSubtitleCaptured: false,
//       isSubtitleCapturing: true,
//       subtitles: [],
//     });

//     // reset 処理: 各content scritpのリセットを実施する
//     await resetEachContentScript(tabId);

//     const newSubtitles: subtitle_piece[] = await repeatCaptureSubtitles(tabId);

//     // If okay, then save subtitles data.
//     await state.set({
//       isSubtitleCaptured: true,
//       isSubtitleCapturing: false,
//       subtitles: newSubtitles,
//     });

//     // NOTE: 必ずresetオーダーを出してから字幕を送ること
//     const resetOrder: iResponse = await sendMessageToTabsPromise(tabId, {
//       from: extensionNames.background,
//       to: extensionNames.controller,
//       order: [orderNames.reset],
//     });

//     const resetSubtitle: iResponse = await sendMessageToTabsPromise(tabId, {
//       from: extensionNames.background,
//       to: extensionNames.controller,
//       subtitles: newSubtitles,
//     });

//     await state.set({
//       isTranscriptDisplaying: true,
//     });

//     console.log("[background] RESET Complete!");
//   } catch (e) {
//     throw e;
//   }
// };

const handlerOfReset = async (
  tabId: number,
  // NOTE: 修正： 字幕は予め取得して渡されることとする
  subtitles: subtitle_piece[]
): Promise<void> => {
try {
  console.log("[background] RESET Begin...");
  await state.set({
    isTranscriptDisplaying: false,
    isSubtitleCaptured: false,
    isSubtitleCapturing: true,
  //   NOTE: 修正: ここではsubtitlesを消去しない
  //   subtitles: [],
  });

  await resetEachContentScript(tabId);

  // NOTE: 修正: 字幕データはこの関数の外で取得することにする
  // const newSubtitles: subtitle_piece[] = await repeatCaptureSubtitles(tabId);

  await state.set({
    isSubtitleCaptured: true,
    isSubtitleCapturing: false,
    subtitles: subtitles,
  });

  const resetOrder: iResponse = await sendMessageToTabsPromise(tabId, {
    from: extensionNames.background,
    to: extensionNames.controller,
    order: [orderNames.reset],
  });

  const resetSubtitle: iResponse = await sendMessageToTabsPromise(tabId, {
    from: extensionNames.background,
    to: extensionNames.controller,
    subtitles: subtitles,
  });

  await state.set({
    isTranscriptDisplaying: true,
  });

  console.log("[background] RESET Complete!");
} catch (e) {
  throw e;
}
};



/*****************************************************
 * Handler of hide ExTranscript
 *
 * NOTE: これは拡張機能をOFFにするハンドラではない
 * 実際には隠すのではなくて、ExTranscriptを消す処理を実行する
 *
 * 発動条件：
 * - 本家トランスクリプトが非表示になった
 * - 英語字幕以外の字幕を選択されてしまった
 *
 *
 * */
const handlerOfHide = async (tabId: number): Promise<void> => {
  try {
    console.log("[background] handlerOfHide hides ExTranscript...");
    // stateの更新：
    await state.set({
      isTranscriptDisplaying: false,
      isSubtitleCaptured: false,
      // subtitles: [],
    });
    // reset 処理: 各content scritpのリセットを実施する
    await sendMessageToTabsPromise(tabId, {
      from: extensionNames.background,
      to: extensionNames.controller,
      order: [orderNames.turnOff],
    });
  } catch (e) {
    console.error(e.message);
    throw e;
  }
};

// ---- OTHERS METHODS ----------------------------------------

/**
 *
 *
 * */
const resetEachContentScript = async (tabId: number): Promise<void> => {
  try {
    console.log("[background] BEGIN resetEachContentScript()");

    const contentScript = sendMessageToTabsPromise(tabId, {
      from: extensionNames.background,
      to: extensionNames.contentScript,
      order: [orderNames.reset],
    });

    const controller = sendMessageToTabsPromise(tabId, {
      from: extensionNames.background,
      to: extensionNames.controller,
      order: [orderNames.reset],
    });

    // const r: iResponse[] = await Promise.all([contentScript, controller]);
    await Promise.all([contentScript, controller]);

    // const failureReasons: string = r
    //     .filter((_) => {
    //         if (!_.success) {
    //             return _.failureReason;
    //         }
    //     })
    //     .join(' ');

    // if (failureReasons) {
    //     throw new Error(
    //         `Error: While reset content script. ${failureReasons}`
    //     );
    // }

    console.log("[background] DONE resetEachContentScript()");
  } catch (e) {
    throw e;
  }
};

/**********
 *
 * 各content scriptを拡張機能OFFに合わせ初期化する
 *
 * */
const turnOffEachContentScripts = async (tabId: number): Promise<void> => {
  try {
    console.log("[background] Turning off each content scripts");

    const contentScript = sendMessageToTabsPromise(tabId, {
      from: extensionNames.background,
      to: extensionNames.contentScript,
      order: [orderNames.turnOff],
    });

    const controller = sendMessageToTabsPromise(tabId, {
      from: extensionNames.background,
      to: extensionNames.controller,
      order: [orderNames.turnOff],
    });

    // const r: iResponse[] = await Promise.all([contentScript, controller]);
    await Promise.all([contentScript, controller]);

    // const failureReasons: string = r
    //     .filter((_) => {
    //         if (!_.success) {
    //             return _.failureReason;
    //         }
    //     })
    //     .join(' ');

    // if (failureReasons) {
    //     throw new Error(
    //         `Error: failed to turn off content script. ${failureReasons}`
    //     );
    // }

    console.log("[background] Done turning off each content scripts");
  } catch (e) {
    throw e;
  }
};

//
// --- Other Methods ----------------------------------------
//

/***
 *  Repeat to capture subtitles
 * ______________________________________________________________
 *
 *  Repeats 10 times so far.
 * */
const repeatCaptureSubtitles = async function (
  tabId: number
): Promise<subtitle_piece[]> {
  return new Promise(async (resolve, reject): Promise<void> => {
    let intervalId: NodeJS.Timer;
    let counter: number = 0;

    console.log("[repeatCaptureSubtitles]Begin to capture subtitles... ");

    intervalId = setInterval(async function () {
      if (counter >= 10) {
        // Failed
        console.log("[repeatCaptureSubtitles] Time out! It's over 10 times");
        clearInterval(intervalId);
        reject([]);
      }

      console.log("[repeatCaptureSubtitles] capture again...");
      const r: iResponse = await sendMessageToTabsPromise(tabId, {
        from: extensionNames.background,
        to: extensionNames.captureSubtitle,
        order: [orderNames.sendSubtitles],
      });
      if (r.subtitles !== undefined && r.subtitles.length) {
        // Succeed
        console.log("[repeatCaptureSubtitles] Succeed to capture!");
        clearInterval(intervalId);
        resolve(r.subtitles);
      } else counter++;
    }, INTERVAL_TIME);
  });
};

// circulaterへ渡すcallback関数
//
// 完全にハードコーディング
// 利用場面に応じて個別に作って
//
// 実際に実行したい関数へ渡さなくてはならない引数はここで渡すこと
// 戻り値は任意であるが、condition関数のgenerics型と同じにすること
const cb: iCallbackOfCirculater<subtitle_piece[]> = async (): Promise<subtitle_piece[]> => {
  const { tabId } = await state.get();
  const s: subtitle_piece[] = await repeatCaptureSubtitles(tabId);
  return s;
};

// circulaterへ渡すconditon関数
//
// 完全にハードコーディング
// 利用場面に応じて個別に作って
//
// circulaterへ渡す引数callbackの戻り値の型と同じ型をgenericsとして渡すこと
const condition: iConditionOfCirculater<subtitle_piece[]> = (operand: subtitle_piece[]): boolean => {
  return operand.length ? true : false;
};

/**********************************************
 * circulateRepeatCaptureSubtitles
 * 
 * 
 * description:
 * repeactCaptureSubtitles()を3回繰り返す関数
 * condition()の条件を満たせば即終了し、
 * repeactCaptureSubtitles()が取得した最後の戻り値を返す
 * 
 * UdemyのDOMローディングの時間がかかりすぎる場合に対処するための関数
 * */ 
const circulateRepeatCaptureSubtitles: iClosureOfCirculater<subtitle_piece[]> = circulater(cb, condition, 2);

/*****
 * state module
 * _________________________________________________________________
 *
 * This module never holds variables.
 * No matter background script unloaded or reloaded,
 * state never lose saved varibales.
 * */
const state: iStateModule<iModel> = (function () {
  const _getLocalStorage = async function (key): Promise<iModel> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (s: iModel): void => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        resolve(s);
      });
    });
  };

  return {
    // 本来ローカルストレージに保存しておくデータの一部だけでも
    // 保存することを可能とする
    //
    set: async (prop: {
      [Property in keyof iModel]?: iModel[Property];
    }): Promise<void> => {
      try {
        const s: iModel = await _getLocalStorage(KEY_LOCALSTORAGE);
        const newState = {
          ...s[KEY_LOCALSTORAGE],
          ...prop,
        };
        await chrome.storage.local.set({
          [KEY_LOCALSTORAGE]: newState,
        });
      } catch (e) {
        console.error(`Error: Problem ocurreud while chrome.storage`);
        throw e;
      }
    },

    get: async (): Promise<iModel> => {
      try {
        const s: iModel = await _getLocalStorage(KEY_LOCALSTORAGE);
        return { ...s[KEY_LOCALSTORAGE] };
      } catch (e) {
        console.error(`Error: Problem ocurreud while chrome.storage`);
        throw e;
      }
    },

    clearAll: async (): Promise<void> => {
      try {
        await chrome.storage.local.remove(KEY_LOCALSTORAGE);
      } catch (e) {
        console.error(`Error: Problem ocurreud while chrome.storage`);
        throw e;
      }
    },
  };
})();

//
// --- LEGACY ----------------------------
//

/*
//     state module
//     ______________________________________________
//     service workerなので、Stateを常に参照できるようにしておくため
//     モジュール化したState

//     Stateのインスタンスはここへカプセル化され、
//     getInstance()を通して参照が渡される

//     検証してみた結果、アンロード、ロードに耐えうる模様
// */
// export const state: iStateModule<iModel> = (function () {
//   let _instance: State<iModel> = null;

//   return {
//     register: (m: State<iModel>): void => {
//       _instance = m;
//     },
//     // unregisterする場面では、もはやStateは要らないから
//     // Stateを削除しちゃってもいいと思う
//     unregister: (): void => {
//       _instance = null;
//     },
//     getInstance: (): State<iModel> => {
//       return _instance;
//     },
//   };
// })();

// /*****
//  * Verify given url or current tab url
//  * ________________________________________________________
//  *
//  * */
// const handlerOfVerifyValidPage = async (_url?: string): Promise<boolean> => {
//   try {
//     let url: string = "";
//     if (_url === undefined) {
//       const tab: chrome.tabs.Tab = await tabsQuery();
//       url = tab.url;
//     } else url = _url;
//     const result: RegExpMatchArray = url.match(urlPattern);
//     return result && result.length ? true : false;
//   } catch (err) {
//     console.error(err.message);
//   }
// };
