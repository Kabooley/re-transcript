# JavaScript Tips 

chrome 拡張機能を開発中に得たJavaScript知見を集約

## Web API

#### MutationObserver

> MutationObserver インターフェイスは、 DOM ツリーへ変更が加えられたことを監視することができる機能を提供します。これは DOM3 Events の仕様で定義されていた Mutation Events (en-US) 機能の置き換えとして設計されたものです。

ということで、

例えば、あるDOM要素の属性が変化したことを検知したい場合がある。

そんなときに使える標準の機能がMutationOserverである


```TypeScript
interface MutationObserver {
    /** Stops observer from observing any mutations. Until the observe() method is used again, observer's callback will not be invoked. */
    disconnect(): void;
    /**
     * Instructs the user agent to observe a given target (a node) and report any mutations based on the criteria given by options (an object).
     *
     * The options argument allows for setting mutation observation options via object members.
     */
    observe(target: Node, options?: MutationObserverInit): void;
    /** Empties the record queue and returns what was in there. */
    takeRecords(): MutationRecord[];
}

// observerへ渡すconfig
interface MutationObserverInit {
    /** Set to a list of attribute local names (without namespace) if not all attribute mutations need to be observed and attributes is true or omitted. */
    attributeFilter?: string[];
    /** Set to true if attributes is true or omitted and target's attribute value before the mutation needs to be recorded. */
    attributeOldValue?: boolean;
    /** Set to true if mutations to target's attributes are to be observed. Can be omitted if attributeOldValue or attributeFilter is specified. */
    attributes?: boolean;
    /** Set to true if mutations to target's data are to be observed. Can be omitted if characterDataOldValue is specified. */
    characterData?: boolean;
    /** Set to true if characterData is set to true or omitted and target's data before the mutation needs to be recorded. */
    characterDataOldValue?: boolean;
    /** Set to true if mutations to target's children are to be observed. */
    childList?: boolean;
    /** Set to true if mutations to not just target, but also target's descendants are to be observed. */
    subtree?: boolean;
}

```

- target: 監視対象
- config: 監視対象の何を監視するのかの指定。MutationObserverで監視できるものはMutationObserverInitインタフェイスで確認できる


流れ：


```JavaScript
// select the target node
var target = document.querySelector('#some-id');

// create an observer instance
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {

    });
});

// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true }

// pass in the target node, as well as the observer options
observer.observe(target, config);

// later, you can stop observing
observer.disconnect();
```

target という監視対象を決めて、
config という監視対象で検知したい変更を決めて
実行する処理を`new MutationObserver`のコールバックで定義して
`observer.observer()`でこれらを結びつけて監視開始
`observer.disconnect()`で監視終了


できること：たとえば、

- 監視対象の子要素とかも監視できる
- 変更前の値も取得できる

監視対象の制限：

監視できる対象は`Node`である

たとえば複数監視したいときはdocument.querySelectorAll()で取得して
そのもどりちをいきなりMutationOBserver.observeへ渡すことはできない

かならずNode一つずつに対してobserveしなくてはならない

callbackが受け取るもの:

```TypeScript
interface MutationCallback {
    (mutations: MutationRecord[], observer: MutationObserver): void;
}

/** A MutationRecord represents an individual DOM mutation. It is the object that is passed to MutationObserver's callback. */
interface MutationRecord {
    /** Return the nodes added and removed respectively. */
    readonly addedNodes: NodeList;
    /** Returns the local name of the changed attribute, and null otherwise. */
    readonly attributeName: string | null;
    /** Returns the namespace of the changed attribute, and null otherwise. */
    readonly attributeNamespace: string | null;
    /** Return the previous and next sibling respectively of the added or removed nodes, and null otherwise. */
    readonly nextSibling: Node | null;
    /** The return value depends on type. For "attributes", it is the value of the changed attribute before the change. For "characterData", it is the data of the changed node before the change. For "childList", it is null. */
    readonly oldValue: string | null;
    /** Return the previous and next sibling respectively of the added or removed nodes, and null otherwise. */
    readonly previousSibling: Node | null;
    /** Return the nodes added and removed respectively. */
    readonly removedNodes: NodeList;
    /** Returns the node the mutation affected, depending on the type. For "attributes", it is the element whose attribute changed. For "characterData", it is the CharacterData node. For "childList", it is the node whose children changed. */
    readonly target: Node;
    /** Returns "attributes" if it was an attribute mutation. "characterData" if it was a mutation to a CharacterData node. And "childList" if it was a mutation to the tree of nodes. */
    readonly type: MutationRecordType;
}

```

要は配列が引数として渡されて、その中身が上記のMutationRecordである

配列が実際に何で埋め尽くされるかはobserverへ渡したconfigに依る

configで指定した監視対象の変異が起こったらコールバックが呼び出されるが

変異が重なったりしたときにその配列の中身に重なった変異が詰め込まれるときがあったりなかったり

なのでコールバックが取得する配列には注意が必要である。

#### MutationObserver例: 

```TypeScript
// Config of MutationObserver for auto highlight.
const moConfig: MutationObserverInit = {
    attributes: true,
    childList: false,
    subtree: false,
    attributeOldValue: true,
} as const;
```

このコンフィグで監視開始すると、

- 属性の変化検知
- （監視対象の）子要素の変化無視
- (監視対象の)子孫の変異無視
- (変更検知時に)　属性の変更前の値の取得ができる



subtree: ターゲットだけでなく、ターゲットの子孫への変異も観測する場合はtrueを設定する

#### MutationObserver 途中で対象の要素を変更できる

`MutationObserver.observe()`の第一引数に監視対象を渡せばいいだけなので

`MutationObserver`のインスタンスを作るときに監視対象は必要ない。

なので監視対象だけを変更したかったら、

一旦`MutationObserver.disconnect`してから、

別の監視対象をobserve()へ渡せばいい

## DOM

#### 属性と DOM プロパティは必ず一致するとは限らない

https://stackoverflow.com/questions/10280250/getattribute-versus-element-object-properties

https://javascript.info/dom-attributes-and-properties

結論：属性と DOM プロパティは必ず一致するとは限らない

属性を取得する方法

1. getAttribute()
2. element.attributes

> getAttribute は DOM 要素の属性を取得し、el.id はこの DOM 要素のプロパティを取得します。これらは同じではありません。
> ほとんどの場合、DOM プロパティは属性と同期しています。
> しかし、この同期は同じ値を保証するものではありません。

たとえば input の check 属性があるとして
DOM プロパティは true または false を返すのに対して
属性は checked を返す
これは同じ値ではない

#### JavaScript Tips: click イベントが addEventListener を呼び出したときに即発火してしまうのを防ぐ

NOTE: ちょっとこのトピックは疑問がある...

たとえば document に対して click イベントリスナをつけたときとか
document は root 要素だから addEventListener を呼び出した瞬間にすぐ発火してしまう

```TypeScript

  const e: HTMLElement = document.querySelector<HTMLElement>(
    _selectors.controlBar.cc.popupButton
  );

    // この呼出し時に即clickイベントが発火しコールバックが呼び出される
  document.addEventListener("click", ccPopupMenuClickHandler);
```

これの回避策は addEventListener の第三引数を true にして bubbling phase をスキップすることである

```TypeScript

  document.addEventListener("click", ccPopupMenuClickHandler, true);
  document.removeEventListener("click", ccPopupMenuClickHandler, true);
```

ちなみに remove するときも第 3 引数は指定する（じゃないと remove できない）


## class

#### インスタンスを無効化するには？

https://stackoverflow.com/questions/17243463/delete-instance-of-a-class

インスタンス変数に`null`か`undefined`を代入する