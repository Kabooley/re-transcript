# Chrome Extension API 教訓

## これは何

個人開発中に経験した、chrome 拡張機能開発における教訓でございます。

Manifest のバージョンは MV3 です。

V3 特有の話と、よく嵌りやすい点についてまとめました。

## icon が表示されないときは

参考：https://developer.chrome.com/docs/extensions/reference/action/#icon

次を確認してみてください。

-   `png`を提供しているか

`pbg`以外の拡張子、例えば`svg`とかは無視されます

次の 3 つのサイズ(DIP: デバイスに依存しないピクセル)を提供しているか

-   128 \* 128

> インストール中および Chrome ウェブストアで使用されます

-   48 \* 48

> 拡張機能管理ページ（chrome://extensions）で使用される 48x48 アイコンも提供する必要があります

-   16 \* 16

> 拡張機能のページのファビコンとして使用する 16x16 アイコンを指定することもできます。
> 16x16 アイコンは、実験的な拡張情報バー機能にも表示されます。

Chrome は完全に一致するものが見つからない場合、画像に合わせて拡大縮小するように調整してくれるみたいなので

完全なサイズを提供する必要はない模様。

## MV3 Service Worker の特徴

参考：

https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/

https://developers.google.com/web/fundamentals/primers/service-workers/

`background`は MV3 で`service worker`へ移行しました。

`service worker`の特徴として

1. `service worker`は使われていない時にアンロードされて、必要になったときだけロードされる
2. `service worker`は DOM にアクセスできない

MV2 までの`background page`は（アンロードされないという意味で）永続的な独立環境でしたが、

`service worker`はアイドル時にアンロードされて、

リスンしているイベントがあった場合だけ再ロードされるという違いがあります。

この特徴によって気を付けないといけないことがあります。

#### 注意 1. service worker のイベントリスナはトップレベルに同期的に記述すること

理由は必ずイベントが発生したときに chrome API のリスナが真っ先に実行されるようにするためです

どういうことかというと、

リスナの発生条件を「イベントが発生したから」以外にしてはならないという意味です

```JavaScript
// 公式のコードそのままですが...

// background.js
chrome.storage.local.get(["badgeText"], ({ badgeText }) => {
  chrome.action.setBadgeText({ text: badgeText });

  // Listener is registered asynchronously
  // This is NOT guaranteed to work in Manifest V3/service workers! Don't do this!
  chrome.action.onClicked.addListener(handleActionClick);
});
```

上記のようにイベントリスナをネストさせて、

発火条件を「イベントが発生したから」という条件以外にすると

再ロードされたときに非同期にイベントリスナが登録されて、
イベントを逃してしまう可能性があります

また同様に、

イベントが発生したときにすぐに発火すべきはイベントリスナなので

background script ファイルの最初のほうは、

余計なコードが実行されないようにイベントリスナはトップに書いておくべきです

#### 注意 2. service worker で変数を保存するなら必ず`chrome.storage` API で保存すること

service worker は頻繁にアンロードと再ロードが繰り返されます

**その間 background script は変数を保持してくれません**

たとえば`background.js`でファイル内のグローバル変数の値を変更したとしても

一旦再ロードされればその値は存在しないのです

この重要な事実は、公式情報をよく確認してから開発するか

開発中偶然経験しないかぎり十分見落とす可能性があります

(拡張機能を background がアンロードされるまで放置しないといけなくて、場合によってはなかなかアンロードされない時もあるから)

開発中まったく気づかず、そのまま拡張機能をリリースするところまで来る可能性はないとはいえません

ということで

公式に書いてあるとおり、`chrome.storage`を使って変数を保持することになります

background はアンロードでうっかり変数を失うのを防ぐために、

変数の呼び出しのたびにこの`chrome.storage`を使っていちいち保存・取り出しを行わないといけません

例：

```TypeScript
// background.ts

// KEY_LOCALSTORAGEというkeyでローカルストレージにT型のデータを保存しています
const KEY_LOCALSTORAGE = "some_awesome_local_storage_name";

const state: <T> = (function () {
    const _getLocalStorage = async function (key): Promise<T> {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(key, (s: T): void => {
                if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
                resolve(s);
            });
        });
    };

    return {
        set: async (prop: {
            [Property in keyof T]?: T[Property];
        }): Promise<void> => {
            try {
                const s: T = await _getLocalStorage(KEY_LOCALSTORAGE);
                const newState = {
                    ...s[KEY_LOCALSTORAGE],
                    ...prop,
                };
                await chrome.storage.local.set({
                    [KEY_LOCALSTORAGE]: newState,
                });
            } catch (err) {
                // ...
            }
        },

        get: async (): Promise<T> => {
            try {
                const s: T = await _getLocalStorage(KEY_LOCALSTORAGE);
                return { ...s[KEY_LOCALSTORAGE] };
            } catch (err) {
                // ...
            }
        }
    };
})();


// background内では下のように呼び出してつかいます
await state.set({hoge: 'hoge'});

// 10秒待つ間にservice workerがアンロードされたとして
setTimeout(function() {
    state.get().then((t: T) => {
        // 変数が保存出来ているのを確認できます
        console.log(t);     // {hoge: 'hoge'}
    })
}, 10000);
```

他、background を service worker として使う場合の注意点はこちらの公式情報を参考にしてください

https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/

#### アンロードを検知する方法はないのか？

あるようです(使ったことない)。

`chrome.runtime.onSuspend`

> アンロードされる直前にイベントページに送信されます。これにより、拡張機能にクリーンアップを実行する機会が与えられます。

先のコードのような、毎回ちまちまストレージに保存する方法から、
アンロード時に一気に保存する方法をとってみます

```TypeScript
// background.ts

interface State {
    hoge: string;
    num: number;
}

// 起動中はstorageを使わずこのstateに保存された値を使うとして
const state: State = {
    hoge: null,
    num: null
};

const KEY_LOCALSTORAGE: string = "some_awesome_local_storage_name";

// アンロード検知したらstateに保存されている値をstorageに保存する
chrome.runtime.onSuspend.addListener((): void => {
    chrome.storage.local.set({
        [KEY_LOCALSTORAGE]: state,
    });
})
```

ということでアンロード時に保存はできます。

ただし、

**chrome API には再ロードされたことに対してトリガーされるイベントはないです。**

service worker は発生したイベントのリスナが登録されてあるときにのみ再ロードされるだけだからです。

つまり、アンロードされたときに保存した最新の値を、再ロード時に使うにはストレージから取得したいけれど

再ロードに関するイベントがないから再ロードを検知することができないのです。

となると、

結局必要な変数を取得するには必要な時に直接ストレージから取得するか、

今回の方法を守るとするならば、
すべての変数を利用するイベントリスナに`chrome.storage.local.get`の呼出しを義務付けることになります。

ただしアンロードさせない方法はあります

https://stackoverflow.com/questions/66618136/persistent-service-worker-in-chrome-extension

こちらで紹介されています通り、

拡張機能の content script や popup と`chrome.runtime.connect()`で接続されているときはしばらくアンロードされない仕様を利用して、

`chrome.runtime.onDisconnect()`で切断検知したらすかさず再接続させて service worker の稼働状態を保つ方法のようです

これをするくらいなら MV2 で開発したほうがいいと思います。

## `chrome.tabs.query`で `windowId` を option で指定するな

**今フォーカスしているウィンドウのアクティブなタブ**を取得したいとき、

chrome API の`tabs.query`を使って取得することになります。

その際、「どの window でどのタブなんですか？」という情報を`option`として`tabs.query`に渡します。

この`option`には`windowId`というプロパティを含めることができますが、

この`windowId`を指定してはなりません。

なぜなのか

windowId を取得する方法として次のメソッドを使うことになります。

-   `chrome.windows.getCurrentId()`
-   `chrome.windows.getLastFocused()`

これらのメソッドで取得できる`windowId`は、

必ずと言っていいほど、**最後に生成されたウィンドウ**の ID を取得します。

なので

たとえば拡張機能を展開中のタブを含むウィンドウとは別に、あとから新しいウィンドウを生成したときに、

その新しいウィンドウで拡張機能を展開しているわけではないのに`chrome.windows.getCurrentId()`または`chrome.windows.getLastFocused()`は

この新しいウィンドウを表す`windowId`を返してしまうのです。

chrome API では頻繁に`tabId`を求められるのですが

このままだと新しいウィンドウを生成した瞬間に`tabs.query`がとんちんかんな`Tab[]`を取得してしまい

拡張機能が機能しなくなってしまうのです。

特に開発中は chrome の DevTools を別窓なんかで開いていたりするので

この開発者ツールの窓の ID なんかも加わってきてさぁ大変です。

#### 解決策

**今フォーカスしているウィンドウ**の**アクティブなタブ**を取得したいときは、

`tab.query`に次のオプションを渡すとよい

```TypeScript
{
  active: true,              // 表示中のタブを指定する
  lastFocusedWindow: true,   // 最後にフォーカスしたwindowを指定できる
  currentWindow: true        // 現在のwindowを指定できる
}
```

`lastFocusedWindow`と`currentWindow`はどちらかだけでもいい。

`windowId`がとんちんかんになる実験は[こちら](#chromewindows-の-windowid-取得実験)です。

#### message-passing で sendResponse()を非同期に完了させたいならば`chrome.runtime.onMessage.addListener()`のコールバックは必ず`true`を返すこと

というのは公式に書いてあるので当然かもしれませんが本当はここで言いたいのは文法の話です。

TypeScript 的にいうと、

`chrome.runtime.onMessage.addListener()`のコールバックは

-   正しい：`(): boolean => { return true }`

-   誤り：`async (): Promise<boolean> => {return true;}`

非同期処理を含むからといってついついコールバック関数を`async`関数にしてしまうと

非同期処理が無視されて、`sendResponse()`が非同期に返されるのを待たずに

送信先が存在しませんという旨の`runtime.lastError`が起きてしまいます。

このエラーが起きると「なんでコールバック関数で`return true`したのに非同期処理にならないんだ」と迷宮入りしてしまいます。

つまり`sendResponse`を非同期に返したいときは次の通りにしなくてはなりません。

-   `chrome.runtime.onMessage.addListener()`のコールバックは同期関数を渡さなくてはならない
-   `chrome.runtime.onMessage.addListener()`のコールバックは`true`を返さなくてはならない
-   `chrome.runtime.onMessage.addListener()`のコールバック内で非同期処理をしたいならプロミスチェーンか即時関数内部で`async/await`を使わなくてはならない

よって次の通りに書くべきです

```TypeScript
  // message-passingでやり取りするオブジェクトの型
interface iMessage {
    // ...
}

chrome.runtime.onMessage.addListener(
    // 1. 同期関数をcallbackとして渡す
    (
        message: iMessage,
        sender,
        sendResponse: (response: iMessage) => void
    ): boolean => {
        const { order, from } = message;
        const response: iMessage = {
            from: "content_script",
            to: from,
        };

        // orderの各処理には非同期処理が含まれるとして...
        if (order && order.length) {
            // 3-1. 非同期処理を書きたいときはプロミスチェーンを使うか...
            if (order.includes(orders.reset)) {
                handlerOfReset()
                    .then(() => {
                        sendResponse({
                          ...response
                            complete: true
                        });
                    })
            }
            // 3-2. IIFEでasync関数を囲う
            if (order.includes(orderNames.turnOff)) {
              (async function() {
                  const result: boolean = await handlerOfTurnOff();
                    if(result) sendResponse({
                        ...response,
                        complete: true
                    })
              })()
            }
        }
        // 2. sendResponse()が非同期に実行されるのを許可するために
        // `true`を返す
        return true;
    }
);

```

これで非同期的に`sendResponse`が返されるまで通信が途切れない。

#### popup の state は background script で管理すること

**chrome 拡張の`popup`は開かれるたびに、web ページのリロード同様に、毎回リフレッシュされます**

なので例えば POPUP を React で生成しているようなとき、
POPUP 再表示後の state は以前の保存内容を記録していません

POPUP が表示されるたびに state は毎回初期値になります。

なので popup は state の値に依存して、その表示内容が変化するようなときは、

background script に state の値を保存してもらうことになります。

以下は私が POPUP を React で実装したときに特に問題なく動いたやり方です。

`useEffect()`を使って background script から必要な情報を取得しています。

注意点として、`useEffect()`のコールバック関数は async 関数は使えません

```TypeScript
// popup.tsx
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";


const Popup = (): JSX.Element => {
  const [hoge, setHoge] = useState<boolean>(false);
  const [fuga, setFuga] = useState<boolean>(false);

  // 表示されたときの初期値だけ取得するので
  // 第二引数には空の配列を渡します
  useEffect(() => {
    sendMessagePromise({
      from: extensionNames.popup,
      to: extensionNames.background,
      order: [orderNames.sendStatus],
    }).then((res: iResponse) => {
      const { hogeStatus, fugaStatus } = res.state;
      setHoge(hogeStatus);
      setFuga(fugaStatus);
    });
  }, []);

    //...
}
```

## chrome.windows の windowId 取得実験

`chrome.windows`のメソッドが実際にはどの`windowId`を取得するのか

それを確認する実験を行いました。

#### 実験内容

POPUP を表示させた時に POPUP は background script へ message passing し

background script は下記コードの`windowIdSurvey()`を実行する。

以下の状況で`windowIdSurvey()`内の各出力が異なる windowId を出すのか確認する

-   検証１：ブラウザのウィンドウが 1 つだけの時
    windowId はすべて同じになるはず

-   検証２：ブラウザのウィンドウが 2 つの時、もあるウィンドウをフォーカスしたままその POPUP を表示させる
    windowId は最後にフォーカスしたウィンドウになるはず

-   検証３：あとから生成したウィンドウをフォーカスしている最中に、もとあるウィンドウの方の POPUP を表示させる
    windowId はあとから生成したウィンドウの id になるはず

-   検証４：あとから生成したウィンドウをフォーカスしている最中に、そちらのウィンドウの方の POPUP を表示させる
    windowId はあとから生成したウィンドウの id になるはず

```JavaScript
const windowIdSurvey = funciton() {

      chrome.tabs.query(
        { active: true, currentWindow: true, lastFocusedWindow: true },
        function (tabs) {
          console.log("windowId by tabs.query() with the option: ");
          console.log(tabs[0].windowId);
        }
      );

      chrome.windows.getLastFocused({}, (w) => {
        console.log('windowId by getLastFocused():');
        console.log(w.id);
      });
      chrome.windows.getCurrent({}, (w) => {
        console.log('windowId by getCurrent():');
        console.log(w.id);
      });
}

```

#### 実験結果

```bash
# 検証１: 当然ウィンドウが一つしかないから同じwindowIdになる
windowId by tabs.query() with option
1
windowId by getLastFocused():
1
windowId by getCurrent():
1

# 検証２: chrome.windowsメソッドのほうは
# フォーカスしていないにもかかわらずあとから生成したウィンドウのIDを出力した
windowId by tabs.query() with option
1
windowId by getLastFocused():
101
windowId by getCurrent():
101

# 検証３: 検証2と同じ結果になった

windowId by tabs.query() with option
1
windowId by getLastFocused():
101
windowId by getCurrent():
101

# 検証４： 想定通り

windowId by tabs.query() with option
101
windowId by getLastFocused():
101
windowId by getCurrent():
101
```

以上の結果から、`chrome.windows`の２つのメソッドは期待した`windowId`を取得しないことが分かりました。

このように、なぜだか不明ですが、`chrome.widnows.getCurrent()`も`chrome.widnows.getLastFocused()`も

必ず最後に生成したウィンドウの id を返します。

最後にフォーカスしていたかも現在のウィンドウであるかどうかは全く関係ありません。

一方`chrome.tabs.query`のオプションに`{ active: true, currentWindow: true, lastFocusedWindow: true }`を

渡せば必ず最後にフォーカスしたウィンドウの id を取得できます。

公式はどうすればどのウィンドウの id を取得できるのか、どのウィンドウのタブを取得できるのか

チュートリアルでも出してくれればいいのですが、

残念ながら誤解を招くメソッドの説明をするだけでありました。

<!-- ## その他、細かいこと

NOTE: 次回更新するときに記事の根拠とかも詰めて

timerに関するメソッドは、chrome APIが用意してあるからそちらを使ってと公式には書いてあります。

つまり`setTimeout`を使う代わりに`chrome.alarm`APIを使えと言っています。

この理由は長時間のインターバルを設けるとその間にservice workerがアンロードされるから

`setTimeout`にわたしたコールバック関数が実行されるのは保証されないためです。

しかし`chrome.alarm`の問題点は「分」単位でしか指定できず、秒以下は無視するとAPIに書いてあります。

なので`chrome.alarm`の出番は分単位でインターバルを空けるような場面だけになります。 -->

## 最後に

以上の教訓は私が実際に chrome 拡張機能を開発する際に立ちはだかった障害に対して調べたあれこれです。

認識など間違いがあるかもしれませんので、

chrome 拡張機能の開発に強い人は是非ご指摘いただきたいです。

またこんな記事でもこれから chrome 拡張機能の開発をする方の助けに慣れれば幸いです。

## 未更新部分

## `setTimeout`, `setInterval`を background script で使うな

解決

https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/#alarms

https://developer.chrome.com/docs/extensions/reference/alarms/

かわりに chrome.alarms API を使いなさいとのこと

> In order to reduce the load on the user's machine, Chrome limits alarms to at most once every 1 minute but may delay them an arbitrary amount more. That is, setting delayInMinutes or periodInMinutes to less than 1 will not be honored and will cause a warning. when can be set to less than 1 minute after "now" without warning but won't actually cause the alarm to fire for at least 1 minute.

> ユーザーのマシンの負荷を軽減するために、**Chrome はアラームを最大で 1 分に 1 回に制限します**が、アラームをさらに任意の量だけ遅延させる場合があります。つまり、delayInMinutes または periodInMinutes を 1 未満に設定すると、適用されず、警告が発生します。**警告なしに「今」から 1 分未満に設定できますが、実際には少なくとも 1 分間はアラームが発生しません。**
