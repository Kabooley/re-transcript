import * as selectors from '../utils/selectors';
import { subtitle_piece } from '../utils/constants';
import './bottomTranscriptView.css';

const BottomTranscriptView = function () {
    // insert position for Element.insertAdjaccentHTML()
    this.insertPosition = 'afterbegin';
    this.insertParentSelector = selectors.EX.noSidebarParent;
    this.transcriptSelectors = [
        selectors.EX.dashboardTranscriptWrapper,
        selectors.EX.dashboardTranscriptHeader,
        selectors.EX.dashboardTranscriptPanel,
        selectors.EX.dashboardTranscriptBottom,
    ];
};

/*
.ex--dashboard-transcript--cue-container
.ex--dashboard-transcript--cue--underline
span[data-purpose="ex--dashboard-cue-text"]

*/
BottomTranscriptView.prototype.generateSubtitleMarkup = function (
    subtitles: subtitle_piece[]
): string {
    var mu: string = '';
    for (const s of subtitles) {
        const _mu: string = `
        <div class="${selectors.EX.dashboardTranscriptCueContainer.slice(
            1
        )}" data-id="${s.index}">
            <p data-purpose="ex-transcript-cue" class="${selectors.EX.dashboardTranscriptCue.slice(
                1
            )}">
                <span data-purpose="ex--dashboard-cue-text">
                    ${s.subtitle}
                </span>
            </p>
        </div>
    `;
        // concatでいいのかな...
        mu = mu.concat(_mu);
    }
    return mu;
};

BottomTranscriptView.prototype.generateMarkup = function (
    subtitleStrings?: string
) {
    return `
    <div class="${selectors.EX.dashboardTranscriptWrapper.slice(1)}">
        <div class="${selectors.EX.dashboardTranscriptHeader.slice(
            1
        )}">ExTranscript</div>
        <div class="${selectors.EX.dashboardTranscriptPanel.slice(1)}">
            ${subtitleStrings === undefined ? '' : subtitleStrings}
        </div>
        <div class="${selectors.EX.dashboardTranscriptBottom.slice(
            1
        )}">Auto Scroll</div>
    </div>
    `;
};

// BottomTranscriptView.prototype.render = function (): void {
//   console.log("[BottomTranscriptView]render");

//   //   親要素を`position: relative`にする
//   const e: HTMLElement = document.querySelector<HTMLElement>(
//     this.insertParentSelector
//   );
//   e.style.position = "relative";
//   const p: InsertPosition = this.insertPosition;
//   const html: string = this.generateMarkup();
//   e.insertAdjacentHTML(p, html);
// };

BottomTranscriptView.prototype.render = function (
    subtitles?: subtitle_piece[]
): void {
    //   親要素を`position: relative`にする
    const e: HTMLElement = document.querySelector<HTMLElement>(
        this.insertParentSelector
    );
    e.style.position = 'relative';
    const p: InsertPosition = this.insertPosition;
    var html: string = '';
    if (subtitles.length > 0) {
        const s: string = this.generateSubtitleMarkup(subtitles);
        html = this.generateMarkup(s);
    } else {
        html = this.generateMarkup();
    }
    e.insertAdjacentHTML(p, html);
};

// Udemyページのコンテンツを間違っても消してしまわないように
BottomTranscriptView.prototype.clear = function (): void {
    this.transcriptSelectors.forEach((s: string) => {
        const e: Element = document.querySelector(s);
        if (e) e.remove();
    });
    //   親要素につけていた`position: relative`を解除する
    const parent: HTMLElement = document.querySelector<HTMLElement>(
        this.insertParentSelector
    );
    parent.style.position = '';
};

BottomTranscriptView.prototype.renderSpinner = function (): void {
    console.log('[BottomTranscriptView] render spinner');
};

BottomTranscriptView.prototype.renderError = function (): void {
    console.log('[BottomTranscriptView] render error');
};

BottomTranscriptView.prototype.renderMessage = function (): void {
    console.log('[BottomTranscriptView] render message');
};

export default new BottomTranscriptView();

/*
 */
