```TypeScript

/*

    シナリオ：
    Stateを更新して、
    Stateはupdate()へnotify()する

    update()は取得した引数から必要な処理を判断して実行する(主にmessage passing)

    このシナリオにおいて、message passingの後に返事が必要になった場合はどうしましょうか

    たとえば、
    下記のupdate関数の各条件分岐の先の処理を関数に一任するとしたら、
    その関数は返事を受け取れるようにすればいい
*/

// 非同期関数は渡さないこと
// observer 関数は戻り値はvoidであること
type tObserverFunction = (params?: any) => void;

class Observable {
    private _observers:tObserverFunction;
    constructor(){
        this.observers = [];
    };

    // observer is function
    register(observer: tObserverFunction): void {
        this._observers.push(observer);
    }

    // pass function that about to unregister.
    unregister(observer: tObserverFunction): void {
        // omit
    }

    notify(data: any): void {
        this._observers.forEach((_update: tObserverFunction) => {
            _update(data);
        });
    }
};


enum eCommand {
    updateSubtitle = "updateSubtitle",
    turnOff = "turnOff",
    capturingSubtitle = "capturingSubtitle",
    capturedSubtitle = "capturedSubtitle",
    failedCapturedSubtitle = "failedCapturedSubtitle",
    restructuredTranscript = "restructuredTranscript"
};

// 登録するタイミング
const update = (prop:{[Property in keyof iModel]?: iModel[Property]}, prevState: iModel) => {
    if(prop.subtitle.length) {
        // messsage passing
        //
        // controllerへ新しい字幕を送信する
        //
        // 字幕を変更するにあたっては返事が必要ない
        // const { tabId } = await state.getState();
        // await sendMessageToTabsPromise(tabId, {
        //     from: extensionNames.background,
        //     to: extensionNames.controller,
        //     subtitle: prop.subtitle
        // });

        // updateは動機関数でなくてはならないので
        // Promiseチェーンで
        state.getState().then(s: iResponse) => {
            sendMessageToTabsPromise(s.tabId, {
            from: extensionNames.background,
            to: extensionNames.controller,
            subtitle: prop.subtitle
        }).then(res => resolve())
        }).catch(err => {
            throw new Error(`Error: Failed to sending subtitle data to controller. ${err.message}`);
        })
    }
    if(prop.turnOff) {
        // message passing
        //
        // controllerへExTranscriptをOFFにする
        handlerOfTurnOff();

    }
    if(prop.isCapturingSubtitle) {
        // message passing
        //
        // POPUPへ、字幕取得中の表示をするようにオーダー
        // 戻り値不要
    }
    if(!prop.isCapturingSubtitle && prevState.isCapturingSubtitle) {
        // message passing
        //
        // POPUPへ字幕取得中は終了したことを知らせる
        // 戻り値不要
    }
    // NOTE:
    //
    // isCapturedSubtitleはいらないかも。
    // isCapturingSubtitleだけで事が済む
    if(prop.isCapturedSubtitle && !prevState.isCapturedSubtitle){
        // message passing
        //
        // POPUPへ字幕取得が完了したことを知らせる
        // 戻り値不要
    }
}

const handlerOfTurnOff = async (): Promise<void> => {
        const { tabId } = await state.getState();
        const response: iResponse = await sendMessageToTabsPromise(tabId, {
            from: extensionNames.background,
            to: extensionNames.controller,
            order: [orderNames.turnOff]
        });
        // もしもresponseにエラーが含まれていたら拡張機能を手動でOFFにしてとアラート
        // 成功したらここでstateを更新すればよい
        if(!response.success){
            throw new Error("Error: ...");
        }

}

const observable: Observable = new Observable();
observer.register(update);

// 呼び出す側: Stateのある値が変更になったとき
// state.subtitles
// state.isSubtitleCapturing
// state.isSubtitleCaptured
class State {
    private _state: iModel;
    private _observable: Observable;
    // ...
    constructor(observable: Observable) {
        // ...
        this._observable = observable;
    }

    setState(prop: [Property in keyof iModel]?: iModel[Property]){
        // 変更前のstateを取得する
        // ネストは1段階までなのでspread構文でいい
        const prevState: iModel = {...this._state};
        // ...
        // stateの変更を実行して
        // 常にnotifyする
        this._observable.notify(prop, prevState);
    }
    // ...
}

// 呼び出される側

```

`_observable`は State にとっては参照なので、
後から State が持つ`_observable`には State の外で register できる

今のところ、notify される observer である関数は`update`だけである

`Observable.notify()`は同期関数で、notify する関数は同期的に呼び出されるので、
observer として登録される関数も動機関数であること


## Errorについて

各ユーザ操作とそれに伴う処理において発生しうるエラーの箇条書き

1. POPUPを開いた

- [popup] useEffectが反応してbackgroundへsendMessage
    このとき、sendResponse()が返されないとruntime last エラーになる
- [background] messagehandlerが反応してurl判定関数へ
- [background] url判定関数が正規表現で判定
    このとき、senderからurlを取得する
- [background] sendResponse()を実行して判定を返す
- [popup] message handlerがメッセージを受信し、popupを利レンダリング

以上

エラーはsendResponse()が返されない場合にのみ発生しうる
sendResponse()が返されなかったらエラーをpopUpへ表示させて
拡張機能の再起動を提案する

2. RUNボタンが押された


- [popup] useEffectが反応してbackgroundへsendMessage
    このとき、sendResponse()が返されないとruntime last エラーになる
- [background] messagehandlerが反応してrunハンドラ関数へ

    - url判定
        IF url違反：
            NOTE: **ここでurl違反だとするとそもそもおかしいのでerrorをスローしてもいいかも**
            runハンドラ関数はここでreturnしてmessageハンドラ関数へ戻る
            sendResponse()でpopupへ返事をだす
            [popup] alertを出す
        url合格：
            処理を続行する
            stateを更新する contentUrl, tabId
                state更新に伴うエラー： errorスロー。拡張機能を再起動して
            contentScript.jsを動的injectする
            contentScript.jsからステータスを取得する
            stateを更新する isEnglish, isTranscriptOpened
                state更新に伴うエラー： errorスロー。拡張機能を再起動して
            ステータスの判定：
                不合格：
                    runハンドラ関数はここでreturnしてmessageハンドラ関数へ戻る
                    sendResponse()でpopupへ返事をだす
                    [popup] alertを出す
                    必要な処理をするようにユーザへ伝える文言をPOPUPへ表示させる
                合格：
                    次の処理へ

                    
                
    
