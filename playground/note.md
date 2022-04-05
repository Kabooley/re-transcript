# Learnign how to implement dynamically resizable and DNDable box

参考: youtube.com/watch?v=NyZSlhzz5Do
上記 URL の動画では DragDropAPI を使わずに VanillaJS で DragDrop を実現している

## 実現するもの

Udemy のトランスクリプション・パーツの再現と
ラインスクリプトを DNDable かつ Resizable にすること

まず 2 つの状態が存在する

1. udemy トランスクリプト window と同じく埋め込まれた状態
   ブラウザ画面のサイズに合わせて移動、拡縮する本来の transcript コンテナとまったく同じ挙動をする

2. DNDable で resizabel な window 化
   ドラグするとこのモードになり、ページのどこでも drop 可能、かつ window のサイズを好きに変更できる

見た目はほぼ本来の transcript コンテナと同じにする

## 必要なもの

sidebar layout
header
footer
checkbox

CSS スキル：まったくもってすっぽり忘れ去っている
あとから見返して役に立つようにまとめること

ーー＞ Udemy/build-responsive-real-..以下略フォルダに

## 今回の開発で得た知見/経験など

#### 固定サイドバーをスクロールページに固定表示させる

main が 200vh あるなかで、サイドバーを固定し main をスクロールしても同じ場所に固定して表示し続ける

`position: fixed`を使う

```html
<body>
    <main class="main"></main>
    <div class="sidebar">
        <div class="header"></div>
        <div class="main"></div>
        <div class="footer"></div>
    </div>
</body>
```

```css
body {
    display: flex;
}

.main {
    height: 200vh;
}

.sidebar {
    position: fixed;
    right: 0;
    width: 25%;
}

/* 
.mainのコンテンツが大量で本来下に伸びてしまう時でも
これでfooterが固定されてmainはスクロールしない
*/
.footer {
    position: fixed;
    bottom: 0;
    width: 100%;
}
```

#### 固定サイドバーの中でのスクロール領域の生成

上記の状態のまま、
main コンテントを固定サイドバーの中でスクロールさせたい

条件：

-   overflow の指定
    はみ出る分は一旦隠す

-   表示領域の高さの計算
    表示領域は高さ指定 + overflow: hidden でスクロール領域生成できる臭い

https://www.nishishi.com/javascript-tips/without-scrollbar-clientheight.html#without-scrollbar-clientHeight0-2

高さは常にピッタリサイズを計算しなくてはならない
どうも 100vh を指定しても効果がなさそう
JavaScript で計算する

```css
.main {
    z-index: 1;
    background-color: #fff;
    border: 1px solid #f7f9fa;
    overflow-x: hidden;
    overflow-y: auto;
    /* height specified by JavaScript */
}
```

#### DNDable by HTML5 Drag and Drop API

drag 要素の条件:

1. `draggable="true"`属性を drag したい要素に付ける
2. `dragstart`イベントをリスンするリスナーを定義する
3. 上記のリスナーで`DataTransfer.setData()`を呼び出す

dataTransfer に drag 要素のデータを登録する:

drag したデータを登録して drop した先で参照するために、
DragEvent.dataTransfer.setData()で登録@onDragstart
DragEvent.dataTransfer.getData()で参照@onDrop

これによって drag されたデータを drop 先で参照できる

drag 要素につけるリスナ：

`onDragstart`: drag 始めたら発火
`onDragenter`: 有効な drop ゾーンへ侵入したら発火する
`onDragover`: 有効な drop ゾーンをホバーしたら発火する
`onDragleave`: 有効な drop ゾーンから離れたら発火する
`onDragend`: drag が終了したら発火する(これは drag 要素の方につける)

これらのイベントのリスナは ev.target を drag 要素を指す
drop ゾーンの要素と混乱することがるから気を付ける

Drop zone の条件：

1. `onDrop`, `onDragover`リスナが登録されている
2. 上記のイベントは`event.preventDefault()`すること(または属性定義のリスナから return false)

droppable-zone 要素につけるリスナ：

`onDragover`
`onDragenter`
`onDragleave`
`onDrop`

`onDragend`イベントは drop ゾーン側では検知できない
なので必ず drag イベント側で登録すること

何を drag drop するのかの指定：

これも条件の一つで、
`DataTransfer.effectAllowed()`をつかって
データを「移動」、「コピー」、「リンク」させるのかを指定する

これを指定しないと、
例えば要素を DND して完全に元の場所から削除されて drop したさきに移動するときに
これが実現できない

あとは drag したときや dropover するときのエフェクトとか指定できるけど省略

さて、この条件の中で次を実現したい

-   ページのどこにでも drop できる
-   `position: fixed`要素を draggable にしたい

##### DataEvent.dataTransfer()で複数データを送受信するとき同じ型に対して複数のデータを登録できるのか？

たとえば次のように`text/plain`に対して複数データを登録したいとき...

```JavaScript

// dragされる要素のclassNameと座標を送信したいとき...
const onDragStartHandler = (ev) => {
  console.log("drag start");

  const rect = draggable.getBoudingClientRect();
  const diff = {x: rect.x - ev.clientX, y: rect.y - ev.clientY};

  // これは何か受け取り側で配列データとして受け取れる？
  ev.dataTransfer.setData("text/plain", ev.target.classList[0]);
  ev.dataTransfer.setData("text/plain", diff);
  ev.dataTransfer.effectAllowed = "move";

  // ...
};
```

結論：できない

理由:

1. `DataEvent.dataTransfer.getData()`の戻り値は`DOMString`でつまり文字列である

> DataTransfer.getData() メソッドは、指定した型のドラッグデータを (DOMString として) 受け取ります。ドラッグ操作がデータを含まない場合、このメソッドは空文字列を返します。

なので`setData('text/plain', )`で String 型以外を送信することを想定していない

2. 同じ datat 型に対して複数は登録できない(同じ型を使うと上書きされる)

```JavaScript

const onDragStartHandler = (ev) => {
  console.log("drag start");

  const rect = draggable.getBoudingClientRect();
  // const diff = {x: rect.x - ev.clientX, y: rect.y - ev.clientY};
  // Objectは渡せない代わりに文字列にすれば...
  const diff = rect.x - ev.clientX + ',' + rect.y - ev.clientY;

  // これは何か受け取り側で配列データとして受け取れる？
  ev.dataTransfer.setData("text/plain", ev.target.classList[0]);
  ev.dataTransfer.setData("text/plain", diff);
  // ...
};

const onDropHandler = (ev) => {
  console.log("dropped");
  ev.preventDefault();

  const data = ev.dataTransfer.getData("text/plain");
  console.log(data);
  // ...
}
```

出力結果：diff の値が出力された

なので、複数データを送信したいときはカンマ区切りの文字列に変換して
取得側ではそれらをカンマ区切りで抽出する作業をする必要がある

つまりこう

```JavaScript
// register
//
// 一旦文字列にする（カンマ区切り）
  const data = ev.target.classList[0] + ',' + parseInt(rect.x - ev.clientX) + ',' + parseInt(rect.x - ev.clientX);
  ev.dataTransfer.setData("text/plain", data);
// receiver
const d = ev.dataTransfer.getData("text/plain").split(',');
console.log(d);   // [draggable, 123, 456]

```

ただしこれだと、完全に dragstarthandler と drophandler は`ev.target.classList[0] + ',' + parseInt(rect.x - ev.clientX) + ',' + parseInt(rect.x - ev.clientX`のデータしか扱えなくなるので不便

解決策: JSON を使う！！！

```JavaScript
// register
const data = {
  classname: ev.target.classList[0],
  x: parseInt(rect.x - ev.clientX),
  y: parseInt(rect.y - ev.clientY),
};

const j = JSON.stringify(data);

ev.dataTransfer.setData("text/plain", j);

// receiver
const d = JSON.parse(ev.dataTransfer.getData("text/plain"));
console.log(d);
```

いろんなデータを Object として
さらに一度の登録で済む

完璧か

##### ページのどこでも drop できるのを実現する

情報収集：
https://stackoverflow.com/questions/6230834/html5-drag-and-drop-anywhere-on-the-screen

`document.body.addEventListener('drop', listener)`で全体を drop 可能として
`getComputedStyle`や`event.target`で座標を計算してすきな drag 場所の座標を登録させる

という手法

`document.body.addEventListener('drop', listener)`は onDragstart したときに登録して
onDragend で解除するようにしたい

##### `position: fixed`要素を draggable にしたい

これって大丈夫なんか？

`position: fixed`:

> 要素は文書の通常のフローから除外され、ページレイアウト内に要素のための空間が作成されません。ビューポートによって定められた初期の包含ブロックに対して相対配置される

transcript ウィンドウは

```css
body {
    display: flex;
}
/* の子要素で */
.draggable {
    position: fixed;
    right: 0;
}
```

というコンテナになっている

なので body が包含ブロックになって
あとは right や top で座標をしていすれば
どこにでも配置できるはずである

ではシナリオはこうである

-   transcript ウィンドウ要素に対して onDragstart リスナを登録する
-   transcript ウィンドウを drag する
-   transcript ウィンドウが DNDable モードになる
-   (DND モード時は特別なサイズになってほしい（transcript ウィンドウのデフォが画面の高さいっぱいまで伸びているから）)
-   onDragstart リスナで次を登録する
    -   document.body.addEventListener('drop')
    -   document.body.addEventListener('dropover')
    -   DataEvent.dataTransfer.setData(/_ drag 要素のすべての情報_/)
-   onDrop 時に drop 座標を計算して draggable コンテナ要素の座標として登録する
-   onDrop 時に document.body.addEventListener('drop'), document.body.addEventListener('dropover')を remove する

頂点座標を再計算する機能を実装して頂点プロパティを動的に決めるようにしたらうまくいった

#### mouse cursor の座標と rect 座標

DND したときの両者の座標差分を計算して、
Drop するときにマウスﾎﾟｲﾝﾀの座標上ではなく要素の左上の座標にドロップされるようにする

マウスが要素を drag するときは、マウスは要素の「内側」にいるはず
かつ
drop するときに要素の左上頂点とマウスの頂点との差分は変わらないはずなので、
dragstart するときに差分を dataTransfer すれば、
drop 先で差分を取得できるはず

知りたいのは
マウスの座標: MouseEvent 継承イベントならば event.clientX, event.clientY で取得できる
.draggable の左上の座標: $.draggable.getBoundingClientRect().x, $.draggable.getBoundingClientRect().y で取得できる

このときの`DataEvent.dataTranscfer()`の drag-type は、
独自のデータを送るときは`text/plain`が推奨とのこと

`Element.getBoundingClientRect()`

> 返値は、要素に対しての getClientRects() が返す矩形の集合である DOMRect (en-US) オブジェクトです。つまり、要素に関連付けられている CSS の境界ボックスのことです。結果は境界ボックス全体を表す読み取り専用の left, top, right, bottom, x, y, width, height の各プロパティを持つ、要素全体を含む最小の矩形です。 width と height 以外のプロパティは、"ビューポートの左上を基準"としています。

送信するのはつぎの座標

```
(rect.x - clientX, rect.y - clientY)
```

DataEvent.dataTransfer()で複数のデータを送ることになったので、
[こちらを参考に](<#DataEvent.dataTransfer()で複数データを送受信するとき同じ型に対して複数のデータを登録できるのか？>)
改善した

```JavaScript
const draggable = document.querySelector(".draggable");

const onDragStartHandler = (ev) => {
  console.log("drag start");
  // マウスと.draggable左上座標差分を取得
  const rect = draggable.getBoudingClientRect();
  const data = {
  className: ev.target.classList[0],
  x: parseInt(rect.x - ev.clientX),
  y: parseInt(rect.y - ev.clientY),
};

  ev.dataTransfer.setData("text/plain", JSON.stringify(data));
  ev.dataTransfer.effectAllowed = "move";
  // ...
};


// ev.targetはdropゾーンの要素です注意
const onDropHandler = (ev) => {
  console.log("dropped");
  ev.preventDefault();
  // transfer data and move it
  const {classname, x, y} = JSON.parse(ev.dataTransfer.getData("text/plain"));
  console.log(classname);
  console.log(x);
  console.log(y);

  const target = document.querySelector(`.${classname}`);
  // ...
};
```


#### boxを四辺と各頂点でリサイザブルにしたい

`./playground/resizable-box/`にて各頂点でリサイズできるボックスは作れるはず
問題は四辺を基準にリサイズする場合である

いったん四辺は無視してもいいなぁ...



#### ここらでごちゃついてきたJavaScriptを整理する

mount時：

- `mountDummyData()`: dummyDataをHTMLとして挿入

- .draggableを初期表示はsidebarにするためにinitDraggableContainer()
    updateDraggableStatus(): .draggableのclassNameを更新する
    calcHeight(): .draggable .transcript-mainを正しく表示するためにheightを計算する
- .draggable .transcript-mainを常に正しい表示にするためにcalcHeight()をonResizeではっかするようにする <--- 問題あり

- DND機能を実現するためのリスナを設定する: initDragDropHandlers()
    基本的にonDragstart時にリスナを登録し、onDrop, onDragend時にリスナを解除するのでDNDの最中だけしかリスナが登録されない
    同様にonDragstartの時にすべて必要なリスナが登録される仕組みなので常にdragstartリスナだけは残しておく

resize機能を実装するにあたって

- resize機能は`.draggable.around`の時だけ機能するようにする

    つまりcalcHeight()はこれまで通りでおｋ
    draggableStatus.aroundの間だけresize機能をONにする


#### Make .draggable container Resizable

**一旦resizeとdndは放置**

UIとtranscriptウィンドウの配置場所や運用方法が決まり次第利用するか廃棄するか決める...

いまさらだけどCSSのresizeでめっちゃ大きさ変更できた...
あとさらに今更だけど、dndもresizeもいらない気がしてきた

いやあればすこし便利だけど
.draggableは次の配置だけでいい気がする

- sidebar
- noSidebar
- subtitle-position : 動画の字幕表示部分

ただし、提供する機能はsubtitle-positionでも字幕が1行ずつ表示できるわけではないので
ある程度のスペースの確保と好きな方向へ伸ばせる（または縮小できる）のがいいはず

resizeするときに考慮すべきこと

- resizeしたら横幅は自由として、縦方向の変更があってもheaderとfooterを常に残す
    つまり.transcript-mainの長さだけ変更される
    というかUI変更したい...


#### transcriptウィンドウを3か所に配置する機能の実装

Udemyの講義ページでの挙動と同じにで自動的に配置する機能と
ボタンクリックで移動する機能ほしい

- 自動機能

本家のtranscriptのclass名が`sidebar`であることを検知したらこちらもサイドバーに表示
`no-sidebar`なら動画下部に表示
そもそも講義ページでtranscriptを有効にしてくれないと拡張機能が使えないようにしないとうまくいかない

上記はcontentScriptで実装するとして

#### sidebar と no-sidebarをウィンドウサイズで配置換えする

sidebar
```
div.has-sidebar
  div.app--row.app--header    // header
  main.app--column-container  // 
    div.app--content-column
      div.app--row.app--body-container  // movie
      div.app--sidebar-column   // sidebar
        section.sidebar--sidebar
          div.sidebar--sidebar-header
          div.sidebar--content
          div.transcript--autoscroll-wrapper.transcript--bottom
      div.app--row.app--dashboard   // dashboard
        div.app--row-content
          div.app--dashboard-content
            section.dashboard-tabs-container
```

no-sidebar
```diff

- div.has-sidebar
+ div.app--no-sidebar
  div.app--row.app--header    // header
  main.app--column-container  // 
    div.app--content-column
      div.app--row.app--body-container  // movie
-      div.app--sidebar-column   // sidebar
-        section.sidebar--sidebar
-          div.sidebar--sidebar-header
-          div.sidebar--content
-          div.transcript--autoscroll-wrapper.transcript--bottom
      div.app--row.app--dashboard   // dashboard
        div.app--row-content
          div.app--dashboard-content
+         div.dashboard-transcript--header
+         div.dashboard-transcript--transcript-panel
+         div.transcript--autoscroll-wrapper.transcript--bottom
            section.dashboard-tabs-container
```


sidebarの時は
div.sidebar-contentのheightはウィンドウY軸方向に対するリサイズに応じて再計算される

div.app--sidebar-columnとdiv.app--body-containerはx軸に対して25:75の配分である

sidebar, no-sidebarの切り替え条件：
window.innerWidth < 975pxでno-sidebarになる

no-sidebarはウィンドウリサイズの影響を受けない
高さはmin-height:300pxである
