import { extensionNames, orderNames, iMessage } from '../utils/constants';

chrome.runtime.onMessage.addListener(
    (
        message: iMessage,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: iMessage) => void
    ): boolean => {
        console.log('[content script] ONMESSAGE');
        const { from, to, order } = message;
        if (to !== extensionNames.contentScript) return;

        // もしもorderプロパティが存在して、中身が空じゃなければ
        if (order && order.length) {
            console.log('[content script] GOT ORDER');
            if (order.includes(orderNames.sendStatus)) {
                console.log('[content script] SEND STATUS');
            }
            if (order.includes(orderNames.disconnect)) {
                console.log('[content script] DISCONNECT');
            }
            if (order.includes(orderNames.injectCaptureSubtitleScript)) {
                console.log('[content script] injectCaptureSubtitleScript');
            }
            if (order.includes(orderNames.injectExTranscriptScript)) {
                console.log('[content script] injectExTranscriptScript');
            }
        }
        return true;
    }
);

(function () {
    setTimeout(function () {
        console.log('content script running...');
        chrome.runtime.sendMessage({
            from: extensionNames.contentScript,
            to: extensionNames.background,
            activated: true,
        });
    }, 3000);

    setTimeout(function () {
        console.log('Send some orders');
        chrome.runtime.sendMessage({
            from: extensionNames.contentScript,
            to: extensionNames.background,
            order: [orderNames.sendStatus, orderNames.disconnect],
        });
    }, 3000);

    setTimeout(function () {
        console.log('content script running...');
        chrome.runtime.sendMessage({
            from: extensionNames.contentScript,
            to: extensionNames.background,
            language: true,
            order: [
                    orderNames.injectCaptureSubtitleScript, orderNames.injectExTranscriptScript,
            ],
        });
    }, 3000);

    setTimeout(function () {
        console.log('content script running...');
        chrome.runtime.sendMessage({
            from: extensionNames.contentScript,
            to: extensionNames.background,
            title: 'Awesome title',
            complete: true,
        });
    }, 3000);
})();
