/*********************************************************
 * TEST: State class usage
 * _______________________________________________________
 *
 * MAKE SURE
 * - instances are correctly generated and stored
 *  into stateList._list.
 * - stateList.caller() correctly returns instance
 *  that specified by the name parameter.
 *
 *
 *
 *
 **********************************************************/
import { State } from '../src/utils/State';
import { deepCopier } from '../src/utils/helpers';
import {
    extensionsTypes,
    extensionNames,
    iMessage,
    subtitle_piece,
    port_names,
    messagePassingStatus,
    orderNames,
} from '../src/utils/constants';

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

interface messageTemplate {
    message: iMessage;
    sender: chrome.runtime.MessageSender;
    sendResponse: (response?: any) => void;
}

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

const stateList: iStateList = (function () {
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
            return _list[name];
        },
    };
})();

// set up
const setupStates = (): void => {
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

    try {
        await refStatus.setState(dummyData.status);
        await refSubtitles.setState(dummyData.subtitles);
        await refTabId.setState(dummyData.tabId);
        await refSectionTitle.setState(dummyData.sectionTitle);

        // MAKE SURE:
        //
        // Initialized variables are saved correctly?
    } catch (err) {
        console.error(err.message);
    }
};

(function () {
    setTimeout(function () {
        setupStates();
        initializeStates();
    }, 5000);
})();
