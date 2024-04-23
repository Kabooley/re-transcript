/***************************************************
 * SELECTORS
 *
 * Including:
 * - Ud*my elements selectors.
 * - re-transcript generated elements selectors.
 *
 * **************************************************/

// --- Selectors related to Transcript ---------------------------

// Ud*my講義ページが動画ページならこのセレクタが一致する
// updated: 2024/4/23
export const videoContainer: string = 'video-viewer--container--3yIje';
// export const videoContainer: string = 'div.video-viewer--container--23VX7';

// Ud*my講義ページがテキストページならこのセレクタが一致する
export const textContainer = 'text-viewer--container--TFOCA';

// new added. Ud*myページのヘッダ
// updated: 2024/4/23
export const header: string = 'header.header--header--g2QGk';
// export const header: string = '.header--header--3k4a7';

export const transcript = {
    // HTMLSpanElement which is Highlight as current subtitle on movie.
    highlight: 'span.transcript--highlight-cue--ugVsE',

    // NodeListOf<HTMLSpanElement> which are list of subtitle element.
    transcripts:
        'div.transcript--cue-container--Vuwj6 p.transcript--underline-cue---xybZ span',

    // top element of side bar
    noSidebar: 'div.app--no-sidebar--oqmAw',
    // updated: 2024/4/23  noSidebar: 'div.app--no-sidebar--1naXE',

    sidebar: 'div.has-sidebar',

    // Controlbar
    controlbar:
        'div.shaka-control-bar--control-bar--gXZ1u[data-purpose="video-controls"]',
    // updated: 2024/4/23  controlbar: "div.control-bar--control-bar--MweER[data-purpose='video-controls']",

    // Footer of Transcript when it is sidebar.
    footerOfSidebar: 'div.transcript--autoscroll-wrapper--3ac1w',
    // updated: 2024/4/23  footerOfSidebar: '.transcript--autoscroll-wrapper--oS-dz',

    // new added. 自動スクロールチェックボックス
    // AutoScroll Checkbox
    autoscroll: "[name='autoscroll-checkbox']",

    // 使っていないかも...
    // High level element of Movie element
    movieContainer: 'div.app--curriculum-item--2GBGE',

    // 使っていないかも...
    // Movie Replay button
    replayButton: "button[data-purpose='video-play-button-initial']",
} as const;

// --- Selectors related to control bar. -------------------------

export const controlBar = {
    // "closed captioning"
    cc: {
        // 字幕 ボタン要素
        popupButton: "button[data-purpose='captions-dropdown-button']",
        // textContentで取得できる言語を取得可能
        //   languageList:
        //     "button.udlite-btn.udlite-btn-large.udlite-btn-ghost.udlite-text-sm.udlite-block-list-item.udlite-block-list-item-small.udlite-block-list-item-neutral > div.udlite-block-list-item-content",
        //
        // 言語リストを取得するには一旦languageButtonsを取得してからそれからquerySelectorする
        // いらないかも
        menuCheckButtons: 'button',
        menuList: '.ud-block-list-item-content',
        menuListParent:
            "ul[role='menu'][data-purpose='captions-dropdown-menu']",
        // 上記のセレクタのラッパーボタン。
        // querySelectorAll()でCCメニューのリスト要素をすべて取得したのち
        // 取得したNodeListのうち属性`aria-checked`がtrueになっていれば選択されている
        checkButtons:
            'button.ud-btn.ud-btn-large.ud-btn-ghost.ud-text-sm.ud-block-list-item.ud-block-list-item-small.ud-block-list-item-neutral',
        // checkButtons:
        //     'button.udlite-btn.udlite-btn-large.udlite-btn-ghost.udlite-text-sm.udlite-block-list-item.udlite-block-list-item-small.udlite-block-list-item-neutral',
    },
    transcript: {
        // トランスクリプション　ボタン要素
        toggleButton: "button[data-purpose='transcript-toggle']",
    },
    theatre: {
        // 展開表示　ボタン要素　windowサイズが一定以上大きくないと表示されない
        theatreToggle: "button[data-purpose='theatre-mode-toggle-button']",
    },
} as const;

// --- Selectors related ex-transcript -----------------------

export const EX = {
    // Ud*my page-specific selector

    sidebarParent: 'div.app--sidebar-column--gfbWJ',
    // updated: 2024/4/23  sidebarParent: '.app--content-column--HC_i1',
    noSidebarParent: 'div.app--dashboard-content--FEzxy',
    // updated: 2024/4/23  noSidebarParent: '.app--dashboard-content--r2Ce9',

    // 使われていないかも...
    movieContainer: '.app--body-container',

    // 独自selector `ex--`を接頭辞とする

    // sidebar ex-transcript selectors
    sidebarWrapper: '.ex-sidebar__column',
    sidebarSection: '.ex-sidebar__sidebar',
    sidebarHeader: '.ex-sidebar__header',
    sidebarContent: '.ex-sidebar__content',
    sidebarContentPanel: '.ex-transcript__panel',
    sidebarCueContainer: '.ex-transcript__cue-container',
    // recently added. '.ex-transcript__cue-container'の子要素のparagraphのclass名
    sidebarCue: '.ex-transcript__cue',
    // recently added. .ex-transcript__cue'の子要素のspan要素のdata-purposeの指定値
    sidebarCueSpan: 'ex-transcript__cue--text',
    sidebarFooter: '.ex-sidebar__footer',
    // sidebar width in case more than SIDEBAR_WIDTH_BOUNDARY
    wideView: '.ex--sidebar--wideview',
    // sidebar width in case less than SIDEBAR_WIDTH_BOUNDARY
    middleView: '.ex--sidebar--middleview',

    // bottom ex-transcript selectors
    dashboardTranscriptWrapper: '.ex-dashboard-transcript__wrapper',
    dashboardTranscriptHeader: '.ex-dashboard-transcript__header',
    dashboardTranscriptPanel: '.ex-dashboard-transcript__transcript--panel',
    dashboardTranscriptCueContainer:
        '.ex-dashboard-transcript__transcript--cue-container',
    dashboardTranscriptCue: '.ex-dashboard-transcript__transcript--cue',
    // data-purpose
    dashboardTranscriptCueText: 'ex--dashboard-cue-text',
    dashboardTranscriptBottom: '.ex-dashboard-transcript__footer',

    // To Highlight Transcriot Cue Container
    highlight: '.--highlight',
    closeButton: '.btn__close',
} as const;
