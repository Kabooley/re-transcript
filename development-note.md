# Applying Architecture

MVC と DDD の設計思想を取り入れたい

でも参考とする書籍は一切に読んでいない

それでは実現できないので自分なりに「綺麗」にする

## 目次

[確認できる問題走り書き](#確認できる問題走り書き)
[デイリータスク](#デイリータスク)
[課題](#課題)
[仕様について](#仕様について)
[成果記録](#成果記録)
[1/25:処理についておさらい](#1/25:処理についておさらい)
[chrome-extension-API](#chrome-extension-API)
[TEST](#TEST)

## 確認できる問題走り書き

## 課題

更新は豆に！

-   [webpack 出力をファイルごとにする](#webpack出力をファイルごとにする)

-   [不具合：udemy のページ遷移で原因不明のエラーが出る件](#不具合：udemyのページ遷移で原因不明のエラーが出る件)
-   [不具合記録](#不具合記録)

-   [refactoring](#refactoring)
    TODO: `undefined`の評価部分の修正

-   [chrome ストアで表示するまで](#chromeストアで表示するまで)

-   `getComputedStyle`のエラー対処
    後回しでいい

-   [ExTranscript のハイライト位置の修正](#ExTranscriptのハイライト位置の修正)
    もうちょい下にする

-   [responsive](#responsive)
    transcriotView のレスポンシブデザインを JavaScritp の計算から
    CSS の力で自力でサイズ変更できるように変更する

-   [エラーハンドリング](#エラーハンドリング)
    進捗：`alertHandler()`を background.ts の各要所で呼び出すことにした
    今のところ、すべての例外発生時はアラートを出してリロードか再起動をユーザに促している
    とくに原因別にメッセージを変更はしない

-   デザイン改善: 見た目の話
    [デザイン改善:popup](#デザイン改善:popup)
    いい加減 ExTranscript の background-color を red にしない

-   loading 中を ExTranscript へ表示させる
    [ローディング中 view の実装](#ローディング中viewの実装)

-   [時間をおいてから Udemy 講義ぺーいに戻るとリロードするけど、popup のボタンが turnoff のままな件](#時間をおいてからUdemy講義ぺーいに戻るとリロードするけど、popupのボタンがturnoffのままな件)

-   どのタブ ID でどの window なのかは区別しないといかんかも
    たとえば複数タブで展開するときに、おそらく今のままだと
    一つのタブの情報しか扱えない
    なので複数のタブで拡張機能を展開したときに先に展開開始した情報を
    両方のたぶに展開することになるかも
    [修正：window-id と tabId からなる ID で state を区別する](#修正：window-idとtabIdからなるIDでstateを区別する)
    [chrome-extension-API:Window](#chrome-extension-API:Window)

    もしくはタブ情報を「持たない」とか？
    もしくはそれがでふぉということで、1 ページにしか使えないという仕様にする

後回しでもいいかも:

-   controller.ts の onwWindowResizeHandler をもうちょっとサクサク動かしたい
-   [また問題が起こったら対処] [Google 翻訳と連携させるとおこる不具合対処](#Google翻訳と連携させるとおこる不具合対処)
-   [async 関数は暗黙に Promise を返すから return_new_Promise しなくていい](#async関数は暗黙にPromiseを返すからreturn_new_Promiseしなくていい)

つまりコードリーディングてきな改善としての refactoring

-   [また問題が起こったら対処] 自動スクロール機能で重複する字幕要素を完全に処理しきれていない模様...
    つまりたぶんだけど、重複しているほうの要素に css の class をつけてしまっていて、
    だけれども remove はできていない
    という可能性...
    [自動スクロール機能修正：ハイライト重複](#自動スクロール機能修正：ハイライト重複)
-   [また問題が起こったら対処] 複数 window を開いていると、あとから複製した window の id を取得してしまう問題
    [複数 window だとあとから複製した window.id を取得してしまう問題](#複数windowだとあとから複製したwindow.idを取得してしまう問題)

他:

-   chrome extension はブラウザが閉じたらどうなるのか
    [ブラウザが閉じたらどうなるのか](#ブラウザが閉じたらどうなるのか)

済：

-   [済] [ExTranscript の閉じるボタンの実装](#ExTranscriptの閉じるボタンの実装)
-   [済] [検討：自動スクロールの footer は本家をそのまま表示する](#検討：自動スクロールのfooterは本家をそのまま表示する)
-   [済][sass の webpack への導入](#SASS の webpack への導入)
-   [済]拡張機能を展開していたタブが閉じられたときの後始末
-   [済][`settimeout`, `setinterval`を background script で使うな](#`setTimeout`, `setInterval`を background script で使うな)
    専用の API が用意されているのでそちらに切り替えること
    https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/#alarms

-   [済][google翻訳を実行したあとに拡張機能offからのonにすると英語字幕は最早取得できない件](#Google 翻訳を実行したあとに拡張機能 OFF からの ON にすると英語字幕は最早取得できない件)
-   [済] [実装：拡張機能 OFF](#実装：拡張機能OFF)
-   [済] [展開中にリロードしたときの挙動の実装](#展開中にリロードしたときの挙動の実装)
-   [済] [展開中のタブが別の URL へ移動したときの対応](#展開中のタブが別のURLへ移動したときの対応)
-   [済] [実装：拡張機能 OFF](#実装：拡張機能OFF)
-   [済] sidebar の時の自動スクロール機能関数`controller.ts::scrollToHighlight()`が機能するようにすること
-   [済] background.ts はいったんアンロードされると state に渡した変数がすべて消えることへの対処
-   [済] Refac: background script で `chrome.tabs.updated.addListener`に filter を設けることで余計な url はデフォで無視する仕様にする
    参考：https://developer.chrome.com/docs/extensions/reference/events/#filtered

-   [済] `chrome.tabs.onUpdated.addListener()`のスリム化
    　 filter は使えないことは TypeScript の型から確認済
    よけいなローディングに反応しないようにしたい
    [`chrome.tabs.onUpdated.addListener()`のスリム化](<#`chrome.tabs.onUpdated.addListener()`のスリム化>)

-   [済] Udemy の講義ページで、動画じゃないページへアクセスしたときの対応
    たとえばテキストだけ表示される回があるけど、それの対 [テキストページへの対処](#テキストページへの対処)

-   [済] message passing で受信側が非同期関数を実行するとき完了を待たずに port が閉じられてしまう問題
    [onMessage で非同期関数の完了を待たずに接続が切れる問題](#onMessageで非同期関数の完了を待たずに接続が切れる問題)

実装しない機能：

-   Autro Scroll ON/OFF ボタンとその機能

## 仕様について

## 成果記録

記事にしていない成果:

-   chrome.tabs.onUpdated.addListener には filter が付けられない

-   普遍的な知見

[All_about_JavaScript エラーハンドリング](#All_about_JavaScriptエラーハンドリング)
[Return-false-vs.-throw-exception](#Return-false-vs.-throw-exception)

### All_about_JavaScript エラーハンドリング

[try...catch](#try...catch)
[promise](#promise)
[](#)
[](#)

https://ja.javascript.info/try-catch

https://ja.javascript.info/custom-errors

https://ja.javascript.info/promise-error-handling

try...catch 構造:

-   エラーが起こったら残りの*try 内のコードは無視されて*catch ブロックが実行される

で、とくに catch ブロックで何もしなければ関数の外側が実行される

-   try...catch は同期的に動作する

try 内で setTiemout を置いておいて、setTimeout のなかでエラーが発生しても
catch は同期呼出なのでキャッチされない

-   catch するのはエラーオブジェクト

```JavaScript
{
  name: // 未定義変数の場合"RefferenceError"
  message: // エラーに関する詳細
  stack: // コールスタック
}
```

tyr...catch の利用方法：

-   スローエラーは一番近い catch が捕まえる

つまり次の状況では...

```JavaScript

function c () {
  throw new Error("Will this error caught?");
}

function b() {
  c();
}

function a() {
  try {
    b();
  }
  catch(e) {

  }
}

a();
// output: `Error caught Error: Will this error caught? `
```

b()で catch しなかったら a()でキャッチしないでグローバルな例外処理に移る...

ということはなく

一番近い catcht が捕まえてくれる

なので呼出が深いところで例外がスローされたら、

例外を次の呼び出し元、次の呼び出し元...とバケツリレーしなくていい

捕まえたいところで try...catch を定義すればいい

-   `throw`演算子でエラーオブジェクトを生成しよう

エラーオブジェクトには種類がある！
エラーオブジェクトの`name`は各オブジェクトにちなんだ名前になる

```JavaScript
// error.name === 'Error'
let error = new Error(message);
// or
// error.name === 'SyntaxError'
let error = new SyntaxError(message);
// error.name === 'ReferenceError'
let error = new ReferenceError(message);
// ...
```

名前を付加できるのでエラーの分類がしやすくなる

-   再スロー

**キャッチはそれが知っているエラーだけを処理し、すべてのオブジェクトを “再スロー” するべきです**

1. すべてのエラーをキャッチします。
2. catch(err) {...} ブロックで、エラーオブジェクト err を解析します。
3. どう処理すればいいか分からなければ、throw err をします。

```JavaScript

let json = '{ "age": 30 }'; // 不完全なデータ
try {

  let user = JSON.parse(json);

  if (!user.name) {
    throw new SyntaxError("Incomplete data: no name");
  }

  blabla(); // 予期しないエラー

  alert( user.name );

} catch(e) {

  // エラーを選別して再スローしている
  if (e.name == "SyntaxError") {
    alert( "JSON Error: " + e.message );
  } else {
    // それ以外のエラーをスローする
    throw e; // 再スロー (*)
  }

}
```

finally :

`finally`は try で何も起こらなくても、catch が実行されることになっても
必ず実行される

現在の開発でいえば、
chrome extension では sendResponse するときに都合がいいかも

-   `finally`と`return`

`return`が`try`のなかにあったら`finally`はどうなるのか？

**`finally`は制御が外部に戻る前に実行される**

カスタムエラー、Error の拡張

-   継承でエラーオブジェクトをカスタマイズして分類しやすくする

```JavaScript

// JavaScript自体で定義された組み込みのErrorクラスの「擬似コード」
class Error {
  constructor(message) {
    this.message = message;
    this.name = "Error"; // (組み込みのエラークラスごとに異なる名前)
    // this.stack = <nested calls>; // non-standard, but most environments support it
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

// Usage
function readUser(json) {
  let user = JSON.parse(json);

  if (!user.age) {
    throw new ValidationError("No field: age");
  }
  if (!user.name) {
    throw new ValidationError("No field: name");
  }

  return user;
}

// try..catch での動作例

try {
  let user = readUser('{ "age": 25 }');
} catch (err) {
  if (err instanceof ValidationError) {
    alert("Invalid data: " + err.message); // Invalid data: No field: name
  } else if (err instanceof SyntaxError) { // (*)
    alert("JSON Syntax Error: " + err.message);
  } else {
    throw err; // 知らないエラーなので、再スロー
  }
}
```

> instanceof の方がよりベターです。
> なぜなら、将来 ValidationError を拡張し、PropertyRequiredError のようなサブタイプを作るからです。
> そして instanceof チェックは新しい継承したクラスでもうまく機能し続けます。それは将来を保証します。

-   さらなる継承

```JavaScript

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

class PropertyRequiredError extends ValidationError {
  constructor(property) {
    super("No property: " + property);
    this.name = "PropertyRequiredError";
    this.property = property;
  }
}

// 使用法
function readUser(json) {
  let user = JSON.parse(json);

  if (!user.age) {
    throw new PropertyRequiredError("age");
  }
  if (!user.name) {
    throw new PropertyRequiredError("name");
  }

  return user;
}

// try..catch での動作例

try {
  let user = readUser('{ "age": 25 }');
} catch (err) {
  if (err instanceof ValidationError) {
    alert("Invalid data: " + err.message); // Invalid data: No property: name
    alert(err.name); // PropertyRequiredError
    alert(err.property); // name
  } else if (err instanceof SyntaxError) {
    alert("JSON Syntax Error: " + err.message);
  } else {
    throw err; // 知らないエラーなので、それを再スロー
  }
}
```

例外のラッピング：

たとえばいまユーザ情報をよみとってバリデートする関数があるとして
バリデートで問題が発見されたらエラーを投げるようにしているけれど
今後読み取るユーザ情報が拡張されるかもしれない
たとえば出身国とか追加されるかも

そうなったときに
バリデート関数はすべての項目に対してそれぞれ異なるエラータイプをチェックすべきか？

> 答えは NO で
> 外側のコードは “それらすべての 1 つ上のレベル” でありたいです。つまり “データ読み込みエラー” でいくつかの種類を持ちたいです。正確になぜそれが起きたのか – はしばしば重要ではありません(エラーメッセージがそれを説明します)。もしくは、必要な場合にのみ、エラーの詳細を取得方法があると更にベターです。

なので「それ以外」ひとまとめの新しいエラークラスを作ればいい

```JavaScript
"use strict";

class ReadError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = 'ReadError';
  }
}

class ValidationError extends Error { /*...*/ }
class PropertyRequiredError extends ValidationError { /* ... */ }

function validateUser(user) {
  if (!user.age) {
    throw new PropertyRequiredError("age");
  }

  if (!user.name) {
    throw new PropertyRequiredError("name");
  }
}

function readUser(json) {
  let user;

  try {
    user = JSON.parse(json);
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new ReadError("Syntax Error", err);
    } else {
      throw err;
    }
  }

  try {
    validateUser(user);
  } catch (err) {
    if (err instanceof ValidationError) {
      throw new ReadError("Validation Error", err);
    } else {
      throw err;
    }
  }

}

try {
  readUser('{bad json}');
} catch (e) {
  if (e instanceof ReadError) {
    alert(e);
    // Original error: SyntaxError: Unexpected token b in JSON at position 1
    alert("Original error: " + e.cause);
  } else {
    throw e;
  }
}
```

> 外部のコードは instanceof ReadError をチェックするだけです。可能性のあるすべてのエラータイプをリストする必要はありません。

> このアプローチは、“低レベルの例外” を取り除き、呼び出しコードで使用するより抽象的で便利な “ReadError” に “ラップ” するため、“例外のラッピング” と呼ばれます。 オブジェクト指向プログラミングで広く使用されています。

呼出先のスローエラーは、呼出もとの catch でとらえられるのか？:

上の例コードを見るとわかるけれど、
その通りになる

#### promise でのエラーハンドリング

https://ja.javascript.info/promise-error-handling

知りたいのは Promise が reject されたときの挙動がどうなのかとどうすべきかである

-   暗黙の try...catch rejct の意味

次は、

```JavaScript
new Promise(function(resolve, reject) {
  throw new Error("Whoops!");
}).catch(alert); // Error: Whoops!
```

次と同じ

```JavaScript
new Promise(function(resolve, reject) {
  reject(new Error("Whoops!"));
}).catch(alert); // Error: Whoops!
```

つまり`reject`は例外を投げているのと同じである

(そして、暗黙に try...catch が設置されている)

ここからわかること：

1. `reject()`を実行した時点でそれは例外である
2. try...catch は同期的なエラー検出・取得機能なので、非同期に投げられるエラーはキャッチできない

#### エラー vs 例外

参考：

https://blog.ohgaki.net/error-exception-secure-coding-programming

多くの場所でよく言われていること...

> 例外処理をエラー処理に使ってはならない

> エラー処理と例外処理は役割が異なるので、例外処理をエラー処理に使ってはならないのです。

> エラー処理と例外処理の違い

> -   **エラー処理は”起きることが期待される問題”で、多くの場合、プログラムの実行停止は行えない**

> -   **例外処理は”起きることが期待されない問題”で、多くの場合、プログラムの実行を停止しても構わない**

これを理解していないとおかしな例外の使い方／エラー処理になります。

プログラムを開発するときは
起こりうる問題をすべて想定しておかなくてはならない
（そして、それは予測可能なエラーと判断することになる）

とはいえ、
起こりうる問題に対処するコードを追加し始めると、
正常系の処理のなかにエラー対処コードがたくさん追加されることになるので
いったい何がしたいのかよくわからないコードになってしまう

実現したいのは正常系の処理で
エラー処理はなるべく分離したい！

### chrome API 知見まとめ

-   content script で例外が発生しても background script へそのことを教えるには message-passing しかない

#### icon が表示されないときは

`png`でなくてはならない
次の 3 つのサイズを提供しているか

-   128 \* 128 :
    > インストール中および Chrome ウェブストアで使用されます
-   48 \* 48
    > 拡張機能管理ページ（chrome：// extends）で使用される 48x48 アイコンも提供する必要があります

#### service worker への理解

https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/

https://developers.google.com/web/fundamentals/primers/service-workers/

> service worker は、ブラウザが Web ページとは別にバックグラウンドで実行するスクリプトであり、Web ページやユーザーの操作を必要としない機能への扉を開きます

#### background script で変数を保存するなら必ず`chrome.storage`で保存すること

#### `chrome.tabs.query`で windowId を option で指定するな

`tabs.query`で今フォーカスしているウィンドウのアクティブなタブを取得したいとき、
windowId を絶対指定するな(めったな状況でない限り)

なぜなのか

`chrome.windows.getCurrentId()`、または`chrome.windows.getLastFocused()`は、
必ずと言っていいほど、
最後に生成されたウィンドウの ID を取得するからである

なので

`tabs.query`で今フォーカスしているウィンドウのアクティブなタブを取得したいときは、

次のオプションを渡すとよい

```TypeScript
{
  active: true,           // 表示中のタブを指定する
  lastFocusedWindow: true,   // 最後にフォーカスしたwindowを指定できる
  currentWindow: true     // 現在のwindowを指定できる
}
```

`lastFocusedWindow`と`currentWindow`はどちらかだけでもいい

#### message-passing で sendResponse()を非同期に完了させたいならば chrome.runtime.onMessage.addListener()のコールバックは必ず true を返すこと

というのは公式に書いてあるので当然かもしれませんが

TypeScript 的にいうと、

`chrome.runtime.onMessage.addListener()`のコールバックは

`(): boolean => { return true }`でないと効果を発揮しないよということ

`async (): Promise<boolean> => {return true;}`では無効である

ついつい`async/await`を使いたいからと言って
async 関数を渡してしまうと非同期処理が無視されて
`sendResponse()`が非同期に返されるのを待たずに
送信先が存在しませんという旨の`runtime.lastError`が起きます

となると

`chrome.runtime.onMessage.addListener()`のコールバックは

次の通りに書くべきです

```TypeScript
interface iMessage {
  // message-passingでやり取りするオブジェクトの型
}

chrome.runtime.onMessage.addListener(
    (
        message: iMessage,
        sender,
        sendResponse: (response: iResponse) => void
    ): boolean => {
        const { order } = message;
        const response: iResponse = {
            from: extensionNames.contentScript,
            to: from,
        };
        if (to !== extensionNames.contentScript) return;

        if (order && order.length) {
            // 1. Promise chainを用いる
            if (order.includes(orders.reset)) {
                handlerOfReset()
                    .then(() => {
                        sendResponse({
                          ...response
                            complete: true,
                            success: true,
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
            // 2. IIFEでasync関数を囲う
            if (order.includes(orderNames.isPageIncludingMovie)) {
              (async function() {

              })()

                repeatQuerySelector(selectors.videoContainer)
                    .then((r: boolean) => {

                        sendResponse({
                            complete: true,
                            isPageIncludingMovie: r,
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }

            if (order.includes(orderNames.turnOff)) {

                moControlbar.disconnect();
                controlbar.removeEventListener('click', handlerOfControlbar);
                // moControlbarとcontrolbarはnullにしておく必要があるかな？
                // その後のorderによるなぁ
                sendResponse({complete: true});
            }
        }
        return true;
    }
);

```

#### popup の state は background script で管理すること

popup は開かれるたびに、web ページのリロード同様に、毎回リフレッシュされる

なので例えば POPUP を React で生成しているようなとき
一旦 POPUP 表示を消して再表示するとき
state の値は保存されない

## chrome-extension-API

必要に応じて API を確認する

### chrome.windows

結論：

`tabs.query`で今フォーカスしているウィンドウのアクティブなタブを取得するには windowId を絶対指定するな

`option: {active: true, currentWindow: true, lastFocusedWindow: true}`を指定しよう

https://developer.chrome.com/docs/extensions/reference/windows/

> ブラウザウィンドウにインタラクトできる API
> この API でウィンドウを作成、変更、再調整できる

The _current window_:

*current winodw*というのは、よく
chrome api の関数の引数として windowId が要求されるときにデフォルトで与えられる「現在の window 情報」である

**「現在の winodw 情報」というのは必ずしもいまフォーカスしているウィンドウではないし、または一番上にあるウィンドウをではない**

しかも状況による!!

ではどうやって判定すればいいのか？下記の調査を行った

```JavaScript
/**********************************************
 *
 * NOTE: 調査1 chrome.windows.onFocusChangedの挙動確認
 *
 * onFocusChanged.addListener()内では、
 * getLastFocusedとgetCurrentは両方とも同じwindowを指す
 *
 * ブラウザのウィンドウを２つにして、bakcgroundインスペクターを1つ開いた
 * ブラウザのウィンドウをフォーカスすると必ずwindow.focused === trueになる
 * インスペクターをフォーカスするとwindow.focused === falseになる
 * 各windowのidは異なる
 * インスペクターのwindowIDはなぜか後から開いたブラウザウィンドウのIDと同じになる
 * （インスペクターは本番では関係ないからどうでもいいけれど...）
 *
 * その後、さらにウィンドウを増やすと、そのwindowIdは他と異なることは分かった
 *
 *
 *
 * NOTE: 調査２ POPUPが開かれたwindowのtabを特定できるか？
 *
 * できる
 *
 * 状況：
 * 別のwindowをフォーカスしているときに、
 * それとは別のwindowで表示されたpopupをクリックしてonMessageを発火させてみた
 *
 *
 * NOTE: 教訓
 *
 * 1. tabs.queryはwindowIdをoptionに含めるべきでない
 *
 * どの窓でonMessageをが実行されても、
 * chrome.windowsメソッドで取得できるwindowIdはなぜか必ず
 * 最後に開いたwindowIdで変わらなかった
 *
 * これはめちゃくちゃ困るので
 * tabs.queryとかする時はwindows.windowIdを指定すべきでない
 *
 * 2. tabs.queryで「今フォーカスしている窓」のアクティブなタブを指定するなら下記の通りに
 * option: {active: true, currentWindow: true, lastFocusedWindow: true}
 * これで必ず「今フォーカスしている窓」のタブ情報を取得できる
 *
 * */

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.order === 'survey window') {


        // NOTE: 調査２のメモ
        //
        // {active: true}
        // いま開かれているすべてのwindowのアクティブなタブ（表示中のタブ）である
        // なので複窓のとき、各窓の表示中のタブの情報を取得する
        chrome.tabs.query({ active: true }, function (tabs) {


        });
        //
        // {currentWindow: true}
        // 状況のPOPUPを表示させていた（つまり最後にフォーカスした）ウィンドウの
        // すべてのタブ情報を配列で取得した
        chrome.tabs.query({ currentWindow: true }, function (tabs) {


        });
        //
        // { lastFocusedWindow: true }
        // {currentWindow: true}と同様
        chrome.tabs.query({ lastFocusedWindow: true }, function (tabs) {


        });
        //
        // { active: true, currentWindow: true, lastFocusedWindow: true }
        // POPUPを開いていたタブだけを取得できた！
        chrome.tabs.query(
            { active: true, currentWindow: true, lastFocusedWindow: true },
            function (tabs) {

                    'option: {active: true, currentWindow: true, lastFocusedWindow: true}'
                );

            }
        );

        //
        // NOTE: chrome.windowsメソッドで取得したのは最後にフォーカスした窓の前にフォーカスしていた窓であった!!
        //
        // 下記のメソッドで取得できるwindowIdは実際にフォーカスしていた
        // windowIdではなくてその直前のwindowIdであった
        //
        chrome.windows.getLastFocused({}, (w) => {


        });
        chrome.windows.getCurrent({}, (w) => {


        });
    }
});

// chrome.windows.onFocusChanged.addListener((windowId) => {
//
//     chrome.windows.getLastFocused({}, (w) => {
//
//
//     });
//     chrome.windows.getCurrent({}, (w) => {
//
//
//     });
// });

```

これで必ず background script で
今フォーカスしているウィンドウのアクティブなタブを取得できる

## TEST

テストって何ぞや

ユニット・テスト

「単体」テスト。クラスとか関数をテストするときの話

インテグレーション・テスト

他のクラスや外部モジュールと結合してテストすること

## DDD 設計思想の導入に関するメモ

聞きかじりでしかない

考えまとめ

#### ユーザの操作

起こりえるユーザ操作と、拡張機能に関わりそうな部分

@popup

-   popup を開く
-   popup 上の RUN ボタンを押す

@Udemy-page

-   ブラウザのサイズを変更する
-   字幕を変更する
-   トランスクリプトを ON/OFF にする
-   URL が変わる(動画が切り替わる)
-   tab を閉じる（ブラウザを閉じる）

-   ExTranscript を閉じる

#### 一般的な処理の流れ

ユーザの操作

リスナの反応

メッセージ・パッシングで background(アプリケーション・レイヤ)へ信号送信

background で信号受信

background で信号に応じて必要な処理単位をキューに詰める

キューを実行する

処理単位の成功で状態更新

処理単位の失敗でエラー送信、または呼び出し元へもどって表示、キューを空にする

すべての処理単位の成功でキューが空になる

~キューが空になったら必要に応じて信号送信元へ処理結果を返す~

(アプリケーションがなにをビジネスロジックにかかわっているので処理結果を返すのは
ドメイン層の指示に依る)

#### タスク管理の State とビジネスロジック管理の State を区別すること

microsoft の DDD の説明によれば
アプリケーション層が、タスク管理のための状態保持をしてもいいらしい

しかし
ビジネスロジックの管理はドメイン層の仕事なので、アプリケーション層から独立していないといかん

#### 単一責任の原則を守ること

責任とは：正常動作に対して責任を持つこと

正常動作に責任を持つクラスの設計方法

> オブジェクト指向におけるクラスは、
>
> -   インスタンス変数
> -   インスタンス変数 を正常に制御するメソッド
>     から構成されるのが基本です

つまり単一責任とはある変数を変更できるクラスは一つだけで
そのクラスが負う責任は変数の正常動作にたいして責任を負うのである

その変数はビジネスロジック上必要不可欠で
その変数が仕様に反しない値をもつように管理されないといけない

例：popup で RUN を押したら

ユーザ操作：popup で RUN を押した

popup: background へ RUN が押された信号を送信

background: chrome.runtime.onMessage で受信

background: 信号内容を振り分け信号ごとのハンドラへ処理を移す

background: その信号に対するハンドラ内部でキューを生成する(必要な処理単位をキューにプッシュする)

    queue中身は以下の通り(今のところ思いつき)
    - URLは正しいか確認
    - contentScriptのinject: ビジネスロジック状態を更新
    - contentScriptからのステータス送信要請
    - contentScriptからのステータス内容確認: ビジネスロジック状態を更新
    - captureSubtitlesのinject：ビジネスロジック状態を更新
    - captureSubtitlesへ字幕データ送信要請
    - captureSubtitlesからの字幕データ内容確認：ビジネスロジック状態を更新
    - controllerのinject：ビジネスロジック状態を更新
    - controllerへExTranscriptの正常展開ができたのか確認要請
    - controllerからの状況送信確認：ビジネスロジック状態を更新

NOTE: 思い付きだけれど、各ビジネスロジックの状態変化を notify されるようオブザーバをつけるといいことあるのかな？
queueu のタスクが空になったら queue の正常終了
途中でエラーまたは中断の理由が発生したら queue の異常終了

background: キューの中身を実行させる

NOTE: RUN におけるタスクの詳細を詰めればほぼアプリの構成が定まるのでは？

#### State 更新の流れ

処理単位という名の関数 task 関数と呼ぶ

task 関数 --> State の更新指示 --> State 管理クラス --> chrome.storage.local の管理クラス --> sotrage 更新完了

State 更新指示、State 管理クラスはドメイン(model)の仕事
chrome.storage.local の管理クラスはインフラストラクチャ層の仕事

ドメイン層の指示に従って State を更新して
storage.local へ保存する

#### ビジネスロジック

## 開発メモ

必要な登場人物

Queue クラス
Queue インスタンスを受け取って Queueu のなかの関数を実行する関数
各処理単位である関数（Queue に突っ込まれる関数）

Queue に関数を突っ込もうと思ったけれど
Queue のクラスの型付けが any だらけになるので断念
代わりに command pattern が解決策にならないか模索する

(Queue は関数を直接ではなくて command インスタンスを取得するとか)

#### Queue と command pattern の合わせだし

##### Command Pattern

https://www.patterns.dev/posts/command-pattern/

> コマンドパターンを使用すると、特定のタスクを実行するオブジェクトを、メソッドを呼び出すオブジェクトから切り離すことができます。

```JavaScript
class OrderManager() {
  constructor() {
    this.orders = []
  }

  placeOrder(order, id) {
    this.orders.push(id)
    return `You have successfully ordered ${order} (${id})`;
  }

  trackOrder(id) {
    return `Your order ${id} will arrive in 20 minutes.`
  }

  cancelOrder(id) {
    this.orders = this.orders.filter(order => order.id !== id)
    return `You have canceled your order ${id}`
  }
}

const manager = new OrderManager();

manager.placeOrder("Pad Thai", "1234");
manager.trackOrder("1234");
manager.cancelOrder("1234");
```

以上のコードでは
manager インスタンスを介して直接メソッドを呼び出している

このメソッドを manager から切り離す

```JavaScript
//
// OrderManagerからメソッドをすべて取り除いて
// 代わりにexecuteﾒｿｯﾄﾞ一つだけを持たせる
//
class OrderManager {
  constructor() {
    this.orders = [];
  }

    //
    // Commandインスタンスのexecuteメソッドを実行するだけ
    //
  execute(command, ...args) {
    return command.execute(this.orders, ...args);
  }
}

//
// 新たにCommandクラスをつくり
//
class Command {
  constructor(execute) {
    //
    // 渡された関数をexecuteという共通の名前で登録する
    //
    this.execute = execute;
  }
}

//
// コマンドで実行する関数とな
//
function PlaceOrderCommand(order, id) {
    //
    // Commandには実際に実行することになる関数を渡す
    //
  return new Command(orders => {
    orders.push(id);
    return `You have successfully ordered ${order} (${id})`;
  });
}

function CancelOrderCommand(id) {
  return new Command(orders => {
    orders = orders.filter(order => order.id !== id);
    return `You have canceled your order ${id}`;
  });
}

function TrackOrderCommand(id) {
  return new Command(() => `Your order ${id} will arrive in 20 minutes.`);
}
```

`execute()`メソッドは与えられた関数をすべて実行する関数

```JavaScript
const manager = new OrderManager();

manager.execute(new PlaceOrderCommand("Pad Thai", "1234"));
manager.execute(new TrackOrderCommand("1234"));
manager.execute(new CancelOrderCommand("1234"));
```

つまり
Command インスタンスには execute()呼出で実行できる関数を登録する
Command インスタンスを生成する関数はコンストラクタ関数である
OrderManager インスタンスの execute()にはこのコンストラクタ関数の new オブジェクトを渡す
つまり実際には OrderManager.execute()には Command のインスタンスを渡している
OrderManager は order プロパティをもち、これが実際に実行される関数に渡されるから OrderManager がわざわざ呼び出す意義がある 0
=======
Command には execute()呼出で実行できる関数を登録する
Command インスタンスには実際に実行することになる関数を渡す
Command インスタンスを生成する関数はコンストラクタ関数である
OrderManager インスタンスの execute()にはこのコンストラクタ関数の new オブジェクトを渡す
つまり実際には OrderManager.execute()には Command のインスタンスを渡している

これにより

呼出す側と実際に実行するメソッドは分離される
呼出す側は好きなメソッドを実行できる

メリット

-   クラスはメソッドを持つ必要がなくなる
-   実際に実行する関数は呼び出し側のクラスのプロパティと共通の名前をもつことでプロパティを変更できる
-   呼び出し側の都合でクラスに好きなメソッドを実行させることができる

これを応用して Queue クラスを作ってみる

```TypeScript
class Command {
    public execute: (any) => any;
    constructor(execute: (any) => any ){
        this.execute = execute;
    }
}

// --- 実際に実行する関数群 ---
const someProcess = (): void => {
    // ...
}

const otherProcess = (): boolean => {
    // ...
    return true;
}

const anotherProcess = (): number => {
    // ...
    return 11;
};

// --- Commandインスタンスを生成する関数 ---
//
// 任意の関数を渡してCommandインスタンスへ変換する
const generateCommand = (func: (any) => any) => {
    return new Command(func);
};


// class Queue {
//     private _queue: Command[];
//     constructor(queue: Command[]){
//         if(queue.length) {
//             queue.forEach(q => {
//                 this._queue.push(q);
//             })
//         }
//     }

// }

// Queueはただの入れものにしたいのか
// それともexecuteメソッドを持つ、実行もともなうclassにしたいのか



// Commandインスタンスからなる配列であればいい
const queue: Command[] = [];
queue.push(generateCommand(someProcess));
queue.push(generateCommand(otherProcess));
queue.push(generateCommand(anotherProcess));

class QueueManager {

}
// この段階ではCommandのインスタンスをexecute()にわたしてあればいい
manager.execute()
```

```JavaScript
class Command {
    public execute: (any) => any;
    constructor(execute: (any) => any ){
        this.execute = execute;
    }
}

// --- 実際に実行する関数群 ---
const someProcess = (): void => {
    // ...
}

const otherProcess = (): boolean => {
    // ...
    return true;
}

const anotherProcess = (num: number): number => {
    // ...
    return num * num;
};

// --- Commandインスタンスを生成する関数 ---
//
// 任意の関数を渡してCommandインスタンスへ変換する
const generateCommand = (func: (any) => any, ...args) => {
    return new Command(func, ...args);
};


// class Queue {
//     private _queue: Command[];
//     constructor(queue: Command[]){
//         if(queue.length) {
//             queue.forEach(q => {
//                 this._queue.push(q);
//             })
//         }
//     }

// }

// Queueはただの入れものにしたいのか
// それともexecuteメソッドを持つ、実行もともなうclassにしたいのか



// Commandインスタンスからなる配列であればいい
const queue: Command[] = [];
queue.push(generateCommand(someProcess));
queue.push(generateCommand(otherProcess));
queue.push(generateCommand(anotherProcess, 11));

class QueueManager {
    private _que: Command[];
    constructor(que: Command[]){
        que.forEach(q => {
            _que.push(q);
        });
    };

    execute

    popAll(): void {
        while(this._que.length){
            this._que.pop():
        }
    }

}
// この段階ではCommandのインスタンスをexecute()にわたしてあればいい
manager.execute()
```

いや、いったんボトムアップで作ってみよう...

```TypeScript
// RUN以降の処理をひとまずひとまとめにするとどうなるか


const inject_contentScript = async (scriptName: string, tabId: number): Promise<void> => {
    await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: [scriptName],
    });
}

const inquireTabsForResponse = async(tabId: number, sendto: extensionNames, order: orderNames[]): Promise<iResponse> => {
    const response: iResponse = await sendMessageToTabsPromise({
        from: extensionNames.background,
        to: sendTo,
        order: order
    });
    return response;
}

const executeRUN = async(): Promise<{
    isSuccess: boolean;
    phase: string;
    failureReason: string;
}> => {
    try {
        // tabId取得処理と保存処理
        await inject_contentScript("contentScript.js", tabId);
        const response: iResponse = await inquireTabsForResponse(tabId, extensionNames.contentScript, [orderNames.sendStatus]);
        // responseに収められたstatusの保存
        // statusの値を検査 条件分岐
            // 検査合格：次へ
            // 不合格：失敗 return {isSuccess: false, phase: "after injecting contentScript.js", failureReason: "language is not English"}
        await inject_contentScript("contentScript.js", tabId);
        // 5秒くらい待ったほうがいいかも
        const response2: iResponse = await inquireTabsForResponse(tabId, extensionNames.captureSubtitle, [orderNames.sendSubtitle]);
        // response2に収められた字幕データをstateへ保存
        // 字幕データが壊れていないか検査
            // 検査合格：次へ
            // 不合格：失敗 return {isSuccess: false, phase: "after injecting captureSubtitle.js", failureReason: "Could not capture subtitles"}
        await inject_contentScript("controller.js", tabId);
        const response3: iResponse = await inquireTabsForResponse(tabId, extensionNames.controller, [orderNames.sendCompleted]);

        return {isSuccess: true, phase: "", failureReason: ""};
    }
    catch(err) {console.error(err.message)}
}


chrome.runtime.onMessage.addListener((
    message: iMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: iResponse) => void
) => {
    const { order, ...rest} = message;
    // ...
    if(order.includes(orderNames.run)){
        const tabId: number = await checkTabIsCorrect();
        const result = await executeRUN();
        // resultの検査
        // result結果にしたがってpopupへ返事を返す
        // or
        // Errorを出力する
        sendResponse({})
    }
});
```

なんか次のパターンが見て取れる
content scrpt inject
content script へステータスなどの要求
ステータスの State への保存
ステータスの検査、検査結果に応じた次のアクション

これは一般化できるか？

```TypeScript

```

#### observer の導入

State の変更を検知して変更値に応じて notify する仕組みの導入を検討する
State に何か新しい機能を付けるのは面倒なので
らくちんな middleware を導入できないかしら？

検討１：proxy API

proxy を導入するにしても、何に対して？
State.\_state の場合、State が proxy インスタンスを持つことになる
(\_state は private なので)

model

```TypeScript
import { State } from "../utils/State";
import {iProgress, iPageStatus, iSubtitles, iTabId, iContentUrl } from './annotations';

const progress_storage_key = "key__progress_state";
const progressState = new State<iProgress>(progress_storage_key);

const pageStatus_storage_key = "key__pageStatus_state";
const pageStatusState = new State<iProgress>(pageStatus_storage_key);

const subtitles_storage_key = "key__subtitles_state";
const subtitlesState = new State<iSubtitles>(subtitles_storage_key);

const tabId_storage_key = "key__tabId_state";
const tabIdState = new State<iProgress>(tabId_storage_key);

const contentUrl_storage_key = "key__contentUrl_state";
const contentUrlState = new State<iContentUrl>(contentUrl_storage_key);



```

確認できるパターン

content script をインジェクトする
background script 側からインジェクトしたコンテントスクリプトへ何かしらのデータを要求する
要求したデータに併せてモデルを更新する
モデルの変化結果から状態を判断する
状態に応じて何らかの結果が返る
参考になりそう...?
https://qiita.com/emaame/items/745a35509fdfc7250026

#### 1/23

こんがらがってきた

ちょっと整理

やろうとしていること
中目標として MVC モデルの導入、DDD 設計思想に近づけたい
そのために必要なこととして

-   order にたいして処理に必要な関数を Queue につめて Queue を実行するシステムにする
-   state の変更内容に応じて notify するシステムにする

##### order と Queue の実装に関して

想定する処理の一般的な流れ

例：popup から RUN ボタンが押された

前提：必要な state の生成は chrome.runtime.onInstalled で済んでいる

-   メッセージ受信機能がメッセージハンドラを呼び出す
-   メッセージハンドラはメッセージ内容を読んで、必要な処理（関数）を Queue へつめる
-   Queue を queue 実行関数へ渡す
-   Queue の関数が一つずつ実行される
-   実行するにつれて必要な state の変更も発生する
-   すべての処理が無事に済んだら success, うまくいかなかったら failure を返す

実装しようとしたときにぶち当たった障害

-   Queue につめる関数を一般化したいけれど、戻り値の扱いが異なるから一般化できない
    すくなくとも今の自分の腕では...

##### state observer の実装に関して

結論：proxy はいらない。既存の State に observable を持たせればいい

```TypeScript
/*
  確認した成果：
  - proxyはなんでもできる。でも型付けが難しい
  - proxyはspread syntaxに対応していない
  - proxyは、他のオブジェクト同様参照を扱う



*/
const deepCopier = <T>(data: T): T => {
  return JSON.parse(JSON.stringify(data));
};


// このままだと型付けがanyだらけだ...
//
class Observable {
  private _observers: ((param?: any) => any)[];
  constructor() {
    this._observers = [];
  }

  register(func: (param?: any) => any): void {
    this._observers.push(func);
  }

  unregister(func: (param?: any) => any): void {
    this._observers = this._observers.filter((observer) => observer !== func);
  }

  notify(data: any) {
    this._observers.forEach((observer) => observer(data));
  }
}

class State<TYPE extends object> {
  private _state: TYPE;
  private _proxy: TYPE;
  constructor(baseObject: TYPE, handler: ProxyHandler<TYPE>) {
    this._state = baseObject;
    this._proxy = new Proxy(this._state, handler);
  }

  setState(prop: { [Property in keyof TYPE]?: TYPE[Property] }): void {
    // いったんここでdeep copyをとるとして...
    //
    // NOTE: spread構文だとproxyのsetハンドラは反応しないらしい...
    // this._proxy = {
    //   ...this._proxy,
    //   ...prop,
    // };

    // 必ず浅いコピーを作る
    const temporary = {...prop};
    Object.keys(temporary).forEach((p, index) => {
      if(p in this._proxy) this._proxy[p] = prop[p];
    })
  }

  getState(prop?: string): TYPE {
    // かならずコピーを渡すこと
    if(prop && prop in this._proxy){
      return this._proxy[prop];
    }
    return deepCopier<TYPE>(this._proxy);
  }
}

interface iProgress {
  isScriptInjected: boolean;
  isSubtitleCapturing: boolean;
  isSubtitleCaptured: boolean;
  isTranscriptRestructured: boolean;
}

const progressBase: iProgress = {
  isScriptInjected: false,
  isSubtitleCapturing: false,
  isSubtitleCaptured: false,
  isTranscriptRestructured: false,
};

// すごく一時的な処理だけど
// obseervableのインスタンスをいったん作る
const observable = new Observable();
const observer = (props) => {


};
observable.register(observer);

// handlerにはobservableをわたせられれば
// あとは再利用可能なオブジェクトになるはず
const handler: ProxyHandler<iProgress> = {
  set: function (
    target: iProgress,
    property: keyof iProgress,
    value: boolean,
    receiver: any
  ) {
    // NOTE: targetはnotfyする時点で変更が反映されてしまうらしいので
    // 一旦コピーをとってこれをprevStateとする
    const temp = {...target};
    // 変更をnotifyする

    observable.notify({ prop: property, value: value, prevState: temp });
    return Reflect.set(target, property, value, receiver);
  },
  get: function (target: iProgress, property: keyof iProgress, receiver: any) {
    // Reflect.getは参照を返す

    return Reflect.get(target, property, receiver);
  },
};


// // NOTE: proxy.getは参照を返している
// const proxyProgress = new Proxy(progressBase, handler);
// proxyProgress.isScriptInjected = true;
// const refProxyProgress = proxyProgress;
//
// refProxyProgress.isSubtitleCaptured = true;
// // isSubttileCaptured: trueだった
//

// THIS WORKED
// なんだかhandlerともとのオブジェクトをそのまま渡すくらいなら
// Stateなんてclassいらないのでは?
const state_progress: State<iProgress> = new State<iProgress>(
  progressBase,
  handler
);
state_progress.setState({
  isScriptInjected: true,
  isSubtitleCaptured: true,
});




state_progress.setState({
  isTranscriptRestructured: true,
  isSubtitleCaptured: false,
});






// いまんところ



// おさらい
// シャローコピーはspread構文でおｋ
const dummy = {
  name: "Jonathan",
  age: 16,
  country: "USA"
};

const tmp = {...dummy};
tmp.name = "JOJO";



// // https://stackoverflow.com/questions/32308370/what-is-the-syntax-for-typescript-arrow-functions-with-generics
// const generateProxyHandler = <TYPE extends object, K extends keyof TYPE>(observable: Observable): ProxyHandler<TYPE> => {
//   return {
//     set: function(target:TYPE, property: string | number | symbol, value: any, receiver?: any): boolean {
//       if(target[property] === undefined)return false;
//       // 変更をnotifyする
//       observable.notify({prop: property, value: value, prevState: target});
//       return Reflect.set(target, property, value, receiver);
//     },
//     get: function(target:TYPE, property: PropertyKey, receiver?: any): boolean {
//       // Reflect.getは参照を返す
//       return Reflect.get(target, property, receiver);
//     }
//   }
// };

// // const observableForProgress = new Observable();
// // const progressHandler2 = new generateProxyHandler<iProgress>(observableForProgress);

// // これだとstateインスタンスをいくつでも作れてしまうことに注意
// class generateState<TYPE extends object> {
//   public stateInstance: State<TYPE>;
//   private _observableInstance: Observable;
//   private _proxyHandler: ProxyHandler<TYPE>;
//   constructor(base: TYPE, observable: Observable) {
//     this._observableInstance = observable;
//     this._proxyHandler = new generateProxyHandler<TYPE>(observable);
//     this.stateInstance = new State<TYPE>(base, this._proxyHandler);
//   }

//   getInstance(): State<TYPE> {
//     return this.stateInstance;
//   }
// }

// const progressState2 = new generateState(progressBase, new Observable());

// // Proxyについて勉強してstateのつくりを見直すこととする
// // Proxyについて詳しい(TypeScriptはない)
// // https://javascript.info/proxy

```

作ってみて思ったのが
Proxy は導入してもいいけれど
型をつけるのがむずかしく、
結構ハードコーディングの可能性が出てくるのと、
そもそも要らないのではという話

使い方が悪いかもだけど
notify するためだけに使おうとおもっていじっていたが、
結局順序として setstate してから proxy に移るので
じゃあ setstate で完結させればいいじゃんとなった

機能がダダ被りなので、
state を作るか proxy を使うかどちらかの話になってくる

notify は setstate 内で呼出せばいいだけなので
結局 proxy 入らないねって話になる

## 1/25:処理についておさらい

ユーザ操作：

-   [popup](#popupが開かれる)
-   [popup](#RUNが押される)
-   [ブラウザ] ウィンドウのサイズを変更する
-   [ブラウザ] 字幕の言語を変更する
-   [ブラウザ] (公式の)トランスクリプトを ON または OFF にする
    一度拡張機能を実行済ならこれに合わせて閉じる、再度開かれたら開く
-   [ブラウザ](<#URLが変わる(動画が切り替わる)>)
-   [ブラウザ] タブを閉じる
-   [ExTranscript] ExTranscript を閉じる

[設計に関する考察](#設計に関する考察)

#### popup が開かれる

前提：chrome.runtime.sendMessage は sendResponse が返されることが前提である

拡張機能が ON になってから popup を開くと、mount 時の useEffect が発動する
それ以降の popup の開閉は毎回発火する useEffect が発動することになる

```TypeScript
// popup.tsx

const Popup = (): JSX.Element => {
  // popupの初回呼び出しが済んでいるかどうか
  const [active, setActive] = useState<boolean>(false);
  // RUNボタンを押して、ExTranscriptが挿入されるまでの間はtrue
  const [loading, setLoading] = useState<boolean>(false);
  // ExTranscriptが挿入完了したらtrue
  const [complete, setComplete] = useState<boolean>(false);
  // popupが表示されたページがUdemyの講義ページならばtrue
  const [matchedPage, setMatchedPage] = useState<boolean>(false);

  useEffect(() => {

    chrome.runtime.onMessage.addListener(messageHandler);
    chrome.runtime.sendMessage({
      from: extensionNames.popup,
      to: extensionNames.background,
      order: [orderNames.isUrlCorrect]
    })
      .then((result) => {

        setMatchedPage(result);
      })
      .catch((err) => console.error(err));

    return () => {

      chrome.runtime.onMessage.removeListener(messageHandler);
    };
  }, []);

  useEffect(() => {

    chrome.runtime.sendMessage({
      from: extensionNames.popup,
      to: extensionNames.background,
      order: [orderNames.isUrlCorrect]
    })
      .then((result) => {

        setMatchedPage(result);
      })
      .catch((err) => console.error(err));
  });

  const buttonHandler = (): void => {

    chrome.runtime.sendMessage(messageTemplates.run);
  };

  const messageHandler = (
    message: iMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: iResponse) => void
  ) => {
    if (message.to !== extensionNames.popup) return;
    const { order, ...rest } = message;
    //
  };

  return (
    // ...
  );
};

// ...
```

```TypeScript
// background.ts

const popupMessageHandler = async (m: messageTemplate): Promise<void> => {
  try {

    const { message, sender, sendResponse } = m;
    const { order, ...rest } = message;
    const refStatus: State<iStatus> = stateList.caller<iStatus>(
      nameOfState.status
    );
    if (order && order.length) {
      if(order.includes(orderNames.isUrlCorrect)){
        // URLが正しいのかチェックして判定結果をbooleanで返す
        //
        // urlがただしくてもこの時点ではtabIdを保存しない
        // このタブで必ず拡張機能を実行するとは限らないので
        // なので純粋にboolean値を返すだけ
        // StateにtabIdは保存しない
        //
        // 処理内容
        // ほしい情報はすべてsenderに含まれている
        // url, tabId
        // なのでまじでURLを判定するだけ
        const pattern = /https:\/\/www.udemy.com\/course\/*/gm;
        const result: RegExpMatchArray = sender.url.match(pattern);
        sendResponse({url: true, complete: true})

      }
    }
    if (sendResponse) sendResponse({ complete: true });
  } catch (e) {
    console.error(e);
  }
};

```

処理順序:

-   [poup] マウント時または毎度の useEffect()で background へ`order:[orderNames.isUrlCorrect]`を送信する

-   [background] メッセージハンドラが受信してメッセージに応じた処理関数へ移動する
-   [background] メッセージに含まれる sender から URL を取得する
-   [background] url を matchURL と比較して比較結果を sendResponse()で返す
    `{complete: true, url: true}`
-   [poup] sendResponse の結果に応じて state を変更し、popup の表示内容を変える

popup の state について:

-   `matchedPage`: popup を開いたときの tab の URL が正しいかについての状態を管理する state

#### RUN が押される

前提：

-   RUN ボタンは`matchedPage`が true の時に有効になるとする
-   sendResponse()で返事が返されることを前提とする
-   sendResponse()はエラーが返されることも想定する

エラーの可能性箇条書き：

-   字幕が英語でない、トランスクリプトが開かれていない
    alert で字幕を英語にするように、またはトランスクリプトを開くように促す

-   処理途中で字幕の言語を変えた、トランスクリプトを閉じた
    alert で失敗を表示し、英語とトランスクリプトを戻して再度実行してもらうように促す

-   それ以外のエラー
    エラーだからどうしようもないよ

つまり大別して、成功、失敗（アラート）、エラー
成功：`complete: true`
それ以外: `complete: false`

RUN ボタンが押されたら、background へ`order: [orderNames.run]`を送信する

```TypeScript
// popup.tsx

const Popup = (): JSX.Element => {
  // RUNボタンを押して、ExTranscriptが挿入されるまでの間はtrue
  const [loading, setLoading] = useState<boolean>(false);
  // ExTranscriptが挿入完了したらtrue
  const [complete, setComplete] = useState<boolean>(false);
  // popupが表示されたページがUdemyの講義ページならばtrue
  const [matchedPage, setMatchedPage] = useState<boolean>(false);


  const buttonHandler = (): void => {

    chrome.runtime.sendMessage({
      from: extensionNames.popup,
      to: extensionNames.background,
      order: [orderNames.run]
    })
    .then(res => {
      setComplete(res.success)
    })
  };

  return (
    <div className="container">
      // ...
      <button onClick={runButtonHandler} disabled={!matchedPage}>RUN</button>
    </div>
  );
};

```

```TypeScript
// background.ts

const popupMessageHandler = async (m: messageTemplate): Promise<void> => {
  try {

    const { message, sender, sendResponse } = m;
    const { order, ...rest } = message;
    const refStatus: State<iStatus> = stateList.caller<iStatus>(
      nameOfState.status
    );
    if (order && order.length) {
      if (order.includes(orderNames.run)){
        // phase 1.
        // is URL correct?
        const pattern = /https:\/\/www.udemy.com\/course\/*/gm;
        const result: RegExpMatchArray = sender.url.match(pattern);
        if(!result) {
          sendResponse({complete: true, alert: "Invalid URL. Extension works only in https://... "});
          return;
        }

        // tabIdとURLの保存
        // senderから取得できる

        // phase 2.
        // inject contentScript.js

        await chrome.scripting.execute({target: { tabId: tabId }, files: ["contentScript.js"]});

        // TODO: ここでcontentScript.jsが展開完了したのを確認したうえで次に行きたいのだが...

        const response: iResponse = await sendMessageToTabsPromise({
          from: extensionNames.background, to: extensionNames.contentScript,
          order: [orderNames.sendStatus]
        });

        if(!response.language || !response.transcriptExpanded) {
          sendResponse({complete: true, alert: "Required subtitle language English and tunr Transcript ON"});
          return;
        }

        // contentScript.jsからのステータスをstateへ保存

        // phase 3.
        // inject captureSubtitle.js

        // tabIdはStateから取得したとして
        await chrome.scripting.execute({target: { tabId: tabId }, files: ["captureSubtitle.js"]});

        // TODO: ここでcontent scriptが展開完了したのを確認したうえで次に行きたいのだが...

        const response: iResponse = await sendMessageToTabsPromise({
          from: extensionNames.background, to: extensionNames.contentScript,
          order: [orderNames.sendSubtitles]
        });

        // response.subtitleを検査(長さがおかしいとか)
        // いまのところテキトー
        if(!response.subtitles.length) {
          sendResponse({comolete: true, error: "Failed to capture subtitle data"});
          return;
        }

        // 検査が問題なければstateへ字幕データを保存したとして

        // phase 4.
        // inject controller.js

        await chrome.scripting.execute({target: { tabId: tabId }, files: ["controller.js"]});

        // TODO: ここでcontent scriptが展開完了したのを確認したうえで次に行きたいのだが...

        const response: iResponse = await sendMessageToTabsPromise({
          from: extensionNames.background, to: extensionNames.contentScript,
          order: [orderNames.sendStatus]
        });

        // 検査：controller.jsがExTranscriptを正常展開できたか

        // 検査結果失敗ならばpopupへ失敗送信、return

        // 成功ならstateを更新

        // すべて正常完了で
        sendResponse({complete: true, success: true});
      }
    }
  } catch (e) {
    console.error(e);
  }
};

```

NOTE: 以下の処理チャートは state の更新について考えていない

-- phase 1 --
URL チェック
検査結果 ? tabId と URL の保存、次の処理へ : popup へエラーを返す(そもそも無効な URL では RUN ボタンは無効なはずなので)

-- phase 2. --

contentScritp.js の inject
contentScript.js へステータス送信要求
contentScript.js からのステータス検査
検査結果 ? ステータスを保存し次の処理へ : popup へアラート返す

起こりうるエラー：
css selector がマッチしない(Udemy が selector を変更したとか)

-- phase 3. --

captureSubtitle.js を inject
captureSubtitle.js へ字幕データ要求
字幕データを取得、検査（データがおかしくないか）
検査結果 ? 字幕データを保存し次の処理へ : popup へアラートを返す

起こりうるエラー：
css selector がマッチしない(Udemy が selector を変更したとか)

-- phase 4. --

controller.js を inject
controller.js が正常に ExTranscript を展開できたか確認
正常展開 ? popup へ正常完了の返事 : エラー出力

orderName.run を受け取った後の処理に見られる傾向：

-   content script の inject

-   content script からのメッセージで次の処理に必要な情報を取得する
    または
-   background script から inject した content script へ必要な情報を催促して取得する

-   取得した情報を検査して state へ保存して次へ進むか、処理を中断してエラーを返す

#### URL が変わる(動画が切り替わる)

`chrome.tabs.onUpdated.addListener`で検知する

拡張機能が展開済の時に、URL が変更されたときの挙動をここで制御する

継続条件：

-   拡張機能が未展開であるけど、Udemy 講義ページである
    なにもしない

-   拡張機能が展開されていて、同じタブで Udemy 講義ページだけど末尾の URL が変更されたとき
    拡張機能をリセットして引き続き展開する

-   拡張機能が展開されていて、同じタブで Udemy 講義ページ以外の URL になった時
    拡張機能は OFF にする

-   タブが切り替わった
    何もしない

-   拡張機能が展開されていたタブが閉じられた
    拡張機能を OFF にする

次の時はどうするか:

-   すでに拡張機能が実行されているときにページのユーザ操作によるリロードがあった
    変わらず展開したい
    google 翻訳アプリも変わらず展開しているし
    OFF になるのは、
    tab が閉じられたとき、ユーザの操作によって拡張機能上の OFF ボタンが押されたとき
    拡張機能マネージャでが OFF にされたとき、
    そのタブで別の Udemy 講義ページ以外に移動したとき

Udemy ページの挙動と chrome.tabs.onUpdated の挙動:

-   リンクをたどって Udemy 講義ページへ移動したとき
    "loading"は二度以上起こる
    しかし、URL は同じ(#以下が変わるだけ)

    ...よく考えたらこれ関係ないな...

...以上の挙動と事情がすべて反映されるように条件分岐を設ける

NOTE:
たとえば RUN がおされて処理の最中にページがリロードされたときの処置はまだ考えていない

```TypeScript
chrome.tabs.onUpdated.addListener(
  async (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    Tab: chrome.tabs.Tab
  ): Promise<void> => {
    // "https://www.udemy.com/course/*"以外のURLなら無視する
  const { url, status } = changeInfo;
  const pattern = /https:\/\/www.udemy.com\/course\/*/gm;
  const { resturctured } = progressState.getState();
  const { tabId } = tabIdState.getState();
  const { url } = contentUrl.getState();
  // 条件１：
  // 拡張機能が未展開、changeInfo.statusがloadingでないなら無視する
  if(changeInfo.status !== "loading" || !restructured) return;


  // 条件２：
  // 拡張機能が展開済だとして、tabIdが展開済のtabId以外に切り替わったなら無視する
  // return;
  if(Tab.id !== tabId) return;


  // 条件３：
  // 展開中のtabId && chnageInfo.urlがUdemy講義ページ以外のURLならば
  // 拡張機能OFF
  // --> 拡張期のOFFの処理へ
  if(restructured && Tab.id === tabId) {
    // おなじURLでのリロードか？
    if(changedInfo.url === undefined) {
      // 拡張機能は何もしない
      return;
    }
    else if(!changedInfo.url.match(pattern)) {
      // Udemy講義ページ以外に移動した
      // --> 拡張機能OFF処理へ
    }

  // 条件４：
  // 展開中のtabIdである && changeInfo.urlが講義ページだけど末尾が変化した(#以下は無視)
  // 動画が切り替わった判定
    else if(changeInfo.url.match(pattern) && changeInfo.url !== url){
      // 動画が切り替わった
      // --> リセット処理へ
    }
  }
  }
);

```

##### リセット処理

要確認：

-   state はどのようにリセットすべきか
-   content script は inject されたままなのか
-   content script は inject されたままだとして、ちゃんとリロードされたページの DOM を取得できるのか？

動画が切り替わったら

-   各 content script のイベントリスナを remove して再度セットする必要
-   各 content script のイベントリスナリセットを通知、完了報告管理
-   `state<iSubtitles>.subtitles: null`に
-   `state<iTabId>`はそのまま
-   `state<iContentUrl>`は URL が変わったのでその反映だけ
-   `state<iProgress>`は...
-   ExTranscript は中身をいったん空にする(空にして表示する loading circle でも表示するかい？)

進行状況 state：

```TypeScript

// ベース

interface iProgress {
  isContentScriptInjected: boolean;
  isCaptureSubtitleInjected: boolean;
  isControllerInjected: boolean;
  isSubtitleCapturing: boolean;
  isSubtitleCaptured: boolean;
  isTranscriptRestructured: boolean;

}

const progressBase: iProgress = {
  isContentScriptInjected: false,
  isCaptureSubtitleInjected: false,
  isControllerInjected: false,
  isSubtitleCapturing: false,
  isSubtitleCaptured: false,
  isTranscriptRestructured: false
};

// 動画の切り替えでリセットは...
const progressBase: iProgress = {
  // 各 content script はinjectされたままのでtrueのまま
  isContentScriptInjected: true,
  isCaptureSubtitleInjected: true,
  isControllerInjected: true,
  //
  // 字幕データは取り直しになるのでfalseだけれど...
  //
  isSubtitleCapturing: false,
  isSubtitleCaptured: false,
  //
  // 動画の切り替わりで、中身は空になるけれど、「展開」はしているからtrue
  //
  isTranscriptRestructured: true
};
```

この進行状況 state だと矛盾が起こりそうだなぁ...

リセットタスク：

-   各 content script のイベントリスナを remove して再度セットする必要
-   各 content script のイベントリスナリセットを通知、完了報告管理
-   `state<iSubtitles>.subtitles: null`に
-   `state<iTabId>`はそのまま
-   `state<iContentUrl>`は URL が変わったのでその反映だけ
-   `state<iProgress>`は...
-   ExTranscript は中身をいったん空にする(空にして表示する loading circle でも表示するかい？)

-   [background] contentScript.js へリセット通知
-   [background] captureSubtitle.js へリセット通知
-   [background] controller.js へリセット通知
-   [background] 各 content script から`{success: boolean;}`の返事取得
-   [background] 全ての content script sucess が true だったら state を更新
-   [background] 字幕取得処理を実施
-   [background]

-   [contentScript] toggle ボタンの要素は変化しないのでリセット不要
-   [contentScript] ccPopupButton 要素も変化しないのでリセット不要
    結果、contentScript はリセット不要でした...

-   [captureSubtitle] state のリセット
-   [captureSubtitle] 要素へのリスナはないのでリスナのリセット不要
-   [captureSubtitle] 毎度関数の実行時にすべて DOM を取得しなおすのでリセット不要
-   [captureSubtitle] 実行関数をサイド呼出せばいいだけっぽい
-   [captureSubtitle] 処理完了したら background へ字幕データを送信する

-   [controller] state は...
    \_state: iControllerState 不要
    \_subtitles リセット
    \_highlight リセット
    \_ExHighlight リセット
    \_indexList リセット

```TypeScript
// background.ts
//
// chrome.tabs.onUpdated.addListener()より...

const resetHandler = async (): Promise<void> => {
  try {
    // reset開始...
    //
    // 各content scriptへリセット通知、すべて成功ならエラーがスローされない
    // reset orderというか初期化しなおしだなただしくは
    await resetOrderHandler();
    // stateを更新する
    // 更新完了したとして
    // ページのステータスを調べて問題なければ
    // 字幕取得
    const isSubtitleCaught: iResponse = await sendMessageToTabsPromise({
      from: extensionNames.background,
      to: extensionNames.captureSubtitles,
      order: [orderNames.sendSubtitle]
    });
    // 字幕データをstateに保存できたとして
    // controllerへ字幕データ: subtitles を送信
    const isRestructured: iResponse = await sendMessageToTabsPromise({
      from: extensionNames.background,
      to: extensionNames.controller,
      subtitles: subtitles
    });
    if(isRestructured.success) {
      // reset完了
      // stateを更新する
    }
    else {
      throw new Error("Error: Failed to restructure ExTranscript after sent subtitles data");
    }
  }
  catch(err) {
    console.error(err.message);
  }
}

// iResponse.response: {
//   success: boolean;
//   failureReason: string;
// }を取得する
const resetOrderHandler = async(): Promise<void> => {
  const captureSubtitle = sendMessageToTabsPromise({
    from: extensionNames.background,
    to: extensionNames.captureSubtitles,
    order: [orderNames.reset]
  });
  const controller = sendMessageToTabsPromise({
    from: extensionNames.background,
    to: extensionNames.controller,
    order: [orderNames.reset]
  });
  try {
    const results: iResponse[] = await Promise.all([captureSubtitle, controller]);
    const failures: string[] = results.filter(r => {
      if(!r.success) return r.failureReason;
    });
    if(failure.length) {
      throw new Error(`Failed to reset content script. ${failures.join(" ")}`);
    }
  }
  catch(err) {
    console.error(err.message);
  }
}
```

```TypeScript
// constants.ts

export const orderNames = {
  // ...
  reset: "reset",
} as const;

export interface iResponse {
  // これはmessage passingのsendResponseで必須のプロパティ
  // メッセージの返事を正常に送信することを示す
  complete?: boolean;
  // orderの処理が正常に完了したことを示す
  success?: boolean;
  failureReason?: string;
}
```

##### 拡張機能 OFF 処理

要確認：

-   state はどのようにリセットすべきか
-   content script はそのページから除去できるのか
-   除去できないとしたらどうするか

## 1/28:各処理機能の実装をしてみる

[1/25:処理についておさらい](#1/25:処理についておさらい)
にて検討した処理を実装してみる

たびたび障害となる、service worker ゆえに変更を保持できない問題
これは別の「環境」を用意してやれば解決するだろうか

つまり background script じゃない環境を state のために用意すればいちいちロード、アンロードに対応しなくていい
もしくは最小限に抑えられるのか

```TypeScript
/**
 * よく考えたらstateをやたら作る必要はなくて、すべてまとめちゃっても別にいいわけだ
 * そうなるとstateListみたいなものを作る必要はなくなるわけで
 * */
//
// これは間違い
// interface iModel {
//     [Property in keyof iProgress]: iProgress[Property];
//     [Property in keyof iPageStatus]: iPageStatus[Property];
//     [Property in keyof iTabId]: iTabId[Property];
//     [Property in keyof iContentUrl]: iContentUrl[Property];
//     [Property in keyof iSubtitle]: iSubtitle[Property];
// };

// こっちがただしい
interface iModel extends iProgress, iPageStatus, iContentUrl, iTabId, iSubtitle{};

// modelBaseは新規プロパティの追加も削除もない
const modelBase: iModel = {
    isContentScriptInjected: false,
    isCaptureSubtitleInjected: false,
    isControllerInjected: false,
    isSubtitleCapturing: false,
    isSubtitleCaptured: false,
    isTranscriptRestructured: false,
    isTranscriptON: false,
    isEnglish: false,
    isWindowTooSmall: false,
    tabId: null,
    url: null,
    subtitles: null
} as const;

const model: Model = new Model();
model.update({isContentScriptInjected: true, isEnglish: true, isOpened: true});

class Model<T exntends object> {
    private _storage_key: string;
    private _local_storage: LocalStorage;
    constructor(key: string, base: T) {
        this._storage_key = key;
        this._local_storage = new LocalStorage(this._storage_key);
        this._local_storage.save(base);
    };

    async update(prop: {[Property in keyof T]?: T[Property]}): Promise<void> {
        // いちいち毎度すべていったん取得してから、引数に一致するプロパティだけ変更して
        // 変更したすべてを保存する
        // なのでひと手間ある
        const current: T = await this._local_storage.load();
        current = {...current, ...prop};
        await this._local_storage.save(current);
    }

    async load(): Promise<T> {
        const current: T = await this._local_storgae.load();
        return deepCopier(current);
    }

    async clearAll(): Promise<void> {
        await this._local_storage.clearAll();
    }
}
```

```TypeScript

chrome.runtime.onInstalled.addListener((details: chrome.runtime.InstalledDetails): void => {

    const model: Model = new Model("__key__local_storage_", modelBase);
});

const model_ = (function() {
    const instance: Model = null;

    return {
        register: (m: Model): void => {
            instance = m;
        },
        unregister: (): void => {
            instance = null;
        },
        _: (): Model => {
            return instance;
        }
    }
})();

```

## 1/31

**update**やること：

-   background.ts の update に伴った各 content script の update
-   エラーハンドリング：どういう場合にエラースローでどういうときに続行なのか定義する
-   Model の見直し：エラーハンドリングと伴って
-   各`TODO`の消化
-   Observer の導入: state の変化で反応させられる View に導入する
-   拡張機能の OFF 機能の実装
-   （可能ならば）transcript が ON じゃなくても、英語字幕でなくても機能を ON にできるようにする
-   見た目をイカした感じに

#### Observer の導入

Model の変化で View を変化させるような場面は存在した...

例：

-   popup の`capturing`表示、`complete`表示に関して

state の`isSubtitleCaptured`, `isSubtitleCapturing`の値の変化を
notify して popup を変化させてもいいね

-   controller.js が表示する subtitles データの変化を notify されるようにする

`state.subtitles`が変化したら notfy されて取得する仕組みにする

```TypeScript
class Observable {
  private _observers: (params?:any) => any | void;
  constructor() {
    this._observers = [];
  };
}
```

##### 字幕データを受け取ってから字幕展開する仕様へ変更

今までは script の inject 時に controller 側から字幕データを要求していたけれど
これからは background から送信されたものを受動する仕様にする

なので、次の通りにする

-   字幕データがなくても ExTranscript を展開できるようにする
-   字幕データが届き次第、ExTranscript へ展開する仕様にする
-   自動スクロールも、字幕データが届き次第リセットされる仕様にする

```TypeScript


// Annotations
//
interface iController {
  // 本家Transcriptのポジション2通り
  position: keyof_positionStatus,
  // 本家Transcriptがsidebarであるときの表示のされ方2通り
  view: keyof_viewStatus,
  // 本家Transcriptでハイライトされている字幕の要素の順番
  highlight: number;
  // ExTranscriptの字幕要素のうち、いまハイライトしている要素の順番
  ExHighlight: number;
  // _subtitlesのindexプロパティからなる配列
  indexList: number[];
}

// 字幕データはでかいので、毎回気軽に呼び出さないでほしい
// そのため別にしておく
interface iSubtitles {
  subtitle: subtitle_piece[];
}


type iObserver<TYPE extends object> = (prop: {[Property in keyof TYPE]?: TYPE[Property]}, prev: TYPE) => void;


// Constants
//
const controllerStateBase: iController = {
  position: "",
  view: "",
  highlight: null,
  ExHighlight: null;
  indexList: [];
} as const;

const subtitleBase: iSubtitle = {
    subtitles: [];
} as const;


// Classes
//
class State<TYPE extends object> {
  private _state: TYPE;
  public observable: Observable;
  constructor(s: TYPE, o: Observable) {
    this._observable = o;
    this._state = {...s};
  };

  setState(prop: {
        [Property in keyof TYPE]?: TYPE[Property];
    }): void {
      const prev: TYPE = {...this._state};
      // _stateは一段階の深さなので
      // コピーはspread構文で充分
      this._state = {
        ...this._state,
        ...prop
      };
      this._observable.notify(prop, prev);
    };

    getState(): TYPE {
      // _stateは一段階の深さなので
      // コピーはspread構文で充分
      return {...this._state};
    };
};

class Observable<TYPE> {
  private _observers: iObserver<TYPE>[];
  constructor() {
    this._observers = [];
  };

  register(func: iObserver<TYPE>):void {
    this._observers.push(func);
  };

  unregister(func: iObserver<TYPE>):void {
    this._observers = this._observers.filter(o => {
      return o !== func;
    };
  };

  notify(prop: {[Property in keyof TYPE]?: TYPE[Property]}, prev: TYPE): void {
    this._observers.forEach(o => {
      o(prop, prev);
    });
  };
};




// Observer aka Updater
//

// 字幕アップデート
// 常に受け取った字幕に再レンダリングする
const updateSubtitle: iObserver<iSubtitles> = (prop, prev): void => {
  if(prop.subtitles === undefined) return;

  // 字幕データのアップデート
  const { position, view } = status.getState();
    if(position === "sidebar") {
      renderSidebarTranscript();
    //   sidebarのrenderingの後は
    // 高さと幅の更新を必ずしないといかん...のか?
    // 未確認なので念のため更新することにする
      sidebarTranscriptView.updateContentHeight();
      view === "middleView"
        ? sidebarTranscriptView.updateWidth(SIGNAL.widthStatus.middleview)
        : sidebarTranscriptView.updateWidth(SIGNAL.widthStatus.wideview);
    }
    if(position === "noSidebar"){
        renderBottomTranscript();
    }
}

const updatePosition = (prop, prev): void => {
    const { position } = prop;
    if(position === undefined) return;

    if(position === "sidebar") renderSidebarTranscript();
    else if(position === "noSidebar") renderBottomTranscript();
};

const updateSidebarView = (prop, prev): void => {
    const { view } = prop;
    if(view === undefined) return;

    if(view === "middleView") sidebarTranscriptView.updateWidth(SIGNAL.widthStatus.middleview);
    else if(view === "wideView") sidebarTranscriptView.updateWidth(SIGNAL.widthStatus.wideview);
}

const updateHighlight = (prop, prev): void => {
    const { highlight } = prop;
    if(highlight === undefined) return;
}

const updateExHighlight = (prop, prev): void => {
    const { highlight } = prop;
    if(highlight === undefined) return;
}


// Instantiate
//
// controllerのstatusとsubtitleは分けるので2つ作る
//
const subtitle_observable: Observable<iSubtitles> = new Observable<iSubtitles>();
const status_observable: Observable<iController> = new Observable<iController>();
const sStatus: State<iController> = new State<iController>(controllerStateBase, status_observable);
const sSubtitle: State<iSubtitle> = new State<iSubtitle>(subtitleBase, subtitle_observable);


// Registration of observer
//
sSubtitle.observable.register(updateSubtitle);
sStatus.observable.register(updatePosition);
sStatus.observable.register(updateSidebarView);
sStatus.observable.register(updateHighlight);
sStatus.observable.register(updateExHighlight);


// Updated
//
chrome.runtime.onMessage.addListener(
  async (
    message: iMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: iResponse) => void
  ): Promise<boolean> => {
    try {
      if (message.to !== extensionNames.controller) return;

      const { order, ...rest } = message;
      if (order && order.length) {}
      // 字幕データが送られてきたら
      if(rest.subtitles) {
        //  setStateのnotify()がこの変更に必要な関数を実行してくれる
          sSubtitle.setState({subtitles: subtitles});
      }
      return true;
    } catch (err) {
      console.error(err.message);
    }
  }
);

// Updated
//
const onWindowResizeHandler = (): void => {


  const w: number = document.documentElement.clientWidth;
  const { position, view } = sStatus.getState();

  // ブラウザの幅がRESIZE_BOUNDARYを上回るとき
  // Transcriptをsidebarに設置する
  if (w > RESIZE_BOUNDARY && position !== positionStatusNames.sidebar) {
    sStatus.setState({ position: positionStatusNames.sidebar });
    sStatus.setState({ view: viewStatusNames.middleView });

    // 同時に、sidebar時のTranscriptの表示方法の変更
    sStatus.setState({
        view: w > SIDEBAR_WIDTH_BOUNDARY
            ? viewStatusNames.wideView : viewStatusNames.middleView
    });
  }

  // ブラウザの幅がRESIZE＿BOUNDARYを下回るとき
  // Transcriptを動画下部に表示する
  if (w < RESIZE_BOUNDARY && position !== positionStatusNames.noSidebar) {
    sStatus.setState({ position: positionStatusNames.noSidebar });
  }

  // Transcriptがsidebarの時、
  // 2通りある表示方法を決定する
  if (position === positionStatusNames.sidebar) {
    sidebarTranscriptView.updateContentHeight();
    if (view === viewStatusNames.middleView && w > SIDEBAR_WIDTH_BOUNDARY) {
      // sidebar widthを300pxから25%へ
      sStatus.setState({ view: viewStatusNames.wideView });
    }
    if (view === viewStatusNames.wideView && w < SIDEBAR_WIDTH_BOUNDARY) {
      // sideba widthを25%から300pxへ
      sStatus.setState({ view: viewStatusNames.middleView });
    }
  }
};



// Updated
//
(function(): void{


    // 初期のExTranscriptの展開場所に関するステータスを取得する
    const w: number = document.documentElement.clientWidth;
    const s: keyof_positionStatus =
      w > RESIZE_BOUNDARY
        ? positionStatusNames.sidebar
        : positionStatusNames.noSidebar;
    state.setState({ position: s });

    if (s === positionStatusNames.sidebar) {
      sStatus.setState({
          view: w > SIDEBAR_WIDTH_BOUNDARY
            ? viewStatusNames.wideView : viewStatusNames.middleView
      })
    };

    window.addEventListener("resize", function () {
      clearTimeout(timerQueue);
      timerQueue = setTimeout(onWindowResizeHandler, RESIZE_TIMER);
    });

    // TODO: 自動スクロール機能の発火条件の発見と実装
})();

```

#### OFF 機能 実装

ここでいう OFF 機能とは、
拡張機能の OFF ではなくて
頻繁に訪れる Udemy のトランスクリプトの消失にともなう
ExTranscript の非表示である

ExTranscript の機能として、必ず本家のトランスクリプトの表示が必要なので
それが消えたらこちらも非表示にしないといかん

具体的に：

-   ExTranscript の`bottomTranscriptView.clear();` or `sidebarTranscriptView.clear();`
-   `onWindowResizeHandler`のイベントリスナの remove

それだけ

##### ユーザ操作による OFF の発生

条件：

-   [webpage] 字幕を英語以外にした
-   [webpage] ブラウザのサイズを小さくしすぎた
-   [webpage] トランスクリプト上の × ボタンを押した
    上記までの操作は、トランスクリプトを ON にすることで ExTranscript は復活する

-   [ExTranscript] OFF ボタンを押した
-   [popup] OFF ボタンを押した
    上記の操作の場合、ExTranscript は消え、再度 POPUP 上の実行ボタンを押さないと再展開しない

信号の定義:

```TypeScript

// constants.ts

export const orderNames = {
    // ...
    // from popup, run process
    run: 'run',
    // reset content script
    reset: 'reset',
    // Turn Off ExTranscript
    turnOff: 'turnOff',
} as const;
```

##### OFF 機能の実装 controller.ts

controller.ts の機能のおさらい

前提：

字幕が英語である
トランスクリプトが開かれている

初期化：

State の生成
onWindowResizeHandler のリスナ設定
字幕データを取得次第トランスクリプトをリレンダ

```TypeScript
// controller.ts

const statusBase: iController = {
  position: positionStatus.sidebar,
  view: viewStatusNames.wideView,
  highlight: null,
  ExHighlight: null,
  indexList: [],
  isAutoscrollInitialized: false,
};

```

OFF 処理：

-   State はインスタンスは残しておいて、プロパティだけリセットする
    highligh, ExhHighlight, indexList, isAutoscrollInitialized
    iSubtitles

```TypeScript
chrome.runtime.onMessage.addListener(
  async (
    message: iMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: iResponse) => void
  ): Promise<boolean> => {
    try {
      if (message.to !== extensionNames.controller) return;

      const { order, ...rest } = message;
      if (order && order.length) {
        if (order.includes(orderNames.reset)) {

          handlerOfReset();
          sendResponse({complete: true, success: true});
        }
        if(order.includes(orderNames.turnOff)){

          handlerOfTurnOff();
          sendResponse({complete: true, success: true});
        }
      }
      // 字幕データが送られてきたら
      if (rest.subtitles) {
        //  setStateのnotify()がこの変更に必要な関数を実行してくれる
        sSubtitles.setState({ subtitles: rest.subtitles });
        sendResponse({ complete: true });
      }
      return true;
    } catch (err) {
      console.error(err.message);
    }
  }
);


//
// --- HANDLERS --------------------------------
//

const reductionOfwindowResizeHandler = (): void => {
    clearTimeout(timerQueue);
    timerQueue = setTimeout(onWindowResizeHandler, RESIZE_TIMER);
}

const handlerOfTurnOff = (): void => }{


  // REMOVAL Listeners
  window.removeEventListener("resize", reductionOfwindowResizeHandler);
  window.removeEventListener("scroll", onWindowScrollHandler);

  // CLEAR ExTranscript
  const { position } = sStatus.getState();
  if(positon === positionStatus.sideBar) {
    sidebarTranscriptView.clear();
  }
  else {
    bottomTranscriptView.clear();
  }

  // REMOVAL MutationObserver
  transcriptListObserver.disconnect();
  transcriptListObserver = null;


  // RESET State
  sStatus.setState({...statusBase});
  sSubtitles.setState({...subtitleBase});
}

const handlerOfReset = (): boolean => {


  handlerOfTurnOff();

  // NOTE: 以下はMAINの後半の処理と同じである

    // 初期のExTranscriptの展開場所に関するステータスを取得する
  const w: number = document.documentElement.clientWidth;
  const s: keyof_positionStatus =
    w > RESIZE_BOUNDARY ? positionStatus.sidebar : positionStatus.noSidebar;
  sStatus.setState({ position: s });

  if (s === positionStatus.sidebar) {
    sStatus.setState({
      view:
        w > SIDEBAR_WIDTH_BOUNDARY
          ? viewStatusNames.wideView
          : viewStatusNames.middleView,
    });
  }

  window.addEventListener("resize", function () {
    clearTimeout(timerQueue);
    timerQueue = setTimeout(onWindowResizeHandler, RESIZE_TIMER);
  });
};


// ---- MutationOserver ---------------------------------

class MutationObserver_ {
  private _callback: (mr: MutationRecord[]) => void;
  private _config: MutationObserverInit;
  private _target: NodeListOf<Element>;
  private _observer: MutationObserver;
  constructor(
    callback: (mr: MutationRecord[]) => void,
    config: MutatonObserverInit,
    target: NodeListOf<Element>
  ){
    this._callback = callback;
    this._config = config;
    this._target = target;
    this._obserever = new MutationObserer(this._callback);
  };

  observe(): void {
    this._target.forEach(ts => {
      this._observer.observe(ts, this._conifg);
    })
  };

  disconnect(): void {
    this._observer.disconnect();
  };
};

const moConfig: MutatoinOBserevreInit = {
    attributes: true,
    childList: false,
    subtree: false,
    attributeOldValue: true,
}

const moCallback = (mr: MutationRecord[]): void => {

    mr.forEach((record: MutationRecord) => {
      if(
          record.type === "attributes" &&
          record.attributeName === "class" &&
          record.oldValue === ""
      ){
        observer.disconnect();
        // --- DOM への変更中はdisconnectで無限ループ防止できる ----
        updateHighlightIndexes();
        updateExTranscriptHighlight();
        scrollToHighlight();
        // ------------------------------------------------------
        observer.observer(mr.target, this._config);
      }
    });
}

//   NodeListOf HTMLSpanElement
const transcriptList: NodeListOf<Element> = document.querySelectorAll(
  selectors.transcript.transcripts
);
const transcriptListObserver = new MutationObserver_(moCallback, moConfig, transcriptList);

// To delete instance
transcriptListObserver = null;
```

MutationObserver 内で無限ループが起こるとき:

https://pisuke-code.com/mutation-observer-infinite-loop/

インスタンスを削除する方法：

https://stackoverflow.com/questions/17243463/delete-instance-of-a-class

#### RESET 機能実装： contentScript.ts

contentScript.ts では、
トランスクリプトが表示・非表示・OFF・ON のどの状態なのかを検知して
background script へ伝える機能を実装する

background script は信号受信して state と比較して ExTranscript を表示するかどうかを判断して controller.js へ伝える

controller.js はそれに従うだけ

#### OFF 機能実装：contentScript.ts

トランスクリプトはあらゆる場面で消える！

-   ブラウザのサイズがある一定以上小さくなると消える（トグルボタンも消える）
-   トランスクリプト上の × ボタンを押すと消える
-   トグルボタンで OFF にすれば消える
-   「展開表示」で強制的に消える

そして、
必ずコントロールバーのトランスクリプト・トグルボタンの表示・非表示と
連動している

OFF にすべき部分と稼働を残す部分を切り離さないといかん

background.ts
State インスタンスは残す
State プロパティはいくつか初期化する
subtitle データは消す(非表示から再表示の間に別字幕になる可能性があるから)

```TypeScript
// State<iModel> 初期値
export const modelBase: iModel = {
    isContentScriptInjected: false,
    isCaptureSubtitleInjected: false,
    isControllerInjected: false,
    isSubtitleCapturing: false,
    isSubtitleCaptured: false,
    // NOTE: ExTranscriptがONかどうか
    // RUNした後かどうか、でもある
    // 表示、非表示は関係ない
    isExTranscriptStructured: false,
    // NOTE: 本家トランスクリプトが表示されているかどうか
    // ONかどうかではなく、表示されているかどうか
    // これが非表示なら、ExTranscriptも非表示にする
    isTranscriptDisplaying: false,
    isEnglish: false,
    tabId: null,
    url: null,
    subtitles: null,
} as const;


// State<iModel> RUNした直後
export const modelBase: iModel = {
    isContentScriptInjected: true,
    isCaptureSubtitleInjected: true,
    isControllerInjected: true,
    isSubtitleCapturing: false,
    isSubtitleCaptured: true,
    isExTranscriptStructured: true,
    isTranscriptDisplaying: true,
    isEnglish: true,
    tabId: 1,
    url: "https://...",
    subtitles: [
      /* subtitles data */
    ],
} as const;


// State<iModel>
// RUN以降、トランスクリプトが非表示になり、
// ExTranscriptを一時非表示にしたとき
export const modelBase: iModel = {
  // 当然だけど、content scriptは一度injectしたらはがせない
  // なのでinjectedはすべてtrue
    isContentScriptInjected: true,
    isCaptureSubtitleInjected: true,
    isControllerInjected: true,
    isSubtitleCapturing: false,
    // 字幕データをリセットするのでfalse
    isSubtitleCaptured: false,
    // ExTranscriptはONのままである
    isExTranscriptStructured: true,
    // ExTranscriptは非表示なので
    isTranscriptDisplaying: false,
    isEnglish: true,
    tabId: 1,
    url: "https://...",
    // 字幕データは再表示時に再取得するので
    // 空にする
    subtitles: [],
} as const;

// State<iModel>
// RUN以降、トランスクリプトは表示中だけど
// 字幕を英語以外にされたとき
export const modelBase: iModel = {
  // 当然だけど、content scriptは一度injectしたらはがせない
  // なのでinjectedはすべてtrue
    isContentScriptInjected: true,
    isCaptureSubtitleInjected: true,
    isControllerInjected: true,
    isSubtitleCapturing: false,
    // 字幕データをリセットするのでfalse
    isSubtitleCaptured: false,
    // ExTranscriptはONのままであるが...
    isExTranscriptStructured: true,
    // 拡張機能は英語以外に対応しないのでやはり
    // ExTranscriptは非表示にする
    isTranscriptDisplaying: false,
    // 英語じゃないので
    isEnglish: false,
    tabId: 1,
    url: "https://...",
    // 字幕データは再表示時に再取得するので
    // 空にする
    subtitles: [],
} as const;
```

##### コントロールバーを監視する機能を付ければいいのでは？

つまり、ブラウザのサイズによってコントロールバー上のボタンが消えたり現れたりするけれど
これの検知を今のところブラウザサイズを実際に図ってから判断している

これでもいいんだけど
コントロールバーに監視機能を付けてトグルボタンが現れるかどうか検知できれば
トランスクリプトの表示非表示が監視できるのではないか?

```TypeScript

const controlBarSelector = 'div.control-bar--control-bar--MweER[data-purpose="video-controls"]';
const controlbar = document.querySelector<HTMLElement>(controlBarSelector);

// TODO: 検討中：click or mouseup
controlbar.addEventListener("click", handlerOfControlbar);

// Clickイベント
// 検知したいのはトランスクリプト、CC、展開表示
// これならばトグルボタンが消えたりサイド現れてもいちいちリスナを付ける手間がなくなる
//
// Clickイベントハンドラは何が押されたかはわかるけれど、
// トランスクリプトが表示されたのかどうかはわからない
const handlerOfControlbar = function (ev: MouseEvent): void {
    const path: EventTarget[] = ev.composedPath();
    // TODO: <確認>この遅延装置はclickイベントが完了した後に発火できているか？
    setTimeout(function() {
      // もしもトグルボタンが押されたら
      if(path.includes(/* toggle-transcript-button */) || path.includes(/* toggle-theatre-button */)){
          // トランスクリプトを表示したまたは消えた可能性がある
          // トランスクリプトがあるかどうかだけを調べる

          const toggleTranscript: HTMLElement = document.querySelector<HTMLElement>(/* toggle-transcript-selector*/);
          if(!toggeleTranscript) {
            // トランスクリプト消えた
              sendToBackgroud({ isOpened: false });
          }
          else {
            // トランスクリプト消えてない
              sendToBackgroud({ isOpened: true });
          }
      }
      if(path.includes(/* cc-button */)){
          // 字幕が変更された可能性がある
          ccPopupMenuClickHandler(ev);
      }
    }, 100)
};

// もしかしたらいらないかも...
// コントロールバーの変更を検知する
// MutationObserver
const controlbarCallback = (mr: MutationRecord[]): void => {
    mr.forEach(record => {
        if(record.type === "childList"){
            // 子要素の何が追加されたのか、削除されたのか調査する
            // 追加された要素

            // 削除された要素


            if(/* record.addedNodes の子要素にトランスクリプト・トグルボタンが含まれているならば */) {
              // トランスクリプトが再表示された可能性がある
              if(/* もしもトランスクリプトDOMが取得で来たら*/){
                sendToBackgroud({ isOpened: true });
              }
            }
            if(/*record.removedNodesの子要素にトランスクリプト・トグルボタンが含まれているならば*/){
              // トランスクリプトが非表示になった可能性がある
              // いずれにしろ送信する
                sendToBackgroud({ isOpened: false });
            }
            // if(record.addedNodes === ccPopupMenu){
            //   // いまのところ出番がない...
            // }
            // if(record.addedNodes === toggleTheatre){
            //   // いまのところ出番がない...
            // }

        }
    })
}

// コントロールバーの子要素だけ追加されたのか削除されたのか知りたいので
// childListだけtrueにする
const config: MutationObserverInit = {
    attributes: false,
    childList: true,
    subtree: false
};

```

各セレクタ

コントロールバー：
`div.control-bar--control-bar--MweER[data-purpose="video-controls"]`

トグル・トランスクリプト：
`div.popper--popper--2r2To`
`button[data-purpose="transcript-toggle"]`

CC：
`div.popper--popper--2r2To`
`div.popper--popper--2r2To`
`button[data-purpose="captions-dropdown-button"]`

トグル・シアター：
`div.popper--popper--2r2To`
`button[data-purpose="theatre-mode-toggle-button"]`

```html
<!-- コントロールバー内部 -->
<div class="control-bar--control-bar--MweER" data-purpose="video-controls">
    <!-- 再生ボタン -->
    <div class="popper--popper--2r2To">
        <button
            type="button"
            data-purpose="play-button"
            class="udlite-btn udlite-btn-small udlite-btn-ghost udlite-heading-sm control-bar-dropdown--trigger--iFz7P control-bar-dropdown--trigger-dark--1qTuU control-bar-dropdown--trigger-small--1ZPqx"
            id="popper-trigger--414"
            tabindex="0"
        ></button>
    </div>
    <!-- rewind skip  -->
    <div class="popper--popper--2r2To">
        <button
            type="button"
            data-purpose="rewind-skip-button"
            class="udlite-btn udlite-btn-small udlite-btn-ghost udlite-heading-sm control-bar-dropdown--trigger--iFz7P control-bar-dropdown--trigger-dark--1qTuU control-bar-dropdown--trigger-small--1ZPqx"
            id="popper-trigger--416"
            tabindex="0"
        ></button>
    </div>
    <!-- 再生速度 -->
    <div class="playback-rate--playback-rate--1XOKO popper--popper--2r2To">
        <!-- omit -->
    </div>
    <!-- skip -->
    <div class="popper--popper--2r2To">
        <button
            type="button"
            data-purpose="forward-skip-button"
            class="udlite-btn udlite-btn-small udlite-btn-ghost udlite-heading-sm control-bar-dropdown--trigger--iFz7P control-bar-dropdown--trigger-dark--1qTuU control-bar-dropdown--trigger-small--1ZPqx"
            id="popper-trigger--422"
            tabindex="0"
        ></button>
    </div>

    <div
        class="udlite-heading-sm progress-display--progress-display--B20-A"
    ></div>
    <!-- ブックマーク -->
    <div class="popper--popper--2r2To">
        <button
            type="button"
            data-purpose="add-bookmark"
            class="udlite-btn udlite-btn-small udlite-btn-ghost udlite-heading-sm control-bar-dropdown--trigger--iFz7P control-bar-dropdown--trigger-dark--1qTuU control-bar-dropdown--trigger-small--1ZPqx"
            id="popper-trigger--424"
            tabindex="0"
        ></button>
    </div>
    <div class="control-bar--spacer--32VvX"></div>
    <div>
        <!-- 音量 -->
        <div
            data-purpose="volume-control-bar"
            role="slider"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow="22"
            aria-label="音量"
            tabindex="0"
            class="volume-control--slider-focus-wrapper--1DEg2 volume-control--invisible-unless-focused--2jCET"
        ></div>
        <!-- トグル　トランスクリプト -->
        <div class="popper--popper--2r2To">
            <button
                type="button"
                aria-expanded="false"
                data-purpose="transcript-toggle"
                class="udlite-btn udlite-btn-small udlite-btn-ghost udlite-heading-sm control-bar-dropdown--trigger--iFz7P control-bar-dropdown--trigger-dark--1qTuU control-bar-dropdown--trigger-small--1ZPqx"
                id="popper-trigger--1256"
                tabindex="0"
            ></button>
        </div>
        <!-- CC MENU -->
        <div class="popper--popper--2r2To">
            <div class="popper--popper--2r2To">
                <button
                    type="button"
                    aria-haspopup="menu"
                    data-purpose="captions-dropdown-button"
                    id="control-bar-dropdown-trigger--429"
                    tabindex="0"
                    aria-expanded="false"
                    class="udlite-btn udlite-btn-small udlite-btn-ghost udlite-heading-sm control-bar-dropdown--trigger--iFz7P control-bar-dropdown--trigger-dark--1qTuU control-bar-dropdown--trigger-small--1ZPqx"
                ></button>
            </div>
        </div>
        <!-- 設定 -->
        <div class="popper--popper--2r2To">
            <div class="popper--popper--2r2To">
                <button
                    type="button"
                    aria-haspopup="menu"
                    data-purpose="settings-button"
                    id="control-bar-dropdown-trigger--433"
                    tabindex="0"
                    aria-expanded="false"
                    class="udlite-btn udlite-btn-small udlite-btn-ghost udlite-heading-sm control-bar-dropdown--trigger--iFz7P control-bar-dropdown--trigger-dark--1qTuU control-bar-dropdown--trigger-small--1ZPqx"
                ></button>
            </div>
            <div
                id="popper-content--435"
                aria-labelledby="control-bar-dropdown-trigger--433"
                class="popper--popper-content--2tG0H"
                style="bottom: 100%; right: 0px; margin-bottom: 3.2rem;"
            ></div>
        </div>
        <!-- 全画面表示 -->
        <div class="popper--popper--2r2To">
            <button
                type="button"
                class="udlite-btn udlite-btn-small udlite-btn-ghost udlite-heading-sm control-bar-dropdown--trigger--iFz7P control-bar-dropdown--trigger-dark--1qTuU control-bar-dropdown--trigger-small--1ZPqx"
                id="popper-trigger--445"
                tabindex="0"
            ></button>
        </div>
        <!-- toggle theatre -->
        <div class="popper--popper--2r2To">
            <button
                type="button"
                data-purpose="theatre-mode-toggle-button"
                class="udlite-btn udlite-btn-small udlite-btn-ghost udlite-heading-sm control-bar-dropdown--trigger--iFz7P control-bar-dropdown--trigger-dark--1qTuU control-bar-dropdown--trigger-small--1ZPqx"
                id="popper-trigger--1270"
                tabindex="0"
            ></button>
        </div>
    </div>
</div>
```

#### 実装：ローディング後に字幕取得を実現するために

時間を置く方法と、取得できていなかったらもう一度取得しなおす方法
の両方を実現する

##### JavaScript Tips: setInterval()

```TypeScript
const INTERVAL_TIME = 1000;

const captureSubtitle = async (): Promise<void> => {
  try {
    const r: subtitle_piece[] = await repeatCaptureSubtitles(tabId);
    if(!r.length) throw new Error("Error: Time out to capture subtitles");
  }
  catch(err) {
    console.error(err.message);
  }
};

const repeatCaptureSubtitles = async function(tabId: number): Promise<subtitle_piece[]> {
  return new Promise(async (resolve, reject) => {
    let intervalId: number;
    let counter: number = 0;

    intervalId = setInterval(async function() {
      if(counter >= 10) {
        clearInterval(intervalId);
        reject([]);
      }
      const r: iResponse = await sendMessageToTabs(tabId,{
        from: extensionNames.background,
        to: extensionNames.captureSubtitle,
        order: [orderNames.sendSubtitles]
      });
      if(r.subtitles !== undefined && r.subtitles.length) {
        // Succeed to capture subtitles
        clearInterval(intervalId);
        resolve(r.subtitles);
      }
      else counter++;
    }, INTERVAL_TIME)
  })
}
```

#### RESET 実装： 確認できる不備

-   字幕変更のために CCPOPUP ボタンをクリックしたら ExTranscript が消えた
-   一旦 loading にともなうリセットが起こると、ExTranscript が非表示にならなくなる？

##### 字幕変更しようとしたら ExTranscript が消える件

動画の切り替えでコントロールバーの DOM も更新される模様

order.reset を contentScript.ts でも実施して
controlbar の DOM を更新することで解決した

解決済

##### 字幕変更のために CC POPUP ボタンを押したら EX トランスクリプトが消える件

呼出すべき関数を勘違いしていた

CC POPUPMENU 　内部の click イベントも
`handlerOfControlbar`で検知できるはずなので
document にイベントリスナをつけずとも
`handlerOfControlbar`に任せればよい

解決済

```TypeScript
// contentScript.ts

const handlerOfControlbar = function (ev: PointerEvent): void {


  const path: EventTarget[] = ev.composedPath();
  const transcriptToggle: HTMLElement = document.querySelector<HTMLElement>(
    selectors.controlBar.transcript.toggleButton
  );
  const theaterToggle: HTMLElement = document.querySelector<HTMLElement>(
    selectors.controlBar.theatre.theatreToggle
  );
  const ccPopupButton: HTMLElement = document.querySelector<HTMLElement>(
    selectors.controlBar.cc.popupButton
  );

  // NOTE: NEW ADDED
  const ccPopupMenu:HTMLElement = document.querySelector<HTMLElement>(selectors.controlBar.cc.menuListParent);

  setTimeout(function () {
    // ...

    // NOTE: いらないかも...
    // 結局、字幕が変更されたかどうかがわかればいいので
    // 字幕変更はPOPUP MENIの内部がクリックされたあとにわかるものである
    // となると、クリックされるかどうかわからない状況で反応しても意味がない...
    // CC POUPボタンが押されたら
    if (path.includes(ccPopupButton)) {

      document.removeEventListener("click", ccPopupMenuClickHandler);
      document.addEventListener("click", ccPopupMenuClickHandler);
    }

    // NOTE: NEW ADDED cc popup menu内部でクリックイベントが起こったら
    // 字幕が変更されたのか調べる
    //
    // これがうまく働けば
    // documentにイベントリスナをつける必要もないし
    // ccPopupMenuClickHandler()も必要ない
    if(path.includes(ccPopupMenu)){
      const r: boolean = isSubtitleEnglish();

      sendToBackground({isEnglish: r});
    }
  }, 200);

};

```

#### 残るタスク

-   自動スクロール機能: のこる大きな課題
-   ブラウザ横幅を小さくしても、ExTranscript 残り続けてしまう問題
-   popup で正しい動作をさせる：RUN した後は RUN ボタンを無効にするとか
-   controller.ts の onwWindowResizeHandler をもうちょっとサクサク動かしたい
-   拡張機能を展開していたタブが閉じられたときの後始末
-   エラーハンドリング: 適切な場所へエラーを投げる、POPUP に表示させる、アラートを出すなど
-   デザイン改善: 見た目の話

##### RESET 機能実装：ウィンドウが小さくなった時、ExTranscript が消えない件

解決済

controller.ts 以外は正常に稼働している...

ログ：

```bash
# Message Handler
CONTROLLER GOT MESSAGE  controller.js:1437
order: TURN OFF ExTranscript   controller.js:1484
# handlerOfTurnOff()
Turning off ExTranscript   controller.js:703
[BottomTranscriptView] clear  controller.js:1689
setup Auto Scroll System  controller.js:1540
# ここでリサイズハンドラが呼び出されているために再レンダリングされてしまっている
[onWindowResizeHandler]  controller.js:804
# おそらくonWindowResizeHandler内でbottomTranscriptView.render()が呼び出されている
[SidebarTranscriptView] clear  controller.js:703 [BottomTranscriptView] clear  controller.js:685 [BottomTranscriptView] render  controller.js:686
[]
```

`onWindowResizeHandler`を呼出した存在を突き止める

`updatePosition`が反応していた

`position: null`を渡していはずがいつの間にか`position`に値が与えられていた

その場所は？

`onWindowResizeHandler`だった

つまりこういうことである

contentScript から発せられるトランスクリプト閉じての order と
controller 自身が管理している onWindoeResizeHandler が
同時に発火したために
バッティングが起こったのである

簡潔に言うと

`handlerOfReset()`と
`onWindowResizeHandler()`の同時発火である

`handlerOfReset()`で`statusBase`の状態に state を戻したけど
別軸で実行された`onWindowResizeHandler()`がすぐに state を更新してしまい
結果 ExTranscript がレンダーされてしまった...

解決策：`onWindowResizeHandler()`がウィンドウサイズ更新時、ブラウザ横幅小さくなりすぎ境界線をまたぐ時だけ何もしないようにする

##### 自動スクロール機能実装

解決済

##### 自動スクロール機能のリセット

解決済

Ex トランスクリプトの position が変更になったりすると
途端に自動スクロール機能が使えなくなる

なのでリセット、再起動できるようにする

```TypeScript
// controler.ts


// Put out requirements of MutationObserver.
// - config object
// - callback function
const moConfig: MutationObserverInit = {
  attributes: true,
  childList: false,
  subtree: false,
  attributeOldValue: true,
} as const;

const moCallback = function (
  this: MutationObserver_,
  mr: MutationRecord[]
): void {
  let guard: boolean = false;
  mr.forEach((record: MutationRecord) => {
    if (
      record.type === "attributes" &&
      record.attributeName === "class" &&
      record.oldValue === "" &&
      !guard
    ) {

      guard = true;
      updateHighlightIndexes();
      updateExTranscriptHighlight();
      scrollToHighlight();
    }
  });
};


// NOTE: Renamed. `resetDetectScroll` as new name.
// check `isAutoscrollInitialized` inside funciton.
// Put out requiremnts of MutationObserver.
const resetDetectScroll = (): void => {


    const { isAutoscrollInitialized } = sStatus.getState();
    if(!isAutoscrollInitialized) {
      // 初期化処理
        // 一旦リセットしてから
        if (transcriptListObserver) {
            transcriptListObserver.disconnect();
            transcriptListObserver = null;
        }
        //   NodeListOf HTMLSpanElement
        const transcriptList: NodeListOf<Element> = document.querySelectorAll(
            selectors.transcript.transcripts
        );
        transcriptListObserver = new MutationObserver_(
            moCallback,
            moConfig,
            transcriptList
        );
        transcriptListObserver.observe();
    }
    else {
      // リセット処理: targetを変更するだけ
        transcriptListObserver.disconnect();
                //   NodeListOf HTMLSpanElement
        const transcriptList: NodeListOf<Element> = document.querySelectorAll(
            selectors.transcript.transcripts
        );
        transcriptListObserver._target = transcriptList;
        transcriptListObserver.observe();
    }

};


const updateSubtitle = (prop, prev): void => {
  if (prop.subtitles === undefined) return;

  // 字幕データのアップデート
  const { position, view,
//   isAutoscrollInitialized
  } = sStatus.getState();

  // ...

    //   if (!isAutoscrollInitialized) {
    //     // NOTE: 自動スクロール機能はここで初期化される
    //     setDetectScroll();
    //     sStatus.setState({ isAutoscrollInitialized: true });
    //   }
    initializeIndexList();
    resetDetectScroll();
};

```

#### 2/16

残る課題: 更新

#### API をみてから改善できる点

-   `chrome.tabs.onUpdated`で関係ない URL を無視したいときは filter を使う

##### 自動スクロール機能の実装： ExTranscript が sidebar だと`scrollToHighlight()`が機能しなくなる件の修正

解決

##### background script のアンロード対策

解決

`background.ts::state`モジュールはローカルストレージに保存しないけれど
モジュールの変数を変更する

これだとやっぱりアンロードで消えてしまう

State のインスタンスを state へ渡す
background.ts のメソッドは state を通じて State のインスタンスへ間接的にアクセスする
State は key を使って呼び出しに応じて localStorage を呼出す

```TypeScript
// background.ts

chrome.runtime.onInstalled.addListener(
  async (details: chrome.runtime.InstalledDetails): Promise<void> => {

    try {
      state.unregister();
      await state.register(new State<iModel>(_key_of_model_state__));
      await state.getInstance().clearStorage();
      await state.getInstance().setState(modelBase);
    } catch (err) {
      console.error(err.message);
    }
  }
);


export const state: iStateModule<iModel> = (function () {
  let _instance: State<iModel> = null;

  return {
    register: (m: State<iModel>): void => {
      _instance = m;
    },
    // unregisterする場面では、もはやStateは要らないから
    // Stateを削除しちゃってもいいと思う
    unregister: (): void => {
      _instance = null;
    },
    getInstance: (): State<iModel> => {
      return _instance;
    },
  };
})();


// 現状の使い方...
const s = state.getInstance();
const { tabId } = await s.getState();

// 必須な工程...

// LOCALSTORAGE GET
chrome.storage.local.get(KEY, function(data){

  // dataを外に出す
});

// LOCALSTORAGE SET
await chrome.storage.local.set({KEY: newData});


// State set
// setStateはlocalstorageへ本来すべてのデータを保存しなくていけないところ、
// 一部のプロパティだけ渡してもすべてのデータを保存できるように上書き操作をしてくれることである

// State get
// すべてのデータを受け取ってディープコピーして返すだけ...


// backgrond.ts

// -- GLOBALS -----
const KEY_LOCALSTORAGE = "__key__local_storage_";


// UPDATED state
//
// 変数の保持を一切しないので
// background scriptのアンロード、リロードに耐えられる
const state = (function<TYPE>() {

  const _getLocalStorage = async function(key): Promise<TYPE> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (s: TYPE): void => {
        if(chrome.runtime.lastError) reject(chrome.runtime.lastError);
        resolve(s);
      })
    })
  }

  return {
    // 本来ローカルストレージに保存しておくデータの一部だけでも
    // 保存することを可能とする
    //
  set: async (prop: {[Property in keyof TYPE]?: TYPE[Property]}): void => {
    try {
    const s: TYPE = await _getLocalStorage(KEY_LOCALSTORAGE);
    const newState = {
      ...s, ...prop
    };
    await chrome.storage.local.set({[KEY_LOCALSTORAGE]: newState});

    }
    catch(err) {
      console.error(err.message);
    }
  },

  get: async (): Promise<TYPE> => {
    try {
    const s: TYPE = await _getLocalStorage(KEY_LOCALSTORAGE);
    return {...s};
    }
    catch(err) {
      console.error(err.message);
    }
  },

  clearAll: (): Promise<void> => {
    try {
      await chrome.storage.local.remove(KEY_LOCALSTORAGE);
    }
    catch(err) {
      console.error(err.message);
    }

  }
  };
})();

```

#### event filter 実装

結果、実装しようとしたら`chrome.tabs.onUpdated.addListener`には filter は設けられなかった...

background.ts の`chrome.tabs.onUpdated.addListener`へ filter を設けることで
余計な処理を減らす

```TypeScript
const eventFilter = {
  url: [
    urlMatches: /https:\/\/www.udemy.com\/course\/*/gm
  ]
}
```

#### `chrome.tabs.onUpdated.addListener()`のスリム化

ほぼ解決済（確認不足）

いまのところ、Udemy 講義ページの dashboard にあるような
「Q&A」や「コース内容」、「概要」とかのあらゆる`loading`が発生する
ものを押すといちいち`chrome.tabs.onUpdated.addListener()`が反応してしまい
再レンダリングが行われている

なので余計な URL には反応しないようにする

原因は URL の末尾`#`以下が比較対象に含まれていたこと

`#`以前だけ比較するようにすればいいかも

```TypeScript
// background.ts

// NOTE: new added (helpers.tsへ追加)
const exciseBelowHash = (url: string): string => {
  return url.slice(0, url.indexOf("#"));
}

chrome.tabs.onUpdated.addListener(
    async (
        tabIdUpdatedOccured: number,
        changeInfo: chrome.tabs.TabChangeInfo,
        Tab: chrome.tabs.Tab
    ): Promise<void> => {

        // "https://www.udemy.com/course/*"以外のURLなら無視する
        const { url, tabId, isExTranscriptStructured } = await state.get();

        // 拡張機能が未展開、changeInfo.statusがloadingでないなら無視する
        if (changeInfo.status !== 'loading' || !isExTranscriptStructured)
            return;

        // 拡張機能が展開済だとして、tabIdが展開済のtabId以外に切り替わったなら無視する
        // return;
        if (tabIdUpdatedOccured !== tabId) return;

        // 展開中のtabId && chnageInfo.urlがUdemy講義ページ以外のURLならば
        // 拡張機能OFFの処理へ
        if (isExTranscriptStructured && tabIdUpdatedOccured === tabId) {
            // おなじURLでのリロードか？
            if (changeInfo.url === undefined) {
                // 拡張機能は何もしない
                return;
            } else if (!changeInfo.url.match(urlPattern)) {
                // Udemy講義ページ以外に移動した
                // 拡張機能OFF処理へ
                // TODO: 拡張機能OFF処理の実装


            }

            // 展開中のtabIdである && changeInfo.urlが講義ページだけど末尾が変化した(#以下は無視)
            // 動画が切り替わった判定
            else if (
              // NOTE: 変更部分
                changeInfo.url.match(urlPattern) &&
                exciseBelowHash(changeInfo.url) !== exciseBelowHash(url)
            ) {
                // 動画が切り替わった
                await handlerOfReset(tabIdUpdatedOccured, changeInfo.url);
            }
        }
    }
);

// ほか、state.set({url:newUrl})のときに
// state.set({url:exciseBelowHash(newUrl)})するようにした
```

#### テキストページへの対処

解決済

ページ移動による場合の話。

いまんところの拡張機能の挙動

テキストページなる

`chrome.tabs.onUpdated`が反応し、`handlerOfReset`を呼び出す

`handlerOfReset`内部で`repeatCaptureSubtitles`由来のエラーが発生して処理がストップ

やっぱり onUpdated で検知するしかないね～

```html
<div class="video-viewer--container--23VX7">
    <div class="video-player--container--YDQRW udlite-in-udheavy">
        <!-- .... -->
    </div>
</div>
```

動画ページ以外は
`div.video-viewer--container--23VX7`
をもたない

なのでこのセレクタにマッチする要素がないかを調査すればいい

##### chrome API tips: シングルメッセージは受信側が非同期関数を実行すると必ず接続切れる

`chrome.runtime.onMessage.addListener()`で`return true`しても無駄

おそらく、次のようなこと...

background script でメッセージを送信する
content script が受信する
メッセージ order に非同期関数を実行することが要求されたとする
非同期関数を async/await で実行する
background script で runtime.lastError

理由は、single message passing で受信側の非同期関数の実行を要求すると
非同期関数が async/await 呼出であるにかかわらず
すぐに処理が次に行ってしまうから！

setTimeout や setInterval を Promise でラップして
async/await 呼出しても意味がない...

これを解決するのに chrome.port は役に立つか？
それとも妥協してコールバック地獄にするか？

#### ローディング中 view の実装

#### 自動スクロール機能修正：ハイライト重複

いまんとこ手つかず

なんか起こる時とおこらない時がある？
なんらかの操作をした後になるのかしら？
それともバグがたまたまその Udemy ページで起こっていなかっただけかな？

### ブラウザが閉じたらどうなるのか

ブラウザが閉じた、または拡張機能を展開していたタブが閉じられたとき
それを検知できるかどうか

1. ブラウザが閉じられたことは検知できるか？

参考：https://developer.chrome.com/docs/extensions/mv3/declare_permissions/#background

> Chrome を早く起動し、遅くシャットダウンするようにします。これにより、拡張機能の寿命を延ばすことができます。
> インストールされている拡張機能に「バックグラウンド」権限がある場合、ユーザーが Chrome を起動する前に、ユーザーがコンピューターにログインするとすぐに Chrome が（目に見えない形で）実行されます。
> 「バックグラウンド」権限により、ユーザーが明示的に Chrome を終了するまで、Chrome は（最後のウィンドウが閉じられた後でも）実行を継続します。

つまり拡張機能は ON にしている限りブラウザが開いていようがいまいがずっとバックグラウンドにいる

参考：

https://stackoverflow.com/questions/3390470/event-onbrowserclose-for-google-chrome-extension

> `chrome.window.onRemoved`は使えない

TODO: 要確認
`chrome.tabs.onRemoved`の`removeInfo.isWindowClosing`で知ることができるかも？

2. タブが閉じられたことは検知できるか？

参考： https://developer.chrome.com/docs/extensions/reference/tabs/#event-onRemoved

`chrome.tabs.onRemoved`で検知できる

```TypeScript
chrome.tabs.onRemoved.addListener(
    (
        _tabId: number,
        removeInfo: chrome.tabs.TabRemoveInfo
    ):void => {
        const { tabId } = await state.get();
        if(removeInfo.isWindowClosing) {

            // 後始末
        }
        if(_tabId === tabId) {

            // 後始末
        }
    }
)
```

https://developer.chrome.com/docs/extensions/reference/windows/

> 現在のウィンドウは、現在実行中のコードを含むウィンドウです。これは、最上部のウィンドウまたはフォーカスされたウィンドウとは異なる可能性があることを理解することが重要です。

確かに、ウィンドウからタブを一つ抜き取った後に拡張機能を実行しようとしたところ
フォーカスしている方ではなくて抜き取ったウィンドウを対象にしていた

#### 複数 window だとあとから複製した window.id を取得してしまう問題

ひとまずは対処済

ブラウザは Udemy の講義ページのタブをフォーカスしている
ブラウザは複数窓を開いている
そんなとき、

background script で window.id を取得するとあとから開いた窓の id を取得してしまう

```TypeScript
// getCurrent()でもgetLastFocused()でも変わらない！
    // const w: chrome.windows.Window = await chrome.windows.getLastFocused();
    const w: chrome.windows.Window = await chrome.windows.getCurrent();
    const tabs: chrome.tabs.Tab[] = await chrome.tabs.query({
      active: true,
      windowId: w.id,
    });
    // フォーカスしていないwindow.idを取得してしまっているので
    // POPUPを開いたタブとは関係ないウィンドウのtabを返してしまう
    return tabs[0];
```

これはひどい仕打ちである

POPUP で同じ処理を行うと、popup を開いたタブの window.id を取得してくれる事が確認できた
なので POPUP から window.id と tabId を取得することとする

```TypeScript
// popup.tsx

// before
  const sendInquire = (): void => {
    sendMessagePromise({
      from: extensionNames.popup,
      to: extensionNames.background,
      order: [orderNames.inquireUrl],
    })
      .then((res: iResponse) => {
        const { correctUrl } = res;
        // DEBUG:

        setCorrectUrl(correctUrl);
      })
      .catch((err) => console.error(err.message));
  };

// after
  const verifyValidPage = (): void => {
    chrome.windows.getCurrent()
      .then((res) => {
        return chrome.tabs.query({ active: true, windowId: res.id });
      })
      .then((tabs: chrome.tabs.Tab[]) => {

          const r: RegExpMatchArray = tabs[0].url.match(urlPattern);

        setCorrectUrl(r && r.length);
    })
      .catch((err) => console.error(err.message));
  };

// before
  const buttonClickHandler = (): void => {
    setRunning(true);


        chrome.windows.getCurrent()
      .then((res) => {
        return chrome.tabs.query({ active: true, windowId: res.id });
      })
      .then((tabs: chrome.tabs.Tab[]) => {
          const r: RegExpMatchArray = tabs[0].url.match(urlPattern);

        setCorrectUrl(r && r.length);
    })
    sendMessagePromise({
      from: extensionNames.popup,
      to: extensionNames.background,
      order: [orderNames.run],
    })
      .then((res) => {
        const { success } = res;

        setComplete(success);
        setRunning(false);
        if (!success) {
          throw new Error(
            "Error: something went wrong while extension running"
          );
        }
      })
      .catch((err) => {
        setComplete(false);
        setRunning(false);
        console.error(err.message);
        // alert出した方がいいかな？
      });
  };


// After
  const buttonClickHandler = (): void => {
    setRunning(true);


    sendMessagePromise({
      from: extensionNames.popup,
      to: extensionNames.background,
      order: [orderNames.run],
    })
      .then((res) => {
        const { success } = res;

        setComplete(success);
        setRunning(false);
        if (!success) {
          throw new Error(
            "Error: something went wrong while extension running"
          );
        }
      })
      .catch((err) => {
        setComplete(false);
        setRunning(false);
        console.error(err.message);
        // alert出した方がいいかな？
      });
  };

```

ひとまずは大丈夫な様子
また問題が発覚したときに対処することとする

#### POPUP の View 実装

**Popup は毎回開くたびに新しくなる(state は保持されない)**

なので常に background script から state を取得することとする

https://stackoverflow.com/questions/9089793/chrome-extension-simple-popup-wont-remain-in-last-state

background script から取得するようにした

#### onMessage で非同期関数の完了を待たずに接続が切れる問題

解決済！

参考：
https://stackoverflow.com/questions/53024819/chrome-extension-sendresponse-not-waiting-for-async-function

これの原因はもしかしたら、
`chrome.runtime.onMessage.addListener()`の戻り値が
`boolean`じゃなくて`Promise<boolean>`であるからかも...

下記の通り、

`async/await`呼出をしたいためにコールバック関数を async 関数にしている

これによって、
`chrome.runtime.onMessage.addListener`が`boolean`を返すのではなくて
`Promise<boolean>`を返している

なので非同期関数は解決したときに.then()で sendResponse()を実行すればうまくいくかも？

```TypeScript
// contentScript.ts


// Before...
chrome.runtime.onMessage.addListener(
  async (
    message: iMessage,
    sender,
    sendResponse: (response: iResponse) => void
  ): Promise<boolean> => {

    const { from, order, to } = message;
    const response: iResponse = {
      from: extensionNames.contentScript,
      to: from,
    };
    if (to !== extensionNames.contentScript) return;

    try {
      // ORDERS:
      if (order && order.length) {
        // RESET
        if (order.includes(orderNames.reset)) {


          await handlerOfReset();

          if (sendResponse) {
            sendResponse({
              from: extensionNames.contentScript,
              to: from,
              complete: true,
              success: true,
            });
          }
        }
        // ...
      }
      return true;
    } catch (err) {
      console.error(err.message);
    }
  }
);

// After
chrome.runtime.onMessage.addListener(
  // NOTE: remove async and return boolean
  (
    message: iMessage,
    sender,
    sendResponse: (response: iResponse) => void
  ): boolean => {

    const { from, order, to } = message;
    const response: iResponse = {
      from: extensionNames.contentScript,
      to: from,
    };
    if (to !== extensionNames.contentScript) return;

      // ORDERS:
      if (order && order.length) {
        // RESET
        //
        // NOTE: solve way 1: use promise chain.
        if (order.includes(orderNames.reset)) {


          handlerOfReset()
          .then(() => {

          if (sendResponse) {
            sendResponse({
              from: extensionNames.contentScript,
              to: from,
              complete: true,
              success: true,
            });
          }
          })
          .catch(err => {
            console.error(err);
          })
        }
        //
        // NOTE: solve way 2:
        // use IIFE
        if (order.includes(orderNames.reset)) {

          (async () => {
            try {
              await handlerOfReset();
              if (sendResponse) {
                sendResponse({
                  from: extensionNames.contentScript,
                  to: from,
                  complete: true,
                  success: true,
                });
              }
            }
            catch(err) {console.error(err)}
          })();
        }
        // ...
      }
      // NOTE: MUST RETURN TRUE so that sendResponse returned asynchronously.
      // DO NOT return Promise<boolean>
      return true;
});

```

やっぱり原因は上記のとおりであり修正したら治った!

#### デザイン改善:popup

進捗：slider を設けた、ある程度のデザインは決まった、拡張機能 OFF 機能を実装し終わったらまた手を付ける

**やっぱり Material-ui を使うことにした！**

drawio にアイディアを書き出した 確認のこと
(./design-image.drawio)

参考：
https://uxplanet.org/chrome-extension-popups-design-inspiration-b38de2cbd589

https://stackoverflow.com/questions/20424425/recommended-size-of-icon-for-google-chrome-extension#:~:text=You%20should%20always%20provide%20a,favicon%20for%20an%20extension's%20pages.

svg を自作した:
`./src/statics/udmey-re-transcript.svg`

Material-Ui を webpack で使うときの注意点

とりあえずなさそう

公式のチュートリアル通りに install する

```bash
$ npm install @mui/material @emotion/react @emotion/styled
```

RUN してからの view のアイディア

-   RUN するまえ

REBUILD ボタンが表示されているだけ

-   RUN おしたら

REBUILD ボタンを消して LOADING ボタンを表示

-   COMPLETE したら

LOADING ボタンを fade するか、透明に近くする
それで
COMPLETE alert をスライドさせる（左から右へ）
alert は 3 秒表示したらひっこめる
それで
OFF ボタンと RUNNING...を表示する

アイディアの実装

##### chrome API Tips: icon が表示されないときは

次を確認して

-   アイコンは 128\*128 のアイコンを提供しないといけない
-   48*48、16*16 も提供しないといけない
-   アイコンは PNG 出ないといけない

#### 実装：拡張機能 OFF

済

まず知っておくこと：

-   background script は拡張機能が ON であるかぎり、ブラウザを閉じていても生きている(PC を起動したら起動される)

-   拡張機能を展開したタブが生きている限り、inject した content scritp はそのままである
    なので再度同じタブで run されたときに、既に content script が inject されていることを前提に動かないといかん
    TODO: handlerOfRun の修正: content scritp が既に inject 済である場合を考慮する

OFF のトリガー：

-   case1:展開中のタブで POPUP のスライダーを OFF にする(タブはそのまま)
-   case2:展開中のタブを閉じる
-   case3:展開中のタブを含む window が閉じられる

case1 ですること：

```TypeScript
// トリガー検知
// popupのスライダーハンドラ
// background scriptのメッセージハンドラ
// handlerOfPopupMessage

// iModel

export const modelBase: iModel = {
    // NOTE: OFFにしても各content scriptはtrueのまま
    isContentScriptInjected: true,
    isCaptureSubtitleInjected: true,
    isControllerInjected: true,
    isSubtitleCapturing: false,
    // NOTE: falseにする
    isSubtitleCaptured: true,
    // NOTE: falseにする
    isExTranscriptStructured: true,
    // NOTE: falseにする
    isTranscriptDisplaying: /* it depends */,
    // NOTE: falseにする
    isEnglish: /* whatever */,
    // NOTE: nullにする
    tabId: /* any number */,
    // NOTE: 初期値にする
    url: /* https://... */,
    // NOTE: 初期値にする
    subtitles: /* stored */,
    tabInfo: /* whatever */
} as const;


// contentScript.ts
// リスナをremoveする
// handlerOfReset()の前半部分を実行すればいいだけ
controlbar.removeEventListener('click', handlerOfControlbar);
moControlbar.disconnect(controlbar, config);


// captureSubtitle.ts
// 何もしなくていい

// controller.ts
// handlerOfTurnOff()を実行すればいいだけ

// NOTE: 再度RUNしたときのためにhandlerOfRunを修正する必要がある
```

case2, 3 ですること：

```TypeScript
// 検知部分
chrome.tabs.onRemoved.addListener();

// iModel
// 初期値にリセットする

// 各content script
// case1と同じ

// NOTE: local stroageのクリア
```

```TypeScript
// backgorund.ts

/*******************
 *
 * @param {tabId} number:
 * @param {case} string:
 *  Represents the case of turn-off extension.
 *  "by-slider", "closed".
 *  case1 turn off by slider off on POPUP
 *  case2 triggered by closing the tab extension deployed.
 *  case3 triggered by closing window.
 * */
const handlerOfTurnOff = async(tabId: number, case: string): Promise<void> => {
  try {
    await sendMessageToTabsPromise(tab, {
      from: extensionName.background,
      to: extensionName.contentScript,
      order: [orderNames.turnOff]
    });

    await sendMessageToTabsPromise(tab, {
      from: extensionName.background,
      to: extensionName.controller,
      order: [orderNames.turnOff]
    });

  switch(case) {
    case "by-slider":

    await state.set({
      // NOTE: OFFにしても各content scriptはtrueのまま
      isContentScriptInjected: true,
      isCaptureSubtitleInjected: true,
      isControllerInjected: true,
      isSubtitleCapturing: false,
      // NOTE: falseにする
      isSubtitleCaptured: false,
      // NOTE: falseにする
      isExTranscriptStructured: false,
      // NOTE: falseにする
      isTranscriptDisplaying: false,
      // NOTE: 初期値にする
      isEnglish: /*  */,
      // NOTE: 初期値にする
      tabId: /* any number */,
      // NOTE: 初期値にする
      url: /* https://... */,
      // NOTE: 初期値にする
      subtitles: /* stored */,
      tabInfo: /* whatever */
    });
    break;
    case "closed":
    break;
  }

  }
  catch(err) {

  }
}
```

```TypeScript

// background.ts

// 0. Fix handlerOfRun for case that content script already injected.
// NOTE: どのtabIdで、どのwindowかは今のところ対応しないとする
const handlerOfRun = async (tabInfo: chrome.tabs.Tab): Promise<boolean> => {
    try {

        const { url, id, windowId } = tabInfo;
        const { isContentScriptInject, isCaptureSubtitleInjected, isControllerInjected } = await state.get();

        // Save valid url and current tab that extension popup opened.
        await state.set({
            url: exciseBelowHash(url),
            tabId: id,
            tabInfo: tabInfo,
        });

        //<phase 2> inject contentScript.js
        const { tabId } = await state.get();
        if(!isContentScriptInjected) {
          await chrome.scripting.executeScript({
              target: { tabId: tabId },
              files: ['contentScript.js'],
          });
          await state.set({ isContentScriptInjected: true });
        }

        // TODO: ここでcontentScript.jsが展開完了したのを確認したうえで次に行きたいのだが...実装する技術がない...
        const { language, isTranscriptDisplaying } =
            await sendMessageToTabsPromise(tabId, {
                from: extensionNames.background,
                to: extensionNames.contentScript,
                order: [orderNames.sendStatus],
            });
        // 結果がどうあれ現状の状態を保存する
        await state.set({
            isEnglish: language,
            isTranscriptDisplaying: isTranscriptDisplaying,
        });
        // 字幕が英語じゃない、またはトランスクリプトがONでないならば
        // キャンセル
        if (!language || !isTranscriptDisplaying) {
            // TODO: 失敗またはキャンセルの方法未定義...
            // ひとまずfalseを返している
            return false;
        }

        // <phase 3> inject captureSubtitle.js
        // 字幕データを取得する
        if(!isCaptureSubtitleInjected) {
          await chrome.scripting.executeScript({
              target: { tabId: tabId },
              files: ['captureSubtitle.js'],
          });
          await state.set({ isCaptureSubtitleInjected: true });
        }

        // 字幕取得できるまで10回は繰り返す関数で取得する
        const subtitles: subtitle_piece[] = await repeatCaptureSubtitles(tabId);

        // const { subtitles } = await sendMessageToTabsPromise(tabId, {
        //     from: extensionNames.background,
        //     to: extensionNames.captureSubtitle,
        //     order: [orderNames.sendSubtitles],
        // });

        await state.set({ subtitles: subtitles });

        // <phase 4> inject controller.js
        if(!isControllerInjected) {
          await chrome.scripting.executeScript({
              target: { tabId: tabId },
              files: ['controller.js'],
          });
          await state.set({ isControllerInjected: true });
        }

        const s: iModel = await state.get();
        await sendMessageToTabsPromise(tabId, {
            from: extensionNames.background,
            to: extensionNames.controller,
            subtitles: s.subtitles,
        });

        await state.set({ isExTranscriptStructured: true });
        // ...ここまででエラーがなければ成功
        return true;
    } catch (err) {
        console.error(err.message);
    }
};


// 1. Triiggered by slider button

const handlerOfPopupMessage = async (
    message: iMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: iResponse) => void
): Promise<void> => {
  // ...
  if(order.includes(orderNames.turnOff)) {

    // phase1. reset injected content script
    await turnOffEachContentScripts(tabId: number);
    const {
      isContentScriptInjected,
      isCaptureSubtitleInjected,
      isControllerInjected } = await state.get();
      // content scriptのinject状況だけ反映させてstateを初期値に戻す
    await state.set({
      ...modelBase
      isContentScriptInjected: isContentScriptInjected,
      isCaptureSubtitleInjected: isCaptureSubtitleInjected,
      isControllerInjected: isControllerInjected,
    });
  }
  // ...
}

// NOTE: new added
const turnOffEachContentScripts = async (tabId: number): Promise<void> => {
    try {


        const contentScript = sendMessageToTabsPromise(tabId, {
            from: extensionNames.background,
            to: extensionNames.contentScript,
            order: [orderNames.turnOff],
        });

        const controller = sendMessageToTabsPromise(tabId, {
            from: extensionNames.background,
            to: extensionNames.controller,
            order: [orderNames.turnOff],
        });

        const r: iResponse[] = await Promise.all([contentScript, controller]);

        const failureReasons: string = r
            .filter((_) => {
                if (!_.success) {
                    return _.failureReason;
                }
            })
            .join(' ');

        if (failureReasons) {
            throw new Error(
                `Error: failed to turn off content script. ${failureReasons}`
            );
        }


    } catch (err) {
        console.error(err.message);
    }
}


// 2. Triggered by close tab

chrome.tabs.onRemoved.addListener(
    async (
        _tabId: number,
        removeInfo: chrome.tabs.TabRemoveInfo
    ): Promise<void> => {
      try {
        const { tabId } = await state.get();
        if (removeInfo.isWindowClosing) {

            // 後始末
            // NOTE: 将来的にはそのwinodwに含まれるすべての展開中拡張機能をOFFにする処理が必要になる
            await turnOffEachContentScripts(tabId);
            await state.set(modelBase);
        }
        if (_tabId === tabId) {

            // 後始末
            await turnOffEachContentScripts(tabId);
            await state.set(modelBase);
        }
      }
      catch(err) {
        console.error(err);
      }
    }
);

```

#### 展開中のタブが別の URL へ移動したときの対応

これはたぶん chrome.tabs.onRemoved と同じことなので...

同じ処理をして解決した

#### 展開中にリロードしたときの挙動の実装

現状：

-   ExTranscript は消える
-   background script の state はそのまま

```TypeScript
{
  isCaptureSubtitleInjected: true,
  isContentScriptInjected: true,
  isControllerInjected: true,
  isEnglish: true,
  isExTranscriptStructured: true,
  isSubtitleCaptured: false,
  isSubtitleCapturing: false,
  isTranscriptDisplaying: true,
  subtitles: (107) [{…}, {…},  …],
  tabId: 151,
  tabInfo: {active: true, audible: false, autoDiscardable: true, discarded: false, favIconUrl: 'https://www.udemy.com/staticx/udemy/images/v8/favicon-32x32.png', …}
  url: "https://www.udemy.com/course/chrome-extension/learn/lecture/25576324"
}
```

どうするか：

拡張機能を OFF にする

理由は、google 翻訳も OFF になるからそもそも意味がなくなるし
多分リロードすると content script が排除されている

なのでこれは仕様ということで OFF にすることとする

```TypeScript
chrome.tabs.onUpdated.addListener(
    async (
        tabIdUpdatedOccured: number,
        changeInfo: chrome.tabs.TabChangeInfo,
        Tab: chrome.tabs.Tab
    ): Promise<void> => {
        // "https://www.udemy.com/course/*"以外のURLなら無視する
        const { url, tabId, isExTranscriptStructured } = await state.get();

        // 拡張機能が未展開、changeInfo.statusがloadingでないなら無視する
        if (changeInfo.status !== 'loading' || !isExTranscriptStructured)
            return;

        // 拡張機能が展開済だとして、tabIdが展開済のtabId以外に切り替わったなら無視する
        // return;
        if (tabIdUpdatedOccured !== tabId) return;

        // 展開中のtabId && chnageInfo.urlがUdemy講義ページ以外のURLならば
        // 拡張機能OFFの処理へ
        if (isExTranscriptStructured && tabIdUpdatedOccured === tabId) {
            // おなじURLでのリロードか？
            if (changeInfo.url === undefined) {

                await state.set(modelBase);
            } else if (!changeInfo.url.match(urlPattern)) {
                // Udemy講義ページ以外に移動した

                await state.set(modelBase);
            }

            // 展開中のtabIdである && changeInfo.urlが講義ページである
            // その上でURLが変化した
            // NOTE: Compare URL WITHOUT below hash.
            else if (
                changeInfo.url.match(urlPattern) &&
                exciseBelowHash(changeInfo.url) !== exciseBelowHash(url)
            ) {
                // ページが切り替わった
                // NOTE: MUST Update URL

                await state.set({ url: exciseBelowHash(changeInfo.url) });

                // 動画ページ以外に切り替わったのか？
                const res: iResponse = await sendMessageToTabsPromise(tabId, {
                    from: extensionNames.background,
                    to: extensionNames.contentScript,
                    order: [orderNames.isPageIncludingMovie],
                });

                // TODO: Fix Udemyで動画ページに切り替わったのに
                // 動画ページじゃない判定してくる...
                // これの対処
                // DEBUG:
                //


                res.isPageIncludingMovie
                    ? // 次の動画に移った
                      await handlerOfReset(tabIdUpdatedOccured)
                    : // 動画を含まないページへ移った
                      await handlerOfHide(tabIdUpdatedOccured);
            }
        }
    }
);


```

#### 修正：window-id と tabId からなる ID で state を区別する

[chrome-extension-API:Window](#chrome-extension-API:Window)より

今フォーカスしているウィンドウのアクティブタブ（表示中タブ）を取得する方法はわかった

#### エラーハンドリング実装

(JavaScript エラーハンドリング)[#JavaScript エラーハンドリング]
を参考にリファクタリング

&&

エラーハンドリング実装

いったんユーザの操作を起点としてアプローチしてみる

1. 実行ボタンを押してからエラーが起こった時

考えられる原因@background.ts :

-   state が初期化されていない(chrome.runtime.onInstalled が実行されていない)
-   `cotnentScript`への`orderNames.sendStatus`オーダのレスポンスのいずれかが false だった時

考えられる原因@contentScript.ts :

-   `initialize()`時、`controlbar`が取得できない
    background へ伝えるには background へ sendMessage するしかない

-   `orderNames.sendStatus`の対応中に、DOM が取得できない
    検知するにはすべての DOM 取得関数の後に条件分岐を設けること
    条件分岐でエラースローすること

Refac: `finally`で`sendResponse()`するようにする && `try...catch`の範囲を小さくする

結局エラーは background へ通知しないといけないし、
`sendMessageToTabsPromise`は失敗成功にかかわらず
`{complete: true}`を取得しない限り
`runtime.lastError`が起こる

```TypeScript
// contentScript.ts

// helper: wrapper of document.qeurySelectorAll() for Not found DOM.
const qsa = <T>(selector: string, target: HTMLElement | Element = null): NodeListOf<T> => {
  const e: NodeListOf<T> = target ? target.querySelectorAll<T>(selector) : document.querySelectorAll<T>(selector);
  if(!e) throw new DomManipulationError(`DOM could not caputred with ${selector}`);
  else return e;
}

// helper: wrapper of document.qeurySelector()
const qs = <T>(selector: string, target: HTMLElement | Element = null): T => {
  const e: T = target ? target.querySelector<T>(selector) : document.querySelector<T>(selector);
  if(!e) throw new DomManipulationError(`DOM could not caputred with ${selector}`);
  else return e;
}


// Refactored
// querySelectorがnullだったら例外をスローするラッピング関数を使うことにする
/****************************
 * @return {boolean} true as Subtitle is English, false as but English.
 * @throw {DomManipulationError}
 *
 *
 * */
const isSubtitleEnglish = (): boolean => {

 try {
  const listParent: NodeListOf<HTMLElement> = qsa<HTMLElement>(
    selectors.controlBar.cc.menuListParent);

  const checkButtons: NodeListOf<HTMLElement> = qsa<HTMLElement>(
      selectors.controlBar.cc.menuCheckButtons, listParent);

  const menuList: NodeListOf<HTMLElement> = qsa<HTMLElement>(
    selectors.controlBar.cc.menuList, listParent
  );
 }
 catch(err) {
     console.error(err.message);
   throw err;
 }

  let counter: number = 0;
  let i: number = null;
  const els: HTMLElement[] = Array.from<HTMLElement>(checkButtons);
  for (const btn of els) {
    if (btn.getAttribute("aria-checked") === "true") {
      i = counter;
      break;
    }
    counter++;
  }

  if (i === null) {
    // NOTE: どういうわけか、いずれの字幕も選択されていなかったとき
    //
    // 結局のところ英語字幕じゃないと動作できないので
    // falseを返すことにする
    return false;
  }
  const currentLanguage: string = Array.from(menuList)[i].innerText;
  if (currentLanguage.includes("English") || currentLanguage.includes("英語"))
    return true;
  else return false;
};



chrome.runtime.onMessage.addListener(
  (
    message: iMessage,
    sender,
    sendResponse: (response: iResponse) => void
  ): boolean => {

    const { from, order, to } = message;
    const response: iResponse = {
      from: extensionNames.contentScript,
      to: from,
    };
    if (to !== extensionNames.contentScript) return;

    // ORDERS:
    if (order && order.length) {
      // SEND STATUS
      if (order.includes(orderNames.sendStatus)) {

        try {
          const isEnglish: boolean = isSubtitleEnglish();
          let isOpen: boolean = false;
          const toggle: HTMLElement = document.querySelector<HTMLElement>(
            selectors.controlBar.transcript.toggleButton
          );
          if (!toggle) isOpen = false;
          else isOpen = isTranscriptOpen();

          response.language = isEnglish;
          response.isTranscriptDisplaying = isOpen;
        }
        catch(err) {
          response.success = false;
          // failureReasonを投げるよりも、
          // Errorインスタンスそのものを渡した方がいいかも？
        //   TODO: ErrorインスタンスをiResponseに含める
        response.error = err;
        //   response.failureReason = err.message;
          // ここでエラースローしても受け取る相手がいない
          // 結局backgroundへ伝えるにはメッセージを送信するしかない
          // throw new PageStatusNotReadyError(err.message);
        }
        finally {
            response.complete = true;
          sendResponse(response);
        }
      }
      // RESET
      if (order.includes(orderNames.reset)) {

        handlerOfReset()
          .then(() => {
            response.success = true;
          })
          .catch((err) => {
            console.error(err);
            response.success = false;
            response.error = err;
          })
          .finally(() => {
            response.complete = true;
              sendResponse(response)
          });
      }
      // Require to make sure the page is including movie container or not.
      if (order.includes(orderNames.isPageIncludingMovie)) {

        repeatQuerySelector(selectors.videoContainer)
          .then((r: boolean) => {
            response.isPageIncludingMovie = r;
            response.success = true;
          })
          .catch((err) => {
            console.error(err);
            response.success = false;
            response.error = err;
          })
          .finally(() => {
              response.complete = true;
              sendResponse(response)
          });
      }
      // TURN OFF
      if (order.includes(orderNames.turnOff)) {

        moControlbar.disconnect();
        controlbar.removeEventListener("click", handlerOfControlbar);
        // moControlbarとcontrolbarはnullにしておく必要があるかな？
        // その後のorderによるなぁ
        response.complete = true;
        sendResponse(response);
      }
    }
    return true;
  }
);

```

```TypeScript
// constants.ts
export type uError = ErrorBase | DomManipulationError | PageStatusNotReadyError;

export interface iResponse {
    // ...
    error?: uError;

}


try {

}
catch(err) {
    // TODO:
}
finally {
    response.complete = true;
    sendResponse(response);
}
```

##### RUN プロセスの最中のエラーハンドリング

RUN するタイミングによってはまだ Udemy 講義ページがローディングの可能性がある

となると

contentScript.js が orderNames.sendStatus 対応中に時間を置くようにすればいいかも

なにか重要な DOM が取得するときは`./utils/helpers.ts::repeatActionPromise()`を使うとか

1. 予測可能・起こっても対処可能なエラー

共通：ローディング中につき DOM が取得できない

2. 予測できない・起こってはならないエラー

NOTE: 共通：セレクタが不一致による問題はアプリ実行不可能

なので素直にアプリ実行不可能にして開発者に連絡しろがいいのかもしれない

TODO: CSS セレクタ不一致なら例外を起こす仕組み
TODO: controller.ts, transcriptView 系のエラーの可能性のある場所の精査
TODO: エラーまたは false 等を受け取った時の background.ts の挙動の決定、実装

#### controller.ts のエラー精査

TODO: MutationObserver の例外処理の実装
TODO: 字幕データ配列が空だった時におかしな挙動が発生し得ないか検証

やっぱり気を付けるべきは DOM 取得の失敗である

例外スローはもっとも近い catch が捕まえるのが仕様なので

基本的に`chrome.runtime.onMessage.addListener()`で catch することとする

各関数は、DOM 取得が失敗したら例外を必ず投げるようにリファクタリングする

MutationObserver はどうすべきか？

MO は order に基づいて動くものではない

なので`chrome.runtime.onMessage.addListener()`で catch するものではない

```TypeScript
// controller.ts

// getElementIndexOfList()を呼出すのはupdateHighlightIndexes()だけ
// updateHighlightIndexes()を呼び出すのはmoCallback()だけ
// updateExTranscriptHighlight()を呼び出すのはmoCallback()だけ
//
// ということでこれらの関数が投げる例外はmoCallbackがcatchすべき


// MutationObserverの実行中の例外はコールバック関数でキャッチする
const moCallback = function (
  this: MutationObserver_,
  mr: MutationRecord[]
): void {
  let guard: boolean = false;
  mr.forEach((record: MutationRecord) => {
    if (
      record.type === "attributes" &&
      record.attributeName === "class" &&
      record.oldValue === "" &&
      !guard
    ) {

      guard = true;
      try {
        updateHighlightIndexes();
        updateExTranscriptHighlight();
        scrollToHighlight();
      }
      catch(e) {
        chrome.runtime.sendMessage({
          from: extensionNames.controller,
          to: extensionNames.background,
          error: e
        });
      }
    }
  });
};


```

#### backgrond Exception Handling

実装するもの：

例外ハンドラ（最終的な例外スロー先）
iResponse.error で拡張機能の例外を取得したあとの処理
background script 自身の例外を処理する

実装するにあたって：

エラーと例外を分類するここと

-   `chrome.runtime.onInstalled.addListener()`

state.clear(), state.set()の失敗
chrome.storage.local.set()起因
chrome.storage.local.get()起因
ただし、どんなエラーが起こるのか不明...
起こる可能性がほぼない（経験したことない）

万が一起こった場合：

`chrome.runtime.onInstalled.addListener()`で catch して alert する

```TypeScript
// background.ts

chrome.runtime.onInstalled.addListener(
async (details: chrome.runtime.InstalledDetails): Promise<void> => {

  try {
    state.clearAll();
    state.set(modelBase);
  } catch (err) {
    console.error(err.message);
    alert()
  }
}
);



const state: iStateModule<iModel> = (function () {
const _getLocalStorage = async function (key): Promise<iModel> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (s: iModel): void => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      resolve(s);
    });
  });
};

return {
  // 本来ローカルストレージに保存しておくデータの一部だけでも
  // 保存することを可能とする
  //
  set: async (prop: {
    [Property in keyof iModel]?: iModel[Property];
  }): Promise<void> => {
    try {
      const s: iModel = await _getLocalStorage(KEY_LOCALSTORAGE);
      const newState = {
        ...s[KEY_LOCALSTORAGE],
        ...prop,
      };
      await chrome.storage.local.set({
        [KEY_LOCALSTORAGE]: newState,
      });
    } catch (e) {
      console.error(`Error: Problem ocurreud while chrome.storage`);
      throw e;
    }
  },

  get: async (): Promise<iModel> => {
    try {
      const s: iModel = await _getLocalStorage(KEY_LOCALSTORAGE);
      return { ...s[KEY_LOCALSTORAGE] };
    } catch (err) {
      console.error(`Error: Problem ocurreud while chrome.storage`);
      throw e;
    }
  },

  clearAll: async (): Promise<void> => {
    try {
      await chrome.storage.local.remove(KEY_LOCALSTORAGE);
    } catch (err) {
      console.error(`Error: Problem ocurreud while chrome.storage`);
      throw e;
    }
  },
};
})();

```

#### update: `sendMessageToTabsPromise`と例外処理

いま`sendMessageToTabsPromise`は`{complete: true}`が返されないと reject される

一方、拡張機能はたとエラーを返す場面であっても`{complete: true}`を返している

これはおかしな状況なので、

message-passing でエラーをやり取りするときは、

それは`reject`として扱う

こうすればメッセージパシンでエラーを受け取った時点ですぐに処理を異常系に
移動できる

あと成功と失敗を明確にできる

TODO: 全体にリファクタリング...これは大変だぞ...

```TypeScript
// helpers.ts

export const sendMessageToTabsPromise = async (
  tabId: number,
  message: iMessage
): Promise<iResponse> => {
  return new Promise(async (resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, async (response: iResponse) => {
      const { complete, error, ...rest } = response;
      complete ? resolve(rest) : reject(error);
    });
  });
};

export const sendMessagePromise = async (
  message: iMessage
): Promise<iResponse> => {
  return new Promise(async (resolve, reject) => {
    chrome.runtime.sendMessage(message, async (response: iResponse) => {
      const { complete, error, ...rest } = response;
      complete ? resolve(rest) : reject(error);
    });
  });
};


// 呼び出し側
function() {
  try {
    // This might throw error.
    const res: iResponse = await sendMessageToTabsPromise(tabId, {
      from: extensionNames.background,
      to: extensionNames.contentScript,
      order: [orderNames.isPageIncludingMovie],
    });
  }
  // sendMessageToTabsPromise()呼出には必ずtry...catchをつけること
  catch(e) {
    // error handling
  }
}

// 返事する側
function() {
  // ....

  // If process succeed
  sendResponse({
    complete: true,   // Required and specified true as succeed.
    // ...
    })
  // else if not
  sendResponse({
    complete: false,    // Required and specified false as fail.
    error: new Error("error message"),  // required.
  })
}

```

##### chrome-extension-tips: alert

**アラートを出すには content script で実行しないと意味ない**

たぶん実行コンテキストが異なるからだと思う

background script で alert しても実行環境がブラウザのページと異なるから

content script ならページに埋め込まれるからできる、という話である

## すること

エラーダイアグラムを書く
popup ボタンのスタイルの実装
popup のボタンのローディングはドットアニメーションにする

## Google 翻訳と連携させるとおこる不具合対処

解決はしていないけど、できる限りの回避策は施せた

まず確認される問題：

-   Google 翻訳済のページは拡張機能は使えないのは仕様にしましょう
-   拡張機能実行してから Google 翻訳して、ページが次に遷移したときに、ExTranscript の字幕一番目の字幕の塊が大きすぎる
    たぶん、Google 翻訳がページ遷移後に拡張機能を実行してして、英語を日本語に翻訳完了させた部分はすべてこの塊に含まれるのだと思う
    Google 翻訳の実行スピードと captureSubtitle と controller のスピード勝負になっている
-   上記とおそらく同じ理由で場合によってはページ遷移後に字幕が取得できないかもしれない

```html
<!-- 翻訳前 -->
<div class="transcript--cue-container--wu3UY">
    <p
        data-purpose="transcript-cue"
        class="transcript--underline-cue--3osdw"
        role="button"
        tabindex="-1"
    >
        <span data-purpose="cue-text" class=""
            >So we talked about the Cascade</span
        >
    </p>
</div>

<!-- 翻訳後 -->
<div class="transcript--cue-container--wu3UY">
    <p
        data-purpose="transcript-cue"
        class="transcript--underline-cue--3osdw"
        role="button"
        tabindex="-1"
    >
        <span data-purpose="cue-text" class="">
            <font style="vertical-align: inherit;">
                <font style="vertical-align: inherit;"
                    >だから私たちはカスケードについて話しました</font
                >
            </font>
        </span>
    </p>
</div>
```

なんか`font`というタグが追加されている（これは特に問題ではなかった）

Google 翻訳済ページを確認してみたところ、

```bash
# chrome dev tools console
# captureSubtitle.tsと同じ処理
$ const span = document.querySelectorAll("div.transcript--cue-container--wu3UY p.transcript--underline-cue--3osdw span");
# 結果、初めの10行分はすでにGoogle翻訳によって翻訳済の字幕テキストを取得していた
# 10行分よりあとは英語字幕を取得していた
# おそらく、
# captureSubtitle.tsで字幕取得している最中にすでにGoogle翻訳が翻訳（字幕の変換）をすすめており、
# 前半10行ほどは翻訳済をcaptureSubtitle.tsが取得してしまったが、それ以降は翻訳返還される前に取得できたため、
# 正常に取得できたのだと思う
$ const subtitle = Array.from(span).map(function(s) {return s.innerText.trim()});

# 以下のプロパティが確認でき、唯一翻訳前の字幕テキストを取得していた
$ span[0].__reactEventHandlers$l71b4sw2al.children
# ただし、$以降の文字列はランダム生成の模様で取得は不可能...
```

ということで
解決方法はなく

とにかくこちらの拡張機能のスピードをあほほど早くするほかない...

ということで各 setTimeout や setInterval のタイマー時間を可能な限り短くした
これで今のところ大きな塊を取得しないで済んでいるが...

ローディングがかかりすぎる場合は拡張機能が機能しなくなることを仕様として追記したほうがいいね...

#### 実装：字幕取得処理のループ処理を 1 周ではなくて 2 週にする

TODO: `repeatCaptureSubtitles()`を条件次第で 2 周させるようにする

条件：字幕データが取得できなかったらもう 1 周

今回の処理に伴う変更: TODO: 2 周するかわりインターバルの間隔を短くする

`circulaterPromise`という関数を作った

引数に渡した callback 関数を、おなじく引数に渡した number の回数だけ
繰り返し実行する

この繰り返し処理は非同期処理関数を実行するが、

繰り返し各周回非同期処理関数を await 呼び出しなので
毎度非同期処理関数の完了を待ってから次の繰り返しへ移る

NOTE: for ループは、ループ中に実行する関数が await 呼出ならばその実行される関数の完了を待ってから次のループに行く仕様

for ループ中に実行する非同期関数が解決したとして
その解決を持ってループ処理を停止したいときは、
break をつけないといけないのか？

参考：
https://stackoverflow.com/questions/55207256/will-resolve-in-promise-loop-break-loop-iteration

> If you want to break the loop, you have to do that with break or return.

ということで、`break`または`return`を付けないといけない

つくってみたけど...

```TypeScript
// 要はこういうことをしたい
// repeactCaptureSubtitles()がほしい値を返すならばループ終了で呼び出し元に戻る
// ほしい値が取得できなかったら取得できるまでまたは任意のループ回数に到達するまで
// 同じ処理を繰り返す
async function(): Promise<subtitle_piece[]> {
  let s: subtitle_piece[] = null;
  s = await repeactCaptureSubtitles(tabId);
  if(!s.length){
    s = await repeactCaptureSubtitles(tabId);
  }
  else return s;
  if(!s.length){
    s = await repeactCaptureSubtitles(tabId);
  }
  else return s;
  // ...continue until arbirary times...
}

// 以下のようにしてもいいけれど、
// 完全にrepeatCaptureSubtitles()に特化した関数なので
// 再利用性はない
const circulater = async function(callback, until, tabId) {
  return function() {
    for(let i = 0; i < until; i++){
      const r: subtitle_piece[] = await repeactCaptureSubtitles(tabId);
      if(r.length) return r;
    }
  }
}

// 改善案１
// 条件分岐を記述した関数でcallbackをラップする
const wRepeactCaptureSubtitles = async function(tabId) {
      const r: subtitle_piece[] = await repeactCaptureSubtitles(tabId);
      if(r.length) return r;
}

// callback関数はbooleanを返すならばどんな関数でもうけつけることが
// できるようになった
const circulater = async function(callback, until) {
  return function() {
    for(let i = 0; i < until; i++){
      const r: boolean = await callback();
      if(r) return;
    }
  }
}

// 問題点：これだと肝心なsubtitle_piece[]データが返せていない
//
// つまり、
// ループを継続するかの条件信号の値と
// ループで実行したい関数から取得できる戻り値の
// 両方を扱わないといけないのである

// 改善案２
// 条件分岐の関数とcallback関数を分ける
// 実行したい処理：callback
// ループを継続するのかの条件分岐判定関数：isLoopDone
const conditoinal = function(result: subtitle_piece[]) {
  return result.length ? true : false;
}

const circulater = async function(callback, isLoopDone, until: number): Promise<subtitle_piece[]> {
  return function() {
    for(let i = 0; i < until; i++){
      let result: subtitle_piece[];
      // 実行したい関数から結果を受け取っておく
      result = await callback();
      // callbackの結果をループ継続させるか判定する関数に渡す
      if(isLoopDone(result)) return result;
    }
  }
}

const repeactSubtitleCapturing = circulater(repeactCaptureSubtitles, conditional, 3);
const data = await repeactSubtitleCapturing()

// 問題点：ループが終わるまでcallbackからほしい値が取得できなかったときの
// 処理を定義していない


// 案２の改善策
//
// T型をあつかっていて、T型を返すことになっているので
// ループが終了を迎えてから返す値もT型に配慮しないといけない
//
// なので1回前のループのときのcallback関数の戻り値を返すようにすればいいかも
const circulater = function<T>(callback, isLoopDone, until: number) {
  return async function(): Promise<T> {
    // 予めループの外にresult変数を置いて
      let result: T;
    for(let i = 0; i < until; i++){
      result = await callback();
      if(isLoopDone(result)) return result;
    }
    // ループが終わってしまったら最後のresultを返せばいい
    return result;
  }
}

// callback関数
//
// callback関数は完全にハードコーディングである
//
// 実際に実行したい関数をラッピングする
// 実行したい関数へ渡す引数はここで渡す
const cb = async function(): subtitle_piece[] {
    const { tabId } = await state.get();
    const r: subtitle_piece[] = await repeactCaptureSubtitles(tab);
    return r;
}
// conditional関数
//
// conditional関数も完全にハードコーディングである
//
const conditoinal = function(result: subtitle_piece[]): boolean {
  return result.length ? true : false;
}

// 最大3回cb関数がループ処理される
const repeactSubtitleCapturing = circulater<subtitle_piece[]>(cb, conditional, 3)
const data: subtitle_piece[] = await repeactSubtitleCapturing();


//// 完成版 ////////////////////////////////////////////
//
//
interface iCallbackOfCirculater {
  <T>(): Promise<T>
};
interface iConditionOfCirculater {
  <T>(operand: T): T
};
interface iClosureOfCirculater {
  <T>(): Promise<T>
};
type iOp = boolean;

// HIGH ORDER FUNCTION
//
// 再利用性のある非同期関数の任意ループ処理ラッパー
const circulater = function(
  callback: iCallbackOfCirculater,
  condition: iConditionOfCirculater,
  until: number): iClosureOfCirculater {
  return async function<T>() {
    // 予めループの外にresult変数を置いて
      let result: T;
    for(let i = 0; i < until; i++){
      result = await callback();
      if(condition(result)) return result;
    }
    // ループが終わってしまったら最後のresultを返せばいいのだが...
    // エラーを出すかも:
    // "TypeScriptがresultが初期化されないままなんだけど"
    //
    // 必ずresultはforループで初期化されるからってことを
    // TypeScriptへ伝えたいけど手段がわからん
    return result;
  }
}

// USAGE

// 実際に実行したい関数
const counter = async (times: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    let timerId: number;
    let num: number = 0;
    timerId = setInterval(function() {

      if(num >= times) {
        clearInterval(timerId);
        const random_boolean = Math.random() < 0.7;
        resolve(random_boolean ? true : false);
      }
      else num++;
    }, 1000);
  })
}


// circulaterへ渡すcallback関数
//
// 完全にハードコーディング
//
// 実際に実行したい関数へ渡さなくてはならない引数はここで渡すこと
// 戻り値は任意であるが、condition関数のgenerics型と同じにすること
const cb: iCallbackOfCirculater = async (): Promise<boolean> => {
  const n: boolean = await counter(7);

  return n;
};

// circulaterへ渡すconditon関数
//
// 完全にハードコーディング
//
// circulaterへ渡す引数callbackの戻り値の型と同じ型をgenericsとして渡すこと
const counterCondition: iConditionOfCirculater = <iOp>(operand: iOp): iOp => {

  return operand ? true: false;
}

const counterLoop = circulater(cb, counterCondition, 3);

(async function() {
  const r = await counterLoop();

})();
```

#### TypeScript Tips: 引数として関数が必要だけど、関数ならなんでもいいとき

どうやってそいつに型付け定義すればいいんじゃ？

結論：

結局法則を見出してちがちに型付けする必要がある

参考：

https://stackoverflow.com/questions/14638990/are-strongly-typed-functions-as-parameters-possible-in-typescript

つまり、
その関数の引数は複数かもしれないし一つだけでいいかもしてないしそもそもいらないかもしれない
その関数の引数がどんな型かはわからない

[実装：字幕取得処理のループ処理を 1 周ではなくて 2 週にする](#実装：字幕取得処理のループ処理を1周ではなくて2週にする)

での`circulater()`みたいなの

```TypeScript
const circulater = async function(callback, isLoopDone, until: number): Promise<T> {
  return function() {
    // 予めループの外にresult変数を置いて
      let result: T;
    for(let i = 0; i < until; i++){
      result = await callback();
      if(isLoopDone(result)) return result;
    }
    // ループが終わってしまったら最後のresultを返せばいい
    return result;
  }
}

```

上記の`callback`と`isLoopDone`は関数である

callback は T 型の値を返す関数である、
isLoopDone は T 型の値を引数にとって、boolean を返す関数

## Google 翻訳を実行したあとに拡張機能 OFF からの ON にすると英語字幕は最早取得できない件

解決済

修正

結構深刻やねこれ...

つまりこういう経緯です

-   拡張機能を ON にして字幕を再生成した ExTranscript を出力した
-   Google 翻訳を実行していい感じの翻訳字幕を取得できた
-   拡張機能を OFF にした(トランスクリプトが閉じられた、window サイズが小さくなりすぎたなど...)
-   再度拡張機能を ON にした(トランスクリプトが再度開かれた、window サイズがリサイズされたなど...)
-   すでに字幕が翻訳済のデータから captureSubtitle するので、英語字幕が取得できずおかしな字幕が出力されてしまう

ということで、

一度取得できた英語字幕またはそこから生成できた整形字幕は
「現在のレクチャーページ以外に移動」するまでは保存したままにしたほうがいいね...

つまり、

保存タイミング：

-   handlerOfRun 時
-   chrome.tabs.onUpdated.addListener()で「次のレクチャーページに移動した」判定後の最初の字幕取得時

消去タイミング：

chrome.tabs.onUpdated.addListener()で「次のレクチャーページに移動した」判定後の最初の字幕取得前

その間：

必ず保存された字幕からデータを取得すること

詳細:

#### 保存タイミング

```TypeScript


chrome.tabs.onUpdated.addListener(
  async (
    tabIdUpdatedOccured: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    Tab: chrome.tabs.Tab
  ): Promise<void> => {
      //...
    //   ...
    if (isExTranscriptStructured && tabIdUpdatedOccured === tabId) {
      //...
      //...
      //...
        res.isPageIncludingMovie
        // NOTE: 保存タイミングはこのときのhandlerOfReset()内での字幕取得
          ? // 次の動画に移った
            await handlerOfReset(tabIdUpdatedOccured)
          : // 動画を含まないページへ移った
            await handlerOfHide(tabIdUpdatedOccured);
      }
    }
  }
);

// NOTE: 保存タイミング２
// ただしすでに保存しているので修正の必要なし
    const subtitles: subtitle_piece[] = await circulateRepeatCaptureSubtitles();
    await state.set({ subtitles: subtitles });

```

重要なのは保存タイミング以外の時は保存字幕をロードするようにして DOM から取得しないようにすること

修正すべきは`handlerOfReset`だけ

```TypeScript
const handlerOfReset = async (tabId: number): Promise<void> => {
  try {

    await state.set({
      isTranscriptDisplaying: false,
      isSubtitleCaptured: false,
      isSubtitleCapturing: true,
    //   NOTE: 修正
    // subtitlesを消すかどうかはケースによる
      subtitles: [],
    });

    await resetEachContentScript(tabId);

    // NOTE: 修正
    // 任意にstateから取得するのかDOMから取得するのか選べるようにする
    // もしくは
    // handlerOfResetのオーバーロード関数を作る
    const newSubtitles: subtitle_piece[] = await repeatCaptureSubtitles(tabId);

    await state.set({
      isSubtitleCaptured: true,
      isSubtitleCapturing: false,
      subtitles: newSubtitles,
    });

    const resetOrder: iResponse = await sendMessageToTabsPromise(tabId, {
      from: extensionNames.background,
      to: extensionNames.controller,
      order: [orderNames.reset],
    });

    const resetSubtitle: iResponse = await sendMessageToTabsPromise(tabId, {
      from: extensionNames.background,
      to: extensionNames.controller,
      subtitles: newSubtitles,
    });

    await state.set({
      isTranscriptDisplaying: true,
    });


  } catch (e) {
    throw e;
  }
};

//
// ひとまずの修正
//

const handlerOfReset = async (
    tabId: number
    // NOTE: 修正： 字幕は予め取得して渡されることとする
    subtitles: subtitle_piece[]
): Promise<void> => {
  try {

    await state.set({
      isTranscriptDisplaying: false,
      isSubtitleCaptured: false,
      isSubtitleCapturing: true,
    //   NOTE: 修正: ここではsubtitlesを消去しない
    //   subtitles: [],
    });

    await resetEachContentScript(tabId);

    // NOTE: 修正: 字幕データはこの関数の外で取得することにする
    // const newSubtitles: subtitle_piece[] = await repeatCaptureSubtitles(tabId);

    await state.set({
      isSubtitleCaptured: true,
      isSubtitleCapturing: false,
      subtitles: subtitles,
    });

    const resetOrder: iResponse = await sendMessageToTabsPromise(tabId, {
      from: extensionNames.background,
      to: extensionNames.controller,
      order: [orderNames.reset],
    });

    const resetSubtitle: iResponse = await sendMessageToTabsPromise(tabId, {
      from: extensionNames.background,
      to: extensionNames.controller,
      subtitles: subtitles,
    });

    await state.set({
      isTranscriptDisplaying: true,
    });


  } catch (e) {
    throw e;
  }
};


// USAGE
// NOTE: 呼出しルール：予め字幕データを取得してhandlerOfResetへ渡す
//
// reset時はstateから取得する
const { tabId, subtitles } = await state.get();
// or
// ページ移動後はDOMから取得する
const subtitles: subtitle_piece[] = await repeatCaptureSubtitles(tabId);

await handlerOfReset(tabId, subtitles);
```

関数の引数の中で await 呼出しした関数の戻り値を受け取るのはアリらしい...

ということで次のような呼び出しができる

```TypeScript
const handlerOfReset = async (
    tabId: number
    // NOTE: 修正： 字幕は予め取得して渡されることとする
    subtitles: subtitle_piece[]
): Promise<void> => {};

// これなら呼び出し側でコントロールできる
await handlerOfReset(tabId, (await state.get()).subtitles);
await handlerOfReset(tabId, await repeatCaptureSubtitles(tabId));
```

Tips:

`(await state.get()).subtitles`のような呼び出しは実現可能な模様

codesandbox で確認済

```JavaScript

(async function() {
  // await foo()
  const foo = async function() {
    return new Promise((resolve, reject) => {

      setTimeout(function() {
        resolve({
          subtitles: "this is awesome subtitle"
        });
      }, 2000);
    })
  };

  // const r = (await foo()).subtitles;
  //

  const bar = async function(subtitles) {

  }

  bar((await foo()).subtitles);
    // this is awesome subtitles
})();

```

#### JavaScript Tips: invoke await function in parameter

参考：

https://stackoverflow.com/questions/52654525/using-an-await-in-function-parameter

関数の引数()の中で async 関数を`await`呼出するのは**あり**である

条件：

呼出できるのは async 関数の引数（）内のみである？

しかし同期関数の中でも実行出来たなぁ...

```TypeScript
interface iState {
  subtitles: string[];
  otherProp: iProp;
}

const state = (function() {
  const _state: iState;

  // ...

  return {
    // ....
    get: async (): Promise<iState> => {
      return {..._state}
    },
    set: async (props: {[Property in keyof iState]?: iState[Property]}): Promise<void> => {
      _state = {
        ..._state, ...props
      }
    }
  }
})();

await state.set({subtitles: [
  "subtitle1",
  "subtitle2",
  "subtitle3",
  "subtitle3",
  "subtitle4",
]})

const functionRequiresSubtitleData = async (subtitles: string[]): Promise<void> => {

}

// NOTE: 関数の中でawait呼出は可能である
// NOTE: あと(await f()).propertyという取得の仕方もありなそうな
await functionRequiresSubtitleData((await state.get()).subtitles);
// outputs...
// ["subtitle1",
// "subtitle2",
// "subtitle3",
// "subtitle3",
// "subtitle4"],


// await functionRequiresSubtitleData((await state.get()).subtitles)は以下と同等
(async function () {
  const { subtitles } = await state.get();
  await functionRequiresSubtitleData(subtitles);
})();
```

以下も同様。
Codesandbox で確認済。

```JavaScript

(async function() {
  // await foo()
  const foo = async function() {
    return new Promise((resolve, reject) => {

      setTimeout(function() {
        resolve({
          subtitles: "this is awesome subtitle"
        });
      }, 2000);
    })
  };

  // const r = (await foo()).subtitles;
  //

  const bar = async function(subtitles) {

  }

  bar((await foo()).subtitles);
    // this is awesome subtitles
})();

```

## `setTimeout`, `setInterval`を background script で使うな

解決

https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/#alarms

https://developer.chrome.com/docs/extensions/reference/alarms/

かわりに chrome.alarms API を使いなさいとのこと

> In order to reduce the load on the user's machine, Chrome limits alarms to at most once every 1 minute but may delay them an arbitrary amount more. That is, setting delayInMinutes or periodInMinutes to less than 1 will not be honored and will cause a warning. when can be set to less than 1 minute after "now" without warning but won't actually cause the alarm to fire for at least 1 minute.

> ユーザーのマシンの負荷を軽減するために、**Chrome はアラームを最大で 1 分に 1 回に制限します**が、アラームをさらに任意の量だけ遅延させる場合があります。つまり、delayInMinutes または periodInMinutes を 1 未満に設定すると、適用されず、警告が発生します。**警告なしに「今」から 1 分未満に設定できますが、実際には少なくとも 1 分間はアラームが発生しません。**

は？

つかえね～

とにかく自分の拡張機能では活躍する場面がないし
イマんところ`setTimeout`, `setInterval`は問題はないので
このままでよし

## 時間をおいてから Udemy 講義ぺーいに戻るとリロードするけど、popup のボタンが turnoff のままな件

とにかく時間をおかないと再現性がない

## エラーハンドリング

background.ts には、

例外が起こった際のやらなきゃいかんことが 2 つある

-   ユーザ向けに alert を出す
-   POPUP 向けにメッセージを送る

background.ts で例外が発生したときまたはキャッチしたときは

その 2 つを実行できるようにする

ただし、

多くの場合 sendMessage()は呼び出し元の finally で必ず実行されることになっている

なので alert のことだけ考える

```TypeScript

const messageWhenExceptionHappened =
"Problem occured that the extension not being able to run. Please turn off the extension or reload the page."

const alertHandler = (tabId: number, msg: string): void => {
  // 返事が必要ないので投げっぱなしの通常のAPIを使う
  chrome.tabs.sendMessage(tabId, {
    from: exntensionNames.background,
    to: extensionNames.contentScript,
    alertMessage: msg
  })
}

// 上記のままだとcontentScript.tsがインジェクトされていることが前提になるので
// ファイルとやり取りするのではなくて、
// 関数を指定のタブに埋め込むことにする

const alertHandler = (tabId: number, msg: string): void => {
  chrome.scripting.executeScript({
    target: {tabId: tabId},
    func: function(msg) {
      alert(msg);
    },
    args: [msg]
  })
}


```

あとやっぱり少し詳細な説明をユーザ向けにするためにオプションページが必要かも

例外が発生したときの POPUP の挙動は...

## responsive

CSS だけで ExTranscript のサイズ変更とかできるかどうか確かめる

ここのディレクトリで確認する

~/Udemy/udemy-advanced-css-sass/playground/

やること：

-   済 セレクタ名の変更
-   たぶん済 セレクタ名変更に伴う全体の修正
-   window リサイズにかかわる修正
-   済 ExTranscript が sidebar のときの middleview or wideview の処理の除去
-   SASS を webpack プロジェクトへ導入する
-   出力 css ファイルを sidebarTranscriptView と bottomTranscriptView と共有することとする

参考:

https://webpack.js.org/loaders/sass-loader/

sass-loader を使えとのこと

注意点として、sass-loader は webpack からみてサードパーティ製だよとのこと

node-sass は非推奨だから Dirt-Sass を使えだって

#### window リサイズにかかわる修正

境界条件を px で指定しないようにしたい

もっと確かな境界条件を付与したい

そのためには@media で指定するような場合分けが必要になるのかも

TODO: どこまでやればいいのかわからんから、Udemy のコースをやってから再度取り掛かる.

-   RESIZE_BOUNDARY を 975px から 963px に変更したけど。。。

たぶんメディアタイプによってこの境界線は異なる

なので別のものだしで図る必要があるだろう...

本家は、

-   `@media (max-width: 75em) {}`
-   `@media (min-width: 61.31em) and (max-width: 75em) {}`
    など設定していて、

おそらく 75em が基準値となるだろう...

これを JavaScript で扱うにはどうすればいいのか

前提について確認：

```JavaScript
// 垂直スクロールバー（表示されている場合）を含む、ブラウザウィンドウの ビューポート (viewport) の幅
window.innerWidth;
// 水平スクロールバー（表示されている場合）を含む、ブラウザウィンドウの ビューポート (viewport) の高さ
window.innerHeight;


// ブラウザウィンドウの外側の幅
window.outerHeight;
// ブラウザウインドウの外側の高さ
window.outerWidth;
```

```JavaScript
// スクロールバー含ない
document.documentElement.clientWidth;
document.documentElement.clientHeight;

// スクロール含む
document.body.clientWidth;
document.body.clientHeight;

```

現状: in case sidebar と bottom の切り替え条件の話

正しくは 61.31\*root font-size が境界条件である(980px になる)

前提がちぐはぐしている

CSS であつかう単位も含めて統一するとしたら
window の view port と root font-size を前提としたい

でもたしか window.innerWidth をつかわないで documentElement.clientWidth にしたのは理由があったはずなんだけどなんだっけ...

```TypeScript
// リサイズ・イベントハンドラ: windowに対してつけている
window.addEventListener("resize", function() {
  // ...
});

// callback funciton: documentの、スクロールバーを含まない幅を取得している
const onWindowResizeHandler = (): void => {

    const w: number = document.documentElement.clientWidth;
    // ...
}


// 垂直スクロールバーの幅を除いた長さを基準値としている
export const RESIZE_BOUNDARY: number = 963;


```

修正後：

```TypeScript
// そのままでおｋ
// リサイズ・イベントハンドラ
window.addEventListener("resize", function() {
  // ...
});


// window.innerWidthにする
// callback funciton
const onWindowResizeHandler = (): void => {

    // const w: number = document.documentElement.clientWidth;
    const w: number = window.innerWidth;
    // ...
}

// 垂直スクロールバーの幅の長さは環境によってことなるのかわからんから
// window.innerWidthで取得する値を前提にすればスクロールバーの幅を気にする必要がない
// わかり安い値になった
export const RESIZE_BOUNDARY: number = 980;

```

#### sidebar のときの middleview と wideview にかかわる処理を取り除く

済

すこし controller.ts のコードが少なくなった

#### CSS Tips: SVG の導入

参考

https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Adding_vector_graphics_to_the_Web

```JavaScript

const button = document.createElement("button");
const svg = document.createElement("img");
svg.setAttribute("src", "close-button.svg");
svg.setAttribute("alt", "close button");
svg.setAttribute("height", "36");
svg.setAttribute("width", "36");
button.appendChild(svg);
document.getElementById("app").appendChild(button);
```

なんかうまくいかん...

## SASS の webpack への導入

参考:

https://webpack.js.org/loaders/sass-loader/

```bash
$ npm i -D node-sass sass-loader
```

## ExTranscript の閉じるボタンの実装

完了

-   `justify-content: space-between;`でアイテムを両端に置く模様
-   閉じるボタンアイコンは CSS でつくる
-   閉じるボタンクリックで本家のトランスクリプトも閉じたい
    ...無理

#### 実装

-   「閉じるボタン」で閉じる仕組み

ExTranscript 上のボタンを押す

controller.ts 上のハンドラが発火する

background.ts へメッセージを送信する

background.ts は受信したら handlerOfHid()を実行する

閉じた

-   「閉じるボタン」のリスナを設置する仕組み

各 view クラスの render()メソッド実行後に、DOM を取得して付ける

remove 処理は必要ない。かならず render()前に DOM をクリアする仕組みだから

```TypeScript
// selectors.ts
export const EX = {
    // ...
    closeButton: ".btn__close",
    linkButton: ".btn__close",
}

// controller.ts

/************************************************
 * Insert sidebar ExTranscript
 * And clear previoud ExTranscript.
 * */
const renderSidebarTranscript = (): void => {

    const { subtitles } = sSubtitles.getState();
    bottomTranscriptView.clear();
    sidebarTranscriptView.clear();
    sidebarTranscriptView.render(subtitles);
    // NOTE: new added.
    resetCloseButtonHandler();
    sidebarTranscriptView.updateContentHeight();
    // sidebarの時だけに必要
    window.addEventListener('scroll', onWindowScrollHandler);
};

/************************************************
 * Insert bttom ExTranscript
 * And clear previoud ExTranscript.
 * */
const renderBottomTranscript = (): void => {


    const { subtitles } = sSubtitles.getState();
    sidebarTranscriptView.clear();
    bottomTranscriptView.clear();
    bottomTranscriptView.render(subtitles);
    // NOTE: new added.
    resetCloseButtonHandler();
    // noSidebarの時は不要
    window.removeEventListener('scroll', onWindowScrollHandler);
};

/**
 *
 * */
const resetCloseButtonListener = (): void => {
    const btn: HTMLElement = document.querySelector<HTMLElement>(selectors.EX.closeButton);
    btn.addEventListener("click", closeButtonHandler);
}


/**
 * Order background to turn off ExTranscript
 *
 * */
const closeButtonHandler = (): void => {
    chrome.runtime.sendMessage({
        from: extensionNames.controller,
        to: extensionNames.background,
        order: [orderNames.turnOff]
    });
};

// background.ts

/**
 * So far no response is needed.
 * */
const handlerOfControllerMessage = async (
    message: iMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: iResponse) => void
): Promise<void> => {
    try {
        const { order, ...rest } = message;
        const { tabId } = await state.get();

        if(order && order.length) {
            if(order.includes(orderNames.turnOff)) await handlerOfHide(tabId);
        }
    } catch (e) {
        alertHandler((await tabQuery()).id, messageTemplate.appCannotExecute);
    }
};

```

閉じるボタンの機能は実装できた

しかし

POPUP の表示が更新しない

理由は handlerOfHide は適切なメソッドじゃなかったから

適切な処理は background.ts::handlerOfPopupMessage()の

turnOff オーダーでの処理である

つまりここの一連の処理が再利用されるので

メソッド化する

```TypeScript
const handlerOfTurnOff = async (): Promise<void> => {
    try {
        const { tabId } = await state.get();
        await turnOffEachContentScripts(tabId);
        const {
            isContentScriptInjected,
            isCaptureSubtitleInjected,
            isControllerInjected,
        } = await state.get();
        // content scriptのinject状況だけ反映させてstateを初期値に戻す
        await state.set({
            ...modelBase,
            isContentScriptInjected: isContentScriptInjected,
            isCaptureSubtitleInjected: isCaptureSubtitleInjected,
            isControllerInjected: isControllerInjected,
        });
    }
    catch(e) throw e;
}
```

修正完了

#### スタイリング

どうやって × ボタンを作るか

参考：

https://developer.mozilla.org/ja/docs/Web/SVG/Element/use

```html
<div>
    <h1 className="title">Hi there!</h1>
    <button class="btn">
        <svg
            class="icon"
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clip-path="url(#clip0_2_8)">
                <line
                    x1="-0.707107"
                    y1="38.2929"
                    x2="35.2929"
                    y2="2.29289"
                    stroke="black"
                    stroke-width="2"
                />
                <line
                    x1="-1.29289"
                    y1="-0.707107"
                    x2="34.7071"
                    y2="35.2929"
                    stroke="black"
                    stroke-width="2"
                />
            </g>
            <defs>
                <clipPath id="clip0_2_8">
                    <rect width="36" height="36" rx="8" fill="white" />
                </clipPath>
            </defs>
        </svg>
    </button>
</div>
```

```CSS

.btn {
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -.02rem;
  font-size: 1.6rem;
  /* buttonの背景を透明にするのに必須 */
  background-color: transparent;
  background-image: none;
  border: none;
  height: auto;
  text-align: left;
  vertical-align: baseline;
  white-space: normal;
  display: inline-flex;
}

.btn:hover {
  cursor: pointer;
}

.icon {
  width: 2rem;
  height: 2rem;
}
```

問題はどうやって svg ファイルを取り込むのか...

ハードコーディングはなぁ。。。

いい感じに挿入できないか？

`<use>`を使うとよそから SVG の中身のノードを取り出して別の場所へ複製できる

#### `<use>`とマスキングよる SVG の複製

参考：

https://developer.mozilla.org/ja/docs/Web/SVG/Applying_SVG_effects_to_HTML_content

https://developer.mozilla.org/ja/docs/Web/SVG/Tutorial/Clipping_and_masking

https://developer.mozilla.org/ja/docs/Web/SVG/Element/use

```html
<!-- svg -->
<svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
>
    <g clip-path="url(#clip0_2_8)">
        <line
            x1="-0.707107"
            y1="38.2929"
            x2="35.2929"
            y2="2.29289"
            stroke="black"
            stroke-width="2"
        />
        <line
            x1="-1.29289"
            y1="-0.707107"
            x2="34.7071"
            y2="35.2929"
            stroke="black"
            stroke-width="2"
        />
    </g>
    <defs>
        <clipPath id="clip0_2_8">
            <rect width="36" height="36" rx="8" fill="white" />
        </clipPath>
    </defs>
</svg>
```

```TypeScript
// sidebarTranscriptView.ts

SidebarTranscriptView.prototype.generateSVG = function(mask_id: string)): string {
  return `
  <svg class="any-awesome-name">
    <use href="参照するノード"></use>
  </svg>
  `
}
```

SVG の HTML をそのまま出力する関数から取得することとした

## 検討：自動スクロールの footer は本家をそのまま表示する

完了

実現したいこと：

トランスクリプトのフッターの自動スクロールチェックボックスを拡張機能展開中でも表示させて、

チェックボックスが外れたらそのことを検知して、

拡張機能の「自動スクロール機能」を OFF にする

課題：

-   本家の「自動スクロール」のチェックボックスにリスナを付ける
-   「自動スクロール機能」の ON/OFF
-   ExTranscript の Footer をなくしても問題なく表示させられるか

#### 本家の「自動スクロール」のチェックボックスにリスナを付ける

```TypeScript
// selector
const autoscroll_checkbox: string = "[name='autoscroll-checkbox']" as const;
// querySelectorAll()も試したけどただ一つの要素だけマッチする
const cb: HTMLElement = document.querySelector(autoscroll_checkbox);
// チェックボックスを外したり付けたりして確認したらチェック状態を反映した値を取得できた

```

```TypeScript
// リスナを付けるタイミングは、controller.tsで各TranscriptView.render()が呼び出された、
// その直後
// (removeをその前に行うこと)
const resetAutoscrollCheckboxListener = (): void => {
    const cb: HTMLElement =  document.querySelector(selectors.transcript.autoscroll);
    if(cb) {
    cb.removeEventListener("click", autoscrollCheckboxClickHandler);
    cb.addEventListener("click", autoscrollCheckboxClickHandler);
    }
};

const autoscrollCheckboxClickHandler = (): void => {
    const cb: HTMLElement = document.querySelector(
        /* selector of "[name='autoscroll-checkbox']"*/
    );

    // Fire after click event has been done.
    setTimeout(function() {
        if(cb.checked){
            // 本家トランスクリプト自動スクロール機能がONになった
            // ExTranscriptの自動スクロール機能をONにする
        }
        else {
            // 本家トランスクリプト自動スクロール機能がOFFになった
            // ExTranscriptの自動スクロール機能をONにする
        }
    }, 100);
}

//
```

拡張機能の自動スクロール機能は controller.ts::moCallback()のなかで、

scrollToHighlight()がよびだされることで実現している

つまり、

自動スクロール機能を OFF にしたいならば moCallback から外せばいい

再度 ON にしたいならば moCallback に追加すればいい

たぶん大変やぞこれ...

MutationObserver おさらい

```JavaScript
const observer = new MutationObserver(function() {
    // トリガーされたときにしたいこと
})
// 監視対象の登録と監視開始
observer.observe(target, config);
// 監視終了
observer.disconnect()
// 監視再開は別の要素にすることもできる
observer.observe(target2, config2);

```

MutationObserver を設置する関数

`resetDetectScroll()`

resetDetectScroll()を呼び出す関数

`updateSubtitle`だけ

scrollToHighlight()だけ自由に ON/OFF にしたいので

つまり、

```TypeScript
// これはすでに（モジュール内の）グローバル変数としてどこからでもスコープできるから
let transcriptListObserver: MutationObserver_ = null;

const resetAutoscrollCheckboxListener = (): void => {
    cb.removeEventListener("click", autoscrollCheckboxClickHandler);
    cb.addEventListener("click", autoscrollCheckboxClickHandler);
};

const autoscrollCheckboxClickHandler = (): void => {
    const cb: HTMLElement = document.querySelector(
        /* selector of "[name='autoscroll-checkbox']"*/
    );
    //   NodeListOf HTMLSpanElement
    const transcriptList: NodeListOf<Element> = document.querySelectorAll(
        selectors.transcript.transcripts
    );

    setTimeout(function() {
        if(!cb.checked){
            // 本家トランスクリプト自動スクロール機能がOFFになった
            // 一旦監視解除して
            transcriptListObserver.disconnect();
            // インスタンスを削除して
            transcriptListObserver = null;
            // 新しいcallbackを渡したインスタンスにして
            transcriptListObserevr = new MutationObserver_(
                /* NEW CALLBACK THAT DOESNOT INCLUDE scrollToHighlight() */,
                moConfig,
                transcriptList
            );
            // 監視再開
            transcriptListObserver.observe();
        }
        else {
            // 本家トランスクリプト自動スクロール機能がONになった
            resetDetectScroll();
        }
    }, 100);
}
```

長いしわかりづらい...

MutationObserver\_クラスを活用できないか？

すでに再利用性皆無なのでこの際都合のいいようにしてしまえば...

```TypeScript
// 自動スクロールあり
const moCallback = function (
    this: MutationObserver_,
    mr: MutationRecord[]
): void {
    let guard: boolean = false;
    mr.forEach((record: MutationRecord) => {
        if (
            record.type === 'attributes' &&
            record.attributeName === 'class' &&
            record.oldValue === '' &&
            !guard
        ) {

            guard = true;
            try {
                updateHighlightIndexes();
                updateExTranscriptHighlight();
                scrollToHighlight();
            } catch (e) {
                chrome.runtime.sendMessage({
                    from: extensionNames.controller,
                    to: extensionNames.background,
                    error: e,
                });
            }
        }
    });
};
// 自動スクロールなし
const moCallback = function (
    this: MutationObserver_,
    mr: MutationRecord[]
): void {
    let guard: boolean = false;
    mr.forEach((record: MutationRecord) => {
        if (
            record.type === 'attributes' &&
            record.attributeName === 'class' &&
            record.oldValue === '' &&
            !guard
        ) {

            guard = true;
            try {
                updateHighlightIndexes();
                updateExTranscriptHighlight();
            } catch (e) {
                chrome.runtime.sendMessage({
                    from: extensionNames.controller,
                    to: extensionNames.background,
                    error: e,
                });
            }
        }
    });
};

// MutationObserver_なしの場合

const observer: MutationObserver = new MutationObserver(moCallback);
const transcriptList: NodeListOf<Element> = document.querySelectorAll(
    selectors.transcript.transcripts
);
transcriptList.forEach(ts => observer.observe(ts, config));
```

こうしてみると

callback は固定されてしまうので

callback の内容が異なる場合、observer をその分用意しておくことになるかも

```TypeScript
const moWatchHighlight = function (
    this: MutationObserver_,
    mr: MutationRecord[]
): void {
    let guard: boolean = false;
    mr.forEach((record: MutationRecord) => {
        if (
            record.type === 'attributes' &&
            record.attributeName === 'class' &&
            record.oldValue === '' &&
            !guard
        ) {

            guard = true;
            try {
                updateHighlightIndexes();
                updateExTranscriptHighlight();
                scrollToHighlight();
            } catch (e) {
                chrome.runtime.sendMessage({
                    from: extensionNames.controller,
                    to: extensionNames.background,
                    error: e,
                });
            }
        }
    });
};

```

もしくはもっとも簡単な方法として iController にプロパティを一つ増やして

その状態を scrollToHighlight()で参照して実行するかしないか判断させれば一番楽かも...

```TypeScript
const scrollToHighlight = (): void => {

    // autoscroll: booleanだとして...
    const { autoScroll } = sStatus.getState();
    if(!autoscroll) return;
    // ...
}

const resetAutoscrollCheckboxListener = (): void => {
    cb.removeEventListener("click", autoscrollCheckboxClickHandler);
    cb.addEventListener("click", autoscrollCheckboxClickHandler);
};

const autoscrollCheckboxClickHandler = (): void => {
    setTimeout(function() {
        const cb: HTMLElement = document.querySelector(
            /* selector of "[name='autoscroll-checkbox']"*/
        );
        sStatus.setState({autoscroll: cb.checked})
    }, 100);
}

```

上の案を採用した

sidebar と bottom を切り替えると常に sStatus.isAutoscrollOn が true のままになってしまう

切り替えの時のプロセスの確認

ブラウザのリサイズが発生

onWindowResizeHandler()

sStatus.setState({position: sideview});

updatePosition()

renderSidebarTranscript()

resetDetectScroll()

    MutationObserverのリセット

で完了。

つまり、autoscroll toggle のリスナ更新がこのプロセスの中にないのである

だから前回の値を参照し続けている...

ということで、切り替えのプロセスの中に更新を含めるようにする

解決した

あとは各 ExTranscript の Footer をなくして、本家のトランスクリプトの footer と

ぴったり一致させること

なんか sidebarTranscript だけ自動ハイライト機能が効いていない...なぜ？

TODO: これの修正!!

各メソッドの呼出は正しく行われている

sidebarTranscriptView のとき、トランスクリプトの`overflow-y: hidden`が無効になっている

多分そのせいでスクロールがそもそもできないのだと思う

つまり、footer があることが前提にある

`SidebarTranscriptView.prototype.updateContentHeight`で高さを再計算している

このとき、footer がそもそも`display: none`なので要素が取得できていない

なので、

footer の要素を取得する代わりに、本家のトランスクリプトのフッターの高さを取得できればいいわけである

```TypeScript
// selectors.ts

export const transcript = {
  // ...
  footer: `.transcript--autoscroll-wrapper--oS-dz.transcript--bottom--2wFKl`,
}
// controller.ts
const calcContentHeight = (): void => {
  const footer: HTMLElement = document.querySelector(selectors.transcript.footer);
  const height: number = parseInt(window.getComputedStyle(footer).height.replace("px", ""))
  sidebarTranscriptView.updateContentHeight(height);
}

// ひとまず導入してみる用のテスト関数
const calcContentHeight = (): void => {
  const footer: HTMLElement = document.querySelector('.transcript--autoscroll-wrapper--oS-dz.transcript--bottom--2wFKl');
  const height: number = parseInt(window.getComputedStyle(footer).height.replace("px", ""))
  sidebarTranscriptView.updateContentHeight(height);
}


// sidebarTranscriptView.ts

// NOTE: new parameter: foterHeight added
// これは本家のトランスクリプトのfooterの高さである
SidebarTranscriptView.prototype.updateContentHeight = function (
  footerHeight: number
): void {
  const content = document.querySelector<HTMLElement>(
    selectors.EX.sidebarContent
  );
  const footer: Element = document.querySelector<Element>(
    selectors.EX.sidebarFooter
  );
  const header: Element = document.querySelector<Element>(
    selectors.EX.sidebarHeader
  );
  const height =
    document.documentElement.clientHeight -
    parseInt(window.getComputedStyle(footer).height.replace("px", "")) -
    parseInt(window.getComputedStyle(header).height.replace("px", ""));

  content.style.height = height + "px";
};
```

NOTE: new selector. 本家のトランスクリプト・フッターのセレクタ

`.transcript--autoscroll-wrapper--oS-dz.transcript--bottom--2wFKl`

ExFooter が要らなくなった！

しかしばっちり動かすには(content の height を正しく計算するには)

Udemy の本家のページのヘッダ(Nav bar)が表示されている分も計算に入れないといけない

ついになんとか API の導入かしら？

intersection observer API の導入の検討

## 不具合記録

#### 5/7: sidebar 表示になるときに run すると controller.ts で getComputedStyle のせいで例外吐き出す件について

セレクタが間違っていたのと

呼び出しタイミングがまちがっていた

修正した

#### 4/22: ブラウザでウィンドウを小さくしたら ExTranscritp が sidebar にい続けた

```TypeScript
const onWindowResizeHandler = (): void => {


    const w: number = document.documentElement.clientWidth;
    const { position, isWindowTooSmall } = sStatus.getState();

    if (w < MINIMUM_BOUNDARY && !isWindowTooSmall) {
        sStatus.setState({ isWindowTooSmall: true });
        return;
    }
    if (w > MINIMUM_BOUNDARY && isWindowTooSmall) {
        sStatus.setState({ isWindowTooSmall: false });
        // NOTE: 原因はここで、returnしてしまっているのが原因
        // 最小幅を超える幅になったのに
        // sidebarかbottomかの判定をするまえにreturnしてしまった
        return;
    }

    if (w > RESIZE_BOUNDARY && position !== positionStatus.sidebar)
        sStatus.setState({ position: positionStatus.sidebar });

    if (w <= RESIZE_BOUNDARY && position !== positionStatus.noSidebar) {
        sStatus.setState({ position: positionStatus.noSidebar });
    }

    if (position === positionStatus.sidebar) calcContentHeight();
};

```

解消済

#### Udemy の CC 上のトランスクリプトトグルボタンを押してトランスクリプトを消すと拡張機能で例外が発生する

済

理由は、controller.ts::resetAutoscrollCheckboxListener で、

閉じられて存在しなくなった DOM の属性を取得しようとしたから

処理の流れはこう

Udemy ページ上でトランスクリプトのトグルボタンがクリックされてトランスクリプトが閉じた

contentScript.ts::handlerOfControlbar が background.ts へ{isTranscriptDisplaying: false}を送信する

background.ts::handlerOfHide()が実行される

background.ts から controller.ts へ`turnOff`オーダーが発令される

controller.ts::handlerOfTurnOff が実行される

sStatus が更新されて、updatePosition が実行され、その内部で resetAutoscrollCheckboxListener が実行されていた

null ガードをつけた

```TypeScript

/**
 * Reset listener for click event on autoscroll checkbox.
 *
 * NOTE: Element A may not be retrieved because the selector does not match. Not only the element is not exist.
 * So might miss the selector has been updated.
 * */
const resetAutoscrollCheckboxListener = (): void => {
    const cb: HTMLInputElement = document.querySelector(
        selectors.transcript.autoscroll
    );
    // NOTE: ADDED null GUARD
    if (!cb) return;
    sStatus.setState({ isAutoscrollOn: cb.checked });
    if (cb) {
        cb.removeEventListener('click', autoscrollCheckboxClickHandler);
        cb.addEventListener('click', autoscrollCheckboxClickHandler);
    }
};
```

#### ExTranscript を閉じても自動ハイライト機能が ON のままになる件

流れ：

ExTranscript 上のバツボタンを押す

handlerOfTurnOff が実行される

sSubtitles.setState({...baseSubtitles});によって updateSubtitle が呼び出される

updateSubtitle()内部で resetDetectScroll()が呼び出される

resetDetectScroll()では`isAutoscrollInitialized`が false だと再設定してしまう

`sStatus.setState({ ...statusBase });`では`isAutoscrollInitialized`が初期値で`false`なので
ExTranscript は閉じたいのに自動ハイライト機能が勝手に起動してしまう

これの修正結構大変だぞ

TurnOff の発生源と処理の流れ

処理起源：handlerOfTurnOff

1. window につけていたリスナの解除
2. view の消去
3. MutationObserver の disconnect
4. 各 state の初期化

問題は state の初期化で必ず resetDetectScroll()を呼出している点

updateSubtitles と updatePosition の両方で呼び出している

検討：自動スクロール機能のあれこれを分離する

updateSubtitles と updatePosition で呼出しているけど

ここから resetDetectScroll を除去して

別のトリガーに任せてみる。

おさらい：

現在、`Observable`で各 state の変化を通知してもらっている

いずれも各 state の値がどれかひとつでも変化があればすべてのオブザーバが発火することになっている

status.setState({position: 'sidebar'}) ==> status.observable.notify({position: 'sidebar'}, prevState) ==> すべての update 関数に{position: 'sidebar'}, prevState がわたされる

```TypeScript

const updateHighlight = (props, prev): void => {
  resetDetectScroll();
}
```

うーーん....

やっぱり抜本的な見直しが必要な気がする

controller でしなくてはならない処理をダイアグラム化してみよう...

https://stackoverflow.com/questions/899102/how-do-i-store-javascript-functions-in-a-queue-for-them-to-be-executed-eventuall

```TypeScript
const handlerOfTurnOff = (): void => {
  const _queue = [];

}
```

#### CC ポップアップメニューで「字幕設定」メニューに入ると ExTranscritp が消える件

あと「字幕設定」メニューから CC ポップアップメニューに戻ると ExTranscript も戻る

字幕設定を選択したときに contentScript.ts::currentLanguage が何を示すのか確認のこと

問題は言語リストのほかに「字幕設定」も取得してしまっているから

なので DOM 取得の時点でこいつを除外するようにする

```TypeScript
const handlerOfControlbar = function (ev: PointerEvent): void {
  // Clickイベント中にDOMを取得しておく...
  // イベントバブリングpath
  const path: EventTarget[] = ev.composedPath();

  // ...

  // クローズド・キャプション・メニュー
  const ccPopupMenu: HTMLElement = document.querySelector<HTMLElement>(
    selectors.controlBar.cc.menuListParent
  );

  // [動作確認済] clickイベント完了後に実行したい事柄はsetTimeoutで
  setTimeout(function () {

    // ...

    // cc popup menu内部でクリックイベントが起こったら
    // 字幕が変更されたのか調べる
    if (path.includes(ccPopupMenu)) {
        // DEBUG:

      // isSubtitleEnglish()の前に、
      const r: boolean = isSubtitleEnglish();
      sendToBackground({ isEnglish: r });
    }
  }, 200);
};
```

CC Popup menu には２つあって

言語選択メニューのほう

`div.control-bar-dropdown--menu--2bFbL.control-bar-dropdown--menu-dark--3cSQg`
`ul[data-purpose="captions-dropdown-menu"]`
`li[role="none"]`
`ul[aria-label="字幕"]`
`button`

```html
<div
    id="control-bar-dropdown-menu--518"
    class="control-bar-dropdown--menu--2bFbL control-bar-dropdown--menu-dark--3cSQg"
    style="max-height: 32.3498rem;"
>
    <ul
        role="menu"
        aria-labelledby="control-bar-dropdown-trigger--517"
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
                    </div></button
                ><button
                    type="button"
                    role="menuitemradio"
                    tabindex="-1"
                    aria-checked="false"
                    class="udlite-btn udlite-btn-large udlite-btn-ghost udlite-text-sm udlite-block-list-item udlite-block-list-item-small udlite-block-list-item-neutral"
                >
                    <div class="udlite-block-list-item-content">
                        インドネシア語 [自動]
                    </div></button
                ><button
                    type="button"
                    role="menuitemradio"
                    tabindex="-1"
                    aria-checked="false"
                    class="udlite-btn udlite-btn-large udlite-btn-ghost udlite-text-sm udlite-block-list-item udlite-block-list-item-small udlite-block-list-item-neutral"
                >
                    <div class="udlite-block-list-item-content">
                        イタリア語 [自動]
                    </div></button
                ><button
                    type="button"
                    role="menuitemradio"
                    tabindex="-1"
                    aria-checked="false"
                    class="udlite-btn udlite-btn-large udlite-btn-ghost udlite-text-sm udlite-block-list-item udlite-block-list-item-small udlite-block-list-item-neutral"
                >
                    <div class="udlite-block-list-item-content">
                        オランダ語 [自動]
                    </div></button
                ><button
                    type="button"
                    role="menuitemradio"
                    tabindex="-1"
                    aria-checked="false"
                    class="udlite-btn udlite-btn-large udlite-btn-ghost udlite-text-sm udlite-block-list-item udlite-block-list-item-small udlite-block-list-item-neutral"
                >
                    <div class="udlite-block-list-item-content">
                        スペイン語 [自動]
                    </div></button
                ><button
                    type="button"
                    role="menuitemradio"
                    tabindex="-1"
                    aria-checked="false"
                    class="udlite-btn udlite-btn-large udlite-btn-ghost udlite-text-sm udlite-block-list-item udlite-block-list-item-small udlite-block-list-item-neutral"
                >
                    <div class="udlite-block-list-item-content">
                        ドイツ語 [自動]
                    </div></button
                ><button
                    type="button"
                    role="menuitemradio"
                    tabindex="-1"
                    aria-checked="false"
                    class="udlite-btn udlite-btn-large udlite-btn-ghost udlite-text-sm udlite-block-list-item udlite-block-list-item-small udlite-block-list-item-neutral"
                >
                    <div class="udlite-block-list-item-content">
                        フランス語 [自動]
                    </div></button
                ><button
                    type="button"
                    role="menuitemradio"
                    tabindex="-1"
                    aria-checked="false"
                    class="udlite-btn udlite-btn-large udlite-btn-ghost udlite-text-sm udlite-block-list-item udlite-block-list-item-small udlite-block-list-item-neutral"
                >
                    <div class="udlite-block-list-item-content">
                        ポルトガル語 [自動]
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
                aria-haspopup="menu"
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
```

字幕設定メニューのほう

`div.control-bar-dropdown--menu--2bFbL.control-bar-dropdown--menu-dark--3cSQg`
`ul[data-purpose="captions-dropdown-menu"]`
`li[role="none"]`
`button`

```html
<div
    id="control-bar-dropdown-menu--518"
    class="control-bar-dropdown--menu--2bFbL control-bar-dropdown--menu-dark--3cSQg"
    style="max-height: 32.3498rem;"
>
    <ul
        role="menu"
        aria-labelledby="control-bar-dropdown-trigger--517"
        data-purpose="captions-dropdown-menu"
        class="unstyled-list udlite-block-list"
    >
        <li role="none">
            <button
                type="button"
                role="menuitem"
                tabindex="-1"
                data-purpose="go-to-tracks"
                aria-label="キャプションメニューに戻る"
                class="udlite-btn udlite-btn-large udlite-btn-ghost udlite-text-sm udlite-block-list-item udlite-block-list-item-small udlite-block-list-item-neutral"
            >
                <div class="udlite-block-list-item-content">
                    <svg
                        aria-hidden="true"
                        focusable="false"
                        class="udlite-icon udlite-icon-small video-control-bar-dropdown--prev-icon--3yd9N"
                    >
                        <use xlink:href="#icon-previous"></use>
                    </svg>
                    字幕設定
                </div>
            </button>
        </li>
        <li role="separator"></li>
        <li role="none">
            <ul class="unstyled-list" role="group" aria-label="字幕設定">
                <button
                    type="button"
                    role="menuitem"
                    tabindex="-1"
                    data-purpose="go-to-font-size"
                    aria-haspopup="menu"
                    class="udlite-btn udlite-btn-large udlite-btn-ghost udlite-text-sm udlite-block-list-item udlite-block-list-item-small udlite-block-list-item-neutral"
                >
                    <div class="udlite-block-list-item-content">
                        フォントサイズ<span
                            data-purpose="current-font-size"
                            class="video-control-bar-dropdown--current-value--18O0E"
                            >100%</span
                        >
                        <svg
                            aria-hidden="true"
                            focusable="false"
                            class="udlite-icon udlite-icon-small video-control-bar-dropdown--next-icon--3crbc"
                        >
                            <use xlink:href="#icon-next"></use>
                        </svg>
                    </div></button
                ><button
                    type="button"
                    role="menuitem"
                    tabindex="-1"
                    data-purpose="go-to-opacity"
                    aria-haspopup="menu"
                    class="udlite-btn udlite-btn-large udlite-btn-ghost udlite-text-sm udlite-block-list-item udlite-block-list-item-small udlite-block-list-item-neutral"
                >
                    <div class="udlite-block-list-item-content">
                        背景の透明度<span
                            data-purpose="current-opacity"
                            class="video-control-bar-dropdown--current-value--18O0E"
                            >75%</span
                        ><svg
                            aria-hidden="true"
                            focusable="false"
                            class="udlite-icon udlite-icon-small video-control-bar-dropdown--next-icon--3crbc"
                        >
                            <use xlink:href="#icon-next"></use>
                        </svg>
                    </div></button
                ><button
                    type="button"
                    role="menuitemcheckbox"
                    tabindex="-1"
                    aria-checked="true"
                    class="udlite-btn udlite-btn-large udlite-btn-ghost udlite-text-sm udlite-block-list-item udlite-block-list-item-small udlite-block-list-item-neutral"
                >
                    <div class="udlite-block-list-item-content">
                        ビデオの下に表示<span
                            class="control-bar-dropdown--checkbox-slider--1LPlb"
                        ></span>
                    </div></button
                ><button
                    type="button"
                    role="menuitem"
                    tabindex="-1"
                    data-purpose="reset"
                    class="udlite-btn udlite-btn-large udlite-btn-ghost udlite-text-sm udlite-block-list-item udlite-block-list-item-small udlite-block-list-item-neutral"
                >
                    <div class="udlite-block-list-item-content">リセット</div>
                </button>
            </ul>
        </li>
    </ul>
</div>
```

つまり両者の違いは、

button 要素群の親要素に`ul[aria-label="字幕"]`があるかないかである

となると、CC popup menu で click イベントが起こるたびに

上記の DOM があるかないかで、

現在表示中の POPUP menu が言語選択画面なのか、

もしくは字幕設定画面なのか

変別することが可能になりそうである

言語選択画面判定セレクタ

`div.control-bar-dropdown--menu--2bFbL.control-bar-dropdown--menu-dark--3cSQg > ul[data-purpose="captions-dropdown-menu"] > li[role="none"] > ul[aria-label="字幕"] > button`

（確認済）上記とマッチする要素がある ? 言語選択画面 : それ以外の画面

同時に、言語選択画面中の選択言語要素である button 要素すべてを取得するのにも使える

「字幕設定」は含まない

```TypeScript
/***
 * 表示中のCC popup menuが、
 * 「字幕言語選択画面」なのか「字幕設定画面」なのか判定する
 *
 * このCSSセレクタで取得できる要素があれば前者
 * nullなら後者という判定になる
 *
 * NOTE: CC popup menu上でのonClickイベント時には必ず呼び出すこと
 * */
const isItSelectLanguageMenu = (): boolean => {
    const menu: HTMLElement = document.querySelector<HTMLElement>(
        'div.control-bar-dropdown--menu--2bFbL.control-bar-dropdown--menu-dark--3cSQg > ul[data-purpose="captions-dropdown-menu"] > li[role="none"] > ul[aria-label="字幕"] > button'
    );
    return menu ? true : false;
};

const handlerOfControlbar = function (ev: PointerEvent): void {
  // Clickイベント中にDOMを取得しておく...
  // イベントバブリングpath
  const path: EventTarget[] = ev.composedPath();

  // ...

  // クローズド・キャプション・メニュー
  const ccPopupMenu: HTMLElement = document.querySelector<HTMLElement>(
    selectors.controlBar.cc.menuListParent
  );

  // [動作確認済] clickイベント完了後に実行したい事柄はsetTimeoutで
  setTimeout(function () {

    // ...

    // cc popup menu内部でクリックイベントが起こったら
    // 字幕が変更されたのか調べる
    if (path.includes(ccPopupMenu)) {
        // DEBUG:

    //   NOTE: new function added.
        if(isItSelectLanguageMenu()) {
          const r: boolean = isSubtitleEnglish();
          sendToBackground({ isEnglish: r });
        }
    }
  }, 200);
};
```

なんかしらんが、

isItSelectLanguageMenu ~ sendToBackground まで期待通りに動いているのに

なぜか background で非表示にせよの判定になる...なぜ？

答えは`!undefined`は`true`になる点にあった！！！！

```TypeScript
// background.ts


// handlerOfContentScriptMessage()
//
    // ...
    // 下記のrestプロパティはいずれかがundefinedだと実行される！！
    if (!rest.isTranscriptDisplaying || !rest.language) {
        try {
          // ...
```

つまり

今回メッセージを contentScript から backgroundt へ送信するときに

{language: true}だけ送信したけれど、

受け取った側の条件判定で

`!rest.isTranscriptDisplaying || !rest.language`

を評価するのだけれど

`isTranscriptDisplaying`は undefined なので

つまり`!undefined`を出力している

結果`!undefined || false`で評価するので

条件判定は真になる！

ということで background script の修正

```TypeScript

// handlerOfContentScriptMessage()

// if (!rest.isTranscriptDisplaying || !rest.language) {

// この評価値は、
// rest.isTranscriptDisplayingがtrueならば偽となり
// rest.isTranscriptDisplayingがfalseならば真となり
// rest.isTranscriptDisplayingがundefinedならば偽となり

if ((rest.isTranscriptDisplaying !== undefined && !rest.isTranscriptDisplaying) || (rest.language !== undefined && !rest.language)) {
  // ...
}

```

#### JavaScript Tips: undefined の扱い

知らんかった...`!undefined`が true なんて...

`undefined`は`false`らしいです

これに伴っていろんな場面を修正しないといかん...

## ExTranscript のハイライト位置の修正

もうちょい下にする

## refactoring

もろもろの点をわかりやすく

#### background.ts::circulateRepeatCaptureSubtitles の関連メソッドを汎用化させる

済

いま、2 つの機能がある

-   `repeatCaptureSubtitles`のように既定回数繰り返すメソッド
-   `circulater`のように条件式必須とする既定回数繰り返すメソッド

`circulater`は既にクラス化してあったわ...

ちゅうわけで`repeatCaptureSubtitles`の機能を汎用化させる

```TypeScript

/***
 * Repeat subtitle acquisition 10 times.
 *
 * @returns {Promise<subtitle_piece[]>} - Returns array of subtitle_piece as promise solved.
 *
 * @throws {[]} - throws empty array as rejected if retry over 10 times.
 * */
const repeatCaptureSubtitles = async function (
    tabId: number
): Promise<subtitle_piece[]> {
    return new Promise(async (resolve, reject): Promise<void> => {
        let intervalId: NodeJS.Timer;
        let counter: number = 0;



        intervalId = setInterval(async function () {
            if (counter >= 10) {
                // Failed

                    "[repeatCaptureSubtitles] Time out! It's over 10 times"
                );
                clearInterval(intervalId);
                reject([]);
            }


            const r: iResponse = await sendMessageToTabsPromise(tabId, {
                from: extensionNames.background,
                to: extensionNames.captureSubtitle,
                order: [orderNames.sendSubtitles],
            });
            if (r.subtitles !== undefined && r.subtitles.length) {
                // Succeed

                clearInterval(intervalId);
                resolve(r.subtitles);
            } else counter++;
        }, INTERVAL_TIME);
    });
};

```

callback の戻り値のチェックを行う存在が必要

参考：

https://stackoverflow.com/questions/12739149/typescript-type-signatures-for-functions-with-variable-argument-counts

```TypeScript

// codesandboxで動作確認のこと

type asyncUnknownFunc = <T>(...args: any[]) => Promise<T>;
type unknownFunc = <T>(arg: T) => boolean;

const repeatPromise = async function<T>(
  // インターバル間隔
  interval: number,
  // setIntervalへ渡すコールバック関数
  callback: asyncUnknownFunc,
  // callbackの戻り値を判定する関数
  condition: unknownFunc,
  // 何回繰り返すのか
  upTo: number
): Promise<T> {
  return new Promise((resolve, reject) => {
    let intervalId: number;
    let counter: number = 0;

  intervalId = setInterval(async function() {
    if(counter >= upTo) {
      clearInterval(intervalId);
      reject(
        // reject時に返す値も予め用意できない
      );
    }
    const result: T = await callback();
    if(condition(result)){
      clearInterval(intervalId);
      resolve(result);
    }
    else counter++;
  }, interval)
  })
}

const callback_ = async (): Promise<subtitle_piece[]> => {
  // returns promise
}

const condition_ = (operand: subtitle_piece[]): boolean => {
  // condition check
  // return result as boolean;
}

const repeatCaptureSubtitles = repeactPromise<subtitle_piece[]>(
  INTERVAL_TIME, callback_, condition_, 10
)
```

#### contentScript.ts の繰り返しメソッドのリファクタリング

repeatCheckQueryAcquired: 指定回数渡された関数を実行する。取得失敗でも resolve としている

```TypeScript
const callback_ = async(): Promise<boolean> => {
    const
}
```

#### controller.ts 自動ハイライト機能の updater の実装

自動ハイライト機能関連を
現在のように直接関数を呼出すのではなくて、
sStatus の更新によって連鎖的に発生するようにしたい

そもそも処理の流れ

前提：

-   MutationObserver のインスタンスはモジュール内部においてグローバル変数である

-   isAutoscrollInitialized は resetDetectScroll()のなかでのみ利用される

-   position の更新ののちすぐさま updateSubtitles()が呼び出されることが前提になっている

初期化時：

entry ポイントで sStatus.position が更新

updatePosition が発火し、resetDetectScroll()が呼び出される

MO インスタンス.disconnect()

MO インスタンスの初期化（要素取得から再登録まで）

MO インスタンス.observe()

---

moCallback 内で...

updateHighlightIndexs()

updateExTranscriptHighlight()

scrollToHighlight()

---

```TypeScript
// 現在
const updateHighlightIndexes = (): void => {

    // １．本家のハイライト要素を取得して、その要素群の中での「順番」を保存する
    const nextHighlight: Element = document.querySelector<Element>(
        selectors.transcript.highlight
    );
    const list: NodeListOf<HTMLSpanElement> = document.querySelectorAll(
        selectors.transcript.transcripts
    );
    const next: number = getElementIndexOfList(list, nextHighlight);
    if (next < 0) throw new RangeError('Returned value is out of range.');

    sStatus.setState({ highlight: next });

    // 2. 1で取得した「順番」がstate._subtitlesのindexと一致するか比較して、
    // ExTranscriptのハイライト要素の番号を保存する
    const { indexList } = sStatus.getState();
    if (indexList.includes(next)) {
        sStatus.setState({ ExHighlight: next });
    } else {
        // 一致するindexがない場合
        // currentHighlightの番号に最も近い、currentHighlightより小さいindexをsetする
        let prev: number = null;
        for (let i of indexList) {
            if (i > next) {
                sStatus.setState({ ExHighlight: prev });
                break;
            }
            prev = i;
        }
    }
};

```

sStatus.setState({highlight: next})したらあとは update 関数に任せてもいいかも

```TypeScript

/**
 * Invoked when sStatus.highlight changed.
 *
 * Actually, update sStatus.ExHighlight based on updated sStatus.highlight.
 *
 * */
const updateHighlight: iObserver<iController> = (prop, prev): void => {
  const { isAutoscrollInitialized, indexList} = sStatus.getState();

  if(prop.highlight === undefined || !isAutoscrollInitialized) return;



  // ExTranscriptのハイライト要素の番号を保存する
  const next: number = prop.highlight;
  const { indexList } = sStatus.getState();
  if (indexList.includes(next)) {
      sStatus.setState({ ExHighlight: next });
  } else {
      // 一致するindexがない場合
      // currentHighlightの番号に最も近い、currentHighlightより小さいindexをsetする
      let prev: number = null;
      for (let i of indexList) {
          if (i > next) {
              sStatus.setState({ ExHighlight: prev });
              break;
          }
          prev = i;
      }
  }
}


/**
 * Invoked when sStatus.ExHighlight changed.
 *
 * Triggers highlightExTranscript() everytime sStatus.ExHighlight changed.
 *
 * */
const updateExHighlight: iObserver<iController> = (prop, prev): void => {
  const { isAutoscrollInitialized } = sStatus.getState();
  if(prop.ExHighlight === undefined || !isAutoscrollInitialized) return;



  // TODO: updateExTranscriptHighlightの名称をhighlightExTranscriptにする
  highlightExTranscript();
};

// TODO: in Entry point. Add above updater to Observable register.
// ....
sStatus.observable.register(updateHighlight);
sStatus.observable.register(updateExHighlight);
```

TODO: うまくいけば moCallback は以下の通りになる

```diff
const moCallback = function (
    this: MutationObserver_,
    mr: MutationRecord[]
): void {
    let guard: boolean = false;
    mr.forEach((record: MutationRecord) => {
        if (
            record.type === 'attributes' &&
            record.attributeName === 'class' &&
            record.oldValue === '' &&
            !guard
        ) {

            guard = true;
            try {
                // この関数の呼び出しだけで済むようになる
                updateHighlightIndexes();
-                updateExTranscriptHighlight();
-                scrollToHighlight();
            } catch (e) {
                chrome.runtime.sendMessage({
                    from: extensionNames.controller,
                    to: extensionNames.background,
                    error: e,
                });
            }
        }
    });
};

```

## chrome ストアで表示するまで

各種ポリシーに違反しないか確認

手順確認

参考：

https://developer.chrome.com/docs/webstore/best_practices/

頒布までにやること：

-   TODO: 日本語対応
-   TODO: Manifest バージョンを x.x.x.x にする
-   TODO: 拡張機能説明などドキュメントを作成
-   TODO: POPUP に表示させる説明文の生成
-   TODO: ストア表示用などの icon の生成
-   TODO: CWS 用アカウント生成

#### 頒布手順確認

https://developer.chrome.com/docs/webstore/publish/

> Chrome ウェブストアにアイテムを公開するには、次の手順に従います。

-   アイテムの ZIP ファイルを作成します。
-   デベロッパー アカウントを作成し、設定します。
-   アイテムをアップロードする。
-   アイテムのアセットを追加します。
-   アイテムを送信して公開する。

1. アイテムの ZIP ファイルを作成します。

Manifest.json がルート・ディレクトリにあること

少なくとも

`name`, `version`, `icons`, `description`が定義されていること

`name`は Chrome web ストアに公開される名前であること

`descriotion`は少なくとも 132 文字以上の拡張機能に関する説明であること

`version`はとても低い数値から始めるのが推奨される

小さいアップデートなど重ねることになるだろうから

2. Chrome Web Store の開発者アカウントを作成し設定する

https://developer.chrome.com/docs/webstore/register/

上記に公式の手順が...

個人アカウントとはべつのパブリッシュなアカウントを作成することを推奨する

CWS アカウント用のメールアドレスには重要なアナウンスが送られてくる場合があるので時々確認するように

いちど削除したアカウントに関連付けられたメールアドレスは再利用できない

## webpack 出力ファイル分割

今のところ、出力ファイルと入力ファイルが一致していない

後余計なファイルが出力されている

出力ファイル

```bash
dist --
        |- background.js
        |- captureSubtitle.js
        |- contentScript.js
        |- controller.js
        |- manifest.json
        |- options.html
        |- popup.html
        |- popup.js
        |- re-transcript-16.png
        |- re-transcript-48.png
        |- re-transcript-128.png
        |- re-transcript-512.png
        |- re-transcript-512.svg
        # 使わない画像 済
        |- rebuild-button-usual.png
```

入力ファイル

```bash
src --
      |- attributes
      |    |- Attributes.ts
      |
      |- background
      |    |- annotations.ts
      |    |- background.ts
      |
      |- contentScript
      |     |- bottomTranscript.view
      |     |- captureSubtitle.ts
      |     |- contentScript.ts
      |     |- controller.ts
      |     |- sidebarTranscriptView.ts
      |     |- exTranscript.scss
      |
      |- Error
      |   |- Error.ts # いるのこれ？contentScritp/contentScritp.tsで使っていた...
      |   |- templates.ts # deleted
      |
      |- events
      |   |- Events.ts
      |
      |- model
      |   |- ExTranscriptModel.ts
      |   |- Model.ts
      |
      |- popup
      |   |- AlertMessage.tsx
      |   |- Content.tsx
      |   |- MainContent.tsx
      |   |- popup.tsx
      |   |- popup.css
      |   |- switch.tsx # deleted
      |   |- switch.css # deleted
      |
      |- static
      |   |- close-button.svg #いるのこれ？ これはExTranscriptの閉じるボタンでは?
      |   |- manifest.json
      |   |- re-transcript-16.png
      |   |- re-transcript-48.png
      |   |- re-transcript-128.png
      |   |- re-transcript-128.svg
      |   |- re-transcript-512.svg
      |   |- re-transcript-512.png
      |   |- rebuild-button-usual.png  # deleted
      |
      |- utils
      |   |- background # deleted
      |   |     |- State.ts #いるのこれ？
      |   |- contentScript # deleted
      |   |     |- State.ts # いるのこれ？
      |   |
      |   |-Circulator.ts
      |   |-constants.ts
      |   |-helpers.ts
      |   |-LocalStorage.ts #いるのこれ？ deleted
      |   |-MuatoinObserver_.ts
      |   |-Observerble.ts #いるのこれ？ Deleted
      |   |-Porter.ts #いるのこれ？ deleted
      |   |-repeatPromise.ts
      |   |-selectors.ts
      |
      |- view
      |   |- Dashboard.ts
      |   |- Sidebar.ts
      |   |- View.ts
```

必要だと思う出力ファイル

```bash
dist --
      |
      # attributes/
      |- Attributes.js
      # contentScript/
      |- bottomTranscriptView.js
      |- sideTranscriptView.js
      # Error/
      |- Error.js
      # events
      |- Events.js
      # model/
      |- ExTranscriptModel.js
      |- Model.js
      # popup
      |- Content.js
      |- MainContent.js
      |- AlertMessage.js
      # utils/
      |- constants.js
      |- helpers.js
      |- selectors.js
      |- repeatPromise.js
      |- Circulator.js
      |- MutationObserver_.js
      # view/
      |- Dashboard.js
      |- Sidebar.js
      |- View.js
```

FLAIR void chords

```JavaScript

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    entry: {
      // 今まで出力した分：
        background: path.resolve('src/background/background.ts'),
        contentScript: path.resolve('src/contentScript/contentScript.ts'),
        captureSubtitle: path.resolve('src/contentScript/captureSubtitle.ts'),
        controller: path.resolve('src/contentScript/controller.ts'),
        popup: path.resolve('src/popup/popup.tsx'),
        //
        // --- 今回追加した出力ファイル ----
        //
        Attributes: path.resolve('src/attributes/Attributes.ts'),
        bottomTranscriptView: path.resolve(
            'src/contentScript/bottomTranscriptView.ts'
        ),
        sidebarTranscriptView: path.resolve(
            'src/contentScript/sidebarTranscriptView.ts'
        ),
        Error: path.resolve('src/Error/Error.ts'),
        Events: path.resolve('src/events/Events.ts'),
        ExTranscript: path.resolve('src/model/ExTranscriptModel.ts'),
        Model: path.resolve('src/model/Model.ts'),
        MainContent: path.resolve('src/popup/MainContent.tsx'),
        Content: path.resolve('src/popup/Content.tsx'),
        AlertMessage: path.resolve('src/popup/AlertMessage.tsx'),
        constants: path.resolve('src/utils/constants.ts'),
        helpers: path.resolve('src/utils/helpers.ts'),
        selectors: path.resolve('src/utils/selectors.ts'),
        repeatPromise: path.resolve('src/utils/repeatPromise.ts'),
        Circulater: path.resolve('src/utils/Circulater.ts'),
        MutationObserver_: path.resolve('src/utils/MutationObserver_.ts'),
        Dashboard: path.resolve('src/view/Dashboard.ts'),
        Sidebar: path.resolve('src/view/Sidebar.ts'),
        View: path.resolve('src/view/View.ts'),
        //
        // ---------------------------------------
        //
    },
    // ...
```

動作は多分問題ない。

しかし、webpack でより多くのファイルを出力すべきか、
もしくは多くのファイルを少ないファイルにまとめるべきなのか

どちらがいいのかはわからない...

できるだけたくさんのファイルに分割したけれど、

やっぱり少ないファイルにまとめた方がいい気がする

-   少ないファイルにまとめた方が出力ファイルの中身が複雑になるから盗み見る人にとって難解になる
-   頻繁にロードするファイルでないならば、パフォーマンスは一つのファイルにまとめた方が動作が速いのでは？
-   たくさんファイル出力するメリットが今のところない...

ということでいままで通りにした。

#### 頒布前の準備：コードを人前に出すための処理

- 表示文章を英語から日本語に
- すべてのTODO:を処理する
- コメントをなるべく英語に
- 余計なコメントを消す 




#### VSCode Tips: console.logを一挙に消す

https://dev.to/suhailkakar/remove-all-console-log-from-your-project-in-less-a-minutes-3glg

#### VSCodeで開いているファイルの`TODO:`コメントを確認する方法


#### TypeScript Tips: 変数がいくつかの特定の値を持つようにする

https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types

```TypeScript

// -- example 1 --

let x: "hello" = "hello";
// OK
x = "hello";
// ...
x = "howdy";
// Type '"howdy"' is not assignable to type '"hello"'.

// -- example 2 --

function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello, world", "left");
printText("G'day, mate", "centre");
Argument of type '"centre"' is not assignable to parameter of type '"left" | "right" | "center"'.
```

https://typescript-jp.gitbook.io/deep-dive/type-system/literal-types


#### JavaScript Tips: Nodeからelementを取得する方法

```JavaScript

record.removedNodes.forEach((node) => {
    node.childNodes[0].parentElement.firstElementChild
    );
    
        node.childNodes[0].parentElement.firstElementChild
            .attributes
    );
    
        node.childNodes[0].parentElement.firstElementChild.getAttribute(
            'data-purpose'
        )
    );
```

なんかいろいろ情報がぬけおちている...