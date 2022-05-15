import * as selectors from "../../src/utils/selectors";


// Viewではselectors.EXのみ必要な模様なので...

type iEXSelectors = {[Property in keyof typeof selectors.EX]: typeof selectors.EX[Property]};

interface iSelectors extends iEXSelectors {};

interface subtitle_piece {
  index: number;
  subtitle: string;
}


const closeButtonHandler = (): void => {
  console.log("close button clicked");
}


const generateSubtitleMarkup = (
    selectors: iSelectors,
  subtitles: subtitle_piece[]
  ): string => {
  let mu: string = '';
  for (const s of subtitles) {
      const _mu: string = `
      <div class="${selectors.sidebarCueContainer.slice(1)}" data-id="${
          s.index
      }">
        <p class="${selectors.sidebarCue.slice(1)}">
          <span data-purpose="${selectors.sidebarCueSpan}">${
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

const generateCloseButton = (): string => {
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


// TODO: どうやってselectorを渡すか...
// 
const generateMarkup = (
    selectors: iSelectors,
  subtitles?: subtitle_piece[]
  ): string => {
    const s: string = (subtitles.length > 0 && subtitles !== undefined) 
    ? generateSubtitleMarkup(selectors, subtitles) : "";

    const closeButton: string = generateCloseButton();

    return `
        <div class="${selectors.sidebarWrapper.slice(1)}">
            <section class="${selectors.sidebarSection.slice(1)}">
                <div class="${selectors.sidebarHeader.slice(1)}">
                    <h2 class="heading-secondary">ExTranscript</h2>
                    <button type="button" class="${selectors.closeButton.slice(
                        1
                    )}">${closeButton}</button>
                </div>
                <div class="${selectors.sidebarContent.slice(1)}">
                <div class="${selectors.sidebarContentPanel.slice(1)}">
                    ${s}
                </div>
                </div>
            </section>
        </div>
    `;
}



export class ExTranscriptView {
    constructor(
        private _selectors: iSelectors,
        // parentSelectorは_selectorsに含まれるけど、汎用性のために区別する
        private parentSelector: string,
        // 同様に。
        // ExTranscript要素のなかで一番外側の要素
        private exTranscriptSelector: string,
        // TODO: markupGeneratorのinterfaceを作ること
        private markupGenerator: (s: iSelectors, subtitles?: subtitle_piece[]) => string,
        // Udemyに埋め込むので、念のためtemplateに識別子をつける
        private templateId: string
    ) {}

    templates(subtitles?: subtitle_piece[]): string {
        // インスタンスごとに異なるmarkupを出力できるようにする
        return this.markupGenerator(this._selectors, subtitles);
    }

    // renderする場所は動的に変化するので必ずその都度DOMを取得する
    // 
    render(subtitles?: subtitle_piece[]): void {
        // 毎回レンダリング前に消去する
        this.clear();

        // TODO: Bottom ExTranscriptだけに必要な措置...
        // 親要素のCSS positionプロパティを強制的に追加
        // これは外部でやっても問題ないかも...
        // parent.style.position = 'relative';

        const template = document.createElement('template');
        template.setAttribute("id", this.templateId);

        // The determination of whether or not an argument exists 
        // is delegated to the calling function.
        template.innerHTML = this.templates(subtitles);

        // this.bindEvents(template.content);

        // 挿入先の親要素DOM取得
        const parent = document.querySelector<Element>(this.parentSelector);
        if(parent) {
            parent.prepend(template.content);
        }
    }

    clear(): void {
        const e = document.querySelector(this.exTranscriptSelector)
        if(e) e.remove();
        // TODO: Bottom ExTranscriptは親要素のposition: relativeを解除しないといけない
    }

    // TODO: Fix this. このinterfaceだと`${}`がつかえない
    eventsMap(): { [key: string]: () => void } {
        return {
            // closeButtonHandlerはcontroller.tsで定義されているやつ
            'click:.btn__close': closeButtonHandler,
        };
    };


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



const sidebar = new ExTranscriptView(
    selectors.EX, selectors.EX.noSidebarParent, 
    selectors.EX.dashboardTranscriptWrapper,
    generateMarkup,
    "awesomeTemplateId"
);


const selectors_ = {
    button: "button",
    div: "div"
}


type iEventBindSetKey = `${string}:${keyof typeof selectors_}`;
type iEventBindSet<T> = {
    T[key: iEventBindSet]: () => void;
}


// 要は、オブジェクトのkeyを任意の文字列にしたくて
// type ooo<T> = {
//     `click:${selectors_.button}`: () => void
// }


// NOTE: そもそもオブジェクトのキーに値を与える方法について
// 
var key = "happyNumber";
var obj = {};

obj[key] = 7;
console.log(obj);
// {happyNumber: 7}


interface StringArray {
    [index: number]: string;
}

// Correct
const nums: StringArray = {
    1: "11"
}

// Wrong
// 
// つまり、indexという命名は自由である
// const nums2: StringArray = {
//     index: "11"
// }