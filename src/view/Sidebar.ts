import { ExTranscriptView } from "./View";
import { subtitle_piece } from "../utils/constants";

export class Sidebar extends ExTranscriptView {
  templates(subtitle?: subtitle_piece[]): string {
    return this.generateMarkup(subtitle);
  }

  eventsMap(): { [key: string]: () => void } {
    const m = {};
    m[`click:${this.selectors.closeButton}`] = this.handlerOfCloseButton;
    return m;
  }

  handlerOfCloseButton(): void {
    console.log("handlerOfCloseButton");
    // TODO: Fix this.
    //   controllerからひっぱってきてもいいけど、内容からみてメソッドにしちゃってもいいかも
    // closeButtonHandler();
  }

  generateSubtitleMarkup(subtitles: subtitle_piece[]): string {
    let mu: string = "";
    for (const s of subtitles) {
      const _mu: string = `
              <div class="${this.selectors.sidebarCueContainer.slice(1)}" data-id="${s.index}">
                  <p class="${this.selectors.sidebarCue.slice(1)}">
                    <span data-purpose="${this.selectors.sidebarCueSpan}">
                        ${s.subtitle}
                    </span>
                  </p>
              </div>
              `;
          mu = mu.concat(_mu);
        }
    return mu;
  }

  generateCloseButton(): string {
    return `
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_2_8)">
        <line x1="-0.707107" y1="38.2929" x2="35.2929" y2="2.29289" stroke="black" stroke-width="2"/>
        <line x1="-1.29289" y1="-0.707107" x2="34.7071" y2="35.2929" stroke="black" stroke-width="2"/>
        </g>
        <defs>
        <clipPath id="clip0_2_8">
        <rect width="36" height="36" rx="8" fill="white"/>
        </clipPath>
        </defs>
        </svg>
    `;
  }

  generateMarkup(subtitles?: subtitle_piece[]): string {
    const s: string =
      subtitles.length > 0 && subtitles !== undefined
        ? this.generateSubtitleMarkup(subtitles)
        : "";

    const closeButton: string = this.generateCloseButton();

    return `
        <div class="${this.selectors.sidebarWrapper.slice(1)}">
            <section class="${this.selectors.sidebarSection.slice(1)}">
                <div class="${this.selectors.sidebarHeader.slice(1)}">
                    <h2 class="heading-secondary">ExTranscript</h2>
                    <button type="button" class="${this.selectors.closeButton.slice(
                    1
                    )}">${closeButton}</button>
                </div>
                <div class="${this.selectors.sidebarContent.slice(1)}">
                <div class="${this.selectors.sidebarContentPanel.slice(
                1
                )}">
                    ${s}
                </div>
                </div>
            </section>
        </div>
    `;
  }
}

// --- USAGE ---------
// const sidebar: Sidebar = new Sidebar(
//   selectors.EX,
//   selectors.EX.sidebarParent,
//   selectors.EX.sidebarWrapper,
//   "awesome_templateId"
// );

// sidebar.render(subtitles);
// sidebar.clear();
