# Note: Refactoring controller.ts

Udemy の TypeScript コースの内容をうまいことプロジェクトに取り込めないか

やってみる

## イベント

標準イベント

-   `onResize`
-   `onScroll`
-   `onClick`: AutroScrollToggleButton
-   `onClick`: CloseButton

独自イベント

-   `reset`
-   `turnOff`
-   `position-changed`: sidebar or noSidebar
-   `subtitle-sent`: When get subtitles
-   `window-too-small`:

## Events と Attributes だけつけた Model を実装してみた

現時点で、`change`イベントだけ登録してある

```TypeScript
/**************************************
 * 動作確認済
 *
 * これで何が変わったかといえば、
 *
 * sStatusの代わりに_modelを使えるようになった
 * そんだけ
 *
 * あまりイベントは活躍しない
 * 今のところ'change'イベントしか必要ないから
 *
 * NOTE: 以下の定義のすべてのT型はすべてたった一つに統一される
 *
 * **/
interface iController {
    // 本家Transcriptのポジション2通り
    position: string;
    // 本家Transcriptでハイライトされている字幕の要素の順番
    highlight: number;
    // ExTranscriptの字幕要素のうち、いまハイライトしている要素の順番
    ExHighlight: number;
    // _subtitlesのindexプロパティからなる配列
    indexList: number[];
    // 自動スクロール機能が展開済かどうか
    isAutoscrollInitialized: boolean;
    // ブラウザサイズが小さすぎる状態かどうか
    isWindowTooSmall: boolean;
    // Udemyの自動スクロール機能がONかOFFか
    isAutoscrollOn: boolean;
}

// T型のオブジェクトのプロパティなら、その一部でも全部でも受け付ける
type iProps<T> = {[Property in keyof T]?: T[Property]}
// iProps型のオブジェクトを受け付ける関数
type Callback<T> = (prop: iProps<T>) => void;


// Base object of sStatus.
const statusBase: iController = {
    // NOTE: position, viewの初期値は意味をなさず、
    // すぐに変更されることが前提である
    position: null,
    highlight: null,
    ExHighlight: null,
    indexList: null,
    isAutoscrollInitialized: false,
    isWindowTooSmall: false,
    isAutoscrollOn: false,
};

export class Attributes<T> {
    // Requires Storage instance
    constructor(private data: T) {
        this.set = this.set.bind(this);
        this.get = this.get.bind(this);
    }

    // prop can have part of data
    set(prop: iProps<T>): void {
        this.data = {
            ...this.data,
            ...prop,
        };
    }

    // get always returns all.
    get(): T {
        return { ...this.data };
    }
}

export class Model<T> {
    constructor(private attributes: Attributes<T>, private events: Events<T>) {}

    get get() {
        return this.attributes.get;
    }

    get on() {
        return this.events.on;
    }

    get trigger() {
        return this.events.trigger;
    }

    set(prop: iProps<T>) {
        this.attributes.set(prop);
        // NOTE: DO PASS prop
        this.events.trigger('change', prop);
        //
        // DEBUG:
        //
        // Make sure how this.attributes.data changed






    }
}


export class Events<T> {
    public events: { [key: string]: Callback<T>[] };
    constructor() {
        this.events = {};
        this.on = this.on.bind(this);
        this.trigger = this.trigger.bind(this);
    }

    on(eventName: string, callback: Callback<T>): void {
        const handlers = this.events[eventName] || [];
        handlers.push(callback);
        this.events[eventName] = handlers;
    }

    trigger(eventName: string, prop: iProps<T>): void {
        const handlers = this.events[eventName];
        if (handlers === undefined || !handlers.length) return;
        handlers.forEach((cb) => {
            cb(prop);
        });
    }
}

export class ControllerModel extends Model<iController> {
    static build(sStatusBase: iController): ControllerModel {
        return new ControllerModel(
            new Attributes<iController>(sStatusBase),
            new Events<iController>()
        );
    }
}

const updatePosition = (prop: iProps<iController>): void => {
    if(prop.position === undefined) return;

};

const updateHighlight = (prop: iProps<iController>): void => {
    if(prop.highlight === undefined) return;

};

const updateExHighlight = (prop: iProps<iController>): void => {
    if(prop.ExHighlight === undefined) return;

};

const _model = ControllerModel.build(statusBase);

_model.on('change', updatePosition);
_model.on('change', updateHighlight);
_model.on('change', updateExHighlight);


_model.set({ position: 'sidebar' });
_model.set({ highlight: 11 });
_model.set({ ExHighlight: 12 });
_model.set(statusBase);

// 定義時にわたしたinterfaceに定義されているプロパティを
// 返すことをTypeScriptは理解できている
// なので以下はエラーにならない
const { position } = _model.get();

```

## turnOff, reset イベント

検討：

`turnOff`というイベントを登録する？

つまり、各発火場所での呼び出しを、

handlerOfTurnOff ではなくて代わりに trigger を呼び出す

```TypeScript
// Fire point
_model.trigger('turnOff');

// 予めhandlerOfTurnOffを登録しておく
_model.on('turnOff', handlerOfTurnOff);

const handlerOfTurnOff = (): void => {

    // ...
}
```

どっちでも変わらない

ただし、今のところ Events.trigger には第二引数として prop が必須な点である...

どっちでも変わらないのならば、別にやらなくてもいいかな

## 後始末

...そもそも必要なかったわ...

## View

の導入検討

講義のほうの View の特徴とは

-   Model インスタンスが必須である
-   'change'イベントで必ず render()させる
-   render()で必ずイベントハンドラをバインドさせている
-   イベントハンドラは Model のインスタンスにアクセスできる

```TypeScript
export class View<T exntends Model<K>, K> {
    constructor(public parent: Element, public model: T) {
        this.bindModel();
    }

    abstract eventsMap(): { [key: string]: () => void };
    abstract template(): string;


    bindModel(): void {
        // NOTE: 必ずしも`change`イベントにしなくてもいいかも
        // たとえば`render`イベントとか
        this.model.on('change', () => {
            this.render();
        });
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

    render(): void {
        this.parent.innerHTML = '';

        // NOTE: inject先でtemplateを使われている可能性はある
        const templateElement = document.createElement('template');
        templateElement.innerHTML = this.template();

        this.bindEvents(templateElement.content);

        this.parent.append(templateElement.content);
    }
}
```

ひとまずプロジェクトの各 view のもとになりそうな class を実装してみる

```TypeScript
export class ExTranscriptView {
    constructor(
        private parentSelector: string,
        private insertPosition: InsertPosition,
        // ExTranscript要素のなかで一番外側の要素
        private exTranscriptSelector: string,
        private markupGenerator: (subtitle_piece[]) => string,
        private templateId: string
    ) {}

    template(subtitles?: subtitle_piece[]): string {
        // インスタンスごとに異なるmarkupを出力できるようにする
        return this.markupGenerator(subtitles);
    }

    // renderする場所は動的に変化するので必ずその都度DOMを取得する
    render(subtitles?: subtitle_piece[]): void {
        // 毎回レンダリング前に消去する
        this.clear();

        // 挿入先の親要素DOM取得
        const parent: HTMLElement = document.querySelector<HTMLElement>(this.parentSelector);

        // TODO: Bottom ExTranscriptだけに必要な措置...
        // 親要素のCSS positionプロパティを強制的に追加
        parent.style.position = 'relative';


        // const html: string = (subtitles.length && subtitles !== undefined)
        //     ? this.generateMarkup(subtitles) : this.generateMarkup();

        // NOTE: bindEvents()を使えるようにするためにtemplateを導入
        //
        const template = document.createElement('template');
        template.setAttribute("id", this.templateId);
        template.innerHTML = this.template(subtitles);

        // NOTE: bindElements()はViewで定義してあるやつ
        this.bindElements(template.content);

        // 挿入
        parent.insertAdjacentHTML(this.insertPosition, template.content);
    }

    clear(): void {
        document.querySelector(this.exTranscriptSelector).remove();
        // TODO: Bottom ExTranscriptは親要素のposition: relativeを解除しないといけない
    }

    eventsMap(): { [key: string]: () => void } {
        return {
            // closeButtonHandlerはcontroller.tsで定義されているやつ
            `click:${selectors.EX.closeButton}`: closeButtonHandler,
        };
    }


}


// for example. sidebar ExTranscript Markup generator
//
const sidebarMarkup = (subtitles?: subtitle_piece[]): string => {
    const s: string = (subtitles.length && subtitles !== undefined) ? generateSubtitle(subtitles) : '';
    const closeButton: string = generateCloseButton();
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
}

const generateSubtitle = (subtitles: subtitle_piece[]): string => {
    let m: string = '';
    for (const s of subtitles) {
        const _m: string = `
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
        m = m.concat(_m);
    }
    return m;
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
}

const sidebar: ExTranscriptView = new ExTranscriptView(
    selectors.EX.sidebarParent, 'afterbegin', selectors.EX.sidebarWrapper, sidebarMarkup
)
```

DOM の挿入方法の模索

```TypeScript
document.getElementById("app").innerHTML = `
<h1>Hello Vanilla!</h1>
<div>
  We use the same configuration as Parcel to bundle this sandbox, you can find more
  info about Parcel
  <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
</div>
<div id="rroot">
  <div class="children">children</div>
  <div class="children">children</div>
  <div class="children">children</div>
  <div class="children">children</div>
  <div class="children">children</div>
</div>
`;

const template: HTMLTemplateElement = document.createElement('template');

const templateGenerator = (): string => {
  return `
    <div class="container">
      <h4>HOGE</h4>
      <input class="input" />
    </div>
  `;
};

template.innerHTML = templateGenerator();
const input = template.content.querySelector<HTMLInputElement>('input');
if(input) {
  input.addEventListener("change", () => {

  })
}
else {

}

// const parent = document.querySelector(".rroot");
const parent = document.getElementById('rroot');
if(parent){
  // Element.appendはElementの一番最後の子要素として挿入する
  // parent.append(template.content)
  // 上記と同様
  // parent.insertBefore(template.content, null);
  // parentの一番初めの子要素として挿入される
  parent.prepend(template.content)
}
else {

}
```

`template`と`DocumentFragment`の合わせだしと

`ParentNode.prepend`で DOM 挿入可能になった

```TypeScript
// sidebarTranscriptView.ts

SidebarTranscriptView.prototype.render = function (
    subtitles?: subtitle_piece[]
): void {
    // e is parent element.
    const e: Element = document.querySelector(this.insertParentSelector);
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

// 今のところ、generateMarkupはstringを返すだけということで...
SidebarTranscriptView.prototype.render = function (
    subtitles?: subtitle_piece[]
): void {
    const template = document.createElement('template');

    if (subtitles.length > 0 && subtitles !== undefined) {
        const s: string = this.generateSubtitleMarkup(subtitles);
        html = this.generateMarkup(s);
    } else {
        html = this.generateMarkup();
    }
    const parent = document.querySelector(this.insertParentSelector);
    if(parent) {
        // parentの一番最初の子要素として登録される
        parent.prepend(template.content)
    }
}

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
        // NOTE: bottomTranscriptViewでは特別以下のstyle指定が必要である
        // その際、必ずHTMLElementで指定しなければならない
        document.querySelector<HTMLElement>(
            this.insertParentSelector
        ).style.position = 'relative';
        parent.prepend(template.content);
    }
};
```

再度、DOM 挿入方法をアップデートして...

```TypeScript

type iEXSelectors = {[Property in keyof typeof selectors.EX]?: typeof selectors.EX[Property]};

interface iSelectors extends iEXSelectors {};


export class ExTranscriptView {
    constructor(
        private _selectors: iSelectors,
        private parentSelector: string,
        private insertPosition: InsertPosition,
        // ExTranscript要素のなかで一番外側の要素
        private exTranscriptSelector: string,
        private markupGenerator: (subtitle_piece[]) => string,
        // Udemyに埋め込むから、念のため区別するために
        private templateId: string
    ) {}

    template(subtitles?: subtitle_piece[]): string {
        // インスタンスごとに異なるmarkupを出力できるようにする
        return this.markupGenerator(subtitles);
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
        template.innerHTML = generateMarkup(subtitles);

        this.bindEvents(template.content);

        // 挿入先の親要素DOM取得
        const parent = document.querySelector<Element>(this.parentSelector);
        if(parent) {
            parent.prepend(template.content);
        }
    }

    clear(): void {
        document.querySelector(this.exTranscriptSelector).remove();
        // TODO: Bottom ExTranscriptは親要素のposition: relativeを解除しないといけない
    }

    eventsMap(): { [key: string]: () => void } {
        return {
            // closeButtonHandlerはcontroller.tsで定義されているやつ
            `click:${selectors.EX.closeButton}`: closeButtonHandler,
        };
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


// TODO: どうやってselectorを渡すか...
//
const generateMarkup = (subtitles?: subtitle_piece[]): string => {
    const s: string = (subtitles.length > 0 && subtitles !== undefined)
    ? generateSubtitleMarkup(subtitles) : "";

    const closeButton: string = generateCloseButton();

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
}

const generateSubtitleMarkup = (subtitles: subtitle_piece[]): string => {
    let mu: string = '';
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
        // concatでいいのかな...
        mu = mu.concat(_mu);
    }
    return mu;
}
```

## TypeScript Tips: 諸略可能な引数の後に必須引数を追加することはできない

```TypeScript

const generateMarkup = (
  subtitles?: subtitle_piece[],
    // ERROR:
    //  A required parameter cannot follow an optional parameter.
  selectors: iSelectors
  ): string => {
      // ...
  }
```

correct way.

```TypeScript

const generateMarkup = (
  selectors: iSelectors,
  subtitles?: subtitle_piece[]
  ): string => {
      // ...
  }
```

つまり`?`つきの仮引数は仮引数群の末尾に追加していくこと

必須仮引数は頭に追加していくこと

理由は省略されると`selectors`が`subtitles`として認識されてしまうから

## TypeScript Tips: type `[key: string]: () => void` に template literal は通用しない

参考：

https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html

```TypeScript
// CORRECT
    eventsMap(): { [key: string]: () => void } {
        return {
            'click:.btn__close': closeButtonHandler,
        };
    };

// WRONG
    eventsMap(): { [key: string]: () => void } {
        return {
            `click:.${selectors.closeButton}`: closeButtonHandler,
        };
    };
```

っちゅうわけでテンプレート・リテラルはそれはそれで別物ってわけだそうです

公式の前半の方では union を使うのは小規模なプロジェクトならばいいんじゃない

ってことだそうで

やっぱりちゃんとやるにはめんどい方法になります

## TypeScript Tips: 必須プロパティと任意プロパティ

わたされたオブジェクト型定義のプロパティを必須とする型と

同様に任意とする型を生成する標準の型がある

-   必須： `Required<T>`
-   任意：`Partial<T>`

```TypeScript
type Person = {
  surname: string;
  middleName?: string;
  givenName: string;
};
type RequiredPerson = Required<Person>;
/*
type RequiredPerson = {
    surname: string;
    middleName: string;
    givenName: string;
}
*/
```

```TypeScript
type Person = {
  surname: string;
  middleName?: string;
  givenName: string;
};
type PartialPerson = Partial<Person>;
/*
type PartialPerson = {
    surname?: string | undefined;
    middleName?: string | undefined;
    givenName?: string | undefined;
}
*/
```

## TypeScript Tips: Intersection

Union 型が「いずれか」を表すならば、

Intersection 型は「いずれも」を表す

まぁ直感的に、`|`と`&`ならわかると思う

ここに先の Required<>と Partial<>を組み合わせると強そう

#### Intersection Types で Template Literal を受け付ける型を作る

```TypeScript
interface Person {
  surname: string;
  middleName?: string;
  givenName: string;
};

type iTemplateLiteral = string & keyof Person;
```
