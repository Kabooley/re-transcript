# Note about chrome background script

Manifest V3 について扱う

## まとめ

- V3 より background script は service worker として振る舞う
- service worker は短命な実行環境である（アイドル状態になるとアンロードされる）
- service worker は監視しているイベントなどが発生するとロードされ、処理が終わってアイドル状態になるとアンロードされる
- この特性上、そのたびにリセットが起こるので前回の変数の変更とかは引き継がれない
- なので情報を引き続き使いたいときは storage API をつかうこと
- イベントリスナはファイルの初めのほうで定義すること
- イベントリスナの中にイベントリスナを定義しないこと（非同期に定義しない）
-

#### Migrating from background pages to service workers

https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/

background script は Manifest V3 より service worker として機能することになる
なので v2 の background script とは別物である

```JSON
{
  "name": "Awesome Test Extension",
  "background": {
    "service_worker": "background.js"
  },
}
```

service worker として機能することに当たって心得るべきこと

1. service worker は短命な実行環境である

> バックグラウンドサービスワーカーは、必要なときにロードされ、アイドル状態になるとアンロードされます

つまり呼び出しのたびに background script はリセットされるので
たとえば background script でグローバル変数なんか定義して変更しても
その変更は引き継がれない！！

```JavaScript
// background.js

// Don't do this!
// The service worker will be created and destroyed over the lifetime of your
// exension, and this variable will be reset.
let savedName = undefined;

chrome.runtime.onMessage.addListener(({ type, name }) => {
  if (type === "set-name") {
    //   こんな風にグローバル変数を変更しても
    savedName = name;
  }
});

chrome.browserAction.onClicked.addListener((tab) => {
    // 呼び出しのたびにリセットなのでsavedNameは常にundefinedである
  chrome.tabs.sendMessage(tab.id, { name: savedName });
});

// DO THIS
chrome.runtime.onMessage.addListener(({ type, name }) => {
  if (type === "set-name") {
    chrome.storage.local.set({ name });
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get(["name"], ({ name }) => {
    chrome.tabs.sendMessage(tab.id, { name });
  });
});
```

**ということで呼び出しのたびにリセットされるから引き継ぎたい情報は`Storage API`を使いましょう**

2. Timer の代わりに`Alarms API`を使おう

1 で述べた通り、background script はそのたびにリセットするので
例えば timer はキャンセルされる
なので代わりになる API を使うのだ

```JavaScript
// background.js

// This worked in MV2.
// But not in V3
const TIMEOUT = 3 * 60 * 1000; // 3 minutes in milliseconds
setTimeout(() => {
  chrome.action.setIcon({
    path: getRandomIconPath(),
  });
}, TIMEOUT);

// DO THIS
// 他のリスナ同様topレベルで呼び出すこと
chrome.alarms.create({ delayInMinutes: 3 });

chrome.alarms.onAlarm.addListener(() => {
  chrome.action.setIcon({
    path: getRandomIconPath(),
  });
});
```

3. service worker コンテキストは JavaScript コンテキストよりも制限された実行環境である

グローバルスコープは window ではなくてとても制限されている
DOM にアクセスできない

この辺は公式みて

#### Manage events with service workers

> 拡張機能は、バックグラウンド Service Worker のスクリプトを使用してこれらのイベントを監視し、スクリプトは指定された命令に反応します。 バックグラウンドサービスワーカーは、必要なときにロードされ、アイドル状態になるとアンロードされます

1. Set up listeners:

- **リスナーは background script で同期的に登録されなくてはならない**

リスナは非同期的に登録してはならないらしい
これはリスナの中でリスナを登録してはならないという意味らしい

```JavaScript
// DO THIS sample 1
chrome.runtime.onInstalled.addListener(() => {
    // do something
});

// This will run when a bookmark is created.
chrome.bookmarks.onCreated.addListener(() => {
  // do something
});

// DON'T DO THIS!! sample 1
chrome.runtime.onInstalled.addListener(() => {
  // ERROR! Events must be registered synchronously from the start of
  // the page.
  chrome.bookmarks.onCreated.addListener(() => {
    // do something
  });
});

// DO THIS sample 2
chrome.storage.local.get(["badgeText"], ({ badgeText }) => {
  chrome.action.setBadgeText({ text: badgeText });
});

// Listener is registered on startup
chrome.action.onClicked.addListener(handleActionClick);

// DON'T DO THIS!! sample 2
chrome.storage.local.get(["badgeText"], ({ badgeText }) => {
  chrome.action.setBadgeText({ text: badgeText });

  // Listener is registered asynchronously
  // This is NOT guaranteed to work in MV3/service workers! Don't do this!
  chrome.action.onClicked.addListener(handleActionClick);
});
```

- リスナーは background script のトップレベルに記述しなくてはならない

chrome が正常にリスナをイベントと結びつけるためにはそうしないといけないとのこｔ

`removeListener`で特定のイベントリスンを終了することが出できる

2. Filter events:

リスナの発火条件はフィルタによって制限することができる

~とにかく`.addListener`の第二引数にフィルタを突っ込めばよさそうです~

> イベントは、そのイベントにとって意味のある特定のフィルターをサポートします。
> イベントがサポートするフィルターのリストは、そのイベントのドキュメントの「フィルター」セクションにリストされます。

ということで filter が利用できるかどうかはイベントによるので各イベント Syntax をチェックしよう

```JavaScript
chrome.webNavigation.onCommitted.addListener(function(e) {
  if (hasHostSuffix(e.url, 'google.com') ||
      hasHostSuffix(e.url, 'google.com.au')) {
    // ...
  }
});

// convert into this...

chrome.webNavigation.onCommitted.addListener(function(e) {
  // ...
}, {url: [{hostSuffix: 'google.com'},
          {hostSuffix: 'google.com.au'}]});
```

3. Unload background scripts

拡張機能がクラッシュする場合に備えよう。Storage API を使う

message passing を利用しているときはすべてのポートが閉じられていることを確認すること

background script はすべてのポートが閉じていないとアンロードされない

`runtime.Port.onDisconnect()`はポートが閉じられたことを検知できる
