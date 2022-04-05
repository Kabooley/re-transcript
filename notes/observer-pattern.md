# Note about Observer Pattern

https://www.patterns.dev/posts/observer-pattern/

> オブザーバーパターンを使用すると、特定のオブジェクトであるオブザーバーを、オブザーバブルと呼ばれる別のオブジェクトにサブスクライブできます。イベントが発生するたびに、observable はすべてのオブザーバーに通知します！

## 登場人物

- `observer`: 変更を知りたい人（オブジェクト）

- `observable`: 変更を通知する人

## sample

```JavaScript
class Observable {
  constructor() {
    this.observers = [];
  }

  subscribe(func) {
    this.observers.push(func);
  }

  unsubscribe(func) {
    this.observers = this.observers.filter(observer => observer !== func);
  }
    // すべてのobserverへ、observer.observer(data)を実行する
  notify(data) {
    this.observers.forEach(observer => observer(data));
  }
}
```

observer からしてみれば通知があるときに、自身の observer()メソッドが実行されることになる

```JavaScript
export default function App() {
  return (
    <div className="App">
      <Button>Click me!</Button>
      <FormControlLabel control={<Switch />} />
    </div>
  );
}
```

button または switch が押されたら
logger と toastify というオブジェクトに通知されるようにする
この通知によって、button または switch のイベントに関するデータが
各オブジェクトに送信される

```JavaScript
import { ToastContainer, toast } from "react-toastify";

// observer その一
function logger(data) {
  console.log(`${Date.now()} ${data}`);
}
// observer その二
function toastify(data) {
  toast(data);
}

export default function App() {
  return (
    <div className="App">
      <Button>Click me!</Button>
      <FormControlLabel control={<Switch />} />
      <ToastContainer />
    </div>
  );
}
```

observer を observable へ登録した

```JavaScript
observable.subscribe(logger);
observable.subscribe(toastify);

```

observable の notify の実装

```JavaScript
export default function App() {
  function handleClick() {
    observable.notify("User clicked button!");
  }

  function handleToggle() {
    observable.notify("User toggled switch!");
  }

  return (
    <div className="App">
        <Button variant="contained" onClick={handleClick}>
            Click me!
        </Button>
        <FormControlLabel
            control={<Switch name="" onChange={handleToggle} />}
            label="Toggle me!"
        />
        <ToastContainer />
    </div>
  );
  );
}
```

## まとめ

登場人物: 
- `observer`: notify されたい人 
- `observable`: notify する人

`observable`は自身に 
- `observer`の登録リスト 
- `notify`メソッド 
- 他、登録、登録解除メソッド
などを持つ

notify はひとたび呼び出すと、すべての observer に一気に通知され、observer らはすべて同じ引数を取得する

`observer`は通知を受け取らせたい関数を`observable`へ登録する

## 特徴など

- トリガーは任意
    observer.notify()を好きな時に呼び出せる

- 必ずすべてのobserverに通知される
    場合によっては関係ない場合に通知されるobserverもいるかも

- 通知する情報は自由
    notify()に渡す引数は自由

- addEventListener()との違いは？
    addEventListenerはリスンする対象はElement, Document, windowなどであるが、observer-patternは任意のオブジェクトである
    addEventListenerはおなじみのイベントが起こったときに発火するが、observer-patternではnotifyの呼び出しは任意である

- pub/sub との違いは？

#### 作成中のものに当てはめてみる


stateの値が変更されたらどうなればいいか:

- validation
- chrome.storage.localを更新する
- 変更内容をobserverへnotifyする



