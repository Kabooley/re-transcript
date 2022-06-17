const extensionNames = {
    contentScript: 'contentScript',
    background: 'background',
    popup: 'popup',
    option: 'option',
} as const;

const orderNames = {
    sendStatus: 'sendStatus',
    activated: 'activated',
    disconnect: 'disconnect',
} as const;

const dataTemplates = {
    activated: 'activated',
    good: 'good',
    bad: 'bad',
} as const;

type typeofDataTemplates = typeof dataTemplates;
type keyofDataTemplates = keyof typeofDataTemplates;

type typeofExtensionNames = typeof extensionNames;
type keyofExtensionNames = keyof typeofExtensionNames;

type typeofOrderNames = typeof orderNames;
type keyofOrderNames = keyof typeofOrderNames;

interface iMessage {
    from: keyofExtensionNames;
    to: keyofExtensionNames;
    order?: keyofOrderNames;
    data?: keyofDataTemplates;
}

chrome.runtime.onMessage.addListener(
    (
        message: iMessage,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: iMessage) => void
    ): boolean => {
        const { from, to, order, data } = message;
        if (
            to !== extensionNames.contentScript ||
            from !== extensionNames.background
        )
            return;

        if (order === orderNames.sendStatus) {
            sendResponse({
                from: extensionNames.contentScript,
                to: extensionNames.background,
                data: dataTemplates.good,
            });
        }

        return true;
    }
);

(function () {
    setTimeout(function () {
        chrome.runtime.sendMessage({
            from: extensionNames.contentScript,
            to: extensionNames.background,
            data: dataTemplates.activated,
        });
    }, 3000);
})();
