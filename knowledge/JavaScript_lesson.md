# JavaScript 教訓、Tips など

これまでの開発で得た教訓、知見の集約

## 目次

-   [基礎](#基礎)
-   [非同期](#非同期)
-   [例外関係](#例外関係)

## 基礎

### `undefined`は`false`である

知らんかった...

```JavaScript

// true

// false


```

ともなって undefined であることの判別には注意を必要とする

-   厳密等価で確認すること

`x === undefined`と`x == undefined`では結果が異なる場合がある

x が null だと`==`比較は true になる

これは`==`が null の比較も行うからである

`undefined`であるのかを区別するには必ず厳密等価を行うこと

-   typeof でも確認可能

```JavaScript
// xという変数はまったく宣言されていないとして...
if(typeof x === "undefined") {
    // これは真になる
}
else {
    // ここは実行されない
}
```

## 非同期

### 関数引数内部での await 呼出

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

## 例外関係

### try...catch 基本

-   エラーが起こったら残りの*try 内のコードは無視されて*catch ブロックが実行される

で、とくに catch ブロックで何もしなければ関数の外側が実行される

-   try...catch は同期的に動作する

try 内で setTiemout を置いておいて、setTimeout のなかでエラーが発生しても
catch は同期呼出なのでキャッチされない

-   catch するのはエラーオブジェクト

```JavaScript
// エラーオブジェクトの中身
{
  name: // 未定義変数の場合"RefferenceError"
  message: // エラーに関する詳細
  stack: // コールスタック
}
```

tyr...catch の利用方法：

-   スローエラーは一番近い catch が捕まえる

### 例外エラーはそのネストの一番近い`try...catch`が補足する

スローエラーは一番近い catch が捕まえる

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

### finally

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

### 例外のラッピング

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

### promise でのエラーハンドリング

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

### 哲学：エラー vs 例外

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
