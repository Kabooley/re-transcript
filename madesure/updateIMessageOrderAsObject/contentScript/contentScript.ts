import { extensionNames, orderNames, iMessage } from '../utils/constants';

chrome.runtime.onMessage.addListener(
    (
        message: iMessage,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: iMessage) => void
    ): boolean => {
        const { from, to, order } = message;
        if (to !== extensionNames.contentScript) return;

        // もしもorderプロパティが存在して、中身が空じゃなければ
        if (order && Object.keys(order).length) {
            if (order[orderNames.sendStatus]) {
            }
            if (order[orderNames.disconnect]) {
            }
            if (order[orderNames.injectCaptureSubtitleScript]) {
            }
            if (order[orderNames.injectExTranscriptScript]) {
            }
        }
        return true;
    }
);

(function () {
    setTimeout(function () {
        chrome.runtime.sendMessage({
            from: extensionNames.contentScript,
            to: extensionNames.background,
            activated: true,
        });
    }, 3000);

    setTimeout(function () {
        chrome.runtime.sendMessage({
            from: extensionNames.contentScript,
            to: extensionNames.background,
            order: {
                sendStatus: orderNames.sendStatus,
                disconnect: orderNames.disconnect,
            },
        });
    }, 3000);

    setTimeout(function () {
        chrome.runtime.sendMessage({
            from: extensionNames.contentScript,
            to: extensionNames.background,
            language: true,
            order: {
                injectCaptureSubtitleScript:
                    orderNames.injectCaptureSubtitleScript,
                injectExTranscriptScript: orderNames.injectExTranscriptScript,
            },
        });
    }, 3000);

    setTimeout(function () {
        chrome.runtime.sendMessage({
            from: extensionNames.contentScript,
            to: extensionNames.background,
            title: 'Awesome title',
            complete: true,
        });
    }, 3000);
})();
