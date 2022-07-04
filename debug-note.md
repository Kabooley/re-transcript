# Debug Note

リリース後の問題の対応を記録する

## 目次

[拡張機能が起動しない問題](#拡張機能が起動しない問題)

#### 拡張機能が起動しない問題

原因はいままで`chrome.runtime.onInstalled`で state を起動させていたこと

てっきり chrome web store から配布されるようになったら

毎度 chrome 立ち上げるたびに拡張機能が oninstalled を実行するもんだと思っていた...

そんなことなかった...

なので別で拡張機能をトリガーする方法を模索しなくてはならなくなった。

アイディア：

-   background script で即時関数を実行してそのなかで state を初期化する

-   popup が開かれたときに background script の state を initialize させる

-   それ以外（情報収集）

##### Activate by popup

branch: activatge-by-popup

ブラウザが起動して初めて拡張機能の POPUP が開かれたときに、拡張機能が起動するようにする

条件分岐を追加した：

popup から`orderNames.sendStatus`を受信したときに state が空かどうかを確認する工程を追加した

その時に state が空のオブジェクトを返したら state へ modelBase を渡し、

そうでないならば続行する

```TypeScript

```

しばらく実際に使ってみて問題なければ再リリース

確認できた問題：

-   拡張機能を実行中に chorme を閉じてからしばらくののち chrome を再度開いてみると、initialize()は実行されなかった

たぶん state がクリアされていないんだと思う。

```TypeScript
chrome.tabs.onRemoved.addListener(
    async (
        _tabId: number,
        removeInfo: chrome.tabs.TabRemoveInfo
    ): Promise<void> => {
        try {
            // DEBUG:
            console.log('on removed');
            const { tabId } = await state.get();
            if (_tabId !== tabId) return;
            //
            // ここでmodelBaseをわたすので、次回起動時にすでに「初期化済」であるのだ..
            // TODO: state.clearAll()をかわりにつかってみよう
            //
            await state.set(modelBase);
        } catch (err) {
            console.error(err);
        }
    }
);
```
