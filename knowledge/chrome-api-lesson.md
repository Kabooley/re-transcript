# Chrome Extension API 教訓

NOTE: まとめていない話

- content script は inject されたらプログラムで撤去することはできない
- window か tab が閉じられたことを検知する方法 `chrome.tabs.onRemoved`

## icon が表示されないときは

参考：https://developer.chrome.com/docs/extensions/reference/action/#icon

次を確認してみよう

- `png`を提供しているか

`pbg`以外の拡張子、例えば`svg`とかは無視されます

次の 3 つのサイズ(DIP: デバイスに依存しないピクセル)を提供しているか

- 128 \* 128

> インストール中および Chrome ウェブストアで使用されます

- 48 \* 48

> 拡張機能管理ページ（chrome：// extends）で使用される 48x48 アイコンも提供する必要があります

- 16 \* 16

> 拡張機能のページのファビコンとして使用する 16x16 アイコンを指定することもできます。
> 16x16 アイコンは、実験的な拡張情報バー機能にも表示されます。

Chrome は完全に一致するものが見つからない場合、画像に合わせて拡大縮小するように調整してくれるみたいなので

完全なサイズを提供する必要はない模様。

## MV3 Service Worker の特徴

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

理由はリスナが必ずイベントが発生したときに真っ先に実行されるようにするためです

どういうことかというと、

リスナの発生条件をイベントが発生したから以外にしてはならないという意味です

公式に書いてあるのそのままだけれど

```JavaScript
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
イベントを逃してしまう可能性があるのである

また同様に、

イベントが発生したときにすぐに発火すべきはイベントリスナなので

background script ファイルの最初のほうは、

余計なコードが実行されないようにイベントリスナはトップに書いておくべきなのである

#### 注意 2. service worker で変数を保存するなら必ず`chrome.storage`で保存すること

service worker は頻繁にアンロードと再ロードが繰り返される

**その間 background script は変数を保持してくれません**

たとえば`background.js`でファイル内のグローバル変数の値を変更したとしても

一旦再ロードされればその値は存在しないのである

この重要な事実は、公式情報をよく確認してから開発するか

開発中偶然経験しないかぎり十分見落とす可能性があります

(拡張機能を background がアンロードされるまで放置しないといけなくて、場合によってはなかなかアンロードされない時もあるから)

開発中まったく気づかず、そのまま拡張機能をリリースするところまで来る可能性はないとはいえません

ということで表題ですけど

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

// service workerがアンロードされたとして
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

先のコードの毎回ちまちまストレージに保存する方法から、
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
}

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

再ロードされたことに対してトリガーされるイベントはないです。

service worker は発生したイベントのリスナが登録されてあれば再ロードされるからです。

結局必要な変数を取得するには必要な時に直接ストレージから取得するか、

今回の方法を守るとするならば、
すべてのイベントリスナに`chrome.storage.local.get`の呼出しを義務付けることになります。

ただしアンロードさせない方法はあります

https://stackoverflow.com/questions/66618136/persistent-service-worker-in-chrome-extension

こちらで紹介されています通り、

拡張機能の content script や popup と`chrome.runtime.connect()`で接続されているときはしばらくアンロードされないみたいなので

`chrome.runtime.onDisconnect()`で切断検知したらすかさず再接続させて service worker の稼働状態を保つ方法のようです

これをするくらいなら MV2 で開発したほうがいいと思います。

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
