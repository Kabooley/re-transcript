/*****************************************************
 * Bottom ExTranscript View
 *
 * Features:
 * - Generate ExTranscript on dashboard transcript position
 * - Using template to set event listers to template DOMs before rendering them.
 * - To insert generated template content, using parent.prepend()
 * - To replace generated HTML, add position style parent element.
 * - Everytime clear, delete added style on parent.
 *
 * ***************************************************/
import * as selectors from '../utils/selectors';
import { subtitle_piece } from '../utils/constants';
import './exTranscript.scss';

const BottomTranscriptView = function () {
    this.insertPosition = 'afterbegin';
    this.insertParentSelector = selectors.EX.noSidebarParent;
    this.transcriptSelectors = [selectors.EX.dashboardTranscriptWrapper];
};

/***
 * Close button svg generator
 *
 * */
BottomTranscriptView.prototype.generateCloseButton = function (): string {
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
                <span data-purpose="${selectors.EX.dashboardTranscriptCueText}">
                    ${s.subtitle}
                </span>
            </p>
        </div>
    `;
        mu = mu.concat(_mu);
    }
    return mu;
};

BottomTranscriptView.prototype.generateMarkup = function (
    subtitleStrings?: string
) {
    const closeButton: string = this.generateCloseButton();
    return `
    <div class="${selectors.EX.dashboardTranscriptWrapper.slice(1)}">
        <div class="${selectors.EX.dashboardTranscriptHeader.slice(1)}">
            <h2 class="heading-secondary">ExTranscript</h2>
            <button type="button" class="${selectors.EX.closeButton.slice(
                1
            )}">${closeButton}</button>
        </div>
        <div class="${selectors.EX.dashboardTranscriptPanel.slice(1)}">
            ${subtitleStrings === undefined ? '' : subtitleStrings}
        </div>
    </div>
    `;
};

BottomTranscriptView.prototype.render = function (
    subtitles?: subtitle_piece[]
): void {
    const template = document.createElement('template');
    if (subtitles.length > 0 && subtitles !== undefined) {
        template.innerHTML = this.generateMarkup(
            this.generateSubtitleMarkup(subtitles)
        );
    } else {
        template.innerHTML = this.generateMarkup();
    }
    const parent = document.querySelector<Element>(this.insertParentSelector);
    if (parent) {
        // NOTE: Parent element must have new position property to replace ExTranscript appropriately.
        // To add style, querySelector must specified as HTMLElement.
        document.querySelector<HTMLElement>(
            this.insertParentSelector
        ).style.position = 'relative';
        parent.prepend(template.content);
    }
};

BottomTranscriptView.prototype.clear = function (): void {
    this.transcriptSelectors.forEach((s: string) => {
        const e: Element = document.querySelector(s);
        if (e) e.remove();
    });
    // NOTE: Remove `position: relative` from parent element.
    const parent: HTMLElement = document.querySelector<HTMLElement>(
        this.insertParentSelector
    );
    parent.style.position = '';
};

// BottomTranscriptView.prototype.renderSpinner = function (): void {};
// BottomTranscriptView.prototype.renderError = function (): void {};
// BottomTranscriptView.prototype.renderMessage = function (): void {};

export default new BottomTranscriptView();
