import { State } from '../utils/State';

// --- LISTENERS -----------------------------------

chrome.runtime.onInstalled.addListener(() => {
    console.log('BACKGROUND RUNNING...');
    initializeBackgroundScript();
});


chrome.runtime.onMessage.addListener(
    async (
        message: iMessage,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: iMessage) => void
    ): Promise<void> => {
        console.log("ONMESSAGE");
        const { from, to, order, data } = message;
        if(to !== extensionNames.background) return;

        // 確認
        // senderで発信者を特定できるのか？
        // 
        console.log(sender);
        if(from === extensionNames.contentScript) {
            if(data === dataTemplates.activated){
                const tabId: number = await checkTabIsCorrect(/https:\/\/developer.mozilla.org\/ja\//);
                console.log(`tabId: ${tabId}`);
                chrome.tabs.sendMessage(
                    tabId,
                    {
                        from: extensionNames.background,
                        to: extensionNames.contentScript,
                        order: orderNames.sendStatus
                    }, sendResponse )
            }
        }
})

const sendResponse = (message: iMessage) => {
    // 確認
    // 
    // この出力がbackground側かcontent script側かで話が変わる
    console.log(message);
}

// --- ANNOTATIONS --------------------------------

enum nameOfState {
    status = 'state_of_status',
    subtitles = 'state_of_subtitles',
    tabId = 'state_of_tabId',
    sectionTitle = 'state_of_sectionTitle',
}

interface iStatus {
    scripts?: state_script_status;
    pageStatus?: state_page_status;
    progress?: state_progress;
}

const messagePassingStatus = {
    working: 'working',
    notWorking: 'notWorking',
    idle: 'idle',
} as const;

type messagePassingStatusTypes = typeof messagePassingStatus;
type messagePassingStatusKeys = keyof messagePassingStatusTypes;

// 要は各拡張機能と応答できているか、そいつは起動しているのかの状態
interface state_script_status {
    popup: messagePassingStatusKeys;
    contentScript: messagePassingStatusKeys;
    controller: messagePassingStatusKeys;
    option: messagePassingStatusKeys;
}

interface state_page_status {
    // 動画がべつの動画になったかどうか（Udemyは別動画に移動しても同じ講義ならばurlは変化しないSPAである）
    // moveToOtherVideo?: boolean;

    // transcript機能をONにしているかどうか。これがわからないとscrapingができない
    isTranscriptOn?: boolean;
    // 字幕の選択言語は英語であるか
    isEnglish?: boolean;
    // transcriptがONでもブラウザwindowサイズが小さすぎると強制的にtranscriptがオフになる
    isWindowTooSmall?: boolean;
}

// PopupでRUNボタンを押してからの進捗フラグ管理
interface state_progress {
    // 字幕取得処理中はtrue
    capturing: boolean;
    // 整形字幕が問題なく取得できたらtrue
    captured: boolean;
    // 整形字幕をstorageへ保存できたらtrue
    stored: boolean;
    // ExTranscriptを挿入して問題なかったらtrue
    restructured: boolean;
}

// Subtitle object interface
interface subtitle_piece {
    index: number;
    subtitle: string;
}

interface iSubtitles {
    subtitles: subtitle_piece[];
}

interface iTabId {
    tabId: number;
}

interface iSectionTitle {
    title: string;
}

interface iStateList {
    register: <TYPE>(name: string, instance: State<TYPE>) => void;
    unregister: (name: string) => void;
    // setState: <TYPE>(name: string, data: TYPE) => Promise<void>;
    // getState: <TYPE>(name: string) => Promise<TYPE>;
    clearStorage: (name: string) => Promise<void>;
    caller: <TYPE>(name: string) => State<TYPE>;
}

interface iDummyData {
    status: iStatus;
    subtitles: iSubtitles;
    tabId: iTabId;
    sectionTitle: iSectionTitle;
}

const dummyData: iDummyData = {
    status: {
        scripts: {
            popup: 'notWorking',
            contentScript: 'notWorking',
            controller: 'notWorking',
            option: 'notWorking',
        },
        pageStatus: {
            isTranscriptOn: false,
            isEnglish: false,
            isWindowTooSmall: false,
        },
        progress: {
            capturing: false,
            captured: false,
            stored: false,
            restructured: false,
        },
    },
    subtitles: {
        subtitles: [
            { index: 1, subtitle: 'this is subtile 1' },
            { index: 2, subtitle: 'this is subtile 2' },
            { index: 3, subtitle: 'this is subtile 3' },
            { index: 4, subtitle: 'this is subtile 4' },
            { index: 5, subtitle: 'this is subtile 5' },
            { index: 6, subtitle: 'this is subtile 6' },
            { index: 7, subtitle: 'this is subtile 7' },
            { index: 8, subtitle: 'this is subtile 8' },
            { index: 9, subtitle: 'this is subtile 9' },
            { index: 10, subtitle: 'this is subtile 10' },
        ],
    },
    tabId: { tabId: 111 },
    sectionTitle: { title: 'this is section title' },
};
const dummyData2: iDummyData = {
    status: {
        scripts: {
            popup: 'working',
            contentScript: 'notWorking',
            controller: 'working',
            option: 'notWorking',
        },
        pageStatus: {
            isTranscriptOn: true,
            isEnglish: true,
            isWindowTooSmall: false,
        },
        progress: {
            capturing: false,
            captured: true,
            stored: true,
            restructured: false,
        },
    },
    subtitles: {
        subtitles: [
            { index: 1, subtitle: 'this is awesome subtile 1' },
            { index: 2, subtitle: 'this is subtile 2' },
            { index: 3, subtitle: 'this is awesome subtile 3' },
            { index: 4, subtitle: 'this is subtile 4' },
            { index: 5, subtitle: 'this is awesome subtile 5' },
            { index: 6, subtitle: 'this is subtile 6' },
            { index: 7, subtitle: 'this is awesome subtile 7' },
            { index: 8, subtitle: 'this is subtile 8' },
            { index: 9, subtitle: 'this is awesome subtile 9' },
            { index: 10, subtitle: 'this is subtile 10' },
        ],
    },
    tabId: { tabId: 222 },
    sectionTitle: { title: 'this is awesome section title' },
};

const stateList: iStateList = (function () {
    console.log('stateList module invoked');
    // _list will store these properties.
    // この場合の_listのAnnotationの仕方がわからない
    // _list = {
    //     stateSectionTitle: stateSectionTitle,
    //     stateExtension: stateExtension,
    //     stateSubtitles: stateSubtitles,
    //     stateTabId: stateTabId,
    // }
    var _list = {};

    return {
        register: <TYPE>(name: string, instance: State<TYPE>): void => {
            _list[name] = instance;
        },
        unregister: (name: string): void => {
            // これでinstanceもさくじょしていることになるかしら
            delete _list[name];
        },
        // setState: async <TYPE>(name: string, data: TYPE): Promise<void> => {
        //     await _list[name].setState<TYPE>(data);
        // },
        // // Genericsは手続きが面倒かしら?
        // getState: async <TYPE>(name: string): Promise<TYPE> => {
        //     return _list[name].getState();
        // },
        //
        // 要らなくなるかも...
        clearStorage: async (name: string): Promise<void> => {
            await _list[name].clearStorage();
        },
        // nameで指定するんじゃなくて、
        // 型引数で指定できるようにしたいなぁ
        caller: <TYPE>(name: string): State<TYPE> => {
            console.log(_list[name]);
            return _list[name];
        },
    };
})();

// ---- METHODS ------------------------------------------------------

const initializeBackgroundScript = async (): Promise<void> => {
    setupStates();
    await initializeStates();
    await modifyStates();
};

// set up
const setupStates = (): void => {
    console.log('SETUP STATES');
    // state of iState
    const key__extensionState: string = 'key__local_storage_state';
    const stateExtension: State<iStatus> = new State<iStatus>(
        key__extensionState
    );

    // state of subtitle_piece[]
    const key__subtitles: string = 'key__local_storage_subtitle';
    const stateSubtitles: State<iSubtitles> = new State<iSubtitles>(
        key__subtitles
    );

    // state of tabId
    const key__tabId: string = 'key__tabId';
    const stateTabId: State<iTabId> = new State<iTabId>(key__tabId);

    // state of sectionTitle
    const key__sectionTitle: string = 'key__sectionTitle';
    const stateSectionTitle = new State<iSectionTitle>(key__sectionTitle);

    // Register instances.
    stateList.register<iStatus>(nameOfState.status, stateExtension);
    stateList.register<iSubtitles>(nameOfState.subtitles, stateSubtitles);
    stateList.register<iTabId>(nameOfState.tabId, stateTabId);
    stateList.register<iSectionTitle>(
        nameOfState.sectionTitle,
        stateSectionTitle
    );
};

const initializeStates = async (): Promise<void> => {
    console.log('INITIALIZE STATES');
    const refStatus: State<iStatus> = stateList.caller<iStatus>(
        nameOfState.status
    );
    const refSubtitles: State<iSubtitles> = stateList.caller<iSubtitles>(
        nameOfState.subtitles
    );
    const refSectionTitle: State<iSectionTitle> =
        stateList.caller<iSectionTitle>(nameOfState.sectionTitle);
    const refTabId: State<iTabId> = stateList.caller<iTabId>(nameOfState.tabId);

    // MAKE SURE:
    //
    // Instances are stored into stateList._list[] correctly?
    //
    // CORRECT!

    console.log('---- Instances stored stateList ---------------');
    console.log('refStatus');
    console.log(refStatus);
    console.log('refSubtitles');
    console.log(refSubtitles);
    console.log('refSectionTitle');
    console.log(refSectionTitle);
    console.log('refTabId');
    console.log(refTabId);
    console.log('---------------------------------------------------');

    try {
        await refStatus.setState(dummyData.status);
        await refSubtitles.setState(dummyData.subtitles);
        await refTabId.setState(dummyData.tabId);
        await refSectionTitle.setState(dummyData.sectionTitle);

        // MAKE SURE:
        //
        // Initialized variables are saved correctly?
        //
        // CORRECT!

        console.log("--- modified state --------------------")
        console.log('refStatus');
        console.log(await refStatus.getState());
        console.log('refSubtitles');
        console.log(await refSubtitles.getState());
        console.log('refSectionTitle');
        console.log(await refSectionTitle.getState());
        console.log('refTabId');
        console.log(await refTabId.getState());
        console.log('---------------------------------------------------');
    } catch (err) {
        console.error(err.message);
    }
};

const modifyStates = async (): Promise<void> => {
    // Modify each stored data.
    await stateList
        .caller<iStatus>(nameOfState.status)
        .setState(dummyData2.status);
    await stateList
        .caller<iSubtitles>(nameOfState.subtitles)
        .setState(dummyData2.subtitles);
    await stateList
        .caller<iTabId>(nameOfState.tabId)
        .setState(dummyData2.tabId);
    await stateList
        .caller<iSectionTitle>(nameOfState.sectionTitle)
        .setState(dummyData2.sectionTitle);

    // MAKESURE
    //
    // Is this way to invoke instances are correct ?
    //
    // CORRECT!
    const dataFromStatus = await stateList
        .caller<iStatus>(nameOfState.status)
        .getState();
    const dataFromSubtitles = await stateList
        .caller<iSubtitles>(nameOfState.subtitles)
        .getState();
    const dataFromTabId = await stateList
        .caller<iTabId>(nameOfState.tabId)
        .getState();
    const dataFromSectionTitle = await stateList
        .caller<iSectionTitle>(nameOfState.sectionTitle)
        .getState();

    console.log('---Data from each getState() ---');
    console.log('Status');
    console.log(dataFromStatus);
    console.log('Subtitles');
    console.log(dataFromSubtitles);
    console.log('SectionTitle');
    console.log(dataFromSectionTitle);
    console.log('TabId');
    console.log(dataFromTabId);
    console.log('-------------------------------------');
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
