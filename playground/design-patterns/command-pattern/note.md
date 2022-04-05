# Note: Command Pattern

https://www.patterns.dev/posts/command-pattern/

> コマンドパターンを使用すると、特定のタスクを実行するオブジェクトを、メソッドを呼び出すオブジェクトから切り離すことができます


もととなるプログラム

    使うことになるメソッドがハードコーディングされている

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

もしもここで`placeOrder`を`addOrder`に名前変更したとしましょう
アプリケーションのすべての`placeOrder`呼出を変更しなくてはならなくなります

代わりに`manager`から`placeOrder`を疎結合するようにできれば楽ちん


登場人物：
- OrderManager
- Command


```JavaScript
class OrderManager {
  constructor() {
    this.orders = [];
  }

// 変更１：executeメソッドだけにする
// placeOrder, trackOrder, cancelOrderが次の一つの呼出だけになる
  execute(command, ...args) {
    return command.execute(this.orders, ...args);
  }
}

// 変更２：commandクラスの追加
class Command {
  constructor(execute) {
    this.execute = execute;
  }
}

// 変更３：メソッドの外部化とcommandインスタンス生成
function PlaceOrderCommand(order, id) {
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

使い方

```JavaScript
const manager = new OrderManager();

manager.execute(new PlaceOrderCommand("Pad Thai", "1234"));
manager.execute(new TrackOrderCommand("1234"));
manager.execute(new CancelOrderCommand("1234"));

```

- OrderManagerのインスタンスは常にexecute()を呼び出すだけで
実際に何を実行するのかに関心がない
- execute()は外部化されたインスタンスを取得する
- 外部化されたインスタンスはCommandインスタンスを生成する
- Commandは渡された関数を保持する

つまり
Commandには実際に処理する関数を渡す
executeにはCommandのインスタンスを渡す
実際に処理する関数は外部化する


## src/background/background/ts::onMessageに適用してみる

onMessageハンドラがiMessageを受け取る
>>ここの間を実装する<<
iMessageのプロパティ全てのプロミスを配列に収める
配列をPromise.all()に渡す
Promise.all()が解決したらsendResponse({compelte: true})を送信する

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