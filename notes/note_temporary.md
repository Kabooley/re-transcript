# Note

## command patternを当てはめるにあたって


```TypeScript
// Commandのインスタンスをthis.ordersに格納する
class CommandManager {
  constructor() {
    this.commands = [];
}

// 実際に処理する関数をexecuteに格納する
class Command {
  constructor(execute) {
    this.execute = execute;
  }
}


const _contentScriptMessageHandler = async (
    m: iMessage | iResponse
): Promise<void> => {

    const { from, to, order, ...rest } = m;
    if(to !== extensioNames.background) return;

    try {

        // IDEAL FUNCTION: 中身は未定
        // とにかくorder, restを渡したらそれぞれに必要な処理を行ったpromiseの配列を返す
        const result: Promise<any>[] = synchronizer(order, rest);
        await Promise.all(result);
        // resultに「返事」となる変数が含まれていたら、
        // これもsendResponse()に含めないといけない...
        // そこも考えていない...
        sendResponse({complete: true})
    } 
    catch (e) {
        console.error(e.message);
    }
};


// @param rest: iMessageのfrom, to抜きのインターフェイスが型になる
// なのでiResponseとおなじ...
// ひとまずでiResponseを型としておく
// 
// 何も考えずに実装すればこんな感じ
const synchronizer = (order: orderTypes, rest: iResponse): Promise<any>[] => {
    const result: Promise<any>[] = [];
    order.forEach(o => {
        if(o === orderNames.sendStatus) {
            result.push(sendStatus());
        }
        if(o === orderNames.sendSubtitles){
            result.push(sendSubtitles());
        }
        // ...
    });
    if(rest.language) {
        result.push(setLanguageEnglish());
    }
    // ...
    return result;
}


// 
// 外部化された処理
// 一例
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

const sendStatus = async(): Promise<> => {
    // ....
}
```

#### お試し

```TypeScript

// このままだと型付けがanyだらけだ...
// 
class Observable {
  private _observers: ((param?:any) => any)[];
  constructor() {
    this._observers = [];
  }

  register(func: (param?:any) => any): void {
    this._observers.push(func);
  }

  unregister(func: (param?:any) => any): void {
    this._observers = this._observers.filter(observer => observer !== func);
  }

  notify(data: any) {
    this._observers.forEach(observer => observer(data));
  }
};

interface iProgress {
  isScriptInjected: boolean;
  isSubtitleCapturing: boolean;
  isSubtitleCaptured: boolean;
  isTranscriptRestructured: boolean;
};

const progressBase: iProgress = {
  isScriptInjected: false,
  isSubtitleCapturing: false,
  isSubtitleCaptured: false,
  isTranscriptRestructured: false
};

// すごく一時的な処理だけど
// obseervableのインスタンスをいったん作る
const observable = new Observable();

const handler: ProxyHandler<iProgress> = {
  set: function(target:iProgress, property: keyof iProgress, value: boolean, receiver: any) {
    // 変更をnotifyする
    observable.notify({prop: property, value: value});
    return Reflect.set(target, property, value, receiver);
  },
  get: function(target:iProgress, property: keyof iProgress, receiver: any) {
    // Reflect.getは参照を返す
    return Reflect.get(target, property, receiver);
  }
}

const proxyProgress = new Proxy(progressBase, handler);

// NOTE:
// proxy.getは参照を返している
proxyProgress.isScriptInjected = true;
const refProxyProgress = proxyProgress;
console.log(refProxyProgress);
refProxyProgress.isSubtitleCaptured = true;
// isSubttileCaptured: trueだった
console.log(proxyProgress);


class State<TYPE extends object> {
  private _state: TYPE;
  private _proxy: TYPE;
  constructor(baseObject: TYPE, handler: ProxyHandler<TYPE>) {
    this._state = baseObject;
    this._proxy = new Proxy(this._state, handler);
  };

  setState(prop:{[Property in keyof TYPE]?: TYPE[Property]}): void {
    // いったんここでdeep copyをとるとして
    this._proxy = {
      this._proxy, ...prop
    }
  }

}
```
