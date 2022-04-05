/****************************************************
 * message-passingでやりとりするメッセージで使う
 * インタフェイスのテスト
 *
 * ________________________________________________
 *
 *
 *
 *************************************************/
import { extensionNames, orderNames, iMessage } from '../utils/constants';

// --- LISTENERS -----------------------------------

chrome.runtime.onInstalled.addListener(() => {
    console.log('BACKGROUND RUNNING...');
});

chrome.runtime.onMessage.addListener(
    async (
        message: iMessage,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: iMessage) => void
    ): Promise<boolean> => {
        console.log('[background] ONMESSAGE');
        const { from, to, order, ...rest } = message;
        if (to !== extensionNames.background) return;

        // Order handling
        // もしもorderプロパティが存在して、中身が空じゃなければ
        if (order && order.length) {
            console.log('[background] GOT ORDER');
            if (order.includes(orderNames.sendStatus)) {
                console.log('SEND STATUS');
            }
            if (order.includes(orderNames.disconnect)) {
                console.log('DISCONNECT');
            }
            if (order.includes(orderNames.injectCaptureSubtitleScript)) {
                console.log('injectCaptureSubtitleScript');
            }
            if (order.includes(orderNames.injectExTranscriptScript)) {
                console.log('injectExTranscriptScript');
            }
        }

        if (rest.activated && from === extensionNames.contentScript) {
            console.log('[background] content script has been activated');
        }

        return true;
    }
);

chrome.tabs.onUpdated.addListener(
    (
        tabId: number,
        changeInfo: chrome.tabs.TabChangeInfo,
        Tab: chrome.tabs.Tab
    ): void => {
        console.log('TAB UPDATED...');
        messageSender();
    }
);

const checkTabIsCorrect = async (pattern: RegExp): Promise<number> => {
    // https://www.udemy.com/course/*
    try {
        const w: chrome.windows.Window = await chrome.windows.getCurrent();
        const tabs: chrome.tabs.Tab[] = await chrome.tabs.query({
            active: true,
            windowId: w.id,
        });
        const tab: chrome.tabs.Tab = tabs[0];
        const result: RegExpMatchArray = tab.url.match(pattern);
        if (result) {
            return tab.id;
        } else {
            return null;
        }
    } catch (err) {
        if (err === chrome.runtime.lastError) {
            console.error(err.message);
        } else {
            console.log(err);
        }
    }
};

const messageSender = async (): Promise<void> => {
    const tabId: number = await checkTabIsCorrect(
        /https:\/\/developer.mozilla.org\/ja\//
    );
    setTimeout(function () {
        console.log('content script running...');
        chrome.tabs.sendMessage(tabId, {
            to: extensionNames.contentScript,
            from: extensionNames.background,
            activated: true,
        });
    }, 3000);

    setTimeout(function () {
        console.log('Send some orders');
        chrome.tabs.sendMessage(tabId, {
            from: extensionNames.contentScript,
            to: extensionNames.background,
            order: [orderNames.sendStatus, orderNames.disconnect],
        });
    }, 3000);

    setTimeout(function () {
        console.log('content script running...');
        chrome.tabs.sendMessage(tabId, {
            to: extensionNames.contentScript,
            from: extensionNames.background,
            language: true,
            order: [
                orderNames.injectCaptureSubtitleScript,
                orderNames.injectExTranscriptScript,
            ],
        });
    }, 3000);

    setTimeout(function () {
        console.log('content script running...');
        chrome.tabs.sendMessage(tabId, {
            to: extensionNames.contentScript,
            from: extensionNames.background,
            title: 'Awesome title',
            complete: true,
        });
    }, 3000);
};
