/****************************************************
 * シングルメッセージパッシングでは
 * 発信側はsendResponse()で返事を受け取れるか？
 * ________________________________________________
 *
 * 結論：受け取れる
 *
 * なのでシングルメッセージのやりとりでは、
 * シングルメッセージのやり取りをするよりも
 * 一旦送信したら、sendResponseに返事を書かせるべき
 * 
 * 
 * メッセージパッシングのsenderから送信者を特定できるか？
 * ________________________________________________
 *
 * 結論：わからん。けどtabIDは取得できる
 * 
 * 取得できるデータは次の通り
 * ```
 * {id: 'hmiebhggelkkcfgogdbcfiogldhlfcjc', 
 *  url: 'https://developer.mozilla.org/ja/', 
 *  origin: 'https://developer.mozilla.org', 
 *  frameId: 0, 
 *  tab: {…}}
 * ```
 * 
 *  tab
 * ```
        tab:
        active: true
        audible: false
        autoDiscardable: true
        discarded: false
        favIconUrl: "https://developer.mozilla.org/favicon-48x48.97046865.png"
        groupId: -1
        height: 769
        highlighted: true
        id: 95
        incognito: false
        index: 2
        mutedInfo: {muted: false}
        pinned: false
        selected: true
        status: "complete"
        title: "MDN Web Docs"
        url: "https://developer.mozilla.org/ja/"
        width: 1368
        windowId: 1
 * ```
 * 
 * urlやtabId, status等が取得できるのは興味深い
 * 
 * たとえばcontentScript.jsがインジェクト完了したら、そのtabIdを調べなくても
 * inject完了したときにシングルメッセージを送信したら
 * そのまま正しいtabIdを取得できる
 * 
 * *************************************************/

// --- ANNOTATIONS -------------------------------
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

// --- LISTENERS -----------------------------------

chrome.runtime.onInstalled.addListener(() => {
    console.log('BACKGROUND RUNNING...');
});

chrome.runtime.onMessage.addListener(
    async (
        message: iMessage,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: iMessage) => void
    ): Promise<void> => {
        console.log('ONMESSAGE');
        const { from, to, order, data } = message;
        if (to !== extensionNames.background) return;

        // 確認
        // senderで発信者を特定できるのか？
        //
        console.log(sender);
        if (from === extensionNames.contentScript) {
            if (data === dataTemplates.activated) {
                const tabId: number = await checkTabIsCorrect(
                    /https:\/\/developer.mozilla.org\/ja\//
                );
                console.log(`tabId: ${tabId}`);
                chrome.tabs.sendMessage(
                    tabId,
                    {
                        from: extensionNames.background,
                        to: extensionNames.contentScript,
                        order: orderNames.sendStatus,
                    },
                    (response: iMessage) => {
                        console.log(response);
                    }
                );
            }
        }
    }
);

const sendResponse = (message: iMessage) => {
    // 確認
    //
    // この出力がbackground側かcontent script側かで話が変わる
    console.log(message);
};

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
