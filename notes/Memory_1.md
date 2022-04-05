# Desktop リポジトリでの開発メモ

**このノートはのちのち開発ノートとしてマージする**

## 目次

[設計](#設計)
[Udemy にまつわること](#Udemyにまつわること)
[chrome extension tips](#chrome_extension_tips)
[JavaScript Tips](#JavaScript_Tips)
[CSS Tips](#CSS_Tips)
[TypeScript Tips](#TypeScript_Tips)
[Web API Tips](#Web_API_Tips)
[Webpack](#Webpack)
[日誌](#日誌)

## 設計

-   background.js
    字幕取得ハンドラ
    エラーハンドラ

-   popup.js
    字幕取得ボタン
    エラー表示
    取得字幕のテキストエリア表示（クリックしたらクリップボードにコピーなど）

-   contentScript.js
    字幕スクレイピング
    字幕整形
    字幕自動スクロール・ハイライトスクレイピング
    字幕埋め込み
    埋め込み字幕を字幕自動スクロール・ハイライトに合わせてスクロール・ハイライトさせる

## Udemy にまつわること

#### Udemy のバグ？Transcription が 2 重に表示される問題について

なんだか講義によっては、
なぜだか transcription が 2 重になっている場合がある

二重になっている講義だと、自動スクロールが起こるたびに mutation の反応が 2 倍になってしまう
(そもそも字幕取得の時点で困る可能性が...)

二重になっていない講義だと期待した通りに動いていた

解決済

## chrome_extension_tips

#### 複数の content script を扱うことに関して

https://stackoverflow.com/questions/26667112/optionally-inject-content-script?noredirect=1&lq=1

公式では

> コンテンツ スクリプトをプログラムで注入するには、スクリプトを注入しようとしているページのホスト パーミッションが必要です。ホスト パーミッションの付与は、拡張機能のマニフェストの一部として要求する方法 (host_permissions を参照) と、activeTab を使用して一時的に付与する方法があります。

## JavaScript_Tips

#### 属性を取得するときの注意

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

## CSS_Tips

#### 位置指定コンテキスト

絶対位置指定要素の「包含ブロック」とは

-   包含ブロックの識別

> position プロパティが absolute の場合、包含ブロックは position の値が static 以外 (fixed, absolute, relative, sticky) の直近の祖先要素におけるパディングボックスの辺によって構成されます。

他参照：https://developer.mozilla.org/ja/docs/Web/CSS/Containing_block#identifying_the_containing_block

つまり`positoin: absolute`である要素を好きな場所に配置するには

包含ブロックとなる祖先要素は position: relative`にする

動かしたい要素に対して
`position: absolute`を設定して
`top`や`left`で位置を決める

の 2 つの条件ということになる

余談：

埋め込み要素を埋め込むページの好きな場所に配置したい場合、

1. 埋め込むページのおおもとに近い要素に`position: relative`　と設定された全く無害な要素(たとえば透明な点とか)を埋め込む（またはちょうどいい要素を選ぶ）
2. 埋め込む要素は 1 の要素の子要素にして`position: absolute`にする

の２つの要素が必要になるね

## TypeScript_Tips

#### querySelectorAll()してから map したいとき

まず querySelectorAll()は型指定する

```TypeScript
// l: NodeListOf<HTMLElement>
const l = document.querySelectorAll<HTMLElement>('div.list');
```

querySelectorAll は Node のリストである NodeListOf のデータを返す
こいつは直接には forEach くらいしか使えない
具体的に言うと Array と異なる代物である

なので Array にいったん変換する

-   Array.prototype.slice.call
-   Array.from

どちらか

```TypeScript
const data = Array.from(l).map(_l => {
  // ...
})

// or

const data = [].slice.call(l).map(_l => {
  // ...
})

```

## Web_API_Tips

## MutationObserver

https://dom.spec.whatwg.org/#interface-mutationobserver

```TypeScript
interface MutationObserver {
  constructor(MutationCallback callback);

  undefined observe(Node target, optional MutationObserverInit options = {});
  undefined disconnect();
  sequence<MutationRecord> takeRecords();
};

// MutationObserverのcallbackはMutationRecordと呼ばれる変更の内容を記したオブジェクトからなる配列を受け取る
callback MutationCallback = undefined (sequence<MutationRecord> mutations, MutationObserver observer);

dictionary MutationObserverInit {
  boolean childList = false;
  boolean attributes;
  boolean characterData;
  boolean subtree = false;
  boolean attributeOldValue;
  boolean characterDataOldValue;
  sequence<DOMString> attributeFilter;
};
```

```TypeScript
interface MutationRecord {
  readonly attribute DOMString type;            // mutationが発火した原因attributeとかcharacterDataとか
  [SameObject] readonly attribute Node target;  // `node`
  [SameObject] readonly attribute NodeList addedNodes;
  [SameObject] readonly attribute NodeList removedNodes;
  readonly attribute Node? previousSibling;
  readonly attribute Node? nextSibling;
  readonly attribute DOMString? attributeName;
  readonly attribute DOMString? attributeNamespace;
  readonly attribute DOMString? oldValue;
};
```

内容をピックアップ

`record.type`:
mutation が発生した原因。
属性が変化したかテキストが変更されたかなど

`record.target`:

> タイプに応じて、ミューテーションが影響を受けた Node を返します。
> 「属性」の場合、属性が変更された要素です。
> 「characterData」の場合は、CharacterData ノードです。
> 「childList」の場合、子が変更されたノードです。

`record.attributeName`:
変更された属性の local name を返す

## Webpack

#### CSS を使うために

manifest.json の contentScript で css を指定する必要はなかった
必要はないというか指定しないとうまくいく

## 日誌

#### TypeScript + React で udemy 模倣 transcript を作成...できなかった

udemy の講義ページの transcript 要素 DOM の直下に react を挿入したら udemy 講義ページのコンテンツが消えた！
vanillajs を挿入する場合はまったくそんなことが起こらないのだけれど

これの解決はかなり深刻

一旦 React で挿入することは忘れて
VanilaJS で挿入してみる

#### VanillaJS で Udemy へ DOM 挿入

`window.onResize`

字幕を取得して埋め込んだ DOM に流すという処理に一切 background や popup と連携しないのか？
--> popup とは通信予定だけどひとまず contentScript で完結させてみる

#### 11/9

見つかった問題

-   sidebar の時 transcript の width は 2 通りあること

    975px < window.innerWidth =< 1182px で width: 300px
    window.innerWidth > 1182px で width: 25%;
    なのでセレクタを追加したほうがいいかも

    たぶん no-sidebar の時も transcript の content の height は window サイズによって変わるかも...

-   window.innerWidth はほしい長さを返していなかった...

MDN に書いてあった

wndow.innerWidth:

> Window の innerWidth プロパティは読み取り専用で、ウィンドウの内部の幅をピクセル単位で返します。これには垂直スクロールバーがある場合、その幅を含みます。

> ウィンドウからスクロールバーや境界を引いた幅を取得するには、ルートの <html> 要素の clientWidth プロパティを代わりに使用してください。

`<html>`の取得方法

https://stackoverflow.com/questions/4196971/how-to-get-the-html-tag-html-with-javascript-jquery

```JavaScript
document.documentElement
```

でいいっぽい

#### 11/10

-   bottom:
    height が合わないのを修正する

-   sidebarTranscript width の動的変更
    完了

-   bottom から sidebar へ変更したときに挙動がおかしくなる問題

解決

-   dashboard transcript は documentElement.width =< 583px でトランスクリプト機能は自動的に off になるみたい

ここの機能の実装はひとまずいいや

ひとまずここまでで概ね transcript を模倣する
bottomTranscriotView と sidebarTranscriptView を実装できた
(bottomTranscriptView はちょっと裾が足りてなかったりするけど)

なので次の段階に進む

-   後回しにできる課題

bottomTranscriptView はちょっと裾が足りてなかったりする

同じ処理がなんども登場したりするのでリファクタリングしたい

TypeScript をちゃんと使って

次の課題

-   整形字幕の挿入 <--- これ
-   整形字幕のオートスクロール機能
-   閉じるボタン

#### 整形字幕の挿入

chrome extension api をまったく使っていないというか
chrome extensions の出番がまったくない設計は大丈夫なのだろうか？

相変わらず contentScript.ts::piecingString()では undefined が含まれてしまっている

contentScript.ts を整理したい

-   run_at: idle で呼び出されて
-   setTimeout()

    -   chrome.runtime.sendMessage()
    -   waitForTenSec()
        -   main()
        -   embedSubtitle()
        -   setCurrentHighlight()
        -   detectScroll()

-   main()
    capturingSubtitle(): 字幕要素をスクレイピング
    piecingStrings():
    スクレイピングした字幕を整形する
    インデックス番号を付加してペアのデータにする

```TypeScript
interface subtitle_piece {
  index: number;
  subtitle: string;
}

/*
@param subtitles {subtitle_piece[]}
subtitle: Udemyの講義で流れてくる字幕一塊とその順番を表すindex

用語の意味：
piece: 破片  chunk: 塊
pieceはパンくずで、chunkは1斤パンである
chunksはスライスされた食パンのセットである


整形処理の流れ:
const chunks = subtitles.map( subtitle => {
})

subtitleの文末がピリオドまたはクエスチョンマークのsubtitleにであうまで、
buff[]へsubtitle.subtitleをpushし続ける

indexはbuff[]が空だった時だけ値を与える
そうすることでbuff[]へ一番初めにpushされたsubtitleのindexだけ記憶できる

このindex番号が後々字幕自動スクロールに必要になる

文末がピリオドまたはハテナのsubtitleにであったらbuff[]とindexがプロパティの
オブジェクトを生成して
chunksへ返す

以上が整形処理の流れ

*/
const subtitlePiecesToChunks = function (subtitles: subtitle_piece[]): subtitle_piece[] {
  var buff: string[] = [];
  var index: number = null;

  // map()なので明示的にreturnしなかった回はundefinedを返してしまっている
  const chunks: subtitle_piece[] = subtitles.map(
    (subtitle: subtitle_piece): subtitle_piece => {
      // 塊を作り始める最初だけindexに値を与える
      if (buff.length === 0) {
        index = subtitle.index;
      }
      const s = subtitle.subtitle.trim().substr(-1, 1);
      if (s === "." || s === "?") {
        const piece = {
          index: index,
          subtitle: [...buff, subtitle.subtitle].join(" "),
        };
        // 次のchunkのためにリセットする
        buff = [];
        index = null;

        return piece;
      } else {
        // 文末ピリオドまたはハテナのsubtitleにであうまで
        // subtitleをpushし続ける
        buff.push(subtitle.subtitle);
      }
    }
  );
  // undefinedを取り除いて返す
  return chunks.filter((chunk: subtitle_piece) => chunk !== undefined);
};

```

問題は`const chunks: subtitle_piece[] = subtitles.map()`が`undefined`を返していること

多分`else {buff.push(subtitle.subtitle);}`で暗黙のうちに返してしまっているのかも

原因は Array.prototype.map()を使っていること
map の callback 内で条件によって return しなくても
map は各ループで必ず値を返す

つまり条件で return しないとしても
暗黙の裡に undefined を返すのである

なので map()から返された配列を filter する

修正完了

chunks の中身

```
0: {index: 0, subtitle: "Let's now create a nice effect on our page navigat…xcept for the link that we actually hovered over."}
1: {index: 5, subtitle: 'And this will teach us something really valuable, …w to pass arguments into event handler functions.'}
2: {index: 8, subtitle: 'And the effect that I mean is this one.'}
3: {index: 9, subtitle: 'So, when we hover over one of the links, you see, all the others fade out like this.'}
4: {index: 11, subtitle: 'And that includes even the logo there on the left side.'}
```

これをどこに保持するのか
そもそも保持の必要があるのか？
保持する場合どういう機能が必要になるのか？

たとえば Udemy の講義ページは次の動画に行くのにページをリロードしない
URL も変わらなかった...

あたらしい動画になったらトランスクリプトの内容も変わるので
新しい動画ページになったらそのたびに取得すればいいので
前の字幕は破棄していい

あと
たとえば transcript ボタンをオフにしていたらこちらの字幕データは消えていいかといえば
これは保持しておいた方が再度表示したいときにすぐに表示できるだろう

とりあえず background.ts とデータのやり取りを連携するようにしてみよう

#### 11/13

popup.tsx で実行ボタンを設ける
この実行ボタンをクリックすることで ExTranscript 機能を実行するようにする

background, popup, content script の 3 つとやり取りする機能を実装する

-   popup: 実行ボタンを押されたら background に実行信号を送信する
-   background: 実行信号を受け取って contentscript を inject する
-   content script は字幕取得～整形データ保存までを行ったら background へ信号を送信する
-   background はデータを保存して content script へ ExTranscript を表示する script を inject する

typescript と chrome extension api がわからなすぎる

#### 11/19

#### 字幕が英語かどうか取得する

取得する DOM 周辺

```
// コントロールバーの一番大本
"div.control-bar--control-bar-container--16vzi"
// CC とかいてあるやつの一番おおもとのラッパー要素
// メニュー表示中は`.udlite-popper-open`が付く
"div.udlite-popper-open.popper--popper--2r2To"
// 各コントロールメニューはすべてこのクラス名でラッピングされている（なので区別できない）
"div.popper--popper--2r2To"
// id は動的に生成されている!!
"div#popper-content--428"
"div.popper--animation-wrapper--1uUMV"
"div#control-bar-dropdown-menu--427"
"ul[role='menu'].unstyled-list.udlite-block-list"
"li[role='none']"
// この ul の子要素群が取得可能字幕リスト一覧である
"ul.unstyled-list[role='group'][aria-label='字幕']"
"button.udlite-btn.udlite-btn-large.udlite-btn-ghost.udlite-text-sm.udlite-block-list-item.udlite-block-list-item-small.udlite-block-list-item-neutral"
"div.udlite-block-list-item-content"

```

`const buttons = document.querySelectorAll("button.udlite-btn.udlite-btn-large.udlite-btn-ghost.udlite-text-sm.udlite-block-list-item.udlite-block-list-item-small.udlite-block-list-item-neutral")`
で取得しても関係なものがまだ被る

`const wrapper = document.querySelector('div#popper-content--428')`で一旦 DOMc を取得して
`const list = wrpaeer.querySelectorAll("button.udlite-btn.udlite-btn-large.udlite-btn-ghost.udlite-text-sm.udlite-block-list-item.udlite-block-list-item-small.udlite-block-list-item-neutral > div.udlite-block-list-item-content")`

これなら OK だった

取得は CC ボタンがクリックされてメニューが開いているかどうか関係なく取得することができるのは diff してみて確認済

セレクタ名が変わっているか？

```diff
// not clicked
- <div class="popper--popper--2r2To">
// clicked
+ <div class="udlite-popper-open popper--popper--2r2To">
```

#### 11/20

message passing 機能について

contentScript から background へ、transcript が ON か OFF かのメッセージ：OK
popup から background へ、RUN ボタンが押された旨のメッセージ受信：OK

確認された問題：
localstorage に保存された情報と、\_state に残っている情報が混在する
service worker が頻繁にリセットされるものだと思っていたけど
そうでもないせいで\_state に情報が残り続けているのが原因だとおもう

\_state を常に localstorage と同期させないといかん...

当面の課題：

localstorage と state の同期 : 済
contentScript, CC の字幕で選択している言語の取得機能: <==いまここ
backgrouind, script の動的挿入機能

#### localstorage と state の同期

storage API のメソッドは非同期関数なのか？
...どうも使ってみたところそんな感じだ...

Promise でラッピングして async/await で順番通り実行させる
state モジュールを非同期関数化する

```TypeScript
const state = ((): stateModule => {
    var _state: iState = {};
    const _key: string = 'key__local_storage_state';

    var _setState = (o) => {
        _state = {
            ..._state,
            ...o,
        };
    };

    return {
        setState: (o) => {
            console.log('setState');
            _state = {
                ..._state,
                ...o,
            };
            chrome.storage.local.set({ key__local_storage_state: _state });
        },
        getState: () => {
            console.log('getState');
            chrome.storage.local.get(_key, (s: iState) => {
                console.log('get localstorage');
                _setState(s);
            });
            return _state;
        },
    };
})();
```

```TypeScript
// Promisified storage methods -----
const getLocalStorage = (key: string) => {
  return new Promise((resolve, reject) => {
    // chrome.storage.local.get()はPromiseチェーンみたいなもの
    chrome.storage.local.get(key, (s: iState): void => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      console.log("getLocalStorage() item successfully has been got.")
      resolve(s);
    });
  }
});

const setLocalStorage = (key: string, data: iState) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({key: data}, (): void => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      console.log("setLocalStorage() item successfully has been stored.")
      resolve("item has been stored.");
    });
  }
});

const state = ((): stateModule => {
    var _state: iState = {};
    const _key: string = 'key__local_storage_state';

    var _setState = (o): void => {
        _state = {
            ..._state,
            ...o,
        };
    };

    return {
        setState: async (o) : void => {
            console.log('setState');
            _state = {
                ..._state,
                ...o,
            };
            try {
            await setLocalStorage(_key, _state);
            }
            catch(err) {
              console.error(err);
            }
        },
        getState: async (): iState => {
            console.log('getState');
            try {
              await getLocalStorage(_key);
              return _state;
            }
            catch(err) {
              console.error(err);
            }
        },
    };
})();
```

https://typescript-jp.gitbook.io/deep-dive/future-javascript/async-await

https://future-architect.github.io/typescript-guide/async.html

> await を扱うには、 async をつけて定義された関数でなければなりません。 TypeScript では、 async を返す関数の返り値は必ず Promise になります。 ジェネリクスのパラメータとして、返り値の型を設定します。

TypeScript で Promise 型付け

```TypeScript
function delay(milliseconds: number, count: number): Promise<number> {
    return new Promise<number>(resolve => {
            setTimeout(() => {
                resolve(count);
            }, milliseconds);
        });
}

// async関数は常にPromiseを返します
async function dramaticWelcome(): Promise<void> {
    console.log("Hello");

    for (let i = 0; i < 5; i++) {
        // awaitは、Promise<number>をnumberに変換します
        const count:number = await delay(500, i);
        console.log(count);
    }

    console.log("World!");
}

dramaticWelcome();

```

async を付ける関数は戻り値に`Promise<T>`としなくてはならない

ジェネリクスの`T`は Promise が resolve するときの値の型である

async/await の基本

async 関数を同期的に呼び出すとどうなるの？
つまり、async 関数を await なしで呼び出すとどうなるの？

答えは async 関数は同期的な部分だけ処理されて次に移動する
つまり非同期処理は呼び出し側で待たれない

なんで非同期関数を呼び出すということは、
呼び出し側も非同期関数にならなくてはならない
というなんだか感染力の強いものであるな

上記の state のメソッドの呼び出しは次の通りになる

```TypeScript

const state = ((): stateModule => {
    var _state: iState = {};
    const _key: string = 'key__local_storage_state';

    var _setState = (o): void => {
        _state = {
            ..._state,
            ...o,
        };
    };

    return {
        setState: async (o) : void => {
            console.log('setState');
            _state = {
                ..._state,
                ...o,
            };
            try {
            await setLocalStorage(_key, _state);
            }
            catch(err) {
              console.error(err);
            }
        },
        getState: async (): iState => {
            console.log('getState');
            try {
              await getLocalStorage(_key);
              return _state;
            }
            catch(err) {
              console.error(err);
            }
        },
    };
})();

const setString = async (data: string): Promise<void> => {
  try {
    await state.setState(data);
  }
  catch(e) {
    console.error(e);
  }
}

const getString = async (): Promise<string> => {
  try {
    const data : string = await state.getState();
    return data;
  }
  catch(e) {
    console.error(e);
  }
}
```

#### storage への保存と state がちぐはぐである問題

```TypeScript
const state = ((): stateModule => {
    var _state: iState = {};
    const _key: string = 'key__local_storage_state';

// 修正した
    var _setState = (o): void => {
      const {scripts, pageStatus, captureProgress}: iState = o;
        _state = {
            ..._state,
            ...scripts,
            ...pageStatus,
            ...captureProgress
        };
    };

    return {
        setState: async (o): Promise<void> => {
            console.log('setState');
            _state = {
                ..._state,
                ...o,
            };
            try {
                await setLocalStorage(_key, _state);
            } catch (err) {
                console.error(err);
            }
        },
        getState: async (): Promise<iState> => {
            console.log('getState');
            try {
                const current = await getLocalStorage(_key);
                _setState(current);
                console.log(current);
                console.log(_state);
                return _state;
            } catch (err) {
                console.error(err);
            }
        },
    };
})();
```

setState と getState はうまくいっているけれど
\_setState が思った通りに動いていなかった

#### Udemy の講義ページのコントロールバー上の CC ボタンを正確に取得する

というか要は英語字幕以外を選択したら困るから、
英語か否かだけわかればいいので

CC のポップアップメニューが「閉じられたとき」に
`isSubtitleEnglish`を実行して英語が否か確認すればいい

ということは CC ポップアップボタンの aria-expanded を
「開かれた後に閉じられた」らチェックすればいい

CC コントロールバー上のボタン

```html
<div class="popper--popper--2r2To">
    <button
        type="button"
        aria-haspopup="true"
        aria-label="字幕"
        data-purpose="captions-dropdown-button"
        id="control-bar-dropdown-trigger--434"
        tabindex="0"
        aria-expanded="false"
        class="udlite-btn udlite-btn-small udlite-btn-ghost udlite-heading-sm control-bar-dropdown--trigger--iFz7P control-bar-dropdown--trigger-dark--1qTuU control-bar-dropdown--trigger-small--1ZPqx"
        aria-describedby="popper-content--437"
    >
        <span class="udi udi-closed-caption"></span>
    </button>
</div>
```

下記ならずばりを取得できた
`button[data-purpose='captions-dropdown-button']`

CC 　メニュー

```HTML
<!-- このidは動的生成なので使えない... -->
<div id="popper-content--444" aria-labelledby="control-bar-dropdown-trigger--442" class="popper--popper-content--2tG0H udlite-popper-open" style="bottom: 100%; right: 0px;">
<div class="popper--animation-wrapper--1uUMV">
  <div id="control-bar-dropdown-menu--443" class="control-bar-dropdown--menu--2bFbL control-bar-dropdown--menu-dark--3cSQg" style="max-height: 33.53rem; margin-bottom: 3.2rem;">
  <ul role="menu" aria-labelledby="control-bar-dropdown-trigger--442" data-purpose="captions-dropdown-menu" class="unstyled-list udlite-block-list">
    <li role="none"><ul class="unstyled-list" role="group" aria-label="字幕"><button type="button" role="menuitemradio" tabindex="-1" aria-checked="false" class="udlite-btn udlite-btn-large udlite-btn-ghost udlite-text-sm udlite-block-list-item udlite-block-list-item-small udlite-block-list-item-neutral"><div class="udlite-block-list-item-content">オフ</div></button><button type="button" role="menuitemradio" tabindex="-1" aria-checked="true" class="udlite-btn udlite-btn-large udlite-btn-ghost udlite-text-sm udlite-block-list-item udlite-block-list-item-small udlite-block-list-item-neutral"><div class="udlite-block-list-item-content">英語 [自動]</div></button></ul></li><li role="separator"></li><li role="none"><button type="button" role="menuitem" tabindex="-1" data-purpose="go-to-settings" aria-haspopup="true" class="udlite-btn udlite-btn-large udlite-btn-ghost udlite-text-sm udlite-block-list-item udlite-block-list-item-small udlite-block-list-item-neutral"><div class="udlite-block-list-item-content">字幕設定<svg aria-hidden="true" focusable="false" class="udlite-icon udlite-icon-small video-control-bar-dropdown--next-icon--3crbc"><use xlink:href="#icon-next"></use></svg></div></button></li>
    </ul>
  </div>
  </div>
</div>
```

popup menu

```html
<div
    id="popper-content--444"
    aria-labelledby="control-bar-dropdown-trigger--442"
    class="popper--popper-content--2tG0H"
    style="bottom: 100%; right: 0px;"
>
    <div class="popper--animation-wrapper--1uUMV">
        <div
            id="control-bar-dropdown-menu--443"
            class="control-bar-dropdown--menu--2bFbL control-bar-dropdown--menu-dark--3cSQg"
            style="max-height: 45.29rem; margin-bottom: 3.2rem;"
        >
            <!-- このulは取得可能 -->
            <ul
                role="menu"
                aria-labelledby="control-bar-dropdown-trigger--442"
                data-purpose="captions-dropdown-menu"
                class="unstyled-list udlite-block-list"
            >
                <li role="none">
                    <ul class="unstyled-list" role="group" aria-label="字幕">
                        <button
                            type="button"
                            role="menuitemradio"
                            tabindex="-1"
                            aria-checked="false"
                            class="udlite-btn udlite-btn-large udlite-btn-ghost udlite-text-sm udlite-block-list-item udlite-block-list-item-small udlite-block-list-item-neutral"
                        >
                            <div class="udlite-block-list-item-content">
                                オフ
                            </div></button
                        ><button
                            type="button"
                            role="menuitemradio"
                            tabindex="-1"
                            aria-checked="true"
                            class="udlite-btn udlite-btn-large udlite-btn-ghost udlite-text-sm udlite-block-list-item udlite-block-list-item-small udlite-block-list-item-neutral"
                        >
                            <div class="udlite-block-list-item-content">
                                英語 [自動]
                            </div>
                        </button>
                    </ul>
                </li>
                <li role="separator"></li>
                <li role="none">
                    <button
                        type="button"
                        role="menuitem"
                        tabindex="-1"
                        data-purpose="go-to-settings"
                        aria-haspopup="true"
                        class="udlite-btn udlite-btn-large udlite-btn-ghost udlite-text-sm udlite-block-list-item udlite-block-list-item-small udlite-block-list-item-neutral"
                    >
                        <div class="udlite-block-list-item-content">
                            字幕設定<svg
                                aria-hidden="true"
                                focusable="false"
                                class="udlite-icon udlite-icon-small video-control-bar-dropdown--next-icon--3crbc"
                            >
                                <use xlink:href="#icon-next"></use>
                            </svg>
                        </div>
                    </button>
                </li>
            </ul>
        </div>
    </div>
</div>
```

以下なら必ず毎回ユニークとして取得できる
`ul[role="menu"][data-purpose="captions-dropdown-menu"]`
`ul[role="menu"][data-purpose="captions-dropdown-menu"] > ul > li > button`

control bar

```html
<div class="control-bar--control-bar--MweER" data-purpose="video-controls">
    <!-- こいつの子要素に`div.popper--popper--2r2To`が並び、このセレクタで取得できる要素が各ポップアップボタンである -->
</div>
```

CC Popup ボタンが押された
CC Popup ボタンに MutationObserver を付ける
`_selectors.controlBar.cc.popupButton`で取得できる要素の`aria-expanded`属性だけ監視する
`aria-expanded`が false になったら observer を disconnect する
また、`isSubtitleEnglish`を実行して、字幕言語が英語か否かチェックする

```TypeScript
const ccPopupButtonHandler = (ev: MouseEvent): void => {
    console.log('CC popup button was clicked');

    const e: HTMLElement = document.querySelector<HTMLElement>(
        _selectors.controlBar.cc.popupButton
    );

    // やっぱりaria-expanded === trueのときになぜかfalseを返すので
    // 反対の結果を送信する
    if (e.getAttribute('aria-expanded') !== 'true') {
        // CC popupが開かれている
        //
        // 次popupメニューが閉じられるのを知りたい
        // やっぱりMutationObserverしかないかな～
    } else {
        // CC popupは閉じられている
    }
};
```

ccPopupMenuClickHandler で mouseevent から path を取得できない...

#### 11/21

#### TypeScript で Event プロパティに path は存在しないのか？

https://stackoverflow.com/questions/39245488/event-path-is-undefined-running-in-firefox

> path はブラウザによってあったりなかったりする非標準のプロパティである
> 標準は`composedPath`であるがこれは新しい機能である

> そのため、IE11（または Legacy Edge）では、パス情報を直接取得することはできないと思います。もちろん、e.target.parentNode とそれに続く各 parentNode を介してパスを取得することはできますが、通常は同じです。

とのことなので chrome 拡張機能は chrome ブラウザしか使えないから問題なさそう

https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.event.html#composedpath

-   `Event.composedPath()`

Returns: `EventTarget[]`

> イベントのパスの呼び出しターゲットオブジェクト（リスナーが呼び出されるオブジェクト）を返します。ただし、シャドウルートのモードが「closed」であるシャドウツリー内のノードで、イベントの currentTarget から到達できないものは除きます。

-   `Event.parentNode`

親要素をたどっていく方法
これは面倒だけど確実ですね...
Event.target: EventTarget
EventTarget.Node: Node
Node.parentNode: Node

あとは Node から parentNode をたどっていくだけ

採用してみる

```TypeScript

const ccPopupMenuClickHandler = (ev: PointerEvent): void => {
  const menu: HTMLElement = document.querySelector<HTMLElement>(
    _selectors.controlBar.cc.menuListParent
  );


  // if(!ev.path.includes(menu)){
  //     const r: boolean = isSubtitleEnglish();
  //     sendStatusToBackground({ isEnglish: r });
  //     document.removeEventListener("click", ccPopupMenuClickHandler);
  // }

  // -- solution one ---
  // using event.composedPath()

  const path: Eventtarget[] = ev.composedpath();
  if(path.includes(menu)){
    // menuの内側でclickが発生した
    // 何もしない
    console.log("click inside");
  }
  else{
    // menuの外側でclickが発生した
    const r: boolean = isSubtitleEnglish();
    sendStatusToBackground({ isEnglish: r });
    document.removeEventListener("click", ccPopupMenuClickHandler);
  }

  // --- solution two ---
  // searching parentnode

  var node: Node = null;
  var targetNode: Node = ev.target.Node;
  var isInsdie: boolean = false;
  // このdocumentの指定は大丈夫なのか？
  while(node !== document) {
    var n = node;
    node = null;
    node = n.parentNode;
    if(node === menu){
      isInside = true;
      break;
    }
  }
  if(isInside){
    // menuの内側でclickが発生した
    // 何もしない
    console.log("click inside");
  }
    else{
    // menuの外側でclickが発生した
    const r: boolean = isSubtitleEnglish();
    sendStatusToBackground({ isEnglish: r });
    document.removeEventListener("click", ccPopupMenuClickHandler);
  }
};
```

あと CC popup ボタンを何度もおされても addeventListenr が重複して登録されないように

```TypeScript
const ccPopupButtonHandler = (ev: MouseEvent): void => {
  console.log("CC popup button was clicked");
  // is it opening?
  const e: HTMLElement = document.querySelector<HTMLElement>(
    _selectors.controlBar.cc.popupButton
  );

  // やっぱりaria-expanded === trueのときになぜかfalseを返すので
  // 反対の結果を送信する
  if (e.getAttribute("aria-expanded") !== "true") {
    // CC popupメニューが表示された

    // 重複して登録されないように
    document.removeEventListener('click', ccPopupMenuClickHandler);
    document.addEventListener("click", ccPopupMenuClickHandler, false);
  } else {
    // CC popupメニューは閉じた
  }
};

```

#### POPUP の RUN ボタンをクリックしてからの機能の実装

を開始します

-   popup からのボタン押された判定を background へ送信
-   background は字幕が英語であることと transcript が ON になっているか判定する
-   true ならば字幕取得 content script を動的に挿入する
-   正しく content script が挿入できたか background と通信する
-   content script に字幕を取得させ、整形し、background へ送信する
-   background は整形字幕をいったん localstorage へ保存する
-   次に ExTranscript 生成する content script を挿入する
-   ...

とひとまずこんなところ

## 11/22

すること:

-   popup からのボタン押された判定を background へ送信
-   background は字幕が英語であることと transcript が ON になっているか判定する
-   true ならば字幕取得 content script を動的に挿入する
-   正しく content script が挿入できたか background と通信する
-   content script に字幕を取得させ、整形し、background へ送信する
-   background は整形字幕をいったん localstorage へ保存する
-   次に ExTranscript 生成する content script を挿入する
-   ...

contentScript.ts から transcript 開閉状態と字幕言語の変更を検知できるようになった

contentScript.ts はひとまずこんな感じ

見つかった問題:

runtime.lastError が頻発するようになった
popup からのメッセージポートが閉じれているとかなんとか

#### 11/23

manifest.json の更新わすれた
programmatically inject content script をするための権限許可を反映した
manifest.json コミットするの忘れたからやっておくこと

content script を inject するにあたって

-   import/export するファイルも inject しないといけないのか

その前に

https://stackoverflow.com/questions/48104433/how-to-import-es6-modules-in-content-script-for-chrome-extension

https://medium.com/@otiai10/how-to-use-es6-import-with-chrome-extension-bd5217b9c978

ES6 より、html ファイルの`<script>`タグの中に`type="module"`を定義することによって
シングルファイルを生成するような webpack や Browserify 等の
ミドルウェアが必要なくなった

では chrome extensions ではどうか？

content script の場合

もしも content script に`import`が使われていると
次のようなエラーが発生する

```bash
Uncaught SyntaxError: Unexpected identifier
```

これは`<script>`タグに`type="module"`が入っていなかったから

content script は元となる html ファイルがそもそもない

エントリーポイントとなるところへ`<script type="module">`タグを渡せればいい

Google は「動的 import」なる方法を紹介しているらしい

https://v8.dev/features/dynamic-import

まず静的 import

```JavaScript
// Default export
export default () => {
  console.log('Hi from the default export!');
};

// Named export `doStuff`
export const doStuff = () => {
  console.log('Doing stuff…');
};
```

```html
<script type="module">
    import * as module from './utils.mjs';
    module.default();
    // → logs 'Hi from the default export!'
    module.doStuff();
    // → logs 'Doing stuff…'
</script>
```

この静的 import は次のようなことはできない

-   オンデマンドで（または条件付きで）モジュールをインポートする
-   ランタイムにモジュール指定子を計算する
-   (モジュールではなく)通常のスクリプト内からモジュールをインポートする

動的 import()

import(moduleSpecifier) は、要求されたモジュールのモジュール名前空間オブジェクトのプロミスを返します。
このオブジェクトは、モジュールのすべての依存関係とモジュール自体を取得、インスタンス化、評価した後に作成されます。

-   Permission はどのように得ればいいのか

> コンテンツ スクリプトをプログラムで注入するには、スクリプトを注入しようとしているページのホスト パーミッションが必要です。ホストパーミッションは、拡張機能のマニフェストの一部として要求するか（host_permissions を参照）、activeTab を通じて一時的に付与することができます。

```TypeScript
// background.ts
const startInjectCaptureSubtitleScript = async (): Promise<void> => {
  // is contentScript alrady ready?
  // If ready, inject script.
  //
  //
};


```

##### chrome extension: 動的 content script inject 手順

https://developer.chrome.com/blog/crx-scripting-api/

V3 から追加された新しい API

シナリオ：

決められた URL のページに対してのみ inject してほしいので
tab を特定して
それから inject する

前提：

```JSON
{
  "permissions": ["scripting", "tabs"],
  ...
}
```

特定のタブなのか調べる:

```JavaScript
// これだといまのwindowの今のタブならなんでも返すので
// いったん取得して精査する必要がある
// { active: true, currentWindow: true }で指定すればただ一つのタブしか該当しないはずなので
// こいつのURLがほしいものかどうか精査すればいい


const isUrlCorrect = (url) => {
  // https://www.udemy.com/course/*
  var tab = null;
  // たぶん非同期関数だからこのままだとtabはPendingのプロミスかnullのままである
  chrome.tabs.query({ active: true, currentWindow: true }, (tabInfoe) => {
    tab = tabInfo;
  });
  // tabがただしいかチェックしたい
  const pattern = /https:\/\/www.udemy.com\/course\/*/gm;
  const result = tab.url.match(pattern);
  if(result.length) {
    return tab.tabId;
  }
  else {
    return -1;
  }

}

```

```TypeScript
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content-script.js']
  });
```

##### chrome.tabs.query が空の配列を返す問題

https://stackoverflow.com/questions/59974414/chrome-tabs-query-returning-empty-tab-array

どうも chrome の devtools が currentWindow になっちゃっているらしい
めんどくせーなクソか

```JavaScript
chrome.windows.getCurrent(w => {
  chrome.tabs.query({active: true, windowId: w.id}, tabs => {
    const tabId = tabs[0].id;
    // use tabId here...
  });
});
```

なんか transcript が ON じゃないとかいってくる

#### 11/25

現在地：
大きな課題として、動的 content script の挿入を行いたい

-   その前段階として content script の最新の状態を取得する
-   content script の挿入先の tab の情報を取得する
    という機能を実装している真っ最中

1. transcript が ON なのに ON じゃないと言ってくる件

リアルタイムに web ページの状態を取得していなかったのが原因

content script から送信することでどの状態かわかる現状なので
content script からのメッセージ待ちの状態
なので background が要求するようにする

済

要求タイミング

-   `chrome.runtime.onInstalled()`のタイミング
-   popup の run ボタンが押されたタイミング

で要求できるように実装する

2. transcript toggle button の属性値はすぐに変更しない

これは

toggle ボタンを押されたときに onclick イベントで aria-expanded を取得すると、
それはまだ「反映される前」だから反対の値を返す

一方 toggle ボタンの変更が起こらない時に取得すれば正しい属性値が取得できる

なので使い分けないといかん

済

chrome.scripting.executeScript()するところまできた

`Uncaught (in promise) Error: Could not load file: 'controller.js'.`
のエラーが発生した
コールバックが取得する result は undefined である

--> webpack コンフィグで controller を出力していなかっただけだった

あとなぜか
`chrome.scripting.executeScript`のタイミングで contentScript からメッセージがくる
よんだ覚えはない...

chrome extension の Promise について

https://developer.chrome.com/docs/extensions/mv3/promises/

#### 11/25

controller の inject できた
あとやっぱり import している js ファイルはどういうわけか inject しなくても使えているのは
webpack が import しているファイルもすべてひとつにまとめているからかもしれない

本日は asynchronous 処理を公式のとおりに書き直す

Promise methods

-   chrome.tabs.query
-   chrome.storage.local.get
-   chrome.storage.local.set

```TypeScript
const getLocalStorage = (key: string): Promise<iState> => {
  return new Promise<iState>((resolve, reject) => {
    // chrome.storage.local.get()はPromiseチェーンみたいなもの
    chrome.storage.local.get(key, (s: iState): void => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      resolve(s);
    });
  });
};

const setLocalStorage = (key: string, data: iState): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    chrome.storage.local.set({ key: data }, (): void => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      resolve();
    });
  });
};


const state = ((): stateModule => {
  var _state: iState = {};
  const _key: string = "key__local_storage_state";

  var _setState = (o): void => {
    const { scripts, pageStatus, progress, require }: iState = o;
    _state = {
      ..._state,
      ...scripts,
      ...pageStatus,
      ...progress,
      ...require,
    };
  };

  return {
    setState: async (o): Promise<void> => {
      _state = {
        ..._state,
        ...o,
      };
      try {
        // await setLocalStorage(_key, _state);
        await chrome.storage.local.set({ key: data });
      } catch (err) {
        // やっていることかわんないけどね
        if(err === chrome.runtime.lastError){
          console.error(err);
        }
        else{
        console.log(err);
        }
      }
    },
    getState: async (): Promise<iState> => {
      try {
        // const current = await getLocalStorage(_key);
        const current: Promise<iState> = await chrome.storage.local.get(key);
        _setState(current);
        return _state;
      } catch (err) {
        // やっていることかわんないけどね
        if(err === chrome.runtime.lastError){
          console.error(err);
        }
        else{
        console.log(err);
        }
      }
    },
  };
})();

```

なんか storage.local.get は await がつかえない
なんか解決が困難な型エラーが起こる

なのでそこは今まで通りでいこう

一応変更前のﾒｿｯﾄﾞ群を残しておく

```TypeScript

const getLocalStorage = (key: string): Promise<iState> => {
    return new Promise<iState>((resolve, reject) => {
        // chrome.storage.local.get()はPromiseチェーンみたいなもの
        chrome.storage.local.get(key, (s: iState): void => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve(s);
        });
    });
};

const setLocalStorage = (key: string, data: iState): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        chrome.storage.local.set({ key: data }, (): void => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
};

const state = ((): stateModule => {
  var _state: iState = {};
  const _key: string = "key__local_storage_state";

  var _setState = (o): void => {
    const { scripts, pageStatus, progress, require }: iState = o;
    _state = {
      ..._state,
      ...scripts,
      ...pageStatus,
      ...progress,
      ...require,
    };
  };

  return {
    setState: async (o): Promise<void> => {
      _state = {
        ..._state,
        ...o,
      };
      try {
        await setLocalStorage(_key, _state);
      } catch (err) {
        console.error(err);
      }
    },
    getState: async (): Promise<iState> => {
      try {
        const current = await getLocalStorage(_key);
        _setState(current);
        return _state;
      } catch (err) {
        console.error(err);
      }
    },
  };
})();
```

#### 11/26

##### import/export したファイルが manifest.json で指定していなければ動的に inject したわけでもないそのファイルが使えているわけ

理由は webpack が import/export したファイルを一つのファイルにまとめてくれているから
つまり、
`contentScript/controller.ts`が import しているファイル、
`sidebarTranscriptView.ts`, `bottomeTranscriptView.ts`はすべて
`controller.js`へひとまとめに出力してくれているのである

だから`chrome.scripting.executeScript()`で`controller.js`だけ指定しても
import しているファイルの分が実行できたのである

これは逆に言うと
webpack 抜きだとうまくいかないねってことになる

##### controller.ts へ字幕を挿入する

機能の再編成

-   自動スクロール検知機能の controller.ts への移動
-   background.ts の字幕データ保存

いま background.ts の storage は

```TypeScript
{
  key__local_storage_state: {
            scripts: {
                popup: 'not-working',
                contentScript: 'not-working',
                option: 'not-working',
            },
            pageStatus: {
                isTranscriptOn: false,
                isEnglish: false,
                isWindowTooSmall: false,
            },
            progress: {
                capturing: false,
                captured: false,
                stored: false,
                restructured: false,
            },
            require: {
                from: null,
                waiting: false,
            },
        }
}
```

state モジュールはこの状態に完全に依存しているので
あらたな public メソッドを足すことにする

```TypeScript
const state = ((): stateModule => {
    var _state: iState = {};
    var _subtitle: subtitle_piece[] = [];
    const _key: string = 'key__local_storage_state';
    const _key_subtitles: string = 'key__local_storage_subtitle'

    var _setState = (o): void => {
        const { scripts, pageStatus, progress, require }: iState = o;
        _state = {
            ..._state,
            ...scripts,
            ...pageStatus,
            ...progress,
            ...require,
        };
    };

    return {
        setState: async (o): Promise<void> => {
            console.log('setState');
            _state = {
                ..._state,
                ...o,
            };
            try {
                await chrome.storage.local.set({ _key: _state });
            } catch (err) {
                if (err === chrome.runtime.lastError) {
                    console.error(err.message);
                } else {
                    console.log(err);
                }
            }
        },
        getState: async (): Promise<iState> => {
            try {
                const current: iState = await chrome.storage.local.get(_key);
                _setState(current);
                return _state;
            } catch (err) {
                if (err === chrome.runtime.lastError) {
                    console.error(err);
                } else {
                    console.log(err);
                }
            }
        },
        saveSubtitles: async (d: subtitle_piece[]): Promise<void> => {
          // Note: 中身は常に上書きではなく新しくなる
          console.log('save subtitle');
          _subtitle.splice(0);
          _subtitle.push(...d);
          try {
            await chrome.storage.local.set({_key_subtitles: _subtitle});
          }
          catch(err) {
            if (err === chrome.runtime.lastError) {
                    console.error(err.message);
                } else {
                    console.log(err);
                }
          }
        },
        loadSubtitles: async (): Promise<subtitle_piece[]> => {
          console.log("load subtitles");
          _subtitle.splice(0);
          try {
            const loaded: subtitle_piece[] = await chrome.storage.local.get(_key_subtitles);
            _subtitle.push(...loaded);
            return _subtitle;
          }
          catch(err) {
            if (err === chrome.runtime.lastError) {
                    console.error(err);
                } else {
                    console.log(err);
                }
          }
        }
    };
})();

```

配列を正しく使うために

-   saveSubtitle は常に引数のデータだけを\_subtitle へ保存する
-   古い\_subtitle は完全に消去される

参考
https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript

既存の配列を空にする（新しい配列は作らない）
`myarray.splice(0)`

splice は取り除いた要素からなる配列を返す
今回は使わないので戻り値は無視する

既存の配列に配列を追加する方法（新しい配列を作らずに）

参考
https://stackoverflow.com/questions/1374126/how-to-extend-an-existing-javascript-array-with-another-array-without-creating

concat は新しい配列を作るからだめ

`a.push(...b)`がよいようです

##### state の扱いが煩わしすぎる

いちいち setstate するまえに getstate で該当のプロパティを取得して
上書きしてから setstate するので
本来 state が負うべき処理を呼び出し側がいちいち肩代わりしている
同じコードが繰り返されるしミスが起こりやすそうなので
この辺を改善したい

現在 setState は iState のプロパティを取得することにしているが
そのプロパティのプロパティも受け取れるようにしたい

この辺は自身の力不足なだけだから改善のしようがある

でもあとで...

##### controller.ts を inject する

その前に

また新たに関数を作るのが面倒なので
startInjectCaptureSubtitleScript の中身を汎用的にして関数化する

inject する content script のファイル名
active な window で active な tab で、url パターンが`/https:\/\/www.udemy.com\/course\/*/gm`である tabId

`startInjectCaptureSubtitleScript`では
共通化できないのは下記に示した部分

```TypeScript
const startInjectCaptureSubtitleScript = async (): Promise<void> => {
    try {
        console.log('[startInjectCaptureSubtitleScript]');
        await getWebpageStatus();
        const { pageStatus } = await state.getState();
        // tabIdはstateに保存しておいた方がいいかも
        const tabId: number = await checkTabIsCorrect();
        console.log(tabId);
        if (pageStatus.isEnglish && pageStatus.isTranscriptOn && tabId) {
            console.log('Start injecting script...');

            // 共通化できない部分 ----
            const { progress } = await state.getState();
            await state.setState({
                progress: {
                    ...progress,
                    capturing: true,
                },
            });
            // -------------------------

            // inject content script
            const result: chrome.scripting.InjectionResult[] =
                await chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['captureSubtitle.js'],
                });
            console.log(result);
        } else {
            // いずれかだけがfalseのときに適切なエラーメッセージをpopup上に発せるようにしたい...
            console.log(
                'Change subtitle language English and Turn on transcript. Or You may try to turn on extension invalid web page.'
            );
        }
    } catch (err) {
        if (err === chrome.runtime.lastError) {
            console.error(err.message);
        } else {
            console.log(err);
        }
    }
};
```

pageStatus.isEnglish
pageStatus.isTranscriptOn などの条件は動的に決定されるので
関数に渡すことはできない
しかしそのプロパティが必要であることは伝えることはできる

iState 上のどのプロパティか
そのプロパティのどのプロパティか
がわかればいい

```TypeScript
const injectContentScript = async (filename: string, requiredCondition): Promise<void> => {
    try {
        console.log(`Inject script: ${filename}`);

        await getWebpageStatus();
        const { pageStatus } = await state.getState();
        // tabIdはstateに保存しておいた方がいいかも
        const tabId: number = await checkTabIsCorrect();

        // この条件分岐を汎用化させたい...
        if (pageStatus.isEnglish && pageStatus.isTranscriptOn && tabId) {
            console.log('Start injecting script...');
            // inject content script
            const result: chrome.scripting.InjectionResult[] =
                await chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: [filename],
                });
        } else {
            // いずれかだけがfalseのときに適切なエラーメッセージをpopup上に発せるようにしたい...
            console.log(
                'Change subtitle language English and Turn on transcript. Or You may try to turn on extension invalid web page.'
            );
        }
    } catch (err) {
        if (err === chrome.runtime.lastError) {
            console.error(err.message);
        } else {
            console.log(err);
        }
    }
};
```

必要なもの

state: {
pageStatus: {
isEnglish: boolean;
isTranscriptOn: boolean;
},
progress: {
captured: boolean;
},
}

条件に必要な最新の値は都度 state を取得するとして
関数が必要とするのは「どのプロパティなのか？」なのである

やっぱりむり

#### 11/27

captureSubtitle.js から字幕を取得して localstorage へ保存した

この後の処理をどうやって実装しようか

storage へエラーなく保存されたのが確認出来たら
controller.js を inject する処理に移ればよい

##### message passing で相手の反応があるまで呼び出し側を停止する

目下対応中...

```TypeScript
const getWebpageStatus = async (): Promise<void> => {
    console.log('[getWebpageStatus]');
    const tabId = await checkTabIsCorrect();
    if (!tabId) return;
    const message: iMessage = {
        from: extensionNames.background,
        order: orderNames.sendStatus,
    };
    await state.setState({
        require: { from: extensionNames.contentScript, waiting: true },
    });
    // callbackが実行されたら送信完了の合図ってことにできないかな~
    await chrome.tabs.sendMessage(tabId, message, () => {
        console.log('[getWebpageStatus] is it done?');
    });
};
```

ここの sendMessage のあとに
tabId の content script に仕事をしてほしいのだけれど
その仕事が完了したら呼び出し側に message を送信することになっている
この送信があるまで呼び出し側を停止したいのだけれど
それを実現する手段はあるのか？？

参考
https://stackoverflow.com/questions/52087734/make-promise-wait-for-a-chrome-runtime-sendmessage/52089844

sendMessage のコールバックに Promise.resolve()を返させる方法

```TypeScript
//  ---- 呼び出し側　background.ts -------------

const getWebpageStatus = async (): Promise<void> => {
  try {
    console.log('[getWebpageStatus]');
    const tabId = await checkTabIsCorrect();
    if (!tabId) return;
    const message: iMessage = {
        from: extensionNames.background,
        order: orderNames.sendStatus,
    };
    await state.setState({
        require: { from: extensionNames.contentScript, waiting: true },
    });


// chrome.tabs.sendMessageのコールバックは何も返さない
// return Promise<void>である
    const responseHandler = async (response) => {
      return new Promise<void>((resolve, reject) => {
        if(response.complete) {
          resolve();
        }
        else {
          reject("Error: Requiring sending status went something wrong");
        }
      })
    }
    await chrome.tabs.sendMessage(tabId, message, responseHandler);

  }
  catch(err) {
            if (err === chrome.runtime.lastError) {
            console.error(err.message);
        } else {
            console.log(err);
        }
  }
};


// --- 呼び出され側 contentScript.ts ------

chrome.runtime.onMessage.addListener(
  async (message: iMessage, sender, sendResponse: (response?: any) => void): Promise<void> => {
    const { from, order } = message;
    if (from === extensionNames.background && order === orderNames.sendStatus) {
      const isEnglish: boolean = isSubtitleEnglish();
      const isOpen: boolean = isTranscriptOpen();
      await sendStatusToBackground({
        isEnglish: isEnglish,
        isOpened: isOpen,
      });
      if (sendResponse) {
        await sendResponse({complete: true });
      }
    }
  }
);

/*
  background.tsへメッセージを送信する
*/
const sendStatusToBackground = async (order: {
  isOpened?: boolean;
  isEnglish?: boolean;
}): Promise<void> => {
  const { isOpened, isEnglish } = order;

  if (isOpened !== undefined) {
    const m: iMessage = isOpened
      ? _messageTemplates.transcript.opened
      : _messageTemplates.transcript.closed;
    await chrome.runtime.sendMessage(m);
  }
  if (isEnglish !== undefined) {
    const m: iMessage = isEnglish
      ? _messageTemplates.language.english
      : _messageTemplates.language.notEnglish;
    await chrome.runtime.sendMessage(m);
  }
};

```

検証：すべて async/await であらゆる完了を待ってから次に進むようにする

なのですべての sendMessage が完了したら次に行くので
sendMessage で送信した先のものがコールバック関数を実行したときに
完了できたよの Promise を返せばいい

background.ts::getWebpageStatus::
`await chrome.tabs.sendMessage(tabId, message, responseHandler);`

contentScript.ts::chrome.runtime.onMessage.addListener::
`await sendStatusToBackground`

contentScript.ts::sendStatusToBackground::
`await chrome.runtime.sendMessage(m)`

background.ts::getWebpageStatus::
`await responseHandler()`

といった順序ですべて await 呼出ならばひとつずつ完了してから次に行くはずなので
sendMessage()での要求が済んでから完了報告がくるまで呼び出し側は停止できる
はずが

できていない

`await responseHandler()`が完了する前に次の処理に進んじゃっている

多分
background.ts::getWebpageStatus::
`await chrome.tabs.sendMessage(tabId, message, responseHandler);`
での await はコールバック関数が帰るのを待たない
というか
コールバック関数を渡さなかったら promise を返すのであって
コールバック関数を渡したら await で読んでも意味ないね...

ここ修正

##### getState で正しい情報が取得できないとき...

次を検証してみて

-   登録時の key と取得時の key が異なるかもしれない

つまり初歩的なミスだよ

この key では chrome.storage.local.get で取得できない

```TypeScript
const key = "__key__";
chrome.storage.local.set({key: "this is stored data"});
chrome.storage.local.get(key, (items) => {
  // 空のオブジェクト
  console.log(items);
});

```

set したときの key/value の key の文字列と
変数の key の値が一致しないから

これは次のようにすると確認できる

```TypeScript
chrome.storage.local.get(null, (items) => {
  console.log(items);
  // {key: {...}}
  // オブジェクトのキーが"key"であって"__key__"ではない
})
```

初歩的なミス

これは次のように変更すればよい

```diff
const key = "__key__";

- chrome.storage.local.set({key: "this is stored data"});
+ chrome.storage.local.set({__key__: "this is stored data"});
chrome.storage.local.get(key, (items) => {
  // 空のオブジェクト
  console.log(items);
});
```

これで取得できる

##### chrome.storage.local.get()は await で呼び出すことができない？

次は大丈夫だけど

```TypeScript
const getLocalStorage = (key: string): Promise<iState> => {
    return new Promise<iState>((resolve, reject) => {
        // chrome.storage.local.get()はPromiseチェーンみたいなもの
        // keyの渡し方はこれでいい
        chrome.storage.local.get(key, (s: iState): void => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve(s);
        });
    });
};

const current: iState = await getLocalStorage(_key);
```

次はダメであるらしい(TypeError)

```TypeScript
const current : iState = await chrome.storage.local.get(_key);
```

おんなじことしていると思うんだけど
どういうわけか
TypeScript としては
`chrome.storage.local.get`の第二引数がない場合、
callback が省略された扱いになり、
\_key が関数でない場合、それは TypeError であるという旨のエラーを出す

つまり
**`chrome.storage.local.get`は await で呼び出しできない**

だから Promise でラップして使うしかない

おかしい。
公式でも callback は optional なのに...

state.getState が storage から何も取得できなかった問題は解決した

#### 11/28

対応内容はあとで書き足すとして

sendMessage の responseCallback が実行されるまで処理を停止するのはなんだかんだうまくいっているようである

##### popup の Loading 中機能

popup は React だけど useEffect のなかで onMessage をしていいのか？
検証してみる

下記は講義中のコード

```TypeScript
  useEffect(() => {
    chrome.runtime.onMessage.addListener(handleMessages)
    return () => {
      // clean up event listener, bug fix from: https://www.udemy.com/course/chrome-extension/learn/#questions/14694484/
      chrome.runtime.onMessage.removeListener(handleMessages)
    }
  }, [isActive])

```

これがうまくいくかやってみる

background の state で、
require をなくす

progress.capturing === true で popup へ loading 中画面にしろと命令して
controller.js を inject 完了したら loading 画面をけせと命令する

```TypeScript

const sendMessagePromise = async (message: iMessage): Promise<void> => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, (response) => {
            if (response.complete) resolve();
            else reject('Send message to extension went something wrong');
        });
    });
};


const startInjectCaptureSubtitleScript = async (): Promise<void> => {
    try {
        console.log('[startInjectCaptureSubtitleScript]');
        await getWebpageStatus();
        const { pageStatus } = await state.getState();
        const tabId: number = await checkTabIsCorrect();
        console.log(tabId);
        if (pageStatus.isEnglish && pageStatus.isTranscriptOn && tabId) {
            console.log('Start injecting script...');

            // update status
            const { progress } = await state.getState();
            await state.setState({
                progress: {
                    ...progress,
                    capturing: true,
                },
            });


            // inject content script
            const result: chrome.scripting.InjectionResult[] =
                await chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['captureSubtitle.js'],
                });
            console.log(result);

            // sendMessage to popup
            await sendMessagePromise({
              from: exntesionsName.background,
              message: orderNames.loading
            })

        } else {
            // いずれかだけがfalseのときに適切なエラーメッセージをpopup上に発せるようにしたい...
            console.log(
                'Change subtitle language English and Turn on transcript. Or You may try to turn on extension invalid web page.'
            );
        }
    } catch (err) {
        if (err === chrome.runtime.lastError) {
            console.error(err.message);
        } else {
            console.log(err);
        }
    }
};


const startInjectControllerScript = async (): Promise<void> => {
    try {
        console.log('[startInjectControllerScript]');
        await getWebpageStatus();
        const { progress } = await state.getState();
        // tabIdはstateに保存しておいた方がいいかも
        const tabId: number = await checkTabIsCorrect();
        console.log(tabId);
        if (
            progress.captured &&
            !progress.capturing &&
            progress.stored &&
            tabId
        ) {
            console.log('Start injecting script...');

            // inject content script
            const result: chrome.scripting.InjectionResult[] =
                await chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['controller.js'],
                });
            console.log(result);


            // sendMessage to popup
            await sendMessagePromise({
              from: exntesionsName.background,
              message: orderNames.loaded
            });

        } else {
            console.error("Error: It's not ready to inject controller.js");
        }
    } catch (err) {
        if (err === chrome.runtime.lastError) {
            console.error(err.message);
        } else {
            console.log(err);
        }
    }
};


```

popup の devtools に background の結果が含まれてしまうのはなぜなのか？
どうも background.js も popup の devtools から追跡できてしまっている模様

#### 11/30

##### TypeScript Basics: Mapped Types

playground/mappedTypes.ts

##### Implementation

Controller.ts::`updateStatus()`の引数の key を排除して
代わりに

```TypeScript


const updateStatus = (key: string, status: string): void => {
    const o = Object.create({});
    o[key] = status;
    state.setState(o);
};


// Possibly Parameter pattern
//
// {positionStatus: "sidebar"},
// {positionStatus: "noSidebar"},
// {viewStatus: "wideView"},
// {viewStatus: "middleView"},

// これだとsetStateの呼び出しがなんだか直感的ではない
// こういうよびだしかただから
// state.setState("sidebar");
//
// なんの"sidebar"なのかはっきりさせたいので
// state.setState({position: "sidebar"});
// というように呼び出したい
const _updateStatus = (status: positionKey | viewKey): void => {

  if(status === Property in positionNames ){
    state.setState({positionStatus: status});
  }
  else if(status === Property in viewNames) {
    state.setState({viewStatus: status});
  }
};


// となるとupdaeStatusの引数は
// iControllerStatusそのままか、そのプロパティになる
const __updateStatus = (stateToSet: iControllerStatus): void => {
  state.setState(stateToSet)
}

// でもこれだとわざわざ関数でラッピングする必要がない

```

参考になるかもしれない...

https://qiita.com/SoraKumo/items/1d593796de973095f101

やっぱりそもそも updateStatus がいらなかった

##### controller.ts へ subtitles データを渡す

つまり sendMessage と onMessage なので
非同期処理を施す必要がある

手順

controller.ts の inject が完了して、controller.ts の初期化が完了した
[非同期] controller.ts から background.ts へ準備完了信号送信
[非同期] background.ts から controller.ts へ subtitles データ送信
上記が完了次第、controller.ts は各 view へ subtitle データを反映

具体的な順序

controller.ts::chrome.runtime.sendMessage()で{script: {controller: "working"}}と送信する

background.ts::onMessage でそれを受信したら state を更新して、
字幕データを sendMessageToTabsPromise()で送信する

controller.ts::onMessage で subtitles データを各 View へ渡して、
state を保存したら、送られてきた sendResponse を実行して
完了とする

```TypeScript
// controller.ts

chrome.runtime.onMessage.addListener(
    async (
        message: iMessage,
        sender,
        sendResponse: (response?: any) => void
    ): Promise<void> => {
        try {
            const { from, to } = message;
            if (to !== extensionNames.controller) return;
            if (message.subtitles && from === extensionNames.background) {
                state.saveSubtitles(message.subtitles);
                //
                // >>> 字幕データを取り込むのはここの時点である <<<
                //
                // 各viewへsubtitleデータを送信する
            }
            if (sendResponse) {
                sendResponse({ complete: true });
            }
        } catch (err) {
            if (err === chrome.runtime.lastError) {
                console.error(err.message);
            } else {
                console.log(err);
            }
        }
    }
);
```

さて View へいよいよ字幕を渡す段階まで来た
いま各 View の Markup は「テキトー」なので
ディテールをつめないといかん

```TypeScript
// sidebarTranscriptView.ts

// 変更前
SidebarTranscriptView.prototype.generateMarkup = function (): string {
  return `
        <div class="${SELECTORS.EX.sidebarWrapper.slice(1)}">
            <section class="${SELECTORS.EX.sidebarSection.slice(1)}">
                <div class="${SELECTORS.EX.sidebarHeader.slice(
                  1
                )}">ExTranscript</div>
                <div class="${SELECTORS.EX.sidebarContent.slice(1)}">
                    <p>
                    </p>
                </div>
                <div class="${SELECTORS.EX.sidebarFooter.slice(
                  1
                )}">Auto Scroll</div>
            </section>
        </div>
    `;
};

// 変更後
SidebarTranscriptView.prototype.generateMarkup = function (subtitles?: string): string {
  const s: string = subtitles ? subtitles: "";
  return `
        <div class="${SELECTORS.EX.sidebarWrapper.slice(1)}">
            <section class="${SELECTORS.EX.sidebarSection.slice(1)}">
                <div class="${SELECTORS.EX.sidebarHeader.slice(
                  1
                )}">ExTranscript</div>
                <div class="${SELECTORS.EX.sidebarContent.slice(1)}">
                  <div class="${SELECTORS.EX.sidebarContentPanel.slice(1)}">
                    ${s}
                  </div>
                </div>
                <div class="${SELECTORS.EX.sidebarFooter.slice(
                  1
                )}">Auto Scroll</div>
            </section>
        </div>
    `;
};


SidebarTranscriptView.prototype.generateSubtitleMarkup = function(subtitles: subtitle_piece[]): string {

  var mu: string = "";
  for(const s: subtitle_piece[] in subtitles) {
    const _mu: string = `
      <div class="${}" data-id="${s.index}">
        <p class="${}">
          <span data-purpose="${}">${s.subtitle}</span>
        </p>
      </div>
    `;
    // concatでいいのかな...
    mu = mu.concat(_mu);
  }
  return mu;
}

// render
//
// 変更点
// - 引数 subtitle を追加
// - subtitles の有無でgenerateMarkupの呼出を条件分岐させる
SidebarTranscriptView.prototype.render = function (
  subtitles?: subtitle_piece[]
): void {
  console.log("[SidebarTranscriptView] render");

  const e: Element = document.querySelector(this.insertParentSelector);
  const p: InsertPosition = this.insertPosition;
  var html: string = "";
  if(subtitles) {
    const s: string = this.generateSubtitleMarkup(subtitles);
    html = this.generateMarkup(s);
  }
  else {
    html = this.generateMarkup();
  }
  e.insertAdjacentHTML(p, html);
};




// constantsInContentScript.ts

export const SELECTORS = {
  // ...
  EX: {
    // ...
    sidebarContentPanel: ".ex--sidebar-content-panel"
  }
}

```

本家

```html
<div class="transcript--transcript-panel">
    <div class="transcript--cue-container--wu3UY">
        <p
            data-purpose="transcript-cue"
            class="transcript--underline-cue--3osdw"
            role="button"
            tabindex="-1"
        >
            <span data-purpose="cue-text" class=""
                >So you see, as we keep scrolling here,</span
            >
        </p>
    </div>
    <!-- 
      Continues...
      -->
</div>
```

なんか Controller.ts の init()が実行されていない...

#### 12/3

controller.ts が subtitle を受け取っているけれど
runtime.lastError がどっかで発生しているみたいで
init()の途中で処理が途切れてしまっている

いっそのこと message passing は sendMessage じゃなくて
port を使ってみよう

port を学習する
exntesion lifecycle を学習する

##### chrome basics: Long-Lived connections

-   runtime.connect
-   tabs.connect

今回は controller から background へ port を開いて
background から subtitles をうけとるまで通信を接続したままにする
そんな状況を実現する

content script から bakcground script へ通信を開くので
chrome.runtime.connect()を使う
background script は content script からの connect を受信するので
chrome.runtime.onConnect.addListener()を使う

`chrome.runtime.connect()`

```TypeScript
// Syntax
chrome.runtime.connect(
  connectInfo?: chrome.runtime.connectInfo
): chrome.runtime.Port

// or

chrome.runtime.connect(
  extensionId: string
  connectInfo?: chrome.runtime.connectInfo
): chrome.runtime.Port


// connectInfo
interface ConnectInfo {
    name?: string | undefined;
    includeTlsChannelId?: boolean | undefined;
}


// Returns
export interface Port {
    postMessage: (message: any) => void;
    disconnect: () => void;
    /**
     * Optional.
     * This property will only be present on ports passed to onConnect/onConnectExternal listeners.
     */
    sender?: MessageSender | undefined;
    /** An object which allows the addition and removal of listeners for a Chrome event. */
    onDisconnect: PortDisconnectEvent;
    /** An object which allows the addition and removal of listeners for a Chrome event. */
    onMessage: PortMessageEvent;
    name: string;
}


```

公式では extensionId も connectInfo も optional だけど
typescript はそれを許さんらしいです
なんでや

-   extensionId: optional

> 接続する拡張機能またはアプリの ID。省略した場合、独自の内線番号で接続が試行されます。 Web メッセージングのために Web ページからメッセージを送信する場合に必要です。

-   Return:

> メッセージを送受信できるポート。拡張機能/アプリが存在しない場合、ポートの onDisconnect イベントが発生します。

```TypeScript
// controller.ts
const port: chrome.runtime.Port = chrome.runtime.connect({name: "controller_require_subtitles"});

port.postMessage({from: extensionNames.controller, to: extensionNames.background, activated: true});
port.postMessage({from: exntesionsNames.controller, to: extensionNames.background, order: "send subtitles data"});
port.onMessage.addListener((msg: iMessage) => {
  const { from, to, subtitles } = msg;
  if(subtitles) {
    state.saveSubtitles(subtitles);
    // Invoke next process...
    port.disconnect()
  }
})

// background.ts
//
// portは引数として取得できるので
// このコールバック関数の中に全て受信における処理を記述する
chrome.runtime.onConnect.addListener((port) => {
  console.asset(port.name === "controller_require_subtitles");
  port.onMessage.addListener((msg) => {
    if(msg.order === "send subtitles data"){
      const s: subtitle_piece[] = await state.loadSubtitles();
      port.postMessage({from: extensionNames.background, to: extensionNames.controller, subtitles: s});
    }
  });
  port.onDisconnect()
})
```

tabs.connect や runtime.connect をよびだすことで`Port`が生成される
Port は`postMessage`でメッセージを送信する

Port が閉じられたのを検知するには

> たとえば、開いているポートごとに個別の状態を維持している場合など、接続がいつ閉じられるかを確認したい場合があります。このために、runtime.Port.onDisconnect イベントをリッスンできます。このイベントは、チャネルの反対側に有効なポートがない場合に発生します。これは、次の状況で発生します。

-   受信側で`runtime.onConnect`のリスナがないとき
-   Port がロードされていないタブを含んでいるとき
-   `connect`が呼び出されたフレームがアンロードされたとき
-   Port を受信したフレームがすべてアンロードされたとき
-   相手側で`runtime.Port.dicconnect`が呼び出されたとき

つまり上記の例では
controller.ts で disconnect しているので
background.ts では runtime.Port.onDisconnect でそれが検知できるはず

`Port.onDisconnect`

> ポートがもう一方の端から切断されたときに発生します。ポートがエラーによって切断された場合、runtime.lastError が設定されることがあります。ポートが`disconnect`によって閉じられている場合、このイベントはもう一方の端でのみ発生します。このイベントは最大で 1 回発生します。

ということで
相手が disconnect で切断したらこちらは onDisconnect でそれを検知できる
相手側で切れるのかこちらで切れるのかは場合に依るので
両側にセットしておくべき

message passing するときに
「どこから送られてきたのか」の情報は
`MessageSender`に含まれる

なので今のところ iMessage では from, to プロパティがあるけれど
これはいらない

```TypeScript
export interface MessageSender {
    /** The ID of the extension or app that opened the connection, if any. */
    id?: string | undefined;
    /** The tabs.Tab which opened the connection, if any. This property will only be present when the connection was opened from a tab (including content scripts), and only if the receiver is an extension, not an app. */
    tab?: chrome.tabs.Tab | undefined;
    /** The name of the native application that opened the connection, if any.
     * @since Chrome 74
     */
    nativeApplication?: string | undefined;
    /**
     * The frame that opened the connection. 0 for top-level frames, positive for child frames. This will only be set when tab is set.
     * @since Chrome 41.
     */
    frameId?: number | undefined;
    /**
     * The URL of the page or frame that opened the connection. If the sender is in an iframe, it will be iframe's URL not the URL of the page which hosts it.
     * @since Chrome 28.
     */
    url?: string | undefined;
    /**
     * The TLS channel ID of the page or frame that opened the connection, if requested by the extension or app, and if available.
     * @since Chrome 32.
     */
    tlsChannelId?: string | undefined;
    /**
     * The origin of the page or frame that opened the connection. It can vary from the url property (e.g., about:blank) or can be opaque (e.g., sandboxed iframes). This is useful for identifying if the origin can be trusted if we can't immediately tell from the URL.
     * @since Chrome 80.
     */
    origin?: string | undefined;
}

```

`chrome.runtime.Port`

```TypeScript
export interface Port {
  // message should be JSON-ifiable
    postMessage: (message: any) => void;
    disconnect: () => void;
    /**
     * Optional.
     * This property will only be present on ports passed to onConnect/onConnectExternal listeners.
     *
     * このプロパティは、onConnect / onConnectExternalリスナーに渡されるポートにのみ存在します。
     */
    sender?: MessageSender | undefined;
    /** An object which allows the addition and removal of listeners for a Chrome event. */
    onDisconnect: PortDisconnectEvent;
    /** An object which allows the addition and removal of listeners for a Chrome event. */
    onMessage: PortMessageEvent;
    name: string;
}

```

-   どこからきたのか？は sender から取得できる(とはいえ大規模な改善になるので後回し)
-   sender は onConnect で取得できる
-   やりとりする情報は any 型なので iMessage を使う
-   controller からつないで、background が受信して、controller が disconnect する
-   おもいもよらない切断は両側で起こりえるので、両側に onDisconnect を設置する

```TypeScript
// Commons
const _port_name_require_subtitles = "_port_name_require_subtitles";

const _postMessage = (p: chrome.runtime.Port, m: iMessage): void => {
  p.postMessage(m);
}

// controller.ts

const port: chrome.runtime.Port = chrome.runtime.connect({name: _port_name_require_subtitles});

// port.postMessage({activated: true});
// port.postMessage({order: "send subtitles data"});
_postMessage(port, {activated: true});
_postMessage(port, {order: "send-subtitles"});
port.onMessage.addListener((msg: iMessage) => {
  // 取得できるのか？
  console.log(port.sender);
  const { from, to, subtitles } = msg;
  if(subtitles) {
    state.saveSubtitles(subtitles);
    // Invoke next process...
    port.disconnect(() => {
      console.log("[controller] port disconnected manually");
    })
  }
});
port.onDisconnect((p: chrome.runtime.Port) => {
  console.log("[controller] Port has been disconnected accidentally");
  console.log(p);
})


// background.ts
//
// portは引数として取得できるので
// このコールバック関数の中に全て受信における処理を記述する
chrome.runtime.onConnect.addListener((port) => {
  console.asset(port.name === "controller_require_subtitles");
  port.onMessage.addListener((msg) => {
    if(msg.order === "send subtitles data"){
      const s: subtitle_piece[] = await state.loadSubtitles();
      // port.postMessage({from: extensionNames.background, to: extensionNames.controller, subtitles: s});
      _postMessage(port, {from: extensionNames.background, to: extensionNames.controller, subtitles: s})
    }
  });
  port.onDisconnect((port: chrome.runtime.Port) => {
    console.log("[background] Port has been disconnected");
    console.log(p);
  });
})
```

#### 12/4

##### bottomTranscriptView.ts も字幕データを表示させる

同じことをするだけ

```html
<div class="transcript--cue-container--wu3UY">
    <p
        data-purpose="transcript-cue"
        class="transcript--underline-cue--3osdw"
        role="button"
        tabindex="-1"
    >
        <span data-purpose="cue-text" class="">
            In this video, we're going to start to refactor our code and have
            sorter serve as a parent class two
        </span>
    </p>
</div>
```

```JavaScript

BottomTranscriptView.prototype.generateSubtitleMarkup = function(subtitles: subtitle_piece[]): string {

    var mu: string = "";
    for(const s of subtitles) {
      const _mu: string = `
        <div class="ex--dashboard-transcript--cue-container" data-id="${s.id}">
            <p data-purpose="ex-transcript-cue" class="ex--dashboard-transcript--cue--underline">
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
  }
```

css はつくっていないよ！

ついに整形字幕を表示させるところまできた...

お次は本家自動スクロール機能との連動である

#### 本家自動スクロール追跡機能

```TypeScript
/*
    字幕要素群の中から、引数の要素が何番目にあるのかを探してその順番を返す
*/
const getElementIndexOfList = (
  from: NodeListOf<Element>,
  lookFor: Element
): number => {
  var num: number = 0;
  for (const el of Array.from(from)) {
    if (el === lookFor) return num;
    num++;
  }
  // 一致するものがなかった場合
  return -1;
};

/*
    Detect Auto Scroll

    本家自動スクロール機能で現在ハイライトされている字幕が「どれ」かを探して
    ExTranscriptのハイライト要素を更新する

*/
const setDetectScroll = (): void => {
  const _callback = (mr: MutationRecord[]): void => {
    const latestHighlight = document.querySelector(SELECTORS.highlight);
    var latestIndex: number;

    // Update
    const list: NodeListOf<HTMLSpanElement> = document.querySelectorAll(
      SELECTORS.transcripts
    );
    latestIndex = getElementIndexOfList(list, latestHighlight);
    state.setCurrentHighlight(latestIndex);
    console.log("OBSERVED");
    // TODO: update highlighting Extranscript
  };

  const observer = new MutationObserver(_callback);

  const config = { attributes: true, childList: false, subtree: false };

  const transcripts: NodeListOf<Element> = document.querySelectorAll(
    SELECTORS.transcripts
  );
  transcripts.forEach((ts) => {
    observer.observe(ts, config);
  });
};

```

必要なもの

Transcript のハイライト要素の順番
ExTrasncript のハイライト要素と順番

必要な機能

ハイライトは className の追加で

```TypeScript

interface iControllerState {
  // About window status
  setState: (o: iControllerStatus) => void;
  getState: () => iControllerStatus;
  // About subtitle data
  saveSubtitles: (s: subtitle_piece[]) => void;
  loadSubtitles: () => subtitle_piece[];
  // About original Transcript auto scroll data
  setCurrentHighlight: (index: number) => void;
  getCurrentHighlight: () => number;
  // About ExTranscript auto scroll data
  setExCurrentHighlight: (index: number) => void;
  getExCurrentHighlight: () => number;
}

const state: iControllerState = (() => {
  var _state: iControllerStatus = {};
  var _subtitles: subtitle_piece[] = [];
  var _highlight: number = null;]
  var _ExHighlight: number = null;

  return {
    setState: (o: iControllerStatus) => {
      _state = {
        ..._state,
        ...o,
      };
    },
    getState: (): iControllerStatus => {
      return _state;
    },
    // 常に古いものを消し、新しいものだけを保存する
    saveSubtitles: (s: subtitle_piece[]): void => {
      _subtitles.splice(0);
      _subtitles.push(...s);
    },
    //
    loadSubtitles: (): subtitle_piece[] => {
      return _subtitles;
    },
    setCurrentHighlight: (index: number) => {
        _highlight = index;
    },
    getCurrentHighlight: () => {
        return _highlight;
    },
    setExCurrentHighlight: (index: number) => {
        _highlight = index;
    },
    getExCurrentHighlight: () => {
        return _highlight;
    }
  };
})();


/*
    字幕要素群の中から、引数の要素が何番目にあるのかを探してその順番を返す
*/
const getElementIndexOfList = (
  from: NodeListOf<Element>,
  lookFor: Element
): number => {
  var num: number = 0;
  for (const el of Array.from(from)) {
    if (el === lookFor) return num;
    num++;
  }
  // 一致するものがなかった場合
  return -1;
};

/*
    Detect Auto Scroll

    本家自動スクロール機能で現在ハイライトされている字幕が「どれ」かを探して
    ExTranscriptのハイライト要素を更新する

*/
const detectTranscriptScroll = (): void => {
  const _callback = (mr: MutationRecord[]): void => {
    const latestHighlight = document.querySelector(SELECTORS.highlight);
    var latestIndex: number;

    // Update
    const list: NodeListOf<HTMLSpanElement> = document.querySelectorAll(
      SELECTORS.transcripts
    );
    latestIndex = getElementIndexOfList(list, latestHighlight);
    state.setCurrentHighlight(latestIndex);
    console.log("OBSERVED");
    // update highlighting Extranscript
    updateExTranscriptScroll()
  };

  const observer = new MutationObserver(_callback);

  const config = { attributes: true, childList: false, subtree: false };

  const transcripts: NodeListOf<Element> = document.querySelectorAll(
    SELECTORS.transcripts
  );
  transcripts.forEach((ts) => {
    observer.observe(ts, config);
  });
};


const updateExTranscriptScroll = (): void => {
  const latestNumber: number = state.getCurrentHighlight();
  // ExTranscriptの字幕要素には`[data-id="1"]`みたいにデータ属性とかを付与しているので
  // セレクタ + データ属性の番号で要素を呼び出すことができる
  const next: HTMLElement = document.querySelector<HTMLElement>(
    // >>> TODO: SPECIFY CLASS NAME AND DATA-ID <<<
  );
  if(!next) return;

  // 前回のハイライトを元に戻して
  const previousNumber: number = getExTranscriptHighlight();
  const previous: HTMLElement = document.querySelector<HTMLElement>(
    // >>> TODO: SPECIFY CLASS NAME AND DATA-ID <<<
  );
  previous.className.remove("highlight");
  // 次のハイライトをセットする
  next.className.add("highlight");
  state.setExTranscriptHighlight(latestNumber);

  // これでハイライトはＯＫだけど
  // 自動スクロール機能をどうやって作るか...
  //
  // className.includes("highlight")を自動で検知して
  // スクロールさせるようにしたい... MutationObserverかなぁ


}

// ハイライトするclassNameはdiv.ex--dashboard-transcript--cue-container
// につける
BottomTranscriptView.prototype.generateSubtitleMarkup = function (
  subtitles: subtitle_piece[]
): string {
  var mu: string = "";
  for (const s of subtitles) {
    const _mu: string = `
        <div class="ex--dashboard-transcript--cue-container" data-id="${s.index}">
            <p data-purpose="ex-transcript-cue" class="ex--dashboard-transcript--cue--underline">
                <span data-purpose="ex--dashboard-cue-text">
                    ${s.subtitle}
                </span>
            </p>
        </div>
    `;
    // concatでいいのかな...
    mu = mu.concat(_mu);
  }
  console.log(mu);
  return mu;
};

```

Element.scrollTo を使う

#### 12/5

現状のコードだと
state.getCurrentHiglight()から取得する番号で
ExTranscript の要素を探そうとすると
エラーになる

理由は本家の字幕番号と ExTranscript の字幕番号は一致しない場合があるから
その一致しない場合の対処が抜けている

それを直す

```TypeScript

const initializeDetecting = (): void => {
    const currentHighlight = document.querySelector(SELECTORS.highlight);
    var currentIndex: number;

    const list: NodeListOf<HTMLSpanElement> = document.querySelectorAll(
        SELECTORS.transcripts
    );
    currentIndex = getElementIndexOfList(list, currentHighlight);
    state.setCurrentHighlight(currentIndex);
    state.setExCurrentHighlight(currentIndex);

    updateExTranscriptScroll();
}

/*
    Detect Auto Scroll

    本家自動スクロール機能で現在ハイライトされている字幕が「どれ」かを探して保存する
    これをclass化したいな...
*/
const detectScroll = (): void => {
    const _callback = (): void => {
        const latestHighlight = document.querySelector(SELECTORS.highlight);
        var latestIndex: number;

        // Update
        const list: NodeListOf<HTMLSpanElement> = document.querySelectorAll(
            SELECTORS.transcripts
        );
        latestIndex = getElementIndexOfList(list, latestHighlight);
        state.setCurrentHighlight(latestIndex);
        // update highlighting Extranscript
        updateExTranscriptScroll()
    };

    const observer = new MutationObserver(_callback);

    // configuration of the observer:
    const config = { attributes: true, childList: false, subtree: false };

    //   target: span
    const transcripts: NodeListOf<Element> = document.querySelectorAll(
        SELECTORS.transcripts
    );
    transcripts.forEach((ts) => {
        observer.observe(ts, config);
    });
};



/*
'.ex--dashboard-transcript--cue-container[data-id="1"]'
*/
const updateExTranscriptScroll = (): void => {
  const latestNumber: number = state.getCurrentHighlight();
  // ExTranscriptの字幕要素には`[data-id="1"]`みたいにデータ属性とかを付与しているので
  // セレクタ + データ属性の番号で要素を呼び出すことができる
  const next: HTMLElement = document.querySelector<HTMLElement>(
    `${SELECTORS.EX.dashboardTranscriptCueContainer}[data-id="${latestNumber}"]`
  );
  if(!next) return;

  // 前回のハイライトを元に戻して
  const previousNumber: number = state.getExCurrentHighlight();
  const previous: HTMLElement = document.querySelector<HTMLElement>(
    `${SELECTORS.EX.dashboardTranscriptCueContainer}[data-id="${previousNumber}"]`
  );
  previous.classList.remove(SELECTORS.EX.highlight);
  // 次のハイライトをセットする
  next.classList.add(SELECTORS.EX.highlight);
  state.setExCurrentHighlight(latestNumber);

  // これでハイライトはＯＫだけど
  // 自動スクロール機能をどうやって作るか...
  //
  // className.includes("highlight")を自動で検知して
  // スクロールさせるようにしたい... MutationObserverかなぁ
}

(async (): Promise<void> => {
    try {
        console.log('[controller] Initializing...');

        // ...中略

        // 初期化
        initializeDetecting();
        // リスナ
        detectScroll();
    } catch (err) {
        if (err === chrome.runtime.lastError) {
            console.error(err.message);
        } else {
            console.log(err);
        }
    }
})();

```

修正後

```TypeScript

// ----- DETECT AUTO SCROLL METHODS -----------------------------

/*
    字幕要素群の中から、引数の要素が何番目にあるのかを探してその順番を返す
*/
const getElementIndexOfList = (
    from: NodeListOf<Element>,
    lookFor: Element
): number => {
    var num: number = 0;
    for (const el of Array.from(from)) {
        if (el === lookFor) return num;
        num++;
    }
    // 一致するものがなかった場合
    return -1;
};

/*
    updateHighlistIndexes()
    ____________________________

    state._ExHighlightを更新するための関数
    本家のTranscriptのハイライト要素を取得して
    それを基にExTranscriptのハイライトする要素の番号を更新する

    updaeExTranscriptHighlight()を呼び出す前に必ず呼び出すこと


    まずcurrentHighlightが取得できていない
    理由はこのセレクターだと
    動画が再生する前の状態の時(再生画面が動画の真ん中に表示されている状態)はこのセレクタはどの要素にも追加されていないからである
*/
const updateHighlightIndexes = (): void => {
    // １．本家のハイライト要素を取得して、その要素群の中での「順番」を保存する
    const currentHighlight = document.querySelector(SELECTORS.highlight);
    var currentIndex: number;

    const list: NodeListOf<HTMLSpanElement> = document.querySelectorAll(
        SELECTORS.transcripts
    );
    currentIndex = getElementIndexOfList(list, currentHighlight);
    state.setCurrentHighlight(currentIndex);

    // 2. 1で取得した「順番」がstate._subtitlesのindexと一致するか比較して、
    // ExTranscriptのハイライト要素の番号を保存する
    const indexes: number[] = state.getIndexList();
    if (indexes.includes(currentIndex)) {
        state.setExCurrentHighlight(currentIndex);
    } else {
        // 一致するindexがない場合
        // currentHighlightの番号に最も近い、currentHighlightより小さいindexをsetする
        var prev: number = null;
        for (let i of indexes) {
            if (i > currentIndex) {
                state.setExCurrentHighlight(prev);
                break;
            }
            prev = i;
        }
    }
};

/*

    updaeExTranscriptHighlight()
    ________________________________________

    ExTranscriptの字幕要素のハイライトを更新する
    前回のハイライト要素のハイライトを消し
    次のハイライト要素にハイライトを付ける

    どれをハイライトさせるかは`state._ExHighlight`に依存する

    期待するcss selector:
    '.ex--dashboard-transcript--cue-container[data-id="1"]'

    前回のハイライト要素のclassName "highlight" をremoveするので
    前回のハイライト要素の取得が必要になる
*/
const updateExTranscriptHighlight = (): void => {
    // 今回の更新でハイライトする要素のdata-idの番号
    const nextIndex: number = state.getExCurrentHighlight();
    const next: HTMLElement = document.querySelector(
        `${SELECTORS.EX.dashboardTranscriptCueContainer}[data-id="${nextIndex}"]`
    );

    // 現在のハイライト要素のdata-idはDOMから取得する
    const current: HTMLElement = document.querySelector<HTMLElement>(
        `${SELECTORS.EX.dashboardTranscriptCueContainer}${SELECTORS.EX.highlight}`
    );
    const currentIndex: number = parseInt(current.getAttribute('data-id'));

    // もしも変わらないなら何もしない
    if (currentIndex === nextIndex) return;
    // 初期化nならば
    if (!currentIndex) {
        // nextIndexのindexの要素をハイライトさせる
        next.classList.add(SELECTORS.EX.highlight);
    }
    // 更新ならば、前回のハイライト要素を解除して次の要素をハイライトさせる
    else {
        current.classList.remove(SELECTORS.EX.highlight);
        next.classList.add(SELECTORS.EX.highlight);
    }
};

/*
    initializeDetecting()
    ____________________________

    controller.jsがロードされたときに実行される初期化関数
    必ずdetectScroll()を呼び出す前に呼び出すこと

*/
const initializeDetecting = (): void => {
    console.log('[controller] Initialize Detecting...');
    updateHighlightIndexes();
    updateExTranscriptHighlight();
};

/*
    detectScroll()
    ______________________________________

    本家のハイライトされている字幕が、
    自動スクロール機能で移り変わるたびに反応するオブザーバを生成する

*/
const detectScroll = (): void => {
    const _callback = (mr: MutationRecord[]): void => {
        console.log('observed');
        updateHighlightIndexes();
        updateExTranscriptHighlight();
    };

    const observer: MutationObserver = new MutationObserver(_callback);

    const config: MutationObserverInit = {
        attributes: true,
        childList: false,
        subtree: false,
    };

    //   NodeListOf HTMLSpanElement
    const transcriptList: NodeListOf<Element> = document.querySelectorAll(
        SELECTORS.transcripts
    );
    transcriptList.forEach((ts) => {
        observer.observe(ts, config);
    });
};

/*
    MAIN PROCESS
    ___________________________

*/
(async (): Promise<void> => {
    try {
        console.log('[controller] Initializing...');
        //
        // transcript viewを挿入する
        // transcript viewにはLoading画面を表示させる
        // backgroundとのportを開く
        // 字幕データを取得する
        // 字幕データを保存する
        // 字幕データをtranscript viewへ渡して再レンダリングする
        // transcript viewはLoadingを中止して、字幕を表示する
        //
        // そのために
        //
        // 各transcript insert関数は字幕なしありの両方を実現できるようにする
        //
        // await sendMessagePromise({
        //   from: extensionNames.controller,
        //   to: extensionNames.background,
        //   activated: true,
        // });
        // const temporary = state.loadSubtitles();
        // console.log(temporary);
        const w: number = document.documentElement.clientWidth;
        const s: keyof_positionStatus =
            w > RESIZE_BOUNDARY
                ? positionStatusNames.sidebar
                : positionStatusNames.noSidebar;
        state.setState({ position: s });
        if (s === positionStatusNames.sidebar) {
            insertSidebarTranscript();
            sidebarTranscriptView.updateContentHeight();
            if (w > SIDEBAR_WIDTH_BOUNDARY) {
                state.setState({ view: viewStatusNames.wideView });
                sidebarTranscriptView.updateWidth(SIGNAL.widthStatus.wideview);
            } else {
                state.setState({ view: viewStatusNames.middleView });
                sidebarTranscriptView.updateWidth(
                    SIGNAL.widthStatus.middleview
                );
            }
        } else {
            insertBottomTranscript();
        }

        window.addEventListener('resize', function () {
            clearTimeout(timerQueue);
            timerQueue = setTimeout(onWindowResizeHandler, RESIZE_TIMER);
        });

        // --- ここまでで初期化前半完了 ---
        //
        // ここからPortを呼出、subtitlesデータを取得する
        const porter = new Porter(port_names._requring_subtitles);
        porter.onMessageListener((m) => {
            console.log('[controller] Port onMessage...');
            console.log(porter.port.sender);
            const { subtitles } = m;
            if (subtitles) {
                state.saveSubtitles(subtitles);
                // Rerender
                if (state.getState().position === positionStatusNames.sidebar) {
                    sidebarTranscriptView.clear();
                    sidebarTranscriptView.render(subtitles);
                } else {
                    bottomTranscriptView.clear();
                    bottomTranscriptView.render(subtitles);
                }
                porter.port.disconnect();
                console.log('[controller] port disconnected manually');

                // Autor Scroll 機能を呼出す
                // 初期化
                initializeDetecting();
                // リスナ
                detectScroll();
            }
        });
        porter.onDisconnect((p) => {
            console.log('[controller] Port has been disconnected accidentally');
            console.log(p);
        });
        porter.postMessage({
            from: extensionNames.controller,
            to: extensionNames.background,
            order: orderNames.sendSubtitles,
        });
    } catch (err) {
        if (err === chrome.runtime.lastError) {
            console.error(err.message);
        } else {
            console.log(err);
        }
    }
})();

```

#### 12/7

FIXED:

-   initializeDetecting()はなくした
    detectScroll()だけ実行すればあとは勝手にやってくれるようにした
    ただし detectScroll()の MutationObserver が毎回呼び出す関数は
    初期化のタイミングだけ条件分岐させるようにした

次の問題:

MutationObserver が期待したとき以外に呼び出されていた

期待したとき：ハイライト要素が切り替わって次のようにハイライトの className が追加されたとき

余計な時：ハイライト要素の classList からハイライトの className が消えたとき、
Udemy がバグって余計に同じ字幕を何個も生成しているせいで何個も同じ要素が存在していてそれぞれに MutationObserver が反応してしまっている

MutationRecord[]は classList にハイライトの className を付けたときと除去したとき両方同時に記録してコールバックを呼び出している
さらに同じ要素があるぶんその分も含むから
「className をつけるとき」に処理をおこなったら同じ MutationRecord[]での次の処理はしないようにする

FIXED:

```TypeScript
// 修正前

const detectScroll = (): void => {
  const _callback = (mr: MutationRecord[]): void => {
    console.log("observed");
    updateHighlightIndexes();
    updateExTranscriptHighlight();
  };

  const observer: MutationObserver = new MutationObserver(_callback);

  const config: MutationObserverInit = {
    attributes: true,
    childList: false,
    subtree: false,
  };

  //   NodeListOf HTMLSpanElement
  const transcriptList: NodeListOf<Element> = document.querySelectorAll(
    SELECTORS.transcripts
  );
  transcriptList.forEach((ts) => {
    observer.observe(ts, config);
  });
};

// 修正後

const detectScroll = (): void => {
    const _callback = (mr: MutationRecord[]): void => {
        console.log(mr);
        var isItDone: boolean = false;
        mr.forEach((record: MutationRecord) => {
            if (
                record.type === 'attributes' &&
                record.attributeName === 'class' &&
                record.oldValue === '' &&
                !isItDone
            ) {
                // oldValueには""の時と、"ranscript--highlight-cue--1bEgq"の両方の時がある
                // "ranscript--highlight-cue--1bEgq"をoldValueで受け取るときは
                // ハイライトのclassをその要素からremoveしたときと考えて
                // その時は何もしない
                console.log('observed');
                // 処理は1度だけになるように
                isItDone = true;
                updateHighlightIndexes();
                updateExTranscriptHighlight();
            }
        });
    };

    const observer: MutationObserver = new MutationObserver(_callback);

    const config: MutationObserverInit = {
        attributes: true,
        childList: false,
        subtree: false,
        attributeOldValue: true,
    };

    //   NodeListOf HTMLSpanElement
    const transcriptList: NodeListOf<Element> = document.querySelectorAll(
        SELECTORS.transcripts
    );
    transcriptList.forEach((ts) => {
        observer.observe(ts, config);
    });
};

```

次は自動スクロール機能を実装し始める
また、
Observer パターンを身につけたい

#### 12/8

Observer Pattern の学習:

"./palyground/observer-pattern.html, observer-pattern.js"

状態の変化を自動的に取得して勝手に更新してくれる仕組みの導入検討：

-   Observer Pattern:
    オブジェクトに興味のあるオブザーバが直接オブジェクトにコールバックを登録する

-   Pub/Sub:
    では両者の間に立つトピック・イベントチャンネルが存在し
    Pub と Sub はお互いを知らずともお互いのメソッドを使うことが出きる(疎結合)
    またアプリケーション固有のイベントを登録できる

Pub/Sub がいいのかな
アプリケーション特有のイベントを登録できるってのがいいね

参考：

https://css-tricks.com/build-a-state-management-system-with-vanilla-javascript/

https://codeburst.io/observer-pattern-how-can-it-be-used-to-build-a-simple-web-app-651d92d942f5

##### controller.ts に Pub/Sub を導入してみる

```TypeScript

var pubsub = {};

(function (myObject) {
    var topics = {};
    var subUid = -1;

    // Publish
    myObject.publish = function (topic, args) {
        if (!topics[topic]) return false;

        var subscribers = topics[topic];
        var len = subscribers ? subscribers.length : 0;

        while (len--) {
            subscribers[len].func(topic, args);
        }

        return this;
    };

    // Subscribe
    myObject.subscribe = function (topic, func) {
        if (!topics[topic]) {
            topics[topic] = [];
        }

        var token = (++subUid).toString();
        topics[topic].push({
            token: token,
            func: func,
        });
        return token;
    };

    myObject.unsubscribe = function (token) {
        for (var m in topics) {
            if (topics[m]) {
                for (var i = 0, j = topics[m].length; i < j; i++) {
                    if (topics[m][i].token === token) {
                        topics[m].splice(i, 1);
                        return token;
                    }
                }
            }
        }
        return this;
    };
})(pubsub);




```
