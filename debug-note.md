# Debug Note

リリース後の問題の対応を記録する

## 目次

[確認できた問題](#確認できた問題)
[CWS承認拒否案件](#CWS承認拒否案件)
[拡張機能が起動しない問題](#拡張機能が起動しない問題)
[ページをリロードすると REBUILD できなくなる問題](#ページをリロードするとREBUILDできなくなる問題)
[以前のstateがいまだに残り続けている問題](#以前のstateがいまだに残り続けている問題)

## 確認できた未解決問題

-   動画を含まない講義ページに移動してから次の動画を含む講義ページへ移動すると拡張機能が OFF になっている（ただし REBUILD ボタンで再度展開可能）


## CWS承認拒否案件

[アイテムの説明に過剰なキーワードが含まれています](#アイテムの説明に過剰なキーワードが含まれています)

#### アイテムの説明に過剰なキーワードが含まれています

2022/07/08

多分UdemyとかGoogleとかのキーワードを過剰に使用しているせいで

spam policyに違反しているのだと思う。

なのでなるべくUdemyとGoogleのキーワードを抑える。

- パッケージの説明欄の文章を変更した
- 念のためコード内のコメントからも過剰なキーワードを削除した

POPUPはそのままとした。もしもまたspam policy違反ではじかれたら、

popup上のdescriptionを消してPOPUPのレイアウトを変更しなくてはならない。

```TypeScript
// popup/MainContent.tsx
sx={{
    minHeight: 66,
    minWidth: 370,
}}
```


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

上記 onREmoved の時に代わりに state.clearAll()を使ってみた

次回起動時に挙動を確認する

#### 例外が起こってからページをリロードすると REBUILD できなくなる問題

多分リロード時に state を初期化していない

あと例外起こったのにキャッチできてないよどうなってんの

予想で結論書いちゃうと、拡張機能をいったん展開してから、例外が起こって、同じページで拡張機能展開中にリロードをすると、state にデータがなぜか保存されたままになっている
問題が、content script はインジェクトされたままですよと state を読み取って判断されてしまうから
content script がある体で処理を進めてエラーになっている...

つまり、先の update で追加した popup 開いたときに state.get が返すオブジェクトがからどうかで条件分岐する方法だとこの問題は見つけることができない...

なので、

例外が発生したときは「例外なく」state.clearAll するようにすればいい

やること：

-   済）例外がおこったときに state.clearAll()を必ずする
-   content script へアクセスできなことの例外をキャッチする仕組みの確認と修正
-   済）chrome.tabs.onUpdated()での「展開中の講義ページでリロード」「展開中のタブが別のＵＲＬへ移動した」ときに state.clearAll する

##### Gotta execute state.clearAll() when catching exception.

background script では`alertHandler()`を catch{}内で呼出しているので

この`alertHandler()`のなかに state.clearAll()を突っ込む

各処理系(handlerOfRUn, handlerOfReset, handlerOfHide など)は呼び出し元が

background script 内の関数だからすぐさま alertHandler()を呼び出さないで throw するだけにしている点は注意

#### 以前のstateがいまだに残り続けている問題

なぜか以前のstateが残り続けている

onRemovedが万全に機能していない模様

あと、関係ないけど関係ないURLで拡張機能をPOPUPさせるとbackground scriptでstateをclearAll()してしまっている

一旦clearAll()したら、次の電源OFFまでは多分大丈夫。

なので一旦再起動してみて挙動を確認する

**教訓：updateしたら前回のデータがローカルファイルに残っている可能性からonInstalledで必ずstate.clearAll()すること**

しばらく様子見

