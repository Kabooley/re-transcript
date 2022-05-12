# Note: Refactoring controller.ts

UdemyのTypeScriptコースの内容をうまいことプロジェクトに取り込めないか

やってみる

## イベント

標準イベント

- `onResize`
- `onScroll`
- `onClick`: AutroScrollToggleButton
- `onClick`: CloseButton

独自イベント

- `reset`
- `turnOff`
- `position-changed`: sidebar or noSidebar
- `subtitle-sent`: When get subtitles
- `window-too-small`:

## interface

```TypeScript
interface iController {
    // 本家Transcriptのポジション2通り
    position: keyof_positionStatus;
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

// Annotation of sSubtitles.
interface iSubtitles {
    subtitles: subtitle_piece[];
}

```

## Attributes

```TypeScript
export class Attributes<T> {
    // Requires Storage instance
    constructor(private data: T) {
        this.set = this.set.bind(this);
        this.get = this.get.bind(this);
    }

    // prop can have part of data
    set({prop: {
        [Property in keyof T]?: T[Property];
    }}): void {
        this.data = {
            ...this.data, ...prop
        }
    };

    // get always returns all.
    get(): T {
        return {...this.data};
    }
} 
```

## Model

```TypeScript
export class Model<T> {
    constructor(
        private attributes: Attributes<T>,
        private events: Events,
    ){};

    get get() {
        this.attributes.get;
    };

    get on() {
        this.events.on;
    }

    get trigger() {
        this.events.trigger;
    }

    set({prop: {
        [Property in keyof T]?: T[Property];
    }}) {
        this.attributes.set(prop);
        this.events.trigger('change');
    }

}
```

## Events 

講義のそのまま

```TypeScript
type Callback = () => void;

export class Eventing {
    constructor(public events: { [key: string]: Callback[] }) {
        this.events = {};
        this.on = this.on.bind(this);
        this.trigger = this.trigger(this);
    }

    on(eventName: string, callback: Callback): void {
        const handlers = this.events[eventName] || [];
        handlers.push(callback);
        this.events[eventName] = handlers;
    };

    trigger(eventName: string): void {
        const handlers = this.events[eventName];
        if (handlers === undefined || !handlers.length) return;
        handlers.forEach((cb) => {
            cb();
        });
    };
}
```

## Event Handlers

いまのところ

「どのプロパティが来たときにどれをトリガーする」という具合に

選ぶことはできない

すべて呼出になる

でもそれはプロジェクトの方となんら変わらない

雑に使ってみる

```TypeScript
export class ControllerModel extends Model<iController> {
    static build(sStatusBase: iController): ControllerModel {
        return new ControllerModel(
            new Attributes<iController>(sStatusBase),
            new Events(),
        );
    }
}

const _model = ControllerModel.build();

_model.on('change', updatePosition);
_model.on('change', updateHighlight);
_model.on('change', updateExHighlight);
```