/*****************************************************
 * Sidebar ExTranscript View
 *
 * Features:
 * - Generate ExTranscript on sidebar transcript position
 * - Using template to set event listers to template DOMs before rendering them.
 * - To insert generated template content, using parent.prepend()
 * - updateContentTop and updateContentHeight to fix position and height appropriately,
 *
 * ***************************************************/
import * as selectors from '../utils/selectors';
import { subtitle_piece } from '../utils/constants';
import './exTranscript.scss';

const SidebarTranscriptView = function () {
    this.insertPosition = 'afterbegin';
    this.insertParentSelector = selectors.EX.sidebarParent;
    this.transcriptSelectors = [selectors.EX.sidebarWrapper];
};

/***
 * Generate Close button svg
 *
 * */
SidebarTranscriptView.prototype.generateSVG = function (): string {
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

SidebarTranscriptView.prototype.generateMarkup = function (
    subtitles?: string
): string {
    const s: string = subtitles ? subtitles : '';
    const closeButton: string = this.generateSVG();
    return `
          <div class="${selectors.EX.sidebarWrapper.slice(1)}">
              <section class="${selectors.EX.sidebarSection.slice(1)}">
                  <div class="${selectors.EX.sidebarHeader.slice(1)}">
                      <h2 class="heading-secondary">ExTranscript</h2>
                      <button type="button" class="${selectors.EX.closeButton.slice(
                          1
                      )}">${closeButton}</button>
                  </div>
                  <div class="${selectors.EX.sidebarContent.slice(1)}">
                    <div class="${selectors.EX.sidebarContentPanel.slice(1)}">
                      ${s}
                    </div>
                  </div>
              </section>
          </div>
      `;
};

SidebarTranscriptView.prototype.generateSubtitleMarkup = function (
    subtitles: subtitle_piece[]
): string {
    var mu: string = '';
    for (const s of subtitles) {
        const _mu: string = `
        <div class="${selectors.EX.sidebarCueContainer.slice(1)}" data-id="${
            s.index
        }">
          <p class="${selectors.EX.sidebarCue.slice(1)}">
            <span data-purpose="${selectors.EX.sidebarCueSpan}">${
            s.subtitle
        }</span>
          </p>
        </div>
      `;
        mu = mu.concat(_mu);
    }
    return mu;
};

SidebarTranscriptView.prototype.render = function (
    subtitles?: subtitle_piece[]
): void {
    const template = document.createElement('template');

    if (subtitles.length > 0 && subtitles !== undefined) {
        const s: string = this.generateSubtitleMarkup(subtitles);
        template.innerHTML = this.generateMarkup(s);
    } else {
        template.innerHTML = this.generateMarkup();
    }
    const parent = document.querySelector(this.insertParentSelector);
    if (parent) {
        // template.content registered as parent first child.
        parent.prepend(template.content);
    }
};

SidebarTranscriptView.prototype.clear = function (): void {
    this.transcriptSelectors.forEach((s: string) => {
        const e: Element = document.querySelector(s);
        if (e) e.remove();
    });
};

SidebarTranscriptView.prototype.updateContentTop = function (
    top: number
): void {
    const wrapper = document.querySelector<HTMLElement>(
        selectors.EX.sidebarWrapper
    );
    wrapper.style.top = top + 'px';
};

/**
 * Update ExTranscript content height.
 *
 * Height calculation considers about...
 * - Gap of top edge of ExTranscript between top edge of viewport.
 *  Until nav header is shown.
 * - ExTranscript header height.
 * - Transcript footer height.
 * @param {number} footerHeight - Length of transcript footer height.
 * */
SidebarTranscriptView.prototype.updateContentHeight = function (
    footerHeight: number
): void {
    const content = document.querySelector<HTMLElement>(
        selectors.EX.sidebarContent
    );
    const header: Element = document.querySelector<Element>(
        selectors.EX.sidebarHeader
    );
    const height: number =
        document.documentElement.clientHeight -
        footerHeight -
        parseInt(window.getComputedStyle(header).height.replace('px', ''));

    const navHeaderHeight: number = parseInt(
        window
            .getComputedStyle(
                document.querySelector<HTMLElement>(selectors.header)
            )
            .height.replace('px', '')
    );
    // Gap between upperside of transcript and upperside of viewport.
    const gap: number =
        window.scrollY < navHeaderHeight ? navHeaderHeight - window.scrollY : 0;

    content.style.height = height - gap + 'px';
};

// SidebarTranscriptView.prototype.renderSpinner = function () {};
// SidebarTranscriptView.prototype.renderError = function () {};
// SidebarTranscriptView.prototype.renderMessage = function () {};

export default new SidebarTranscriptView();
