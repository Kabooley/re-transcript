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
 * NOTE: 以下の定義のすべてのT型はすべてたった一つに統一されるようにすること
 *
 * **/
import {} from "../../src/contentScript/controller";
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

// NOTE: 新規追加
// T型のオブジェクトのプロパティなら、その一部でも全部でも受け付ける
type iProps<T> = { [Property in keyof T]?: T[Property] };
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
    this.events.trigger("change", prop);
    //
    // DEBUG:
    //
    // Make sure how this.attributes.data changed
    console.log("--------------------------");
    console.log("prop:");
    console.log(prop);
    console.log("Updated data:");
    console.log(this.attributes.get());
    console.log("--------------------------");
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

export class ExTranscriptModel extends Model<iController> {
  static build(sStatusBase: iController): ExTranscriptModel {
    return new ExTranscriptModel(
      new Attributes<iController>(sStatusBase),
      new Events<iController>()
    );
  }
}

const updatePosition = (prop: iProps<iController>): void => {
  if (prop.position === undefined) return;
  console.log("update psotion");
};

const updateHighlight = (prop: iProps<iController>): void => {
  if (prop.highlight === undefined) return;
  console.log("update highlight");
};

const updateExHighlight = (prop: iProps<iController>): void => {
  if (prop.ExHighlight === undefined) return;
  console.log("update ExHighlight");
};

const _model = ExTranscriptModel.build(statusBase);

_model.on("change", updatePosition);
_model.on("change", updateHighlight);
_model.on("change", updateExHighlight);

_model.set({ position: "sidebar" });
_model.set({ highlight: 11 });
_model.set({ ExHighlight: 12 });
_model.set(statusBase);

// 定義時にわたしたinterfaceに定義されているプロパティを
// 返すことをTypeScriptは理解できている
// なので以下はエラーにならない
const { position } = _model.get();

// --- REFACTOR PART -----------------------

// global
let model: ExTranscriptModel;
let mSubtitle: ExTranscriptModel;

/**
 * Entry Point
 *
 * */
(function (): void {
  console.log("[controller] Initializing...");

  // Modelの生成
  model = ExTranscriptModel.build(statusBase);
  mSubtitle = ExTranscriptModel.build(subtitleBase);

  // イベントハンドラの追加
  model.on("change", updatePosition);
  model.on("change", updateHighlight);
  model.on("change", updateExHighlight);
  mSubtitle.on("change", updateSubtitle);

  // ExTranscriptの展開場所判定と生成
  const w: number = document.documentElement.clientWidth;
  const s: keyof_positionStatus =
    w > RESIZE_BOUNDARY ? positionStatus.sidebar : positionStatus.noSidebar;
  model.set({ position: s });
  model.set({ isWindowTooSmall: w < MINIMUM_BOUNDARY ? true : false });

  // その他のリスナの設定
  window.removeEventListener("resize", reductionOfwindowResizeHandler);
  window.addEventListener("resize", reductionOfwindowResizeHandler);
  // 自動スクロールチェック状態監視リスナ
  resetAutoscrollCheckboxListener();
})();

// あとはsStatusやsSubtitleをmodelとmSubtitleに変更するだけ...
