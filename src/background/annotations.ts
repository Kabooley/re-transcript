/******************************************************
 * Annotations for background.ts
 *
 * Definition of annotation for background.ts.
 * Like header files for C.
 *
 * *****************************************************/
import { subtitle_piece } from '../utils/constants';

// interface for state saves progress
export interface iProgress {
    isContentScriptInjected: boolean;
    isCaptureSubtitleInjected: boolean;
    isControllerInjected: boolean;
    isSubtitleCapturing: boolean;
    isSubtitleCaptured: boolean;
    isExTranscriptStructured: boolean;
}

// base object for State<iProgress>
export const progressBase: iProgress = {
    isContentScriptInjected: false,
    isCaptureSubtitleInjected: false,
    isControllerInjected: false,
    isSubtitleCapturing: false,
    isSubtitleCaptured: false,
    isExTranscriptStructured: false,
} as const;

export interface iPageStatus {
    isTranscriptDisplaying: boolean;
    isEnglish: boolean;
    // isWindowTooSmall: boolean;
}
// chrome browser Tab id that extension deployed
export interface iTabId {
    tabId: number;
}

export interface iTabInfo {
    tabInfo: chrome.tabs.Tab;
}

// web page URL that extension deployed
export interface iContentUrl {
    url: string;
}

// Surgery subtitle data that going to be used by ExTranscript
export interface iSubtitle {
    subtitles: subtitle_piece[];
}

// Model for background.ts.
export interface iModel
    extends iProgress,
        iPageStatus,
        iContentUrl,
        iTabId,
        iTabInfo,
        iSubtitle {}

// state interface for state module used in background.ts.
export interface iStateModule<TYPE extends object> {
    set: (prop: {
        [Property in keyof TYPE]?: TYPE[Property];
    }) => Promise<void>;
    get: () => Promise<TYPE>;
    clearAll: () => Promise<void>;
}

// Base object that satisfies iModel.
export const modelBase: iModel = {
    // contentScript.js has been injected or not.
    isContentScriptInjected: false,
    // captureSubtitles.js has been injected or not.
    isCaptureSubtitleInjected: false,
    // controller.js has been injected or not.
    isControllerInjected: false,
    // Subtitles data is capturing now or not.
    isSubtitleCapturing: false,
    // It is done capturing subtitles data or not.
    isSubtitleCaptured: false,
    // ExTranscript is structured or not.
    isExTranscriptStructured: false,
    // There is Udemy Transcript shown or not.
    // Not means turining on or not.
    // If not shown, ExTranscript also not to be either.
    isTranscriptDisplaying: false,
    // Udemy subtitle language is English or not.
    isEnglish: false,
    // Tab id that this extension is now running.
    tabId: null,
    // URL that this extension is now running.
    url: null,
    // Captured subtitles data.
    subtitles: null,
    // Tab info that this extension is now running.
    tabInfo: null,
} as const;
