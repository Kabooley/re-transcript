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

// .draggable???className??????????????????
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
    // THIS MUST THROW ERROR ??????????????????
    
  }
};

// main.style.height???onResize????????????????????????
// ?????????transcript??????????????????????????????????????????????????????????????????????????????????????????
// ????????????window???????????????????????? - footer?????????
const calcHeight = () => {
  

  const resultHeight =
    document.documentElement.clientHeight -
    parseInt(window.getComputedStyle(footer).height.replace("px", "")) -
    parseInt(window.getComputedStyle(header).height.replace("px", ""));

  main.style.height = resultHeight + "px";
};

// ???????????????????????????
// .draggable???drop?????????????????????????????????
// ?????????????????????
// document.body?????????????????????.draggable???????????????????????????
// ?????????.draggable.style.top???left???????????????????????????????????????
//
// ???????????????ondrop????????????????????????
// ?????????????????????????????????
// .draggable.style.top, left???????????????????????????
//
// clientX, Y???????????????????????????????????????????????????
// target.style.left??????????????????????????????????????????????????????????????????drag??????????????????????????????????????????????????????
// 
// ??????????????????????????????????????????????????????...
// 
// @param {HTMLElement} target: ?????????style???????????????????????????????????????????????????
// @param {{ number, number}} : drop???????????????event.clientX, clientY??????
const resetCoordinates = (target, { x, y }) => {
  target.style.left = x + "px";
  target.style.top = y + "px";
};

// Drag and Drop part -------------------------------------

// Draggable

const onDragStartHandler = (ev) => {
  
  // ????????????.draggable???????????????????????????
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
  
};

// Droppable

const onDragOverHandler = (ev) => {
  ev.preventDefault();
  return false;
};

// ev.target???drop??????????????????????????????
const onDropHandler = (ev) => {
  
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
        // drop??????????????????????????????vh / 2?????????????????????
        main.style.height = document.documentElement.clientHeight / 2 + "px";
        break;
    }
  } else {
    // THIS MUST TRHOW ERROR
    
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

DOMContentLoaded??????draggable.addEventListener('dragstart', onDragStartHandler);

onDragstart????????????drag?????????drop???????????????????????????????????????

onDrop????????????resetCoordinates()???????????????drop??????????????????????????????????????????.draggable??????????????????????????????(?????????dataTransfer????????????????????????????????????????????????)

onDrop????????????drop?????????????????????????????????????????????
onDragend????????????drag?????????????????????ondragdtart????????????

drag??????????????????????????????????????????
drag?????????drop??????????????????body?????????????????????
?????????????????????????????????(DataEvent.dataTransfer.effectAllowed????????????????????????????????????)
?????????????????????????????????????????????????????????
??????????????????????????????????????????????????????


.draggable???drag???????????????????????????????????????className?????????????????????????????????CSS?????????????????????
?????????????????????????????????????????????????????????????????????

???????????????.draggable???

sidebar: ???????????????????????????
no-sidebar: ???????????????????????????????????????
around: dnd-able???

???????????????????????????????????????????????????

??????????????????????????????????????????...???????????????????????????...

initDraggableContainer(),
updateDraggableStatus(),
.around???css???



10/28:

?????????

init()???initDraggableContainer()???????????????
initDraggableContainer()???.draggable??????????????????
??????????????????,
  .draggable???classList???.sidebar???????????????(updateDraggableStatus())
  .draggable .transcript-main???height???????????????????????????(calcHeight())
  onDragstart????????????????????????onDragStartHandler???????????????

onDragStartHandler???dnd????????????????????????????????????????????? 
onDrop??????.draggable???classList???.around?????????(.sidebar?????????)

.draggable???drop?????????.draggable.around.style.left???????????????????????????????????????calcCoordinate()???
??????????????????????????????????????????


??????????????????

footer????????????
drop??????????????????drop??????????????????????????????????????????drag???????????????????????????
.draggable???drop?????????????????????????????????????????????????????????
resizable????????????

????????????????????????

initDraggableContainer???draggableStatus???????????????????????????????????????????????????
initDraggableContainer??????????????????????????????????????????????????????????????????
--> _initDraggableContainer()??????????????????

10/29:

# footer????????????????????????????????????

## footer????????????????????????????????????

> position ?????????????????? fixed ??????????????????????????????????????????????????? (?????????????????????????????????) 
> ???????????????????????? (??????????????????????????????) ?????????????????????????????????


??????????????????footer????????????????????????root????????????
.transcript-footer???position: fixed????????????????????????dnd?????????????????????????????????????????????????????????????????????
position: fixed???????????????padding????????????????????????????????????????????????

??????.sideber?????????position: fixed?????????
.around?????????position???????????????????????????????????????

...??????????????????



10/30:
## ?????????????????????

- DND????????????????????????????????????????????????`calcHeight`??????????????????drop?????????????????????????????????????????????
- ??????????????????????????????????????????...

## ??????

- .draggable???drop????????????????????????.draggable??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
- .draggable?????????resize???????????????
- .draggable.around???????????????????????????????????????????????????????????????????????????????????????Udemy????????????????????????????????????????????????????????????????????????????????????.draggable.around????????????UI????????????????????????????????????UI???????????????????????????

## drop???????????????????????????????????????????????????????????????.draggable???????????????????????????

./playground/note.md???(#mouse cursor ???????????? rect ??????)???????????????????????????


## .daraggable?????????resizable?????????

????????????
- .draggable????????????drag?????????.draggable???????????????????????????????????????
- .draggable?????????drag?????????.draggable???????????????????????????????????????




*/
