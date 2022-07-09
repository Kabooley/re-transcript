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

import {
    _key_of_model_state__,
    _key_of_localstorage__,
    urlPattern,
    orderNames,
    extensionNames,
    iMessage,
    subtitle_piece,
    iResponse,
    messageTemplate,
} from '../utils/constants';
import {
    sendMessageToTabsPromise,
    exciseBelowHash,
    tabQuery,
} from '../utils/helpers';
import { iModel, modelBase, iStateModule } from './annotations';
import { circulater, iClosureOfCirculater } from '../utils/Circulater';
import { repeatPromiseGenerator } from '../utils/repeatPromise';

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
chrome.tabs.onUpdated.addListener(
    async (
        tabIdUpdatedOccured: number,
        changeInfo: chrome.tabs.TabChangeInfo,
        Tab: chrome.tabs.Tab
    ): Promise<void> => {
        console.log(`on updated: ${changeInfo.status}`);
        const { url, tabId, isExTranscriptStructured } = await state.get();

        try {
            // 拡張機能が未展開、changeInfo.statusがloadingでないなら無視する
            if (changeInfo.status !== 'loading' || !isExTranscriptStructured)
                return;

            // 拡張機能が展開済だとして、tabIdが展開済のtabId以外に切り替わったなら無視する
            if (tabIdUpdatedOccured !== tabId) return;

            // 展開中のtabId && chnageInfo.urlが講義ページ以外のURLならば
            // 拡張機能OFFの処理へ
            if (isExTranscriptStructured && tabIdUpdatedOccured === tabId) {
                // おなじURLでのリロードか？
                if (changeInfo.url === undefined) {
                    // await state.set(modelBase);
                    await state.clearAll();
                } else if (!changeInfo.url.match(urlPattern)) {
                    // 講義ページ以外に移動した
                    // await state.set(modelBase);
                    await state.clearAll();
                }

                // 展開中のtabIdである && changeInfo.urlが講義ページである
                // その上でURLが変化した
                // NOTE: Compare URL WITHOUT below hash.
                else if (
                    changeInfo.url.match(urlPattern) &&
                    exciseBelowHash(changeInfo.url) !== exciseBelowHash(url)
                ) {
                    //NOTE: MUST Update URL. ページが切り替わったから
                    await state.set({ url: exciseBelowHash(changeInfo.url) });

                    // 動画ページ以外に切り替わった？
                    const res: iResponse = await sendMessageToTabsPromise(
                        tabId,
                        {
                            from: extensionNames.background,
                            to: extensionNames.contentScript,
                            order: [orderNames.isPageIncludingMovie],
                        }
                    );

                    res.isPageIncludingMovie
                        ? // 次の動画に移った
                          await handlerOfReset(
                              tabIdUpdatedOccured,
                              await circulateCaptureSubtitles()
                          )
                        : // 動画を含まないページへ移った
                          await handlerOfHide(tabIdUpdatedOccured);
                }
            }
        } catch (e) {
            alertHandler(tabId, messageTemplate.appCannotExecute);
        }
    }
);

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
chrome.tabs.onRemoved.addListener(
    async (
        _tabId: number,
        removeInfo: chrome.tabs.TabRemoveInfo
    ): Promise<void> => {
        try {
            const { tabId } = await state.get();
            if (_tabId !== tabId) return;
            await state.clearAll();
        } catch (err) {
            console.error(err);
        }
    }
);

/**
 * Handler of onMessage
 *
 * NOTE: MUST RETURN true.
 * */
chrome.runtime.onMessage.addListener(
    (
        message: iMessage,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response?: iResponse) => void
    ): boolean => {
        if (message.to !== extensionNames.background) return;
        sortMessage(message, sender, sendResponse);

        return true;
    }
);

//
// --- Message Handlers ----------------------------------------
//

/**
 * Sort message by sender.
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
const handlerOfPopupMessage = async (
    message: iMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: iResponse) => void
): Promise<void> => {
    const { from, order, ...rest } = message;
    let response: iResponse = {
        from: extensionNames.background,
        to: from,
    };
    if (order && order.length) {
        // SEND STATUS
        if (order.includes(orderNames.sendStatus)) {
            try {
                const current = await state.get();
                if (!Object.keys(current).length) await initialize();
                const { isSubtitleCapturing, isExTranscriptStructured } =
                    await state.get();
                response.state = {
                    isSubtitleCapturing: isSubtitleCapturing,
                    isExTranscriptStructured: isExTranscriptStructured,
                };
                response.complete = true;
            } catch (e) {
                response.complete = false;
                response.error = e;

                alertHandler(
                    (await tabQuery()).id,
                    messageTemplate.appCannotExecute
                );
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
            try {
                const r: boolean = await handlerOfRun(rest.tabInfo);
                response.success = r;
                response.complete = true;
                if (!r) {
                    alertHandler(
                        (await tabQuery()).id,
                        messageTemplate.letPagePrepare
                    );
                }
            } catch (e) {
                response.complete = false;
                response.error = e;
                alertHandler(
                    (await tabQuery()).id,
                    messageTemplate.appCannotExecute
                );
            } finally {
                sendResponse(response);
            }
        }

        // POPUP上のOFF操作による拡張機能のOFF命令
        if (order.includes(orderNames.turnOff)) {
            try {
                await handlerOfTurnOff();
                response.complete = true;
            } catch (e) {
                response.complete = false;
                response.error = e;
                alertHandler(
                    (await tabQuery()).id,
                    messageTemplate.appCannotExecute
                );
            } finally {
                sendResponse(response);
            }
        }
    }
};

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
const handlerOfContentScriptMessage = async (
    message: iMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: iResponse) => void
): Promise<void> => {
    const { from, order, ...rest } = message;
    let response: iResponse = {
        from: extensionNames.background,
        to: from,
    };
    const {
        isExTranscriptStructured,
        isTranscriptDisplaying,
        isEnglish,
        tabId,
    } = await state.get();

    if (order && order.length) {
    }

    // ExTRanscriptを表示する条件が揃わなくなったとき...
    // if (!rest.isTranscriptDisplaying || !rest.language) {
    if (
        (rest.isTranscriptDisplaying !== undefined &&
            !rest.isTranscriptDisplaying) ||
        (rest.language !== undefined && !rest.language)
    ) {
        try {
            // ExTranscriptを非表示にするかする
            // もしもトランスクリプトが表示中であったならば
            if (isExTranscriptStructured && isTranscriptDisplaying) {
                await handlerOfHide(tabId);
            }
            // あとはStateを更新するだけ
            let s = {};
            if (rest.isTranscriptDisplaying !== undefined) {
                s['isTranscriptDisplaying'] = rest.isTranscriptDisplaying;
            }
            if (rest.language !== undefined) {
                s['isEnglish'] = rest.language;
            }

            await state.set(s);
            response.complete = true;
        } catch (e) {
            response.complete = false;
            alertHandler(
                (await tabQuery()).id,
                messageTemplate.appCannotExecute
            );
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
                alertHandler(
                    (await tabQuery()).id,
                    messageTemplate.appCannotExecute
                );
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
                alertHandler(
                    (await tabQuery()).id,
                    messageTemplate.appCannotExecute
                );
            } finally {
                sendResponse(response);
            }
        }
    }
};

/**
 * Handler of message from captureSubtitle.js.
 *
 * So far, there is no turnout unless exception happens.
 * */
const handlerOfCaptureSubtitleMessage = async (
    message: iMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: iResponse) => void
): Promise<void> => {
    try {
        const { order, ...rest } = message;
        if (rest.error) throw rest.error;
    } catch (e) {
        alertHandler((await tabQuery()).id, messageTemplate.appCannotExecute);
    }
};

/**
 *  Handler of message from controller.js
 *
 * In case close button on ExTranscript is clicked,
 * then order "turnOff" will be sent.
 * */
const handlerOfControllerMessage = async (
    message: iMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: iResponse) => void
): Promise<void> => {
    try {
        const { order, ...rest } = message;

        if (order && order.length) {
            if (order.includes(orderNames.turnOff)) await handlerOfTurnOff();
        }
        if (rest.error) throw rest.error;
    } catch (e) {
        alertHandler((await tabQuery()).id, messageTemplate.appCannotExecute);
    }
};

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
                files: ['contentScript.js'],
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
            return false;
        }

        // <phase 3> inject captureSubtitle.js
        // 字幕データを取得する
        if (!isCaptureSubtitleInjected) {
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['captureSubtitle.js'],
            });
            await state.set({ isCaptureSubtitleInjected: true });
        }

        // 字幕取得できるまで10回は繰り返す関数で取得する
        // NOTE: 戻り値が空の配列でも受け入れる
        const subtitles: subtitle_piece[] = await circulateCaptureSubtitles();
        await state.set({ subtitles: subtitles });

        // <phase 4> inject controller.js
        if (!isControllerInjected) {
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['controller.js'],
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
        throw e;
    }
};

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
const handlerOfReset = async (
    tabId: number,
    subtitles: subtitle_piece[]
): Promise<void> => {
    try {
        await state.set({
            isTranscriptDisplaying: false,
            isSubtitleCaptured: false,
            isSubtitleCapturing: true,
        });

        await resetEachContentScript(tabId);

        await state.set({
            isSubtitleCaptured: true,
            isSubtitleCapturing: false,
            subtitles: subtitles,
        });

        await sendMessageToTabsPromise(tabId, {
            from: extensionNames.background,
            to: extensionNames.controller,
            order: [orderNames.reset],
        });

        await sendMessageToTabsPromise(tabId, {
            from: extensionNames.background,
            to: extensionNames.controller,
            subtitles: subtitles,
        });

        await state.set({
            isTranscriptDisplaying: true,
        });
    } catch (e) {
        throw e;
    }
};

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
const handlerOfHide = async (tabId: number): Promise<void> => {
    try {
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

/**
 * Handler of TURN OFF ExTranscript.
 *
 * 各content scriptを初期化する
 * stateを初期化する
 * ただしcontent scriptのinject状況だけstateに反映させておく
 * */
const handlerOfTurnOff = async (): Promise<void> => {
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
    } catch (e) {
        throw e;
    }
};

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
const resetEachContentScript = async (tabId: number): Promise<void> => {
    try {
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

        await Promise.all([contentScript, controller]);
    } catch (e) {
        throw e;
    }
};

/**
 * Turn Off each content script.
 *
 * contentScript.ts, controller.tsへ初期化命令(TurnOff)を発信する
 * 両scriptで完了の返信があった時点でリセット完了となる
 *
 * NOTE: resetEachContentScripts()と区別する
 * */
const turnOffEachContentScripts = async (tabId: number): Promise<void> => {
    try {
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

        await Promise.all([contentScript, controller]);
    } catch (e) {
        throw e;
    }
};

/***
 * Repeat subtitle acquisition 10 times.
 *
 * @returns function - Returns a function which repeats second argument callback function while given times or untile third argument function returns true.
 * */
const captureSubtitles = repeatPromiseGenerator<subtitle_piece[]>(
    INTERVAL_TIME,
    async function () {
        const { tabId } = await state.get();
        const r: iResponse = await sendMessageToTabsPromise(tabId, {
            from: extensionNames.background,
            to: extensionNames.captureSubtitle,
            order: [orderNames.sendSubtitles],
        });
        return r.subtitles;
    },
    function (data: subtitle_piece[]): boolean {
        return data !== undefined && data.length ? true : false;
    },
    10
);

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
const circulateCaptureSubtitles: iClosureOfCirculater<subtitle_piece[]> =
    circulater(
        captureSubtitles,
        (operand: subtitle_piece[]): boolean => {
            return operand.length ? true : false;
        },
        2
    );

/**
 * Alert
 *
 * Embeds alert function into content script.
 *
 * UPDATED:
 *  Add state.clearAll() to clear state object everytime exception thrown.
 */
const alertHandler = (tabId: number, msg: string): void => {
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
                const s: iModel = await _getLocalStorage(
                    _key_of_localstorage__
                );
                const newState = {
                    ...s[_key_of_localstorage__],
                    ...prop,
                };
                await chrome.storage.local.set({
                    [_key_of_localstorage__]: newState,
                });
            } catch (e) {
                throw e;
            }
        },

        get: async (): Promise<iModel> => {
            try {
                const s: iModel = await _getLocalStorage(
                    _key_of_localstorage__
                );
                return { ...s[_key_of_localstorage__] };
            } catch (e) {
                throw e;
            }
        },

        clearAll: async (): Promise<void> => {
            try {
                // DEBUG: ----
                console.log('state: clear all');
                // --------------
                await chrome.storage.local.remove(_key_of_localstorage__);
                const current = await state.get();
            } catch (e) {
                throw e;
            }
        },
    };
})();

/**
 * Always invoke this extension every first time the browser starts up.
 *
 *
 * */
const initialize = async (): Promise<void> => {
    try {
        state.clearAll();
        await state.set(modelBase);
    } catch (err) {
        alertHandler((await tabQuery()).id, messageTemplate.appCannotExecute);
    }
};
