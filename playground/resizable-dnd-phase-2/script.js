const dummy_data = [
  { id: 0, subtitle: "this is subtitle" },
  { id: 1, subtitle: "this is subtitle" },
  { id: 2, subtitle: "this is subtitle" },
  { id: 3, subtitle: "this is subtitle" },
  { id: 4, subtitle: "this is subtitle" },
  { id: 5, subtitle: "this is subtitle" },
  { id: 6, subtitle: "this is subtitle" },
  { id: 7, subtitle: "this is subtitle" },
  { id: 8, subtitle: "this is subtitle" },
  { id: 9, subtitle: "this is subtitle" },
  { id: 10, subtitle: "this is subtitle" },
  { id: 11, subtitle: "this is subtitle" },
  { id: 12, subtitle: "this is subtitle" },
  { id: 13, subtitle: "this is subtitle" },
  { id: 14, subtitle: "this is subtitle" },
  { id: 15, subtitle: "this is subtitle" },
  { id: 16, subtitle: "this is subtitle" },
  { id: 17, subtitle: "this is subtitle" },
  { id: 18, subtitle: "this is subtitle" },
  { id: 19, subtitle: "this is subtitle" },
  { id: 20, subtitle: "this is subtitle" },
  { id: 21, subtitle: "this is subtitle" },
  { id: 22, subtitle: "this is subtitle" },
  { id: 23, subtitle: "this is subtitle" },
  { id: 24, subtitle: "this is subtitle" },
  { id: 25, subtitle: "this is subtitle" },
  { id: 26, subtitle: "this is subtitle" },
  { id: 27, subtitle: "this is subtitle" },
  { id: 28, subtitle: "this is subtitle" },
  { id: 29, subtitle: "this is subtitle" },
  { id: 30, subtitle: "this is subtitle" },
  { id: 31, subtitle: "this is subtitle" },
  { id: 32, subtitle: "this is subtitle" },
  { id: 33, subtitle: "this is subtitle" },
  { id: 34, subtitle: "this is subtitle" },
  { id: 35, subtitle: "this is subtitle" },
  { id: 36, subtitle: "this is subtitle" },
  { id: 37, subtitle: "this is subtitle" },
  { id: 38, subtitle: "this is subtitle" },
];

const CONSTANTS = {
  subscribe: true,
  unsubscribe: false,
};

const draggable = document.querySelector(".draggable");
const container = document.querySelector(".transcript-container");
const header = document.querySelector(".transcript-header");
const main = document.querySelector(".transcript-main");
const order = document.querySelector(".transcript-order");
const footer = document.querySelector(".transcript-footer");

const draggableStatus = {
  sidebar: "sidebar",
  noSidebar: "no-sidebar",
  around: "around",
};

// subscriber -----------------------------------------------

// helpers --------------------------------------------------

// @param target {Element} : target tp add event listener
// @param pairs {Array[]<{event, callback}>} : pairs of event and callback function
const subscribe = (target, pairs) => {
  pairs.forEach((pair) => {
    target.addEventListener(pair.event, pair.callback);
  });
};

const unSubscribe = (target, pairs) => {
  pairs.forEach((pair) => {
    target.removeEventListener(pair.event, pair.callback);
  });
};

// .draggableのclassNameを変更します
// @param: {string}: property of draggableStatus
const updateDraggableStatus = (state) => {
  if (Object.values(draggableStatus).includes(state)) {
    draggable.className = "";
    draggable.classList.add("draggable");
    draggable.classList.add(state);

    footer.className = "";
    footer.classList.add("transcript-footer");
    footer.classList.add(state);
  } else {
    // THIS MUST THROW ERROR でもあとでね
    console.log("invalid state has been passed to updateDraggableStatus()");
  }
};

// main.style.heightをonResizeのたびに計算する
// これはtranscriptサイドバーにおいてスクロールを実現するために必要な措置である
// この値はwindowの表示領域の高さ - footerである
const calcHeight = () => {
  console.log("window resized!");

  const resultHeight =
    document.documentElement.clientHeight -
    parseInt(window.getComputedStyle(footer).height.replace("px", "")) -
    parseInt(window.getComputedStyle(header).height.replace("px", ""));

  main.style.height = resultHeight + "px";
};

// 何を知りたいのか？
// .draggableがdropされたときの座標である
// 具体的に言うと
// document.bodyの座標軸上の、.draggableの原点の座標である
// これを.draggable.style.topやleftとして登録したいからである
//
// この関数はondrop時に呼び出される
// その瞬間の座標を計算し
// .draggable.style.top, leftに登録するのである
//
// clientX, Yはマウスポインタの座標みたいなので
// target.style.leftなどの設定値はマウスポインタの場所とマウスがdrag要素をつかんでいる場所との調整が必要
// 
// よくみたらこいつ全然計算していないな...
// 
// @param {HTMLElement} target: 座標をstyleプロパティで登録することになる要素
// @param {{ number, number}} : dropイベントのevent.clientX, clientY座標
const resetCoordinates = (target, { x, y }) => {
  target.style.left = x + "px";
  target.style.top = y + "px";
};

// Drag and Drop part -------------------------------------

// Draggable

const onDragStartHandler = (ev) => {
  console.log("drag start");
  // マウスと.draggable左上座標差分を取得
  const rect = draggable.getBoundingClientRect();
  const data = {
    className: ev.target.classList[0],
    x: parseInt(ev.clientX - rect.x),
    y: parseInt(ev.clientY - rect.y),
  };

  ev.dataTransfer.setData("text/plain", JSON.stringify(data));
  ev.dataTransfer.effectAllowed = "move";

  // set listener
  subscribe(ev.target, [
    { event: "dragover", callback: onDragOverHandler },
    { event: "dragend", callback: onDragEndHandler },
  ]);
  subscribe(document.body, [
    { event: "dragover", callback: onDragOverHandler },
    { event: "drop", callback: onDropHandler },
  ]);
};

const onDragEndHandler = (ev) => {
  //   ev.target.removeEventListener("dragover", onDragOverHandler);
  //   ev.target.removeEventListener("dragend", onDragEndHandler);
  unSubscribe(ev.target, [
    { event: "dragover", callback: onDragOverHandler },
    { event: "dragend", callback: onDragEndHandler },
  ]);
  console.log("drag end");
};

// Droppable

const onDragOverHandler = (ev) => {
  ev.preventDefault();
  return false;
};

// ev.targetはdropゾーンの要素です注意
const onDropHandler = (ev) => {
  console.log("dropped");
  ev.preventDefault();
  // transfer data and move it
  const { className, x, y } = JSON.parse(ev.dataTransfer.getData("text/plain"));

  const target = document.querySelector(`.${className}`);
  if (target) {
    initDraggableContainer(draggableStatus.around);
    resetCoordinates(target, { x: ev.clientX - x, y: ev.clientY - y });
  }
  // remove listener
  unSubscribe(document.body, [
    { event: "dragover", callback: onDragOverHandler },
    { event: "drop", callback: onDropHandler },
  ]);
};

const initDragDropHandlers = () => {
  draggable.addEventListener("dragstart", onDragStartHandler);
};

// update process -------------------------------------------------

const initDraggableContainer = (state) => {
  if (Object.values(draggableStatus).includes(state)) {
    switch (state) {
      case draggableStatus.sidebar:
        updateDraggableStatus(draggableStatus.sidebar);
        calcHeight();
        break;
      case draggableStatus.noSidebar:
        updateDraggableStatus(draggableStatus.noSidebar);
        calcHeight();
        break;
      case draggableStatus.around:
        updateDraggableStatus(draggableStatus.around);
        // dropされたらデフォルトでvh / 2のサイズにする
        main.style.height = document.documentElement.clientHeight / 2 + "px";
        break;
    }
  } else {
    // THIS MUST TRHOW ERROR
    console.log(
      "Invalid parameter has been received at initDraggableContainer"
    );
  }
};

const mountDummyData = () => {
  dummy_data.forEach((data) => {
    const template = `
            <div class="transcript-list" data-id="${data.id}">
                <span>${data.subtitle}</span>
            </div>
            `;
    order.insertAdjacentHTML("afterbegin", template);
  });
};

// main process --------------------------------------------
//
const init = () => {
  mountDummyData();

  initDraggableContainer(draggableStatus.sidebar);

  window.addEventListener("resize", () => {
    calcHeight();
  });

  initDragDropHandlers();
};

window.addEventListener("DOMContentLoaded", () => {
  init();
});

/*
DNDable feature

DOMContentLoaded時にdraggable.addEventListener('dragstart', onDragStartHandler);

onDragstartリスナでdrag要素とdropゾーン要素にリスナをセット

onDropリスナでresetCoordinates()を呼び出しdropされたときの座標を再計算して.draggableの座標を登録しなおす(これはdataTransferして要素を移動してからがいいかも)

onDropリスナでdropゾーン要素のリスナをすべて解除
onDragendリスナでdrag要素のリスナをondragdtart以外解除

drag要素の切り取り、貼り付けは、
drag要素がdropゾーン要素のbodyの子要素なので
「切り取り」が必要ない(DataEvent.dataTransfer.effectAllowedの登録が必要ない？未確認)
「貼り付け」だけすればいいとするならば
やはり座標だけ変更すればいい話になる


.draggableをdragモードにするとき、あらたなclassNameを加えて埋め込みの時のCSSから解放させる
そうしないとまったく計算した座標が適用されない

ひとまず、.draggableは

sidebar: ページ右に埋め込む
no-sidebar: ページ動画の下部に埋め込む
around: dnd-able時

というクラス名で始まるようにしよう

このクラス名は動的に制御する...なかなか大変である...

initDraggableContainer(),
updateDraggableStatus(),
.aroundのcssで



10/28:

まとめ

init()でinitDraggableContainer()を呼び出す
initDraggableContainer()で.draggableを初期化する
初期化内容は,
  .draggableのclassListに.sidebarを追加する(updateDraggableStatus())
  .draggable .transcript-mainのheightを計算して登録する(calcHeight())
  onDragstartイベントリスナをonDragStartHandlerで登録する

onDragStartHandlerでdndイベントリスナをすべて登録する 
onDrop時に.draggableのclassListを.aroundにする(.sidebarは削除)

.draggableはdropしたら.draggable.around.style.leftが計算で決まるようにした（calcCoordinate()）
これは反映させることができた


問題点や課題

footerが不自然
dropされたときのdrop座標はマウス座標なのでこれをdrag要素の左上にしたい
.draggableがdropされたらサイズが変更になるようにしたい
resizableにしたい

改善したいところ

initDraggableContainerはdraggableStatusの値で処理内容が変わるようにしたい
initDraggableContainerはたぶん何度もよばれるから可読性高い方がいい
--> _initDraggableContainer()として修正中

10/29:

# footerが不自然な問題を解決する

## footerの包含ブロックは何者か？

> position プロパティが fixed の場合、包含ブロックはビューポート (連続的なメディアの場合) 
> またはページ領域 (ページメディアの場合) によって確立されます。


ということでfooterの包含ブロックはroot要素かも
.transcript-footerはposition: fixedを指定しなければdndで移動してもおかしなことにはならないのだけれど
position: fixedじゃないとpaddingとかつけられない（はみでるから）

では.sideberの時はposition: fixedにして
.aroundの時はpositionを付けなければいいのでは？

...うまくいった



10/30:
## 確認できる問題

- DNDしたあとだとブラウザのリサイズで`calcHeight`が実行されてdropしてある位置から「下に伸びる」
- コードがごちゃごちゃしてきた...

## 課題

- .draggableをdropしたときの座標は.draggableの左上の頂点が基準ではなく、マウスカーソルのポイント座標が基準となっているこれの修正
- .draggable要素をresize可能とする
- .draggable.aroundにするのって多分というかこのメリットしかありえないんだけどUdemyの動画の字幕表示部分に持ってきたいからだな～ということで.draggable.aroundのときはUIを字幕メインにする、そのUIのアイディアと実装

## drop位置の基準をマウスカーソル座標上ではなくて.draggable左上座標上にしたい

./playground/note.mdの(#mouse cursor の座標と rect 座標)に対処内容を書いた


## .daraggable要素をresizableにする

実装内容
- .draggable各頂点をdragすると.draggable要素の矩形をリサイズできる
- .draggable四辺をdragすると.draggable要素の矩形をリサイズできる




*/
