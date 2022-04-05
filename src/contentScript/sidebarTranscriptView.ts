import * as selectors from "../utils/selectors";
import { SIGNAL } from "../utils/constants";
import { subtitle_piece } from "../utils/constants";
import "./sidebarTranscriptView.css";

const SidebarTranscriptView = function () {
  // insert position for Element.insertAdjaccentHTML()
  this.insertPosition = "afterbegin";
  this.insertParentSelector = selectors.EX.sidebarParent;
  this.transcriptSelectors = [selectors.EX.sidebarWrapper];
};

SidebarTranscriptView.prototype.generateMarkup = function (
  subtitles?: string
): string {
  const s: string = subtitles ? subtitles : "";
  return `
          <div class="${selectors.EX.sidebarWrapper.slice(1)}">
              <section class="${selectors.EX.sidebarSection.slice(1)}">
                  <div class="${selectors.EX.sidebarHeader.slice(
                    1
                  )}">ExTranscript</div>
                  <div class="${selectors.EX.sidebarContent.slice(1)}">
                    <div class="${selectors.EX.sidebarContentPanel.slice(1)}">
                      ${s}
                    </div>
                  </div>
                  <div class="${selectors.EX.sidebarFooter.slice(
                    1
                  )}">Auto Scroll</div>
              </section>
          </div>
      `;
};

SidebarTranscriptView.prototype.generateSubtitleMarkup = function (
  subtitles: subtitle_piece[]
): string {
  var mu: string = "";
  for (const s of subtitles) {
    const _mu: string = `
        <div class="${selectors.EX.sidebarCueContainer.slice(1)}" data-id="${
      s.index
    }">
          <p class="nothingYet">
            <span data-purpose="nothingYet">${s.subtitle}</span>
          </p>
        </div>
      `;
    // concatでいいのかな...
    mu = mu.concat(_mu);
  }
  return mu;
};

// render
//
// 変更点
// - 引数 subtitle を追加
// - subtitles の中身の有無でgenerateMarkupの呼出を条件分岐させる
//
// これでsubtitleがあってもなくても両方の場合に対応できる
SidebarTranscriptView.prototype.render = function (
  subtitles?: subtitle_piece[]
): void {
  const e: Element = document.querySelector(this.insertParentSelector);
  const p: InsertPosition = this.insertPosition;
  var html: string = "";
  if (subtitles.length > 0) {
    const s: string = this.generateSubtitleMarkup(subtitles);
    html = this.generateMarkup(s);
  } else {
    html = this.generateMarkup();
  }
  e.insertAdjacentHTML(p, html);
};

SidebarTranscriptView.prototype.clear = function (): void {
  this.transcriptSelectors.forEach((s: string) => {
    const e: Element = document.querySelector(s);
    if (e) e.remove();
  });
};

//
SidebarTranscriptView.prototype.updateContentTop = function (
  top: number
): void {
  const wrapper = document.querySelector<HTMLElement>(
    selectors.EX.sidebarWrapper
  );
  wrapper.style.top = top + "px";
};

SidebarTranscriptView.prototype.updateContentHeight = function (): void {
  const content = document.querySelector<HTMLElement>(
    selectors.EX.sidebarContent
  );
  const footer: Element = document.querySelector<Element>(
    selectors.EX.sidebarFooter
  );
  const header: Element = document.querySelector<Element>(
    selectors.EX.sidebarHeader
  );
  const height =
    document.documentElement.clientHeight -
    parseInt(window.getComputedStyle(footer).height.replace("px", "")) -
    parseInt(window.getComputedStyle(header).height.replace("px", ""));

  content.style.height = height + "px";
};

SidebarTranscriptView.prototype.updateWidth = function (signal: boolean): void {
  console.log("[SidebarTranscriptView] updateWidth");
  const wrapper: HTMLElement = document.querySelector<HTMLElement>(
    selectors.EX.sidebarWrapper
  );
  // toggle class
  // 以下の処理より
  // cssの重ね掛けのときにあとづけのselectorのほうが優先されるという特性があるなら
  // もっとシンプルになるんだけれど
  if (signal === SIGNAL.widthStatus.wideview) {
    wrapper.classList.remove(selectors.EX.middleView.slice(1));
    wrapper.classList.add(selectors.EX.wideView.slice(1));
  } else {
    wrapper.classList.remove(selectors.EX.wideView.slice(1));
    wrapper.classList.add(selectors.EX.middleView.slice(1));
  }
};

SidebarTranscriptView.prototype.renderSpinner = function () {
  console.log("[SidebarTranscriptView] render spinner");
};

SidebarTranscriptView.prototype.renderError = function () {
  console.log("[SidebarTranscriptView] render error");
};

SidebarTranscriptView.prototype.renderMessage = function () {
  console.log("[SidebarTranscriptView] render message");
};

export default new SidebarTranscriptView();

// ------ LEGACY CODE ---------------------------------------

// SidebarTranscriptView.prototype.generateMarkup = function (): string {
//   return `
//         <div class="${SELECTORS.EX.sidebarWrapper.slice(1)}">
//             <section class="${SELECTORS.EX.sidebarSection.slice(1)}">
//                 <div class="${SELECTORS.EX.sidebarHeader.slice(
//                   1
//                 )}">ExTranscript</div>
//                 <div class="${SELECTORS.EX.sidebarContent.slice(1)}">
//                     <p>
//                     </p>
//                 </div>
//                 <div class="${SELECTORS.EX.sidebarFooter.slice(
//                   1
//                 )}">Auto Scroll</div>
//             </section>
//         </div>
//     `;
// };

// SidebarTranscriptView.prototype.render = function (): void {
//   console.log("[SidebarTranscriptView] render");

//   const e: Element = document.querySelector(this.insertParentSelector);
//   const p: InsertPosition = this.insertPosition;
//   const html: string = this.generateMarkup();
//   e.insertAdjacentHTML(p, html);
// };
