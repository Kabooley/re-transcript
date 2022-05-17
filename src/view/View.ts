import * as selectors from '../utils/selectors';
import { subtitle_piece } from '../utils/constants';

type iEXSelectors = {
    [Property in keyof typeof selectors.EX]: typeof selectors.EX[Property];
};
interface iSelectors extends iEXSelectors {}

/***
 * Abstract class for ExTranscript View.
 *
 * @constructor
 * @param {iSelectors} selectors - Required selectors that will be use in class.
 * @param {string} _parentSelector - Selector for parent element of ExTranscript.
 * @param {string} _wrapperSelector - Selector for wrapper of ExTranscript.
 * @param {string} _templateId - Provide an identifier to distinguish it from other elements.
 *
 * @abstract
 * @method eventsMap() - Returns set of Object consisting of a combination of
 *  event name and callback function.
 * @method templates() - Returns markup that will be passed to render()
 * @method didRender() - Always fires when render() method ran. 
 * @method didClear() - Always fires when clear() method ran.
 *
 * View導入Refactoringタスク:
 *
 * - TODO: thisの固定の為に、コンストラクタでbindすること
 *  abstract methodもbindしちゃって大丈夫なのか？
 * 
 * - TODO: controller::closeButtonHandlerをメソッドにするため、constantsの変更
 * - TODO: controllerのimport更新
 * - TODO: contentScript/以下のviewファイルの削除
 * */
/*
ただの走り書き

sidebarTranscritpView.ts等はexportの時にnewしている
なのでimport側はどこからでもインスタンスにアクセスできる


*/
export abstract class ExTranscriptView {
    constructor(
        public selectors: iSelectors,
        // parentSelectorはselectorsに含まれるけど、汎用性のために区別する
        private _parentSelector: string,
        // 同様に。ExTranscript要素のなかで一番外側の要素
        private _wrapperSelector: string,
        // Udemyに埋め込むので、念のためtemplateに識別子をつける
        private _templateId: string
    ) {
        this.render = this.render.bind(this);
        this.clear = this.clear.bind(this);
        this.bindEvents = this.bindEvents.bind(this);
        // TODO: make sure that this binding abstract method way is correct...
        this.templates = this.templates.bind(this);
        this.eventsMap = this.eventsMap.bind(this);
    }

    abstract eventsMap(): { [key: string]: () => void };
    abstract templates(subtitles?: subtitle_piece[]): string;
    abstract didRender(): void;
    abstract didClear(): void;

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
        else throw new Error("Error: Parent DOM cannot be caught");
        this.didRender();
    }

    clear(): void {
        const e = document.querySelector(this._wrapperSelector);
        if (e) e.remove();
        this.didClear();
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
