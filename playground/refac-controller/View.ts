/*******************************************************************
 * 最終的な目的：TranscriptViewを再利用可能なclassにする、もしくは近づける
 *
 *
 * 課題：
 * - TODO: Modelと結びつける...必要ある？の検討
 * - TODO: bottonTranscriptViewは親要素に`style.position = "relative"`を付与・解除を実施しなくてはならない
 *
 * */

import * as selectors from '../../src/utils/selectors';
import { subtitle_piece } from '../../src/utils/constants';

type iEXSelectors = {
    [Property in keyof typeof selectors.EX]: typeof selectors.EX[Property];
};

interface iSelectors extends iEXSelectors {}

const subtitles: subtitle_piece[] = [
    { index: 0, subtitle: 'this is awesome subtitle 0' },
    { index: 1, subtitle: 'this is awesome subtitle 1' },
    { index: 2, subtitle: 'this is awesome subtitle 2' },
    { index: 3, subtitle: 'this is awesome subtitle 3' },
    { index: 4, subtitle: 'this is awesome subtitle 4' },
    { index: 5, subtitle: 'this is awesome subtitle 5' },
    { index: 6, subtitle: 'this is awesome subtitle 6' },
];

const closeButtonHandler = (): void => {};

//
// Let's abstract-ify above class
//
// とはいえ、eventsMapしか抽象関数ないけど...

export abstract class ExTranscriptView_ {
    constructor(
        public selectors: iSelectors,
        // parentSelectorはselectorsに含まれるけど、汎用性のために区別する
        private _parentSelector: string,
        // 同様に。
        // ExTranscript要素のなかで一番外側の要素
        private _wrapperSelector: string,
        // Udemyに埋め込むので、念のためtemplateに識別子をつける
        private _templateId: string
    ) {}

    abstract eventsMap(): { [key: string]: () => void };
    abstract templates(subtitles?: subtitle_piece[]): string;

    // renderする場所は動的に変化するので必ずその都度DOMを取得する
    // NOTE: 現状、subtitlesがない場合前提でコードを書いているので必須引数にはできない
    render(subtitles?: subtitle_piece[]): void {
        // 毎回レンダリング前に消去する
        this.clear();

        // TODO: Bottom ExTranscriptだけに必要な措置...
        // 親要素のCSS positionプロパティを強制的に追加
        // これは外部でやっても問題ないかも...
        // parent.style.position = 'relative';

        const template = document.createElement('template');
        template.setAttribute('id', this._templateId);

        // The determination of whether or not an argument exists
        // is delegated to the calling function.
        template.innerHTML = this.templates(subtitles);

        this.bindEvents(template.content);

        // 挿入先の親要素DOM取得
        const parent = document.querySelector<Element>(this._parentSelector);
        if (parent) {
            parent.prepend(template.content);
        }
    }

    clear(): void {
        const e = document.querySelector(this._wrapperSelector);
        if (e) e.remove();
        // TODO: Bottom ExTranscriptは親要素のposition: relativeを解除しないといけない
    }

    bindEvents(fragment: DocumentFragment): void {
        const eventsMap = this.eventsMap();

        for (let eventKey in eventsMap) {
            const [eventName, selector] = eventKey.split(':');
            fragment.querySelectorAll(selector).forEach((element) => {
                element.addEventListener(eventName, eventsMap[eventKey]);
            });
        }
    }
}

// Sidebar.ts -------------------------
class Sidebar extends ExTranscriptView_ {
    templates(subtitle?: subtitle_piece[]): string {
        return this.generateMarkup(subtitle);
    }

    eventsMap(): { [key: string]: () => void } {
        const m = {};
        m[`click:${this.selectors.closeButton}`] = this.handlerOfCloseButton;
        return m;
    }

    handlerOfCloseButton(): void {
        closeButtonHandler();
    }

    generateSubtitleMarkup(subtitles: subtitle_piece[]): string {
        let mu: string = '';
        for (const s of subtitles) {
            const _mu: string = `
            <div class="${this.selectors.sidebarCueContainer.slice(
                1
            )}" data-id="${s.index}">
                <p class="${this.selectors.sidebarCue.slice(1)}">
                <span data-purpose="${this.selectors.sidebarCueSpan}">${
                s.subtitle
            }</span>
                </p>
            </div>
            `;
            // concatでいいのかな...
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
                : '';

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
                    <div class="${this.selectors.sidebarContentPanel.slice(1)}">
                        ${s}
                    </div>
                    </div>
                </section>
            </div>
        `;
    }
}

// --- USAGE ---------
const sidebar: Sidebar = new Sidebar(
    selectors.EX,
    selectors.EX.sidebarParent,
    selectors.EX.sidebarWrapper,
    'awesome_templateId'
);

sidebar.render(subtitles);
sidebar.clear();

// Bottom.ts ----------------------------
class Bottom extends ExTranscriptView_ {
    templates(subtitle?: subtitle_piece[]): string {
        return this.generateMarkup(subtitle);
    }

    eventsMap(): { [key: string]: () => void } {
        const m = {};
        m[`click:${this.selectors.closeButton}`] = this.handlerOfCloseButton;
        return m;
    }

    handlerOfCloseButton(): void {
        closeButtonHandler();
    }

    generateSubtitleMarkup(subtitles: subtitle_piece[]): string {
        let mu: string = '';
        for (const s of subtitles) {
            const _mu: string = `
                <div class="${selectors.EX.dashboardTranscriptCueContainer.slice(
                    1
                )}" data-id="${s.index}">
                    <p data-purpose="ex-transcript-cue" class="${selectors.EX.dashboardTranscriptCue.slice(
                        1
                    )}">
                        <span data-purpose="${
                            selectors.EX.dashboardTranscriptCueText
                        }">
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
                : '';

        const closeButton: string = this.generateCloseButton();

        return `
        <div class="${this.selectors.dashboardTranscriptWrapper.slice(1)}">
            <div class="${this.selectors.dashboardTranscriptHeader.slice(1)}">
                <h2 class="heading-secondary">ExTranscript</h2>
                <button type="button" class="${this.selectors.closeButton.slice(
                    1
                )}">${closeButton}</button>
            </div>
            <div class="${this.selectors.dashboardTranscriptPanel.slice(1)}">
                ${s}
            </div>
        </div>
      `;
    }
}

// --- USAGE ---------
const bottom: Bottom = new Bottom(
    selectors.EX,
    selectors.EX.noSidebarParent,
    selectors.EX.dashboardTranscriptWrapper,
    'bottom-ex-template'
);

bottom.render(subtitles);
bottom.clear();

// --- LEGACY -----------
//
// const generateSubtitleMarkup = (
//     selectors: iSelectors,
//   subtitles: subtitle_piece[]
//   ): string => {
//   let mu: string = '';
//   for (const s of subtitles) {
//       const _mu: string = `
//       <div class="${selectors.sidebarCueContainer.slice(1)}" data-id="${
//           s.index
//       }">
//         <p class="${selectors.sidebarCue.slice(1)}">
//           <span data-purpose="${selectors.sidebarCueSpan}">${
//           s.subtitle
//       }</span>
//         </p>
//       </div>
//     `;
//       // concatでいいのかな...
//       mu = mu.concat(_mu);
//   }
//   return mu;
// }

// const generateCloseButton = (): string => {
//   return `
//   <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
//   <g clip-path="url(#clip0_2_8)">
//   <line x1="-0.707107" y1="38.2929" x2="35.2929" y2="2.29289" stroke="black" stroke-width="2"/>
//   <line x1="-1.29289" y1="-0.707107" x2="34.7071" y2="35.2929" stroke="black" stroke-width="2"/>
//   </g>
//   <defs>
//   <clipPath id="clip0_2_8">
//   <rect width="36" height="36" rx="8" fill="white"/>
//   </clipPath>
//   </defs>
//   </svg>
//   `;
// };

// // TODO: どうやってselectorを渡すか...
// //
// const generateMarkup = (
//     selectors: iSelectors,
//   subtitles?: subtitle_piece[]
//   ): string => {
//     const s: string = (subtitles.length > 0 && subtitles !== undefined)
//     ? generateSubtitleMarkup(selectors, subtitles) : "";

//     const closeButton: string = generateCloseButton();

//     return `
//         <div class="${selectors.sidebarWrapper.slice(1)}">
//             <section class="${selectors.sidebarSection.slice(1)}">
//                 <div class="${selectors.sidebarHeader.slice(1)}">
//                     <h2 class="heading-secondary">ExTranscript</h2>
//                     <button type="button" class="${selectors.closeButton.slice(
//                         1
//                     )}">${closeButton}</button>
//                 </div>
//                 <div class="${selectors.sidebarContent.slice(1)}">
//                 <div class="${selectors.sidebarContentPanel.slice(1)}">
//                     ${s}
//                 </div>
//                 </div>
//             </section>
//         </div>
//     `;
// }

// export class ExTranscriptView {
//     constructor(
//         private selectors: iSelectors,
//         // parentSelectorはselectorsに含まれるけど、汎用性のために区別する
//         private _parentSelector: string,
//         // 同様に。
//         // ExTranscript要素のなかで一番外側の要素
//         private _wrapperSelector: string,
//         // TODO: markupGeneratorのinterfaceを作ること
//         private markupGenerator: (s: iSelectors, subtitles?: subtitle_piece[]) => string,
//         // Udemyに埋め込むので、念のためtemplateに識別子をつける
//         private _templateId: string
//     ) {}

//     templates(subtitles?: subtitle_piece[]): string {
//         // インスタンスごとに異なるmarkupを出力できるようにする
//         return this.markupGenerator(this.selectors, subtitles);
//     }

//     // renderする場所は動的に変化するので必ずその都度DOMを取得する
//     // NOTE: 現状、subtitlesがない場合前提でコードを書いているので必須引数にはできない
//     render(subtitles?: subtitle_piece[]): void {
//         // 毎回レンダリング前に消去する
//         this.clear();

//         // TODO: Bottom ExTranscriptだけに必要な措置...
//         // 親要素のCSS positionプロパティを強制的に追加
//         // これは外部でやっても問題ないかも...
//         // parent.style.position = 'relative';

//         const template = document.createElement('template');
//         template.setAttribute("id", this._templateId);

//         // The determination of whether or not an argument exists
//         // is delegated to the calling function.
//         template.innerHTML = this.templates(subtitles);

//         // this.bindEvents(template.content);

//         // 挿入先の親要素DOM取得
//         const parent = document.querySelector<Element>(this._parentSelector);
//         if(parent) {
//             parent.prepend(template.content);
//         }
//     }

//     clear(): void {
//         const e = document.querySelector(this._wrapperSelector)
//         if(e) e.remove();
//         // TODO: Bottom ExTranscriptは親要素のposition: relativeを解除しないといけない
//     }

//     // TODO: Fix this. このinterfaceだと`${}`がつかえない
//     eventsMap(): { [key: string]: () => void } {
//         return {
//             // closeButtonHandlerはcontroller.tsで定義されているやつ
//             'click:.btn__close': closeButtonHandler,
//         };
//     };

//     bindEvents(fragment: DocumentFragment): void {
//         const eventsMap = this.eventsMap();

//         for (let eventKey in eventsMap) {
//             const [eventName, selector] = eventKey.split(':');
//             fragment.querySelectorAll(selector).forEach((element) => {
//                 element.addEventListener(eventName, eventsMap[eventKey]);
//             });
//         }
//     }
// }

// const dashboard = new ExTranscriptView(
//     selectors.EX, selectors.EX.noSidebarParent,
//     selectors.EX.dashboardTranscriptWrapper,
//     generateMarkup,
//     "awesome_templateId"
// );

// dashboard.render(subtitles);
