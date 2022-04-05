/***************************************************
 * SELECTORS
 * ________________________________________________
 *
 *
 *
 *
 * **************************************************/

// --- Selectors related to Transcript ---------------------------

// Udemy講義ページが動画ページならこのセレクタが一致する
// テキストページとかなら一致しない
export const videoContainer = "div.video-viewer--container--23VX7";

export const transcript = {
  // HTMLSpanElement which is Highlight as current subtitle on movie.
  highlight: "span.transcript--highlight-cue--1bEgq",
  // NodeListOf<HTMLSpanElement> which are list of subtitle element.
  transcripts:
    "div.transcript--cue-container--wu3UY p.transcript--underline-cue--3osdw span",
  // top element of side bar
  noSidebar: "div.app--no-sidebar--1naXE",
  sidebar: "div.has-sidebar",

  // High level element of Movie element
  movieContainer: "div.app--curriculum-item--2GBGE",
  // Movie Replay button
  replayButton: "button[data-purpose='video-play-button-initial']",

  // Controlbar
  controlbar:
    "div.control-bar--control-bar--MweER[data-purpose='video-controls']",
  //
} as const;

// --- Selectors related to control bar. -------------------------

export const controlBar = {
  // "closed captioning"
  cc: {
    // 字幕メニューpopupボタン
    popupButton: "button[data-purpose='captions-dropdown-button']",
    // textContentで取得できる言語を取得可能
    //   languageList:
    //     "button.udlite-btn.udlite-btn-large.udlite-btn-ghost.udlite-text-sm.udlite-block-list-item.udlite-block-list-item-small.udlite-block-list-item-neutral > div.udlite-block-list-item-content",
    //
    // 言語リストを取得するには一旦languageButtonsを取得してからそれからquerySelectorする
    // いらないかも
    menuCheckButtons: "button",
    menuList: ".udlite-block-list-item-content",
    menuListParent: "ul[role='menu'][data-purpose='captions-dropdown-menu']",
    // 上記のセレクタのラッパーボタン。
    // 属性`aria-checked`で選択されているかどうかわかる
    checkButtons:
      "button.udlite-btn.udlite-btn-large.udlite-btn-ghost.udlite-text-sm.udlite-block-list-item.udlite-block-list-item-small.udlite-block-list-item-neutral",
  },
  transcript: {
    toggleButton: "button[data-purpose='transcript-toggle']",
  },
  theatre: {
    theatreToggle: "button[data-purpose='theatre-mode-toggle-button']",
  },
} as const;

// --- Selectors related ex-transcript -----------------------

export const EX = {
  // Udemy page-specific selector

  sidebarParent: ".app--content-column--HC_i1",
  noSidebarParent: ".app--dashboard-content--r2Ce9",
  movieContainer: ".app--body-container",

  // 独自selector `ex--`を接頭辞とする

  // sidebar ex-transcript selectors
  sidebarWrapper: ".ex--sidebar-column",
  sidebarSection: ".ex--sidebar--sidebar",
  sidebarHeader: ".ex--sidebar--sidebar-header",
  sidebarContent: ".ex--sidebar--content",
  sidebarContentPanel: ".ex--sidebar-content-panel",
  sidebarCueContainer: ".ex--sidebar-transcript--cue-container",
  sidebarFooter: ".ex--sidebar-transcript--autoscroll-wrapper",
  // sidebar width in case more than SIDEBAR_WIDTH_BOUNDARY
  wideView: ".ex--sidebar--wideview",
  // sidebar width in case less than SIDEBAR_WIDTH_BOUNDARY
  middleView: ".ex--sidebar--middleview",

  // bottom ex-transcript selectors
  dashboardTranscriptWrapper: ".ex--dashboard-transcript-wrapper",
  dashboardTranscriptHeader: ".ex--dashboard-transcript--header",
  dashboardTranscriptPanel: ".ex--dashboard-transcript--transcript-panel",
  dashboardTranscriptCueContainer: ".ex--dashboard-transcript--cue-container",
  dashboardTranscriptCue: ".ex--dashboard-transcript--cue--underline",
  dashboardTranscriptCueText: "span[data-purpose='ex--dashboard-cue-text']",
  dashboardTranscriptBottom: ".ex--dashboard-transcript--autoscroll-wrapper",

  // To Highlight Transcriot Cue Container
  highlight: ".--highlight--",
} as const;

// --- LEGACY -------------------------

// sectionTitle: 'div.udlite-text-md.video-viewer--title-overlay--OoQ6e',
