# sendMessagePromise 動作検証

次の自作関数の動作確認や修正、正しい使い方の模索のために
いろいろ試す

```TypeScript
export const sendMessageToTabsPromise = async (
  tabId: number,
  message: iMessage,
  callback?
): Promise<iResponse | void> => {
  return new Promise(async (resolve, reject) => {
      chrome.tabs.sendMessage(tabId, message, async (response: iResponse) => {
          const {complete, ...rest} = response;
          if (complete) {
              if (callback && typeof callback === 'function'){
                  await callback(rest);
                  resolve();
              }
              else {
                  resolve(rest);
              }
          } else reject('Send message to tabs went something wrong');
      });
  });
};

export const sendMessagePromise = async (
  message: iMessage,
  callback?
): Promise<iResponse | void> => {
  return new Promise(async (resolve, reject) => {
      chrome.runtime.sendMessage(message, async (response: iResponse) => {
          const {complete, ...rest} = response;
          if (complete) {
              if (callback && typeof callback === 'function'){
                  await callback(rest);
                  resolve();
              }
              else {
                  resolve(rest);
              }
          } else reject('Send message to extension went something wrong');
      });
  });
};
```

-   今のところ sendResponse()は必須で使われることが前提となっている
    そうしないと resolve()できない

## 検証１：sendResponse()を実行しなかったらどうなるか

結果：

-   受信側は痛くもかゆくもない
-   送信側はエラーになる。まず
    `Unchecked runtime.lastError: The message port closed before a response was received.`
    をうけとる
    多分 Promise が response を待っていたけれど
    response は返されずに resolve しなかったせいだと思う

    `contentScript.js:218 Uncaught (in promise) TypeError: Cannot destructure property 'complete' of 'response' as it is undefined`
    が発生する
    当然だけど sendResponse()されなかったので response 引数がない。
    ない変数は undefined なのだが
    response に含まれる complete プロパティがないと resolve できない仕様により
    response は**必ずある**前提になっている

あと、
order を複数含んで sendMessage した場合に
受信側が次の通りにしてしまうと問題である

```TypeScript

chrome.runtime.onMessage.addListener(
    async (
        message: iMessage,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: iResponse) => void
    ): Promise<boolean> => {
        console.log('[background] ONMESSAGE');
        console.log(message);
        const { from, to, order, ...rest } = message;
        console.log(rest);
        if (to !== extensionNames.background) return;

        if (order && order.length) {
            console.log('[background] GOT ORDER');
            if (order.includes(orderNames.sendStatus)) {
                console.log('SEND STATUS');
                sendResponse({ complete: true });
            }
            if (order.includes(orderNames.disconnect)) {
                console.log('DISCONNECT');
                sendResponse({ complete: true });
            }
            if (order.includes(orderNames.injectCaptureSubtitleScript)) {
                console.log('injectCaptureSubtitleScript');
                sendResponse({ complete: true });
            }
            if (order.includes(orderNames.injectExTranscriptScript)) {
                console.log('injectExTranscriptScript');
                sendResponse({ complete: true });
            }
        }

        if (rest.activated) {
            console.log('[background] content script has been activated');
            sendResponse({ complete: true });
        }
        if (rest.language) {
            console.log('[background] correct language');
            sendResponse({ complete: true });
        }

        return true;
    }
);

```

上記は message のプロパティ一つずつに対していちいち sendResponse()を送っている
これの問題は
すべての order や rest が完了したら sendResponse()したいけれど
どれか一つ一番早い order か rest が完了したら sendResponse()してしまうので
すべて完了する前に sendReeponse()を返してしまっているのである

多分そのせいで送信側は必ずエラーを起こすことになると思う

つまり解決策は受信側のすべての条件分岐で sendResponse()することではない


##### message処理機能の実装

要はすべてのメッセージに対する処理が完了したらPromiseを解決すればいいわけである

Promise.all()

```TypeScript
const p1 = new Promise((res, rej) => {
    // ...
})
const p2 = new Promise((res, rej) => {
    // ...
})
const p3 = new Promise((res, rej) => {
    // ...
})

const promises = [p1, p2, p3];
```

inputは

```TypeScript

chrome.runtime.onMessage.addListener(
    async (
        message: iMessage,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: iResponse) => void
    ): Promise<boolean> => {
        console.log('[background] ONMESSAGE');
        console.log(message);
        const { from, to, order, ...rest } = message;
        console.log(rest);
        if (to !== extensionNames.background) return;

        // 
        // NOTE:
        // 
        // promiseの配列を返す
        // Promise.all()に渡すため
        const promises:Promise<any>[] = synchronizer(order, rest);

        // 
        // NOTE:
        // 
        // 全てmessage処理が完了したら
        await Promise.all(promises);
        sendResponse({complete: true});
        return true;
    }
);


const synchronizer = async(order: orderTypes[], restMessages: iResponse): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const results: Promise<boolean>[] = [];


    })
}



// NOTE:
// 
// Ideal usage of command is like this
const result: Promise<any> = command[order](args)
results.push(result);


// 
// If language: true
const setLanguageEnglish = async(): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        console.log("It's English");
        try {
            const refStatus: State<iStatus> = stateList.caller<iStatus>(nameOfStte.status);
            const { pageStatus} =
                await refStatus.getState();
            const newStatus: state_page_status = { isEnglish: true };

            await refStatus.setState({
                pageStatus: {
                    ...pageStatus,
                    ...newStatus,
                },
            });
            resolve();
        }
        catch(err) {
            console.error(err.message);
            reject();
        };
    })
}
```