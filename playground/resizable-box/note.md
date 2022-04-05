# Learnign how to implement dynamically resizable box

参考: youtube.com/watch?v=NyZSlhzz5Do
上記URLの動画ではDragDropAPIを使わずにVanillaJSでDragDropを実現している
まぁそれはいいとして
動画ではJavaScriptでリサイズできるdivを作成した

ここに...
- 角だけではなくて辺でもリサイズさせたい
- Resizable divの中身もリサイズに合わせて自動リサイズさせたい
- ユーザによるリサイズの「最小サイズ」を守らせたい


## mouse event

- `onMousedown`:
> mousedown イベントは、ポインターが要素の中にあるときにポインティングデバイスのボタンが押下されたときに`Element`に発行されます。

`click`イベントと異なるのは、
`click`:マウスのボタンが押されたはなされたら発火する
`mousedown`: マウスのボタンが押されたときに発火する

- `mouseup`:
> `mouseup`イベントは要素の内側にある時にポインティングデバイスのボタンが離されたら発火する

つまりマウスのボタンを離したときですね

- `mousemove`:
> mousemove イベントは、マウスなどのポインティングデバイスで、カーソルのホットスポットが要素内にある間に動いた時に発行されるイベントです。

つまりマウスを動かせば必ず発火するイベントなので
`mousemove`にリスナを付けるときは限定的な状況じゃないといかんだろうなぁ



## `Element.getBoundingClientRect()`

> Element.getBoundingClientRect() メソッドは、要素の寸法と、そのビューポートに対する位置を返します

Syntax:
```TypeScript
    element.getBoundingClientRect(): DOMRect
```

`DOMRect`は矩形のサイズと位置を記述する
`DOMRect`のプロパティは読み取り専用である

```JavaScript
const div = document.querySelector('.foo');
const rect = div.getBoundingClientRect();
```
で、
DOM`div`の、ビューポート上の座標（矩形の左上）やwidthやheightが取得できる



## 要約

頂点を「つかむ(MouseEvent.mousedown)」
MouseEvent.mouseupになるまでにそのつかんでいる頂点の座標を上書きし続ける
頂点の更新 --> ターゲット要素のwidth、heightの更新によってサイズが変更される

つまり、もし四辺をつかんでもリサイズしたいときは...
つかんでいるのが四辺であれば
それ専用の計算をすればいいだけで
最終的な処理は同じはずだよね

