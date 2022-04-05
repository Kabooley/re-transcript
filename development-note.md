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

-   例外/Error ダイアグラムの作成

やっぱり視覚的にわかりやすいのを作った方がいいね
まず紙とペンですわ


- [時間をおいてからUdemy講義ぺーいに戻るとリロードするけど、popupのボタンがturnoffのままな件](#時間をおいてからUdemy講義ぺーいに戻るとリロードするけど、popupのボタンがturnoffのままな件)

-   どのタブ ID でどの window なのかは区別しないといかんかも
    たとえば複数タブで展開するときに、おそらく今のままだと
    一つのタブの情報しか扱えない
    なので複数のタブで拡張機能を展開したときに先に展開開始した情報を
    両方のたぶに展開することになるかも
    [修正：window-id と tabId からなる ID で state を区別する](#修正：window-idとtabIdからなるIDでstateを区別する)
    [chrome-extension-API:Window](#chrome-extension-API:Window)

    もしくはタブ情報を「持たない」とか？
    もしくはそれがでふぉということで、1 ページにしか使えないという仕様にする

-   loading 中を ExTranscript へ表示させる
    [ローディング中 view の実装](#ローディング中viewの実装)

-   拡張機能を展開していたタブが閉じられたときの後始末

-   [エラーハンドリング](#エラーハンドリング)
    エラーハンドリング: 適切な場所へエラーを投げる、POPUP に表示させる、アラートを出すなど

-   デザイン改善: 見た目の話
    [デザイン改善:popup](#デザイン改善:popup)
    拡張機能 OFF 機能を実装したら再度進行する

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

- [済][`setTimeout`, `setInterval`を background script で使うな](#`setTimeout`, `setInterval`を background script で使うな)
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
    console.log(`Error caught ${e}`);
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
                console.log('Order: is this page including movie container?');
                repeatQuerySelector(selectors.videoContainer)
                    .then((r: boolean) => {
                        console.log(`result: ${r}`);
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
                console.log('Order: Turn off');
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
        console.log('---- survey window ----');
        console.log('Query tabs by some option cases:');
        // NOTE: 調査２のメモ
        //
        // {active: true}
        // いま開かれているすべてのwindowのアクティブなタブ（表示中のタブ）である
        // なので複窓のとき、各窓の表示中のタブの情報を取得する
        chrome.tabs.query({ active: true }, function (tabs) {
            console.log('option: {active: true}');
            console.log(tabs);
        });
        //
        // {currentWindow: true}
        // 状況のPOPUPを表示させていた（つまり最後にフォーカスした）ウィンドウの
        // すべてのタブ情報を配列で取得した
        chrome.tabs.query({ currentWindow: true }, function (tabs) {
            console.log('option: {currentWindow: true}');
            console.log(tabs);
        });
        //
        // { lastFocusedWindow: true }
        // {currentWindow: true}と同様
        chrome.tabs.query({ lastFocusedWindow: true }, function (tabs) {
            console.log('option: {lastFocusedWindow: true}');
            console.log(tabs);
        });
        //
        // { active: true, currentWindow: true, lastFocusedWindow: true }
        // POPUPを開いていたタブだけを取得できた！
        chrome.tabs.query(
            { active: true, currentWindow: true, lastFocusedWindow: true },
            function (tabs) {
                console.log(
                    'option: {active: true, currentWindow: true, lastFocusedWindow: true}'
                );
                console.log(tabs);
            }
        );

        //
        // NOTE: chrome.windowsメソッドで取得したのは最後にフォーカスした窓の前にフォーカスしていた窓であった!!
        //
        // 下記のメソッドで取得できるwindowIdは実際にフォーカスしていた
        // windowIdではなくてその直前のwindowIdであった
        //
        chrome.windows.getLastFocused({}, (w) => {
            console.log(`window last focused by getLastFocused()`);
            console.log(w.id);
        });
        chrome.windows.getCurrent({}, (w) => {
            console.log(`getCurrent with no options`);
            console.log(w.id);
        });
    }
});

// chrome.windows.onFocusChanged.addListener((windowId) => {
//     console.log(`window focuse changed: ${windowId}`);
//     chrome.windows.getLastFocused({}, (w) => {
//         console.log(`window last focused by getLastFocused()`);
//         console.log(w.id);
//     });
//     chrome.windows.getCurrent({}, (w) => {
//         console.log(`getCurrent with no options`);
//         console.log(w.id);
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
  console.log("[observer];");
  console.log(props);
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
    console.log("[proxy] set");
    observable.notify({ prop: property, value: value, prevState: temp });
    return Reflect.set(target, property, value, receiver);
  },
  get: function (target: iProgress, property: keyof iProgress, receiver: any) {
    // Reflect.getは参照を返す
    console.log("[proxy] get");
    return Reflect.get(target, property, receiver);
  },
};


// // NOTE: proxy.getは参照を返している
// const proxyProgress = new Proxy(progressBase, handler);
// proxyProgress.isScriptInjected = true;
// const refProxyProgress = proxyProgress;
// console.log(refProxyProgress);
// refProxyProgress.isSubtitleCaptured = true;
// // isSubttileCaptured: trueだった
// console.log(proxyProgress);

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

console.log("current proxy:");
console.log(state_progress.getState());

state_progress.setState({
  isTranscriptRestructured: true,
  isSubtitleCaptured: false,
});



console.log("current proxy:");
console.log(state_progress.getState());

// いまんところ
console.log(state_progress.getState("isScriptInjected"));


// おさらい
// シャローコピーはspread構文でおｋ
const dummy = {
  name: "Jonathan",
  age: 16,
  country: "USA"
};

const tmp = {...dummy};
tmp.name = "JOJO";
console.log(dummy)
console.log(tmp)

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
    console.log("[popup] Set onMessage listener");
    chrome.runtime.onMessage.addListener(messageHandler);
    chrome.runtime.sendMessage({
      from: extensionNames.popup,
      to: extensionNames.background,
      order: [orderNames.isUrlCorrect]
    })
      .then((result) => {
        console.log(result);
        setMatchedPage(result);
      })
      .catch((err) => console.error(err));

    return () => {
      console.log("[popup] Removed onMessage listener");
      chrome.runtime.onMessage.removeListener(messageHandler);
    };
  }, []);

  useEffect(() => {
    console.log("Is this page correct?");
    chrome.runtime.sendMessage({
      from: extensionNames.popup,
      to: extensionNames.background,
      order: [orderNames.isUrlCorrect]
    })
      .then((result) => {
        console.log(result);
        setMatchedPage(result);
      })
      .catch((err) => console.error(err));
  });

  const buttonHandler = (): void => {
    console.log("[popup] RUN");
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
    console.log("...message from POPUP");
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
    console.log("[popup] RUN");
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
    console.log("...message from POPUP");
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
    console.log(`[background] onInstalled: ${details.reason}`);
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
      console.log("CONTROLLER GOT MESSAGE");
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
  console.log("[onWindowResizeHandler]");

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
    console.log("[controller] Initializing...");

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
      console.log("CONTROLLER GOT MESSAGE");
      const { order, ...rest } = message;
      if (order && order.length) {
        if (order.includes(orderNames.reset)) {
          console.log("order: RESET controller.ts");
          handlerOfReset();
          sendResponse({complete: true, success: true});
        }
        if(order.includes(orderNames.turnOff)){
          console.log("order: TURN OFF ExTranscript");
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
  console.log("Turning off ExTranscript");

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
  console.log("Reset ExTranscript");

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
    console.log("observed");
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
            console.log(record.addedNodes);
            // 削除された要素
            console.log(record.removedNodes);

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
  console.log("[contentScript] controlbar clicked");

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
      console.log("[contentScript] CC Popup button clicked");
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
      console.log(`Have subtitle language been changed? ${r}`);
      sendToBackground({isEnglish: r});
    }
  }, 200);
  console.log("[contentScript] controlbar clicke event done");
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
      console.log("OBSERVED");
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
  console.log("[controller] reset Autro Scroll System");

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
    console.log(`[background] onInstalled: ${details.reason}`);
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
  console.log("data from local storage");
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
        console.log(changeInfo);
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

                console.log('[background] TURN OFF this extension');
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
            console.log("Window closing!");
            // 後始末
        }
        if(_tabId === tabId) {
            console.log("tab closed!");
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
        console.log(`[popup] is valid page?: ${correctUrl}`);
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
          console.log(tabs);
          const r: RegExpMatchArray = tabs[0].url.match(urlPattern);
          console.log(`Is this page valid?: ${r && r.length}`);
        setCorrectUrl(r && r.length);
    })
      .catch((err) => console.error(err.message));
  };

// before
  const buttonClickHandler = (): void => {
    setRunning(true);
    console.log("[popup] RUNNING...");

        chrome.windows.getCurrent()
      .then((res) => {
        return chrome.tabs.query({ active: true, windowId: res.id });
      })
      .then((tabs: chrome.tabs.Tab[]) => {
          const r: RegExpMatchArray = tabs[0].url.match(urlPattern);
          console.log(`Is this page valid?: ${r && r.length}`);
        setCorrectUrl(r && r.length);
    })
    sendMessagePromise({
      from: extensionNames.popup,
      to: extensionNames.background,
      order: [orderNames.run],
    })
      .then((res) => {
        const { success } = res;
        console.log("[popup] Successfully Complete!");
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
    console.log("[popup] RUNNING...");

    sendMessagePromise({
      from: extensionNames.popup,
      to: extensionNames.background,
      order: [orderNames.run],
    })
      .then((res) => {
        const { success } = res;
        console.log("[popup] Successfully Complete!");
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
    console.log("CONTENT SCRIPT GOT MESSAGE");
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
          console.log("Order: RESET");

          await handlerOfReset();
          console.log("sfdadfsadfsafdsadfa");
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
    console.log("CONTENT SCRIPT GOT MESSAGE");
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
          console.log("Order: RESET");

          handlerOfReset()
          .then(() => {
            console.log("[contentScript] Reset resolved");
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
          console.log("Order: RESET");
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
    console.log("[background] TURN OFF ordered.");
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
        console.log('[background] Turning off each content scripts');

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

        console.log('[background] Done turning off each content scripts');
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
            console.log('Window closed!');
            // 後始末
            // NOTE: 将来的にはそのwinodwに含まれるすべての展開中拡張機能をOFFにする処理が必要になる
            await turnOffEachContentScripts(tabId);
            await state.set(modelBase);
        }
        if (_tabId === tabId) {
            console.log('tab closed!');
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
                console.log('[background] Turn off extension because page reloaded');
                await state.set(modelBase);
            } else if (!changeInfo.url.match(urlPattern)) {
                // Udemy講義ページ以外に移動した
                console.log('[background] the page moved to invalid url');
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
                console.log('[background] page moved');
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
                console.log(res);

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
    console.log("CONTENT SCRIPT GOT MESSAGE");
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
        console.log("Order: SEND STATUS");
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
        console.log("Order: RESET");
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
        console.log("Order: Is this page including movie container?");
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
        console.log("Order: Turn off");
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
      console.log("OBSERVED");
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
  console.log(`[background] onInstalled: ${details.reason}`);
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
      console.log(`counter: ${num}`);
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
  console.log(`cb: ${n}`);
  return n;
};

// circulaterへ渡すconditon関数
//
// 完全にハードコーディング
//
// circulaterへ渡す引数callbackの戻り値の型と同じ型をgenericsとして渡すこと
const counterCondition: iConditionOfCirculater = <iOp>(operand: iOp): iOp => {
  console.log(`condition: ${operand ? true: false}`);
  return operand ? true: false;
}

const counterLoop = circulater(cb, counterCondition, 3);

(async function() {
  const r = await counterLoop();
  console.log(`RESULT: ${r}`);
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
    console.log("[background] RESET Begin...");
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

    console.log("[background] RESET Complete!");
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
    console.log("[background] RESET Begin...");
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

    console.log("[background] RESET Complete!");
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
  // console.log(r);

  const bar = async function(subtitles) {
    console.log(subtitles);
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
  console.log(subtitles);
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
  // console.log(r);

  const bar = async function(subtitles) {
    console.log(subtitles);
  }

  bar((await foo()).subtitles);
    // this is awesome subtitles
})();

```


## `setTimeout`, `setInterval`を background script で使うな

解決

https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/#alarms

https://developer.chrome.com/docs/extensions/reference/alarms/

かわりにchrome.alarms APIを使いなさいとのこと

> In order to reduce the load on the user's machine, Chrome limits alarms to at most once every 1 minute but may delay them an arbitrary amount more. That is, setting delayInMinutes or periodInMinutes to less than 1 will not be honored and will cause a warning. when can be set to less than 1 minute after "now" without warning but won't actually cause the alarm to fire for at least 1 minute.

> ユーザーのマシンの負荷を軽減するために、**Chromeはアラームを最大で1分に1回に制限します**が、アラームをさらに任意の量だけ遅延させる場合があります。つまり、delayInMinutesまたはperiodInMinutesを1未満に設定すると、適用されず、警告が発生します。**警告なしに「今」から1分未満に設定できますが、実際には少なくとも1分間はアラームが発生しません。**

は？

つかえね～

とにかく自分の拡張機能では活躍する場面がないし
イマんところ`setTimeout`, `setInterval`は問題はないので
このままでよし

## 時間をおいてからUdemy講義ぺーいに戻るとリロードするけど、popupのボタンがturnoffのままな件

とにかく時間をおかないと再現性がない
