# 開発ノート　その２

長くなってきて Lint とかの処理が遅くなってきたので
日誌などは新たにこちらへ記録していく

**このノートはのちのち開発ノートとしてマージする**

## 目次

[課題走り書き](#課題走り書き)
[日誌](#日誌)

## 課題走り書き

-   udemy の講義ページタブを開いたまま、OFF だった拡張機能を ON にして、タブ切り替えしたら拡張機能をすぐに実行できるようにすること

大きな課題

-   chrome.tabs.onUpdate 機能を万全にする
-   OFF 機能
-   最小化機能
-   Udemy の講義ページで動画が切り替わった時に字幕も切り替わること機能
-   Popup の view を rich に
-   Error ハンドリング

小さな課題

-   single-message-passing 機能を sendResponse()を使うようにする
-   みためをリッチに
-

## 日誌

#### 12/9

観測のデザインパターンを導入するのは時間があるときにやるとして
これからは自動スクロール機能を実装していく

`Element.getBoundingClientRect()`でその要素のビューポートに対する位置座標などが取得できる

ここで要素の Y 座標が取得できるので
ここまで scrollTo すればいいのでは？

> Element.scrollTo() は Element インターフェイスのメソッドで、指定された要素内を指定された座標までスクロールします。

`div.ex--dashboard-transcript--transcript-panel`を scrollTo する

```TypeScript
// detectScroll()で要素のハイライトが更新完了したら
// 速やかにこちらを呼出す
const scrollToHighlight = (): void => {
  // そのたびにいまハイライトしている要素を取得する
  const current: HTMLElement = document.querySelector<HTMLElement>(`${SELECTORS.EX.dashboardTranscriptCueContainer}${SELECTORS.EX.highlight}`);

  const panel: HTMLElement = document.querySelector(SELECTORS.EX.dashboardTranscriptPanel);

  const { top } = current.getBoundingClientRect();


  panel.scrollTo({
    top: top,
    left: auto,
    behavior: "instant"
  });
}
```

どうもスクロールが上がったり下がったりするし
ほしい位置にスクロールしてくれない

どんな値を受け取っているのか確認のこと

...やっぱり MutationObserver が余計に発火しているのが問題

余計に生成されている字幕の同じ要素に反応している

#### 12/10

Observer パターンを導入してみる

##### setState ２つのオブジェクトの差分を取得する方法

参考:
https://stackoverflow.com/questions/57899882/javascript-return-differences-between-two-objects/57899941

setState で変更前の\_state と変更後の\_state の差分を吸収して
その差分に応じて subject.notify できるようにする

\_state に対して subscribe するので
\_state のプロパティ名がイベント名として統一する

```TypeScript
interface iControllerStatus {
  position?: keyof_positionStatus;
  view?: keyof_viewStatus;
}

/*
- "sidebar": noSidebarからsidebarへtranscriptを移動する
const insertSidebarTranscript = (): void => {
    const s: subtitle_piece[] = state.loadSubtitles();
    bottomTranscriptView.clear();
    sidebarTranscriptView.render(s);
    // sidebarの時だけに必要
    window.addEventListener('scroll', onWindowScrollHandler);
};

- "noSidebar": sidebarからnoSidebarへtranscriptを移動する
const insertBottomTranscript = (): void => {
    const s: subtitle_piece[] = state.loadSubtitles();
    sidebarTranscriptView.clear();
    bottomTranscriptView.render(s);
    window.removeEventListener('scroll', onWindowScrollHandler);
};

- "middleView"から"wideView"へ更新する
- "wideView"から"middleView"へ更新する


*/
type tEventNames = keyof_positionStatus | keyof_viewStatus;



const state: iControllerState = (() => {
    var _state: iControllerStatus = {};

    extend(_state, new Subject());

    // newStatusもprevStatusも一段階の深さであることが前提
    const _findDiffAndNotify = (newStatus: iControllerStatus, prevState: iControllerStatus): void => {
      var diffs = {};
      var keys = Object.keys(newStatus);

      for (var key in prevState) {
        if (!keys.includes(key)) {
          // 差がある時だけresultへ放り込む
          if(newStatus[key] !== prevState[key]){
            diffs[key] = newStatus[key];
          }
        }
      }
      const dKeys = Object.keys(diffs);
      if(!dKeys.length) return;

      dKeys.forEach(dk => {
        _state.notify(diffs[dk])
      })
    }

    return {
      // _stateは一段階の深さなので社ローコピーで十分
        setState: (o: iControllerStatus) => {
          // いったん変更前を取得しておいて
            const prev = {..._state};
            // 更新して
            _state = {
                ..._state,
                ...o,
            };
            // 差分を比較してNotifyする
            _findDiffAndNotify(_state, prev);

        },
        getState: (): iControllerStatus => {
          // DON'T DO THIS
          // これだと_stateが外で変更されてしまう
            // return _state;

            // _stateは一段階の深さだけなので
            // spread構文を返せばいい
            return {..._state};
        },
    };
})();

```

...なんか無理。
デザインパターンの本読んで、MVC の所をやってからでも
リファクタリングは遅くないはず。

ということで Observer pattern を導入してい見るのは後回し

#### 12/12

自動スクロール機能の実装

まず理解しておくこと

-   `Element.getBoundingClientRect()`が想定する座標の原点は viewport の左上である
-   `Element.scrollTop`はどこを原点とするかは場合による（W3C の説明も複雑）

`Element.scrollTop`の上辺をどことしているのかを確認

#### 12/14

auto-scroll: 動くものができた...`scrollToHighlight()`

残る課題

-   OFF 機能
-   最小化機能
-   Udemy の講義ページで動画が切り替わった時に字幕も切り替わること
-   というか trasncript が表示されていなくても ExTranscript を出力できるようにしたい
-   Popup の view を rich に
-   Error ハンドリング
-   Controller.ts を Model と分離する

##### `popup.tsx`の改善

-   RUN したあとに complete したら RUN ボタンを無効にする
-   見た目を Rich にする
-   popup に記述する説明

「この講義ページのトランスクリプトを再構成する」

あんまいいアイディアが浮かばないので
情報収集もするけど
実際に使ってみよう

-   トランスクリプトを一時消しておいてすぐに戻したいときとかあるから
    それを実現できたらいいなぁ

全然中途半端である

#### 12/16

Udemy の講義ページで動画が更新されたら拡張機能もそれを検知して応じるようにする

1. どうすれば動画の切り替わりが検知できるか

https://www.udemy.com/course/typescript-the-complete-developers-guide/learn/lecture/15066764#content
URL は変化しない...

```html
<!-- 本家のHTML -->
<section class="lecture-view--container--pL22J" aria-label="セクション11: Reusable Code、レクチャー107: When to Use Enums"><div class="video-viewer--container--23VX7">
  <div class="video-player--container--YDQRW udlite-in-udheavy">
    <div class="video-player--video-wrapper--1L212 user-activity--user-inactive--2uBeO">
      <link rel="preload" href="https://mp4-c.udemycdn.com/2019-06-10_15-37-59-538f10d65a1e1a3355b7d7eabb4d3107/2/thumb-sprites.jpg?Expires=1639665856&amp;Signature=NgM6hz1tcUbG0UY67iAqhHQVSYnAgR73xPOHBIRi3WKPP77qlz219YrnpSU3pU-MAyccQUU8t0KLDSE7D2gkJcfMLFRZTaQq48k-EiH0l1oAN00MoBHPGXzwiC39jA5BeIgL~8SIapjKlRJknhrESdoVP0LizBA7hRGTWZi4--Az5s~ckFJ20crafETs83ZnOxE~d7foVDrLtJd-Wed5UKGfRkv8jsHpQ5rw1QPtS4ML4u-OoB3YDHokO8fTNynz4F-gDpr7gBfsmeN5DzaAZIMIPb~IJ3KkmioDS72thwfMii7DDuvCFpHrbWfE3-f5Pk6dM4AET6mQz6YMlyoTMQ__&amp;Key-Pair-Id=APKAITJV77WS5ZT7262A" as="image">
      <div class="video-player--center--2vS3g"><button type="button" class="udlite-btn udlite-btn-large udlite-btn-link udlite-heading-md video-player--play-button--3r0KH" data-purpose="video-play-button-initial"><svg aria-label="ビデオを再生" focusable="false" class="udlite-icon udlite-icon-xxxlarge"></svg>
        <!-- 中略 -->
        <div class="udlite-text-md video-viewer--title-overlay--OoQ6e">107. When to Use Enums</div></div></div></section>
```

案

-   `section.lecture-view--container-pL22J`の`aria-label`が変化したら動画が切り替わった判定
-   `div.udlite-text-md.video-viewer--title-overlay--OoQ6e`が変化したら動画が切り替わった判定 ... こっちにする
-   `chrome.tabs.onUpdated`を用いる

2. `chrome.tabs.onUpdated`を用いる場合

準備：
まず tabId を取得するところから

検証：
「動画が切り替わったこと」を検知できるのか

-   tabId の取得

いつ tabId を取得すると最適か？

popup を押したとき！

background.ts::

popupMessageHandler()
startInjectCaptureSubtitleScript()
checkTabIsCorrent() // ここで tabId を取得する処理を行っている

`chrome.tabs.onUpdated`で
RUN する前でも`state.progress.restructured !== true`なら return すればいい

##### state.\_state.progress.restructured を更新する機能

controller.ts から port 経由で ExTranscript を展開できたら
展開完了のメッセージを送信される

変更前

```TypeScript
// background.ts
const startInjectControllerScript = async (): Promise<void> => {
  try {

      await getWebpageStatus();
      const { progress } = await state.getState();
      // tabIdはstateに保存しておいた方がいいかも
      const tabId: number = await checkTabIsCorrect();

      if (
          progress.captured &&
          !progress.capturing &&
          progress.stored &&
          tabId
      ) {


          const s: subtitle_piece[] = await state.loadSubtitles();

          // >>重要！！<<
          // Injectする前に呼出すこと！
          chrome.runtime.onConnect.addListener(
              (port: chrome.runtime.Port) => {
                  if (port.name !== port_names._requring_subtitles) {
                      // こんなときどんな処理をすればいいんだ？
                      console.assert(
                          port.name === port_names._requring_subtitles
                      );
                  }
                  port.onMessage.addListener((msg: iMessage) => {

                      port.postMessage({
                          from: extensionNames.background,
                          to: extensionNames.controller,
                          subtitles: s,
                      });
                  });

                  port.onDisconnect.addListener(
                      (port: chrome.runtime.Port) => {

                              `Port :${port.name} has been disconnected`
                          );
                      }
                  );
              }
          );

          // inject content script
          const result: chrome.scripting.InjectionResult[] =
              await chrome.scripting.executeScript({
                  target: { tabId: tabId },
                  files: ['controller.js'],
              });

          // sendMessage to popup
          await chrome.runtime.sendMessage({
              from: extensionNames.background,
              to: extensionNames.popup,
              order: orderNames.loaded,
          });
      } else {
          console.error("Error: It's not ready to inject controller.js");
      }
  } catch (err) {
      if (err === chrome.runtime.lastError) {
          console.error(err.message);
      } else {

      }
  }
};
```

変更後

```TypeScript
// background.ts
const startInjectControllerScript = async (): Promise<void> => {
    try {

        await getWebpageStatus();
        const { progress } = await state.getState();
        // tabIdはstateに保存しておいた方がいいかも
        const tabId: number = await checkTabIsCorrect();
        if (
            progress.captured &&
            !progress.capturing &&
            progress.stored &&
            tabId
        ) {


            const s: subtitle_piece[] = await state.loadSubtitles();

            // >>重要！！<<
            // Injectする前に呼出すこと！
            chrome.runtime.onConnect.addListener(
                (port: chrome.runtime.Port) => {
                    if (port.name !== port_names._requring_subtitles) {
                        // こんなときどんな処理をすればいいんだ？
                        console.assert(
                            port.name === port_names._requring_subtitles
                        );
                    }
                    /*
                    Messageの振り分けを可能にして

                    */
                    port.onMessage.addListener(async (msg: iMessage) => {
                        if(msg.order === orderNames.sendSubtitles){
                            port.postMessage({
                                from: extensionNames.background,
                                to: extensionNames.controller,
                                subtitles: s,
                            });
                        }
                        // ExTranscriptの展開が完了した通知を受け取ったら
                        // state._state.progress.restructuredをtrueにする
                        if(msg.completed) {
                            const { progress } = await state.getState();
                            const newProgress: state_progress = {
                                ...progress,
                                restructured: true
                            };
                            await state.setState({progress: newProgress});
                        }
                    });

                    port.onDisconnect.addListener(
                        (port: chrome.runtime.Port) => {

                                `Port :${port.name} has been disconnected`
                            );
                        }
                    );
                }
            );

            // inject content script
            const result: chrome.scripting.InjectionResult[] =
                await chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['controller.js'],
                });

            // sendMessage to popup
            await chrome.runtime.sendMessage({
                from: extensionNames.background,
                to: extensionNames.popup,
                order: orderNames.loaded,
            });
        } else {
            console.error("Error: It's not ready to inject controller.js");
        }
    } catch (err) {
        if (err === chrome.runtime.lastError) {
            console.error(err.message);
        } else {

        }
    }
};

```

```TypeScript

```

動画が切り替わるときに以下の changeInfo を取得した

LOG

```
{status: 'loading', url: 'https://www.udemy.com/course/typescript-the-complete-developers-guide/learn/lecture/15066768#content'}
status: "loading"
url: "https://www.udemy.com/course/typescript-the-complete-developers-guide/learn/lecture/15066768#content"
[[Prototype]]: Object

{status: 'complete'}
status: "complete"
```

loading の起こる要因

-   動画切り替え
-   「コース内容」タブとか
-   「Q&A」タブとかのタブをクリックしたとき

なので loading が起こったらそれは動画の切り替えなのかを結局 DOM をしらべてそうであると判定しないといかん

その機能を実装したいけど...

コードが複雑になってきたからわかりやすく機能を分割したいここらで...

##### しばらくの間やること

中目標： 動画切り替えに応じて ExTranscript を再展開させる

-   動画切り替えの検知
    chrome.tabs.onUpdated と DOM 検査による

-   現在のコードのリファクタリング
    シングルメッセージのやりとりをもっと解りやすくしたい
    state を分離したい(MVC の M として)

##### contentScript.ts の改造

講義セクション・タイトル：`div.udlite-text-md.video-viewer--title-overlay--OoQ6e`の innerText

```TypeScript
const _selectors = {
    // ...
    sectionTitle: "div.udlite-text-md.video-viewer--title-overlay--OoQ6e"
};

const initialize = (): void => {
  // Set up transcript check
  const isOpen: boolean = isTranscriptOpen();
  sendStatusToBackground({ isOpened: isOpen });
  const e: HTMLElement = document.querySelector<HTMLElement>(
    _selectors.controlBar.transcript.toggleButton
  );
  e.addEventListener("click", transcriptToggleButtonHandler, false);
  // Set up language check
  const isEnglish: boolean = isSubtitleEnglish();
  sendStatusToBackground({ isEnglish: isEnglish });
  const b: HTMLElement = document.querySelector<HTMLElement>(
    _selectors.controlBar.cc.popupButton
  );
  b.addEventListener("click", ccPopupButtonHandler, true);
/*
get title and send it
*/
    sendTitle()
};

const sendTitle = async (): void => {
    const title: string = document.querySelector<HTMLElement>(_selectors.sectionTitle).innerText;
    const m: iMessage = {
        from: extensionNames.contentScript,
      to: extensionNames.background,
      title: title,
    }
    await chrome.runtime.sendMessage(m);
}
```

```TypeScript
// constants.ts

export const orderNames = {
    injectCaptureSubtitleScript: "injectCaptureSubtitleScript",
    injectExTranscriptScript: "injectExTranscriptScript",
    transcriptOpened: "transcriptOpened",
    transcriptClosed: "transcriptClosed",
    languageIsEnglish: "languageIsEnglish",
    languageIsNotEnglish: "languageIsNotEnglish",
    // From background to contentScript
    sendStatus: "sendStatus",
    //
    // 新規追加
    //
    sendSectionTitle: "sendSectionTitle",
    // From background to popup
    loading: "loading",
    loaded: "loaded",
    // from controller to background
    sendSubtitles: "sendSubtitles"
} as const;

export interface iMessage {
  // from: extensionsTypes;
  from: extensionsTypes;
  to?: extensionsTypes;
  message?: any;
  //   取得した字幕など
  subtitles?: subtitle_piece[];
  activated?: boolean;
  completed?: boolean;
  order?: orderTypes;
  // english以外認めないのでenglish以外はfalseである
  language?: boolean;
// 新規追加
// contentScript.tsで取得したUdemyの講義ページのセクションタイトル
//
sectionTitle?: string
}

```

まず
contentScript.ts::initialize()で sendTitle()を呼び出し、
background.ts へ sectionTitle を初期登録してもらう

以降は、
background.ts::chrome.tabs.onUpdated.addListener()にて
毎回 loading の変更を検知するたびに contentScript.ts へシングルメッセージを送信して
sectionTitle を送信するようにさせる

```TypeScript
// contentScript.ts

chrome.runtime.onMessage.addListener(
  async (
    message: iMessage,
    sender,
    sendResponse: (response?: any) => void
  ): Promise<void> => {
    const { from, order } = message;
    // orderごとに振り分け
    if (from === extensionNames.background && order === orderNames.sendStatus) {
      const isEnglish: boolean = isSubtitleEnglish();
      const isOpen: boolean = isTranscriptOpen();
      await sendStatusToBackground({
        isEnglish: isEnglish,
        isOpened: isOpen,
      });
      if (sendResponse) {
        await sendResponse({ complete: true });
      }
    }
    if(from === extensionNames.background && order === orderNames.sendSectionTitle){
        await sendTitle();
      if (sendResponse) {
        await sendResponse({ complete: true });
      }
    }
  }
);

```

```TypeScript

interface stateModule {
    // anyはいかんな...
    setState: (any) => Promise<void>;
    getState: () => Promise<iState>;
    saveSubtitles: (d: subtitle_piece[]) => Promise<void>;
    loadSubtitles: () => Promise<subtitle_piece[]>;
    clearStorage: () => Promise<void>;
    saveTabId: (id: number) => void;
    getTabId: () => number;
    //
    // 新規追加
    //
    saveSectionTitle: (sectionTitle: string) => Promise<void>;
    getSectionTitle: () => Promise<string>;
}

const state = ((): stateModule => {
    var _state: iState = {};
    var _subtitle: subtitle_piece[] = [];
    var _tabId: number = null;
    const _key: string = 'key__local_storage_state';
    const _key_subtitles: string = 'key__local_storage_subtitle';
    //
    // 新規追加
    //
    var _sectionTitle: string = null;
    const _key_sectionTitle: string = "key__local_storgae_section_title";



    var _getLocalStorage = (key: string): Promise<iState> => {
        return new Promise<iState>((resolve, reject) => {
            // chrome.storage.local.get()はPromiseチェーンみたいなもの
            chrome.storage.local.get(key, (s: iState): void => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                resolve(s);
            });
        });
    };

    return {
        // --- 中略 ----

        saveTabId: (id: number): void => {
            _tabId = id;
        },
        getTabId: (): number => {
            return _tabId;
        },
        saveSectionTitle: async (sectionTitle: string): Promise<void> => {
            _sectionTitle = sectionTitle;
            try {
                await chrome.storage.local.set({
                    key__local_storgae_section_title: sectionTitle
                });
            }
            catch(err) {
                if (err === chrome.runtime.lastError) {
                    console.error(err.message);
                } else {

                }
            }
        },
        getSectionTitle: async (): Promise<string> => {
            try {

            _sectionTitle = await _getLocalStorage(_key_sectionTItle);
            return _sectionTitle;
            }
            catch(err) {
                if (err === chrome.runtime.lastError) {
                    console.error(err.message);
                } else {

                }
            }
        };
    };
})();



const contentScriptMessageHandler = async (
    m: messageTemplate
): Promise<void> => {
    try {

        const { message } = m;

        // ---中略--
        -
        if(message.title) {


        }
    } catch (e) {
        console.error(e);
    }
};


const movieTransitionHandler = async (sectionTitle: string): Promise<void> => {
    const currentTitle: string = state.
}

```

state を React の state じゃなくて React Hooks の useState みたいにしたら効率的になるかしら？
まいかい state に変数を追加するたびに修正が面倒...

あと毎回 localStorage に保存する方法が長ったらしいので class 化する

```TypeScript
// chrome.storage.localのclass化
//
// あとでutils/へ保存すること
//
// 保存するデータごと(保存するときのkey毎)にインスタンスを生成することになる
class LocalStorage<T> {
    constructor(private key: string){}

    private _getLocalStorage(key: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            // chrome.storage.local.get()はPromiseチェーンみたいなもの
            chrome.storage.local.get(key, (s: T): void => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                resolve(JSON.parse(s));
            });
        });
    };

    async save(data: T): Promise<void> {
        try {
            const obj = {[this.key]: data};
            await chrome.storage.local.set(obj);
        }
        catch(err) {
            if (err === chrome.runtime.lastError) {
                console.error(err.message);
            } else {

            }
        }
    };

    async load(): Promise<T> {
        try {
            const data: T = await this._getLocalStorage(this.key);
            return data;
        }
        catch(err) {
            if (err === chrome.runtime.lastError) {
                console.error(err.message);
            } else {

            }
        }
    }
  }


// USAGE
const ls_sectionTitle = new LocalStorage<string>("key_section_title");
await ls_sectionTitle.save(someStringdata);
const data = await ls_sectionTitle.load();
```

state モジュールを見直す

```TypeScript

const deepCopier = <T>(data: T): T => {
  return JSON.parse(JSON.stringify(data));
}


interface iStatus {
  english: boolean;
  opened: boolean;
}

interface iSubtitle {
  index: number;
  subtitle: string;
}

interface iDeepNested {
  subData: {
      deepNested: {
          something: string
      }
  }
}

interface iState {
  status?: iStatus
  subtitles?: iSubtitle[];
  tabId?: number;
  sectionTitle?: string;
  datas?: iDeepNested
}

const __state = (function(){
  var _storage: iState = {};

  // storage key
  const _key_storage: string = "_key__state_storage";
  const _localStorage: LocalStorage = new LocalStorage<iState>(_key_storage);


  return {
    //   iStateのいずれかのプロパティであるオブジェクトを渡すことができる
    //   iStateの各property定義に?がついていることが条件
    //
    // prop: deep copyされたiStateのプロパティが渡されることを前提にする
    setState: async (prop: {[Property in keyof iState]: iState[Property]}): Promise<void> => {
      _storage = {
        ..._storage,
        ...prop
      }
      try {
          await _localStorage.save(_storage);
      }
      catch(err) {
        if (err === chrome.runtime.lastError) {
          console.error(err.message);
        } else {

        }
      }
    },
    getState: async (): Promise<iState> => {
      try {
        const s: iState = await _localStorage.load();
        // これシャローコピーだけど、すぐにdataはスコープから外れるからまぁええやろ
        _storage = {
          ..._storage, ...s
        }
        // コピーを渡す
        return deepCopier(_storage);
      }
      catch(err) {
        if (err === chrome.runtime.lastError) {
          console.error(err.message);
        } else {

        }
      }
    }
  }
})();



```

使えそうな Mapped Types

```TypeScript
interface state_script_status {
    popup: messagePassingStatusKeys;
    contentScript: messagePassingStatusKeys;
    controller: messagePassingStatusKeys;
    option: messagePassingStatusKeys;
}

type test = {
    [Property in keyof state_script_status]: state_script_status[Property];
}
// test = {
//     popup: messagePassingStatusKeys;
//     contentScript: messagePassingStatusKeys;
//     controller: messagePassingStatusKeys;
//     option: messagePassingStatusKeys;
// }

```

-   stackoverflow での deep clone に関する最も人気の回答

https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript

> オブジェクト内で Dates、functions、undefined、Infinity、RegExps、Maps、Sets、Blobs、FileLists、ImageDatas、sparse Arrays、Typed Arrays、またはその他の複雑な型を使用しない場合、オブジェクトをディープクローン化するための非常に単純なワンライナーは次のとおりです。

`const deepCopied = JSON.parse(JSON.stringify(_deepNested));`

> **車輪の再発明はするな**

こちらによれば
結局 deep copy するには
JSON.stringify()かライブラリを使えとのことの模様
それ以外だと、やっぱりシャローコピーになるよってことらしい

```JavaScript
const deepNested = {
    subdata: {
        deep: {
            something: "something"
        }
    }
};
const deepCopied = JSON.parse(JSON.stringify(deepNested));


```

さて問題はこれを setState の内側に含めて setState に丸投げするのか、
setState する前にプログラマが気を付けて deepCopied を渡すようにするのか
どちらにするのかである...

-   React の state はどう deep nested を扱うのか？

https://stackoverflow.com/questions/43040721/how-to-update-nested-state-properties-in-react

やっぱり deep nested は react の state でも「考慮しない」そうだし
いずれの回答も library を使うのが常套手段の要である

**setState()する前にコピーを作成してから渡す**手段を採用する
lodash を使うか

#### 12/19

deep nested object は JSON メソッドを使う
setState()する前と、chrome.storage.local.set, get でも

subtitle_piece[]は何度も JSON メソッドにさらすとパフォーマンスやばそうなんで
これだけは別で保存しよう

疑問点：
localStorage へ deep nested を保存したら参照を保存することになるのか？
localStorage を扱う前と後は JSON メソッドを使うべきか？

答え：
localStorage では本物の JSON を保存する
なので JavaScript で使うために毎度 JSON.stringify(), JSON.parse()するのであって
別にディープコピーしたいから毎回 JSON メソッドを使っているわけではない

なので別に storage へ保存するのに deep copy のことは考慮しなくていい

```TypeScript
import { LocalStorage } from "../utils/LocalStorage";
import { deepCopier } from "../utils/helpers";

/*
制約

- chrome.storage.localへ保存するためのkeyが必須である
    このStateクラスは、一つのkeyしか保存できない
- TYPE interfaceはすべてのpropertyに?が必須である
    これはsetState()にTYPEのプロパティのうち一つだけを保存などを可能とするための措置である

*/
class State<TYPE> {
    private _state: any;
    private _localStorage: iLocalStorage;
    private _key: number;

    constructor(key: number){
        this._key = key;
        this._localStorage = new LocalStorage<TYPE>(this._key);
    }

    async setState(prop:{[Property in keyof TYPE]: TYPE[Property]}): Promise<void> {
        this._state = {
          ...this._state,
          ...prop
        }
        try {
            await _localStorage.save(_storage);
        }
        catch(err) {
          if (err === chrome.runtime.lastError) {
            console.error(err.message);
          } else {

          }
        }
    };

    async getState(): Promise<TYPE> {
        try {
          const s: iState = await _localStorage.load();
          this._state = {
            ...this._state, ...s
          }
          return deepCopier(this._state);
        }
        catch(err) {
          if (err === chrome.runtime.lastError) {
            console.error(err.message);
          } else {

          }
        }
    };

    async deleteProp(): Promise<void> {

    }


}


// USAGE

const subtitles: subtitle_piece[] = [
    {index: 1, subtitle: "this is subtitle 1"},
    {index: 2, subtitle: "this is subtitle 2"},
    {index: 3, subtitle: "this is subtitle 3"},
    {index: 4, subtitle: "this is subtitle 4"},
    {index: 5, subtitle: "this is subtitle 5"},
    {index: 6, subtitle: "this is subtitle 6"},
    {index: 7, subtitle: "this is subtitle 7"},
    {index: 8, subtitle: "this is subtitle 8"},
    {index: 9, subtitle: "this is subtitle 9"},
];
const key_subtitle: string = "key__subtitles";

// newするときにchrome.storage.localへ渡すことになるkeyを渡す
const state_subtitles = new State(key_subtitle);
// setState()する前にネストされたデータを保存する場合はdeep copyする
await state_subtitle.setState(deepCopier(subtitles));
// データの一部を変更して保存する場合、その変更はsetStateする前に済ませる
subtitles[1].subtitle = "subtitle 1 has been changed";
await state_subtitle.setState(deepCopier(subtitles));
```

この State class を使うとして
State のインスタンスはどこに保存しておこうか...

いったん background.ts のなかでグローバルにする

#### 12/21

background.ts へ State class を登録して使ってみる予定だけど
そもそも State のインスタンスを扱うという時点で間違っているかも

なぜなら background script は頻繁にアンロードされるから
以前の変数の変更は local storage とかに保存しておかない限り
引き継がれない

つまりインスタンスはそのたび消えることになるはずである

...となると結果的に class よりも module の state の方が
background script の事情に沿うね...

ということで折角作ったけれど
utils/State.ts はお蔵入りです

background.ts へ utils/LocalStorage クラスは導入してもいいかも

##### Trello で進捗管理

なんか何がタスクで何が実装している機能なのか忘れるし
日誌を見直すしてから情報整理するのつらい

なので使えるサービスは使いましょう

##### リセット機能の実装

把握しておくこと:

> **contentScript は remove はできない** > https://stackoverflow.com/questions/18477910/chrome-extension-how-to-remove-content-script-after-injection/18477961

再度 inject するというのは幻想ということだそうです

作り直すところ：

マウント時だけの特別な処理を最小限にして
なるべくすべてを更新時に実行する処理に変更する

background.ts

state で変更する部分
\_state:
\_state.state_script_status.controller リセット
\_state.state_page_status.isTranscriptOn リセット
\_state.state_page_status.isEnglish リセット
\_state_progress 全部リセット

    _subtitle: リセット

contentScript.ts

    一応TranscriptとEnglishがONかどうかをチェックして送信する

controller.ts

```TypeScript

const state: iControllerState = (() => {
    // 以下、全部リセット
    var _state: iControllerStatus = {};
    var _subtitles: subtitle_piece[] = [];
    var _highlight: number = null;
    var _ExHighlight: number = null;
    var _indexList: number[] = [];

    // ...
}
```

background.ts から更新の命令が来たら全ての state をリセット
background.ts から subtitles が送られてくるまで待機。
送らせてきたらマウント時と同じ処理を実行する

なにかリスナを重複して登録してしまわないか不安
そうしないために...
動画が切り替わった後にリスナが反応するか確認する

##### background.ts へリセット機能実装

やっぱり State は作り直した方がいいかも
State へ保存する変数すべてに対して delete ﾒｿｯﾄﾞ実装しないといかん

めんどい

たとえば State class をやっぱり使うとして
毎回インスタンスを生成するとしても
保存したいのはインスタンスじゃない変数で
インスタンスは保存する必要がない

でもそれだとアンロードからもどったときにそれができればいいけれど
毎回

```TypeScript
const state = ((): stateModule => {
    var _registeredList = {};
    var _state: iState = {};
    var _subtitle: subtitle_piece[] = [];
    var _tabId: number = null;
    const _key: string = 'key__local_storage_state';
    const _key_subtitles: string = 'key__local_storage_subtitle';
    var _sectionTitle: string = null;
    const _key_sectionTitle: string = "key__local_storgae_section_title";


    var _setState = (o): void => {
        const { scripts, pageStatus, progress }: iState = o;
        _state = {
            ..._state,
            ...scripts,
            ...pageStatus,
            ...progress,
        };
    };

    var _getLocalStorage = <TYPE>(key: string): Promise<TYPE> => {
        return new Promise<TYPE>((resolve, reject) => {
            chrome.storage.local.get(key, (s: TYPE): void => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                resolve(s);
            });
        });
    };

    return {
        /*
            新規追加
        */
       initState: async <TYPE>(name: string, o: TYPE): Promise<void> => {

       },
        setState: async (o): Promise<void> => {
            //
            _state = {
                ..._state,
                ...o,
            };
            try {
                await chrome.storage.local.set({
                    key__local_storage_state: _state,
                });
            } catch (err) {
                if (err === chrome.runtime.lastError) {
                    console.error(err.message);
                } else {

                }
            }
        },
        getState: async (): Promise<iState> => {
            try {
                //
                const current: iState = await _getLocalStorage<iState>(_key);
                _setState(current);
                return { ..._state };
            } catch (err) {
                if (err === chrome.runtime.lastError) {
                    console.error(err);
                } else {

                }
            }
        },
        saveSubtitles: async (d: subtitle_piece[]): Promise<void> => {
            // Note: 中身は常に上書きではなく新しくなる
            //
            _subtitle.splice(0);
            _subtitle.push(...d);
            try {
                await chrome.storage.local.set({
                    key__local_storage_subtitle: _subtitle,
                });
            } catch (err) {
                if (err === chrome.runtime.lastError) {
                    console.error(err.message);
                } else {

                }
            }
        },
        loadSubtitles: async (): Promise<subtitle_piece[]> => {
            //
            _subtitle.splice(0);
            try {
                // const loaded: subtitle_piece[] = await chrome.storage.local.get(_key_subtitles);
                const loaded: { [key: string]: subtitle_piece[] } =
                    await chrome.storage.local.get(_key_subtitles);
                _subtitle.push(...loaded[_key_subtitles]);
                return _subtitle;
            } catch (err) {
                if (err === chrome.runtime.lastError) {
                    console.error(err);
                } else {

                }
            }
        },
        clearStorage: async (): Promise<void> => {

            await chrome.storage.local.remove(_key);
        },
        saveTabId: (id: number): void => {
            _tabId = id;
        },
        getTabId: (): number => {
            return _tabId;
        },
        saveSectionTitle: async (sectionTitle: string): Promise<void> => {
            _sectionTitle = sectionTitle;
            try {
                await chrome.storage.local.set({
                    key__local_storgae_section_title: sectionTitle
                });
            }
            catch(err) {
                if (err === chrome.runtime.lastError) {
                    console.error(err.message);
                } else {

                }
            }
        },
        getSectionTitle: async (): Promise<string> => {
            try {

            _sectionTitle = await _getLocalStorage<string>(_key_sectionTitle);
            return _sectionTitle;
            }
            catch(err) {
                if (err === chrome.runtime.lastError) {
                    console.error(err.message);
                } else {

                }
            }
        }
    };
})();

```

#### 12/23

State.setState にうまく引数が渡せない＆展開できない問題

次のように保存しておいてほしい...

`{key__sectionTitle: subtitle_piece[]}`

しかし次のようになってしまった

```{key__sectionTitle: {…}}
key__sectionTitle:
0: "1"
1: "0"
2: "8"
3: "."
4: " "
5: "E"
6: "x"
7: "t"
8: "r"
9: "a"
10: "c"
11: "t"
12: "i"
13: "n"
14: "g"
15: " "
16: "C"
17: "S"
18: "V"
19: " "
20: "R"
21: "e"
22: "a"
23: "d"
24: "i"
25: "n"
26: "g"
sectionTitle: "108. Extracting CSV Reading"
[[Prototype]]: Object
[[Prototype]]: Object
```

原因は、
Generics の型を統一できていない点である

はじめの呼び出しの時点で

`TYPE: {sectionTitle: string}`にしてしまったために

`State.setState()`の TYPE が string になってほしいところ、

そうでない型になってしまった

```TypeScript

// 初めの呼び出し
await stateList.setState<{ sectionTitle: string }>(
    nameOfState.sectionTitle,
    { sectionTitle: message.title }
);

// stateList.setState()での処理
setState: async <TYPE>(name: string, data: TYPE): Promise<void> => {
    await _list[name].setState<TYPE>(data);
}

// State.setState()での処理
//
// - Objectを渡されることが前提である
// - TYPEを遵守することが条件である
export class State<TYPE> {
    async setState(prop: {
        [Property in keyof TYPE]: TYPE[Property];
    }): Promise<void> {
        //
        // LOG
        //

        //
        //
        this._state = {
            ...this._state,
            ...prop,
        };
        try {
            await this._localStorage.save(this._state);
            //
            // LOG
            //

            //
            //
        } catch (err) {
            if (err === chrome.runtime.lastError) {
                console.error(err.message);
            } else {

            }
        }
    }
}

```

一方、`iState`を保存するときはうまくいっている

```TypeScript
interface iState {
    scripts?: state_script_status;
    pageStatus?: state_page_status;
    progress?: state_progress;
};

// 初めの呼出
if (message.activated) {
    const { scripts } = await stateList.getState<iState>(
        nameOfState.extension
    );
    await stateList.setState<iState>(nameOfState.extension, {
        scripts: {
            ...scripts,
            controller: messagePassingStatus.working,
        },
    });

// stateList.setState()での処理
// TYPE: iState
// data: scripts: { popup: "working", contentScript:... }
setState: async <TYPE>(name: string, data: TYPE): Promise<void> => {
    await _list[name].setState<TYPE>(data);
}



```

ちょっと devtools で追跡した方がいいね
iState も更新できている様で更新できていないので
うまくいっていない模様

やっぱり面倒なので、`stateList`は参照を返すようにする

State, LocalStorage などの使い方をテストした
"Udemy\chrome-extension\playground-chromeextension"

ただしく入出力できる使い方を確認できた

#### 12/26

##### runtime.onUpdate と runtime.onInstalled と tabs.onActivated の処理内容の見直しが必要

background.ts

拡張機能を ON にしてから、タブの切り替えで Udemy 講義ページに行くとき、
chrome.runtime.onInstalled()が済んでいないままなので、
setupState()とか実行されていないまま、State のインスタンスにアクセスしようとしてしまう

今後は、
**statelist.\_list.length === 0 && 正しいタブ(Udemy 講義ページである)**
ならば Popup の RUN ボタンを押す前の状態まで処理を勝手に実行するようにする

変更前:

```TypeScript

chrome.runtime.onInstalled.addListener(
    async (details: chrome.runtime.InstalledDetails) => {



        setupState();

        const refStatus: State<iStatus> = stateList.caller<iStatus>(
            nameOfState.status
        );

        await refStatus.clearStorage();
        await refStatus.setState({
            scripts: {
                popup: 'notWorking',
                contentScript: 'notWorking',
                controller: 'notWorking',
                option: 'notWorking',
            },
            pageStatus: {
                isTranscriptOn: false,
                isEnglish: false,
                isWindowTooSmall: false,
            },
            progress: {
                capturing: false,
                captured: false,
                stored: false,
                restructured: false,
            },
        });
    }
);

chrome.tabs.onActivated.addListener(async (activeInfo) => {

    const tabId: number = await checkTabIsCorrect();
    if (tabId === activeInfo.tabId) {

    }
});

/*
Handling update on web page.

*/
chrome.tabs.onUpdated.addListener(
    async (tabId: number, changeInfo, Tab: chrome.tabs.Tab): Promise<void> => {


        const correctTabId: number = await checkTabIsCorrect();
        if (tabId !== correctTabId || changeInfo.status !== 'loading') return;

        const { progress } = await stateList
            .caller<iStatus>(nameOfState.status)
            .getState();
        if (!progress.restructured) return;

        await sendMessageToTabsPromise(correctTabId, {
            from: extensionNames.background,
            to: extensionNames.contentScript,
            order: orderNames.sendSectionTitle,
        });


        // contentScriptからシングルメッセージが送信されるので
        // メッセージハンドラが処理を引き継ぐ
    }
);
```

変更後：

background.ts
chrome.runtime.onInstalled,
chrome.runtime.onUpdated,
chrome.runtime.onActivated
上記のリスナにおいて、
`statelist._list.length === 0 && await checkTabIsCorrect()`が真であるならば、
初期化処理を実行することとする

    初期化処理
        `initialize()`
            これまでは各拡張機能からステータスを送信させていたが、
            これからは、background.tsから各拡張機能にステータスを送信するようにさせる
            拡張機能から送信させても、その値を保存しておくStateのインスタンスがまだ生成されていない可能性があるため

    `statelist._list.length > 0 && await checkTabIsCorrect()`が真であるならば
    初期化済で実行可能状態であるか確認する

```TypeScript

export interface iStateList {
    register: <TYPE>(name: string, instance: State<TYPE>) => void;
    unregister: (name: string) => void;
    caller: <TYPE>(name: string) => State<TYPE>;
    //
    // DEBUG
    //
    showList: () => void;
    //
    // ADDED
    //
    length: () => number;
}

const stateList: iStateList = (function () {

    var _list = {};

    return {
        // ...中略...
        //
        // ADDED
        //
        length: (): number => {
            return Object.keys(_list).length;
        }
    };
})();

//
// ADDED
//
/*
    isStateInitialized
    ________________________________________

    Stateのインスタンスが生成されているならば、
    すでにstateList._listへ追加されているはず
    且つ、
    生成とイニシャライズは必ず同時に行うから
    イニシャライズ済
    という前提のもと

    stateList._listに長さがあればtrue

*/
const isInitialized = (): boolean => {
    if(stateList.length())return true;
    else return false;
}

//
// ADDED
//
/*
    initializeStates
    __________________________________________
    setupState()の後に必ず呼び出す
    Stateのインスタンスに初期値を与える
*/
const initializeStates = async (): Promise<void> => {

        const refStatus: State<iStatus> = stateList.caller<iStatus>(
            nameOfState.status
        );
        if(!refStatus)return;

        await refStatus.clearStorage();
        await refStatus.setState({
            scripts: {
                popup: 'notWorking',
                contentScript: 'notWorking',
                controller: 'notWorking',
                option: 'notWorking',
            },
            pageStatus: {
                isTranscriptOn: false,
                isEnglish: false,
                isWindowTooSmall: false,
            },
            progress: {
                capturing: false,
                captured: false,
                stored: false,
                restructured: false,
            },
        });
}


//
// ADDED
//
/*
    letExtensionsSendStatus
    _____________________________________________

    Send single message to contentScript and popup to send
    each status.
    Receiving message, each extensions send single message.

    single messageじゃなくてportにした方がいいかしら...

*/
import { sendMessageToTabsPromise, sendMessagePromise } from "../utils/helpers";

const _messageTemplate = {
    requireContentScriptForStatus: {
        from: extensionNames.background,
        to: extensionNames.contentScript,
        order: sendStatus
    },
    requirePopupForStatus: {
        from: extensionNames.background,
        to: extensionNames.popup,
        order: sendStatus
    }
}
const letExtensionsSendStatus = async (): Promise<void> => {
    try {
        /*
            TODO:

            ここすべて解決してから次に行きたいから、
            Promise.all()にしたい

            chrome-extension/palyground-chromeextension/で確認しよう
        */
        const { tabId } = await stateList.caller<iTabId>(nameOfState).getState();
        // await sendMessageToTabsPromise(tabId,
        //     {
        //         from: extensionNames.background,
        //         to: extensionNames.contentScript,
        //         order: sendStatus
        //     }
        // );
        // await sendMessagePromise({
        //         from: extensionNames.background,
        //         to: extensionNames.popup,
        //         order: sendStatus
        // });
        const sendingMessageResult = [
            sendMessageToTabsPromise(tabId, _messageTemplate.requireContentScriptFoStatus),
            sendMessagePromise(_messageTemplate.requirePopupForStatus)
        ];
        await Promise.all(sendingMessageResult);
    }
    catch(err) {
        console.error(err.message);
    }
}


//
// ADDED
//
/*
    initialize()
    __________________________________

    Invoked when State instances are not generated yet
    and active tab is Udemy course page.

    setup and initialize State instances.
    setup extensions(contentScript, popup)


*/
const initialize = async ():Promise<void> => {
    try {
        // Generate State instances.
        await setupState();
        // Initialize State instances.
        await initializeState();
        // Check extensions status
        // contentScript, popup


    }
    catch(err) {
        console.error(err.message);
    }
}
```

```TypeScript
/*
    拡張機能がUdemy講義ページの時に、chromeの拡張機能管理から
    ONまたはOFFにされる場合がある
    また、
    拡張機能管理ページでONまたはOFFにするときは、タブを変更しないと
    Udemy講義ページに移動できないので
    その場合は初期化処理をchrome.tabs.onActivatedに譲る

    ということでtabがUdemy講義ページなのかチェックする
*/
chrome.runtime.onInstalled.addListener(
    async (details: chrome.runtime.InstalledDetails) => {



        if (!(await checkTabIsCorrect()) || isInitialized()) return;
        await initialize();
});

/*
    移動した先のtabがUdemy講義ページである
    且つ、
    Stateの初期化が済んでいない
    ならば初期化処理を実行する
*/
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tabId: number = await checkTabIsCorrect();
    if (tabId !== activeInfo.tabId || isInitialized()) return;

    await initialize();
});


/*
    onUpdatedはあらゆる場面で呼び出されるが、
    知りたいのは
    - 動画が切り替わったのかどうか
    - 初期化済かどうか

    tabIdがUdemy講義ページのtabIdであること
    &&
    chnageInfo.status === "loading"
    &&
    sectionTitleが変更された

    ならば動画が切り替わった判定
*/
chrome.tabs.onUpdated.addListener(
    async (tabId: number, changeInfo, Tab: chrome.tabs.Tab): Promise<void> => {



        // tabIdが正しく、ステータスがloadingならば次の処理へ
        const correctTabId: number = await checkTabIsCorrect();
        if (tabId !== correctTabId || changeInfo.status !== 'loading') return;

        if(!isInitialized()) await initialize();

        const { progress } = await stateList
            .caller<iStatus>(nameOfState.status)
            .getState();
        if (!progress.restructured) return;

        await sendMessageToTabsPromise(correctTabId, {
            from: extensionNames.background,
            to: extensionNames.contentScript,
            order: orderNames.sendSectionTitle,
        });

        // contentScriptからシングルメッセージが送信されるので
        // メッセージハンドラが処理を引き継ぐ
    }
);

```

確認された問題

1. contentScript.js を動的 inject にすべきかどうか...

次の状況

-   chrome://extensions で拡張機能を ON にしてから、「更新ボタン」を押す
    これで background.js の chrome.runtime.onInstalled.addListener()が実行される

-   chrome のタブを切り替えて予め開いてあった Udemy の講義ページに切り替える
    これで background.js の chrome.runtime.onActivated.addListener()が実行される

しかしこれで Udemy の講義ページに拡張機能を ON の状態でたどり着いても静的 content script は挿入されていない

その状況で manifest.json の matches パターンの URL にたどり着いても content script は挿入されないのは仕様だな

2. background.js から拡張機能の各機能にシングルメッセージを送るべきかどうか

次の状況

-   拡張機能を ON にしたのち、ロードして udemy の講義ページに移動する

これだといまんところ content script が inject される前にもろもろの処理が進んでしまう
これは当然である
なぜならば contentScript.ts では setTimeout で 10 秒待つことになっているからだ

となれば、結局 background.js から content script へシングルメッセージを送信するのはやめて
これまで通り、contentscript からの inject 完了のメッセージがくるまでまつようにすればいい

結論：たいそうなものを作りたいわけでもないので、拡張機能を使うにはリロード前提、contentscript からのメッセージをまつ仕様にする

#### 12/30

現状確認される仕様

1. タブの切り替えで match する URL へ移動しても静的 content script は院ジェクトされない
   リロードが必ず必要になる

2. chrome.runtime.onInstalled は content script の match パターンの URL へ移動したら実行される
   こっちはリロードが必要ない。タブの切り替えだけでも発火する

3. chrome.runtime.onUpdated は URL の match パターンとか関係なくどこでも実行される
   非常に危険。常に関係ないページでは黙らせておくこと

4. chrome.runtime.onUpdated の changeInfo.status の loading は、その後 loading が完了したら complete を送信する
   なので loading を受け取ったら complete がくるまで処理を非同期にするとかするとよさそう

次の状況に対応したい

1.  タブの切り替えなどリロードを伴わないで matchURL へ到達しても content script をインジェクトしたい

    リロード要らずで実行出来たいのでやっぱり静的 content script はやめて
    動的 inject にする

2.  chrome.runtime.onUpdated と chrome.runtime.onInstalled と chrome.tabs.onActivated を両立させたい

    -   chrome.runtime.onInstalled の発火するのは ：
        拡張機能を ON にして、「更新ボタン」を ON にしたとき
        **これをしないと永遠に onInstalled は発火しない！**
        かつ
        **onInstalled は「更新時」しか発火しない**

        ただ onInstalled だけ発火しないだけで他の処理は勝手に進む

        拡張機能は chrome ブラウザの右上に表示されるアイコンなどでは ONOFF を
        切り替えられないので
        ONOFF したら必ずページのリロードまたはタブの切り替えが発生するはずなので
        リロードまたはタブ切り替えで動的 inject や初期化をするとしたら、
        onInstalled で行う処理はそんなにないかも...

    -   タブの切り替えで matchURL へたどり着いたとき：
        発火するのは...
        chrome.tabs.onActivated

    -   リロードで matchURL へたどり着いたとき
        発火するのは...
        chrome.runtime.onUpdated

    ということは、

    タブの切り替えとリロード時に行う初期化処理を共通にすればいいはず
    onInstalled の「更新」作業は本来リリース時にはない機能なので
    onInstalled の行う処理は最低限でいいはず
    （メモリを無駄遣いすることになるから）

    ということで

        onActivatedとonUpdatedでは次をチェックする
            matchURLであるかどうか
            stateList._listがemptyである

        上の条件が両方真であるならば、初期化処理を行う
            Stateの初期化、
            contentScript.jsの動的inject
            Stateの更新

        やること：

            contentScript.jsの動的inject処理の実装
            manifest.jsonの更新

3.  動画切り替え時は、リロードが完了してから処理を実行できるようにしたい

        動画の切り替わり時でもloadingからcompleteが必ずセットであることは確認できた

        やること：
            chrome.runtime.onUpdated.addListener()のchangeInfo.status === "loading"になったら
            "complete"を待つ非同期処理を実装する
            "complete"になったら、動画が切り替わったのかチェックする処理を実行するようにする

##### contentScript.js の動的 inject

chrome.tabs.onActivated, chrome.runtime.onUpdated で
初期化が済んでいないことを確認したら
contentScript.js を動的にインジェクトすることとする

```TypeScript
// inject content script
const result: chrome.scripting.InjectionResult[] =
await chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ["controller.js"],
});
```

コードはこれだけなので
実行する前には次が必要である

-   inject 先の URL が正しいこと
-   tabId が正しいこと

inject されたら、inject された content script からの完了シングルメッセージも受け取ってから
initialize()したいので
Promise.all()するか...

Promise.all()するとして、どうすればいいか...

inject 前に port を開いておく
inject する
contentscript からの connect で port がつながるので
contentscript から inject 完了信号を受け取る
(初期ステータスは State のインスタンスができてから)
そこまで完了して初めて initialize()する

```TypeScript
// background.ts

// いまさらだけど、runtimeのリスナは非同期に呼び出すべきではないので
// このonConnectリスナは外に出すべき
//
// port.name別に処理を変えればいい
chrome.runtime.onConnect.addListener((port: chrome.runtime.Port) => {
    switch(port.name) {
        case: port_names._requiring_subtitles:
            // invoke handler and pass port to handler
            //
            // portは他の関数に渡しても接続やスコープは途切れないか？
            break;
        case: port_names._inject_complete:
            injectedContentScriptPortHandler();
            break;
    }
});

// 関数を呼び出してその中でリスナをつけても意味がない可能性...
// すぐスコープアウトするから
// このリスナを一時的にｸﾞﾛｰﾊﾞﾙｽｺｰﾌﾟに置けないものか...
const injectedContentScriptPortHandler = (port: chrome.runtime.Port): void => {
    port.onMessage.addListener(async (msg: iMessage) => {
        const { activated, from } = msg;
        if(from !== extensionNames.contentScript) return;
        if(activated) {
            // initialize()する準備完了ということで
            // disconnectを要求する
            port.postMessage({
                from: extensionNames.background,
                to: extensionNames.contentScript,
                disconnect: true
            });
            // 初期化処理を始める
            await initialize();
        }
    });
    port.onDisconnected.addListener((port: chrome.runtime.Port) => {

    })
}




chrome.tabs.onActivated.addListener(async (activeInfo) => {
    try {
      const tabId: number = await checkTabIsCorrect();
    if (tabId !== activeInfo.tabId || isInitialized()) return;

    //
    // TODO: wait for signle message from injected content script
    //
    //

    //
    // ADD
    //
    await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["contentScript.js"],
    });

    }
    catch(err) {
        console.error(err.message);
    }
})
```

```TypeScript
// constants.ts

// ---- ABOUT PORT ----------------------------------
export const port_names = {
    _requring_subtitles: '_port_name_require_subtitles',
	_injected_contentScript: '_port_name_injected_contentScript',
};

export interface iMessage {
    // from: extensionsTypes;
    from: extensionsTypes;
    to?: extensionsTypes;
    message?: any;
    //   取得した字幕など
    subtitles?: subtitle_piece[];
    activated?: boolean;
    completed?: boolean;
    order?: orderTypes;
    // まだあとから追加することになるだろう
    //
    // english以外認めないのでenglish以外はfalseである
    language?: boolean;
    // Udemy section title
    title?: string;
    //
    // ADDED
    //
    // 接続元にportを切ることを要求する
    disconnect: boolean;
}
```

```TypeScript
// contentScript.ts

import { Porter } from "../utils/Porter";

const initialize = (): void => {

    // // Send current status
    // const isOpen: boolean = isTranscriptOpen();
    // const isEnglish: boolean = isSubtitleEnglish();
    // const title: string = document.querySelector<HTMLElement>(
    //     SELECTORS.sectionTitle
    // ).innerText;

    // sendToBackgroud({ isOpened: isOpen, isEnglish: isEnglish, title: title });
    /*
        初期ステータスを送信するのはbackground.tsから要求されたらにする
        Portを開く

        activated: trueを送信して
        受信側からdisconnect要求が来たらdisconnectする

    */
    const porter = new Porter(port_names._injected_contentScript);
    porter.onMessageListener((m: iMessage) => {
        const { disconnect, from, to } = m;
        if(to !== extensionNames.contentScript) return;
        if(disconnect && from === extensionNames.background) {
            porter.port.disconnect();

        }
    });
    porter.onDisconnected((p) => {


    })
    porter.postMessage({
        from: extensionNames.contentScript,
        to: extensionNames.background,
        activated: true
    });

    // Set up listeners
    const e: HTMLElement = document.querySelector<HTMLElement>(
        SELECTORS.controlBar.transcript.toggleButton
    );
    e.addEventListener('click', transcriptToggleButtonHandler, false);
    const b: HTMLElement = document.querySelector<HTMLElement>(
        SELECTORS.controlBar.cc.popupButton
    );
    b.addEventListener('click', ccPopupButtonHandler, true);
};

```

```JSON
// manifest.json
{
    // ...
    "host_permission": ["https://www.udmey.com/course/*"],
}
```

#### 1/1

上記のコードにして、

タブの切り替えによる初期化処理がうまくいくかの確認

確認できたこと:

-   contentScript.js はこの時は 10 秒待つ必要がない
-   background.js での port を関数に渡してしまうことは問題ない
-   ~port の通信はうまくいっている~果たしてそうだろうか
-   background.js 側の port.onMessage 内部で await initialize()するまでは問題ない

-   contentScript がインジェクトされたけれどいまだに`Could not establish connection. Receiving end does not exist.`のエラーが出る

正しく処理されるならば次の順番に

-   chrome.runtime.onInstalled(): 問題ない(更新ボタンを押したらちゃんと起動する。それだけ)
-   タブを切り替える
-   chrome.tabs.onActivated()は問題なく機能する
-   await chrome.scripting.executeScript()の実行は問題ない（エラーはキャッチされていない）
-

background.js DevTools console

```console
stateList module invoked
BACKGROUND RUNNING...
update
Tabs switched to Udemy course page
INJECT contentScript.js...
<--- contentScript.js has been injected into the page dynamically --->
<--- TO contentScript.js  --->
Port:  _port_name_injected_contentScript  has been opened.
<--- SEND disconnect signal to contentScript.js --->
// disconnectメッセージは非同期に送信される。とくに同期させないためそのまま次のinitialize()へ処理が移る
<--- invoke await initialize()--->
```

contentScript.js DevTools console

```console
[contentScript] running....
CONTENT SCRIPT INITIALIZING...
<--- message will be posted that expresses activated ---->
posted message:
<--- posted iMessage will be shown--->
<--- TO background.js --->
<--- GOT message from background and it said disconnect --->
[contentScript] port disconnected manually
CONTENT SCRIPT GOT MESSAGE
{from: 'background', to: 'contentScript', order: 'sendStatus'}
SENDING MESSAGE TO BACKGROUND

```

というか inject と initialize()直前までは大丈夫なんだよね
シングルメッセージングがうまくいっていないのであって...

シングルメッセージングは、送信したときの`sendResponse`に
送信側のほしい情報は載せられないのか？

##### エラーの理由が分かった＾ーーーーーーーーーーーー

Popup が起動していなかったのが原因だった
つまり
拡張機能を chrome://extensions で ON にして
タブの切り替えで permissionURL へ移動したときに
動的に content script をインジェクトできるとしても
**popup はブラウザのアイコンをクリックされるまで起動していない！！**

これがリロード時ならば同時に起動してくれるけれど
タブの切り替え時ならば勝手に起動と化してくれない

だから通信しようとしてもつながらないのである

ということで
今後は popup はアイコンをクリックされたら起動するという前提で通信する

つまり
background.ts::initialize()で初めに通信しない
いずれにしろ popup を開いて実行ボタンをクリックしないと本機能は実行できないので
popup アイコンがクリックされたときに起動しました信号を popup の方から
信号送信すればいい

ということで

変更前

```TypeScript
// background.ts

const letExtensionsSendStatus = async (): Promise<void> => {
    try {

        const { tabId } = await stateList
            .caller<iTabId>(nameOfState.tabId)
            .getState();
        // await sendMessageToTabsPromise(tabId,_messageTemplate.requireContentScriptForStatus);
        // await sendMessagePromise(_messageTemplate.requirePopupForStatus);
        const sendingMessageResult = [
            sendMessageToTabsPromise(
                tabId,
                _messageTemplate.requireContentScriptForStatus
            ),
            sendMessagePromise(_messageTemplate.requirePopupForStatus),
        ];
        await Promise.all(sendingMessageResult);
    } catch (err) {
        console.error(err.message);
    }
};

```

```TypeScript
// background.ts

const letExtensionsSendStatus = async (): Promise<void> => {
    try {

        const { tabId } = await stateList
            .caller<iTabId>(nameOfState.tabId)
            .getState();

            await sendMessageToTabsPromise(
                tabId,
                _messageTemplate.requireContentScriptForStatus
            );
    } catch (err) {
        console.error(err.message);
    }
};

```

##### やること

-   Popup が起動したら準備完了とするように機能変更
-   シングルメッセージの返事で、送信元のほしい情報を渡すようにする
    それは実現できるのか playground で確認

#### 1/5

-   シングルメッセージの返事からほしい情報を取得するようにする
-   初期化が完了しているかの確認  
     各 State の初期値を確認する
-   Popup が起動したらその信号を受け取ることとする

##### single message passing の sendResponse でデータ取得

結論：可能

"../playground-chromeextension"で確認した

あと sender を使うと tabId が取得できる

なので

-   sendResponse をつかってほしいデータを取得するようにする
-   content script からの sender を使って正しい tabId を取得するようにする

現状の無駄な single message passing を洗い出してみよう

```TypeScript
chrome.tabs.sendMessage(tabId,
    {
        from: extensionNames.background,
        to: extensionNames.contentScript,
        order: orderNames.sendStatus
    },
    (response: iMessage) => {
        // background側で処理したい内容を記述する
        manageStatus();
    }
);

const manageStatus = () => {
    // ...
}
```

```TypeScript
// background.ts

const letExtensionsSendStatus = async (): Promise<void> => {
    try {

        const { tabId } = await stateList
            .caller<iTabId>(nameOfState.tabId)
            .getState();

        await sendMessageToTabsPromise(
            tabId,
            _messageTemplate.requireContentScriptForStatus
        );
    } catch (err) {
        console.error(err.message);
    }
};

// contentScript.ts

chrome.runtime.onMessage.addListener(
    async (
        message: iMessage,
        sender,
        sendResponse: (response?: any) => void
    ): Promise<void> => {


        const { from, order, to } = message;
        if (to !== extensionNames.contentScript) return;
        // orderごとに振り分け
        if (
            from === extensionNames.background &&
            order === orderNames.sendStatus
        ) {
            const isEnglish: boolean = isSubtitleEnglish();
            const isOpen: boolean = isTranscriptOpen();
            const title: string = document.querySelector<HTMLElement>(
                SELECTORS.sectionTitle
            ).innerText;
            await sendToBackgroud({
                isEnglish: isEnglish,
                isOpened: isOpen,
                title: title,
            });
            if (sendResponse) {
                await sendResponse({ complete: true });
            }
        }
        // ...
```

sendResponse と sendToBackground の両方を送信するのは無駄...

なので

両方同時に sendResponse に送信できればいいね

```diff
// contentScript.ts
chrome.runtime.onMessage.addListener(
    async (
        message: iMessage,
        sender,
        sendResponse: (response?: any) => void
    ): Promise<void> => {


        const { from, order, to } = message;
        if (to !== extensionNames.contentScript) return;
        // orderごとに振り分け
        if (
            from === extensionNames.background &&
            order === orderNames.sendStatus
        ) {
            const isEnglish: boolean = isSubtitleEnglish();
            const isOpen: boolean = isTranscriptOpen();
            const title: string = document.querySelector<HTMLElement>(
                SELECTORS.sectionTitle
            ).innerText;
-            await sendToBackgroud({
-                isEnglish: isEnglish,
-                isOpened: isOpen,
-                title: title,
-            });
-            if (sendResponse) {
-                await sendResponse({ complete: true });
-            }
+           await sendResponse({
+               isEnglish: isEnglish,
+               isOpened: isOpen,
+               title: title,
+               complete: true
+           });
        }
```

これをうけて送信側はどう変更すべきか

-   sendResponse()の引数を受けて実行するコールバックを渡すようにする

```diff
export const sendMessageToTabsPromise = async (
    tabId, message,
+  callback
    ): Promise<void> => {
  return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, message, (response) => {
+       const [complete, ...rest] = response;
-          if (response.complete) resolve();
+           if(complete) {
+               callback(rest);
+               resolve();
+           }
          else reject('Send message to tabs went something wrong');
      });
  });
};

```

#### 1/6

課題更新

##### single-message-passing の改善

sendResponse()を活用する件

background.ts での以下の処理を改善する

```TypeScript
const letExtensionsSendStatus = async (): Promise<void> => {
    try {

        const { tabId } = await stateList
            .caller<iTabId>(nameOfState.tabId)
            .getState();

        await sendMessageToTabsPromise(
            tabId,
            _messageTemplate.requireContentScriptForStatus
        );
    } catch (err) {
        console.error(err.message);
    }
};

const contentScriptMessageHandler = async (
    m: messageTemplate
): Promise<void> => {
    try {

        const { message } = m;
        const refStatus: State<iStatus> = stateList.caller<iStatus>(
            nameOfState.status
        );
        if (message.order === orderNames.transcriptOpened) {

            const newStatus: state_page_status = { isTranscriptOn: true };
            const { pageStatus } = await refStatus.getState();
            await refStatus.setState({
                pageStatus: {
                    ...pageStatus,
                    ...newStatus,
                },
            });
        }
        if (message.order === orderNames.transcriptClosed) {

            const newStatus: state_page_status = { isTranscriptOn: false };
            const { pageStatus } = await refStatus.getState();
            await refStatus.setState({
                pageStatus: {
                    ...pageStatus,
                    ...newStatus,
                },
            });
        }
        if (message.order === orderNames.languageIsEnglish) {

            const newStatus: state_page_status = { isEnglish: true };
            const { pageStatus } = await refStatus.getState();
            await refStatus.setState({
                pageStatus: {
                    ...pageStatus,
                    ...newStatus,
                },
            });
        }
        if (message.order === orderNames.languageIsNotEnglish) {

            const newStatus: state_page_status = { isEnglish: false };
            const { pageStatus } = await refStatus.getState();
            await refStatus.setState({
                pageStatus: {
                    ...pageStatus,
                    ...newStatus,
                },
            });
        }
        // 取得した整形字幕があれば
        if (message.subtitles) {

            await stateList
                .caller<iSubtitles>(nameOfState.subtitles)
                .setState({ subtitles: message.subtitles });
            // 字幕取得が完了した
            const { progress } = await refStatus.getState();
            await refStatus.setState({
                progress: {
                    ...progress,
                    capturing: false,
                    captured: true,
                    stored: true,
                },
            });
            // 問題なく保存できたとして
            // controller.jsをinjectする
            await startInjectControllerScript();
        }
        // section titleが送られてきたら
        if (message.title) {

            const refSectionTitle: State<iSectionTitle> =
                stateList.caller<iSectionTitle>(nameOfState.sectionTitle);
            const { title } = await refSectionTitle.getState();

            if (message.title !== title) {
                // 動画が切り替わった判定

                await refSectionTitle.setState({ title: message.title });
            }
        }
    } catch (e) {
        console.error(e);
    }
};



```

シングルメッセージを送信して
受信した contentScript.ts でまたその返事をシングルメッセージで送信する
sendResponse を使えば返事のシングルメッセージが必要ないので
sendResponse を使うように変更する

`sendMessageToTabsPromise()`の callback 引数に、
`contentScriptMessageHandler()`を渡せば話は楽だけど
引数の形が異なるので
`contetnScriptMessageHandler()`の中身を別の関数に移す

sendResponse()は iMessage 型の引数を渡すことになる

```
interface iMessage {
  from: extensionsTypes;
  to: extensionsTypes;
  message?: any;
  subtitles?: subtitle_piece[];
  activated?: boolean;
  completed?: boolean;
  order?: orderTypes;
  language?: boolean;
  title?: string;
  disconnect?: boolean;
  complete?: boolean;
}
```

内、callback に渡されるのは complete 以外の iMessage 型のオブジェクトになるはず

たとえば

response = {
from: "contentScript",
to: "background",
language: true,
title: "Design Pattern of TypeScript",
complete: true;
}

という引数を sendResponse()が引き取り
callback は次を引き取る

rest = {
from: "contentScript",
to: "background",
language: true,
title: "Design Pattern of TypeScript",
}

`contentScriptMessageHandler()`の引数 m はつぎのとおりになる

export interface messageTemplate {
message: iMessage;
sender: chrome.runtime.MessageSender;
sendResponse: (response?: any) => void;
}

rest は上記の message プロパティに相当する

sendMessageToTabsPromise()に callback を追加したら：

```TypeScript
// background.ts

const letExtensionsSendStatus = async (): Promise<void> => {
    try {

        const { tabId } = await stateList
            .caller<iTabId>(nameOfState.tabId)
            .getState();

        await sendMessageToTabsPromise(
            tabId,
            _messageTemplate.requireContentScriptForStatus,
            _contentScriptMessageHandler
        );
    } catch (err) {
        console.error(err.message);
    }
};


const contentScriptMessageHandler = async (
    m: messageTemplate
): Promise<void> => {
    try {

        const { message } = m;
        await _contentScriptMessageHandler(message);
    } catch (e) {
        console.error(e);
    }
};

const _contentScriptMessageHandler = async(m: iMessage): Promise<void> => {
    try {
            const {order, subtitles, title } = m;
            const refStatus: State<iStatus> = stateList.caller<iStatus>(
            nameOfState.status);
            const { pageStatus, progress } = await refStatus.getState();
        if (order === orderNames.transcriptOpened) {

            const newStatus: state_page_status = { isTranscriptOn: true };

            await refStatus.setState({
                pageStatus: {
                    ...pageStatus,
                    ...newStatus,
                },
            });
        }
        if (order === orderNames.transcriptClosed) {

            const newStatus: state_page_status = { isTranscriptOn: false };

            await refStatus.setState({
                pageStatus: {
                    ...pageStatus,
                    ...newStatus,
                },
            });
        }
        if (order === orderNames.languageIsEnglish) {

            const newStatus: state_page_status = { isEnglish: true };

            await refStatus.setState({
                pageStatus: {
                    ...pageStatus,
                    ...newStatus,
                },
            });
        }
        if (order === orderNames.languageIsNotEnglish) {

            const newStatus: state_page_status = { isEnglish: false };

            await refStatus.setState({
                pageStatus: {
                    ...pageStatus,
                    ...newStatus,
                },
            });
        }
        // 取得した整形字幕があれば
        if (subtitles) {

            await stateList
                .caller<iSubtitles>(nameOfState.subtitles)
                .setState({ subtitles: subtitles });
            await refStatus.setState({
                progress: {
                    ...progress,
                    capturing: false,
                    captured: true,
                    stored: true,
                },
            });
            // 問題なく保存できたとして
            // controller.jsをinjectする
            await startInjectControllerScript();
        }
        //
        if (title) {

            const refSectionTitle: State<iSectionTitle> =
                stateList.caller<iSectionTitle>(nameOfState.sectionTitle);
            const storedTitle = await refSectionTitle.getState();

            if (sectionTitle !== storedTitle.title) {
                // 動画が切り替わった判定

                await refSectionTitle.setState({ title: sectionTitle });
                //
                //
                // 動画が切り替わったことをうけてリセットする処理をここに追記する予定
                //
                //
            }
        }
    }
    catch(e) {
        console.error(e.message);
    }
}


chrome.tabs.onUpdated.addListener(
    async (tabId: number, changeInfo, Tab: chrome.tabs.Tab): Promise<void> => {



        try {
            // tabIdが正しく、ステータスがloadingならば次の処理へ
            const correctTabId: number = await checkTabIsCorrect();
            if (tabId !== correctTabId || changeInfo.status !== 'loading') return;

            if (!isInitialized()) await initialize();

            const { progress } = await stateList
                .caller<iStatus>(nameOfState.status)
                .getState();
            if (!progress.restructured) return;

            await sendMessageToTabsPromise(correctTabId, {
                from: extensionNames.background,
                to: extensionNames.contentScript,
                order: orderNames.sendSectionTitle,
                }, _contentScriptMessageHandler
            );

            // contentScriptからシングルメッセージが送信されるので
            // メッセージハンドラが処理を引き継ぐ
        }
        catch(err) {
            console.error(err.message);
        }
    }
);

```

なんか sendMessageToTabsPromise()内で sendResponse()使われたら
この関数の戻り値に sendResponse()の戻り値を含めればいいのでは？

sendMessageToTabsPromise()に callback の代わりに戻り値を返すようにさせる場合:

```TypeScript
// 変更前

export const sendMessageToTabsPromise = async (
    tabId: number,
    message: iMessage,
    callback?
): Promise<void> => {
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, message, (response: iMessage) => {
            const {complete, ...rest} = response;
            if (complete) {
                if (callback && typeof callback === 'function') callback(rest);
                resolve();
            } else reject('Send message to tabs went something wrong');
        });
    });
};

// 変更後

export const sendMessageToTabsPromise = async (
    tabId: number,
    message: iMessage,
): Promise<iMessage> => {
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, message, (response: iMessage) => {
            const {complete, ...rest} = response;
            if (complete) resolve(rest);
            else reject('Send message to tabs went something wrong');
        });
    });
};
```

これなら確実に返事が来てからの処理を行えるし
可読性が上がるかしら...
callback の呼び出しは同期呼出ししかしないから
戻り値返す場合は好きにできるから大丈夫だった

```TypeScript
// background.ts

const letExtensionsSendStatus = async (): Promise<void> => {
    try {

        const { tabId } = await stateList
            .caller<iTabId>(nameOfState.tabId)
            .getState();

        const response: iMessage = await sendMessageToTabsPromise(
            tabId,
            _messageTemplate.requireContentScriptForStatus,
        );

        await _contentScriptMessageHandler(response);
    } catch (err) {
        console.error(err.message);
    }
};

```

こうすればめんどくないかな...

-   return new Promise のコールバックを async にする
    callback が同期関数でも非同期関数でも await 呼び出しはどちらも大丈夫

-   callback 引数の有無次第で戻り値を返すかどうか勝手に決めてくれる

※sendMessage の sendResponse()を非同期に呼び出すには
onMessage.addListener のコールバック関数は return true しなくてはならない

```TypeScript
export const sendMessageToTabsPromise = async (
    tabId: number,
    message: iMessage,
    callback?
): Promise<iMessage | void> => {
    return new Promise(async (resolve, reject) => {
        chrome.tabs.sendMessage(tabId, message, async (response: iMessage) => {
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


chrome.runtime.onMessage.addListener(
    async (
        message: iMessage,
        sender,
        sendResponse: (response?: any) => void
    ): Promise<void> => {



        // 中略...
        // sendResponse()を非同期に呼び出すには
        await sendResponse();
        // ハンドラ内でreturn trueしなくてはならない
        return true
    }
);

```

#### 1/7

やること

-   メッセージパシングの sendResponse を非同期呼出し可能にするためすべての onMessage で return true する
    sendResponse()をつかう場面のｽｺｰﾌﾟになるイベントハンドラは
    onMessage だけだとおもうけども...

    contentScript.ts,
    background.ts,

    で更新した

    popup.tsx は React がからむし問題が起こってからでいいや

-   そのうえで sendMessageToTabsPromise を上記の通り callback を受け入れるかつ戻り値を返す機能のやつに変更する
-   他、sendResponse()を使う処理に各所を変更する

> > 変更中規模<<
> > **本日の変更は中規模なので問題が起こったら今回のコミットよりも前に戻すこと**

#### 1/8

1/7 の実施事項を実施中...

直面した問題：

"constants.ts"の iMessage interface がすごくつぎはぎだらけになっていることと
同時に複数の order を送信できない問題を解消する

-   `completed`と`complete`がかぶっている
    これは`complete`に統一する

-   `orderNames`, `order`はこの命令を実行しろという内容に統一する
    返事になる内容は iMessage 側へ含める
    `language`, `isOpend`, `sectionTitle`, `isLoading`,
    など

これに伴って、使う側は
order プロパティに対しては boolean での判定ではなくて
必ず orderNames と一致するのか確認するようにする

```TypeScript
// 変更前

export const orderNames = {
    injectCaptureSubtitleScript: 'injectCaptureSubtitleScript',
    injectExTranscriptScript: 'injectExTranscriptScript',
    transcriptOpened: 'transcriptOpened',
    transcriptClosed: 'transcriptClosed',
    languageIsEnglish: 'languageIsEnglish',
    languageIsNotEnglish: 'languageIsNotEnglish',
    // From background to contentScript
    sendStatus: 'sendStatus',
    // From background to popup
    loading: 'loading',
    loaded: 'loaded',
    // from controller to background
    sendSubtitles: 'sendSubtitles',
    // from contentScript to background
    sendSectionTitle: 'sendSectionTitle',
} as const;

type on = typeof orderNames;

export type orderTypes = keyof on;

export interface iMessage {
    // from: extensionsTypes;
    from: extensionsTypes;
    to?: extensionsTypes;
    message?: any;
    //   取得した字幕など
    subtitles?: subtitle_piece[];
    activated?: boolean;
    completed?: boolean;
    order?: orderTypes;
    // まだあとから追加することになるだろう
    //
    // english以外認めないのでenglish以外はfalseである
    language?: boolean;
    // Udemy section title
    title?: string;
    // Portを開いていた場合、接続元にportを切ることを要求する
    disconnect?: boolean;
    // sendResponse()を送信するときに必ず含めるプロパティ
    complete?: boolean;
}
```

```TypeScript
// 変更後

export const orderNames = {
    // Inject content script order
    injectCaptureSubtitleScript: 'injectCaptureSubtitleScript',
    injectExTranscriptScript: 'injectExTranscriptScript',
    // From background to contentScript
    sendStatus: 'sendStatus',
    // from controller to background
    sendSubtitles: 'sendSubtitles',
    // from contentScript to background
    sendSectionTitle: 'sendSectionTitle',
    // order to disconnect port
    disconnect: 'disconnect',

    // DELETED
    //
    // transcriptOpened: 'transcriptOpened',
    // transcriptClosed: 'transcriptClosed',
    // languageIsEnglish: 'languageIsEnglish',
    // languageIsNotEnglish: 'languageIsNotEnglish',
    // loading: 'loading',
    // loaded: 'loaded',
} as const;

type on = typeof orderNames;

export type orderTypes = keyof on;


export interface iMessage {
    // from, to propertyは必須とする
  from: extensionsTypes;
  to: extensionsTypes;
  subtitles?: subtitle_piece[];
  activated?: boolean;
  //
  // 複数のorderをorderプロパティに対して送信できるようにした
  //
//   order?: {
//     [Property in keyof on]?:on[Property]
//   },
order?: orderTypes[],
//   true: English, false: Not English
  language?: boolean;
//   section title
  title?: string;
//   Is message passing done?
  complete?: boolean;

//   ADDED
//
    loading?: boolean;
    loaded?: boolean;

//   DELETED
//
//   completed?: boolean;
//   disconnect?: boolean;
//   message?: any;
}

```

使い方と実際に使ってみては、
"./Udemy/chrome-extension/playground-chromeextension/"にあり

order はやっぱりオブジェクトじゃなくて配列にする

#### 1/9

やること

-   新しい utils/helpers/ts の sendMessageToTabsPromise()などの適用とそれに伴う変更
    1/7 からのやることの続き

-   iMessage の変更に伴う全体的な変更の適用

#### 1/10

やること

-   新しい utils/helpers/ts の sendMessageToTabsPromise()などの適用とそれに伴う変更
    1/7 からのやることの続き

-   iMessage の変更に伴う全体的な変更の適用

-   port を使う必要ないところはシングルメッセージに変更する

##### contentScript.ts に port は必要か？

前提：

-   contentScript.ts は動的 inject される
-   contentScript のステータスを送るにしても、background 側で State が初期化されていない可能性がある
-   現状の確実なシナリオとして、タブの切替で matchURL へ移動したときに
    即座に contentScript.js が inject される
    なので
    // background.js
    chrome.tabs.onActivated()
    chrome.scripting.execute()
    // contentScript.js
    activated: true のメッセージを送信する // ここで port を使っている
    // background.js
    chrome.runtime.onConnect.addListener()
    injectedContentScriptPortHandler()
    disconnect: true を送信して、
    await initialize() // State の初期化
    ...という具合に activated を知らせるためと、
    port を閉じてから initialize()するために
    こんな面倒を行っている

シングルメッセージでも同じことはできるし
より短く解りやすいコードになる

ということで port は使わなくなった...

##### controller.ts の state も State class に変更する

...まだ変更していない

State class は crhome.storage.local を使うことが前提になっているので
content script である controller.ts にはそのまま適用できない

そう考えると別に要らないかなとは思う

##### manifest.json の content scritp のプロパティを削除すべき

...だけどまだ chrome.tabs.onUpdate の処理が決まっていないため
リロードに対応していない

対応次第削除してもいいかも

##### captureSubtitles.ts は使っていたっけ？

つかってたわ

background.js::startInjectCaptureSubtitlesScript()後の処理をおさらい

-   `State<iStatus>`capturing: true にする
-   `chrome.scripting.executeScript`で`captureSubtitle.js を動的 inject
-   popup へ`loading: true`のメッセージを送信する
-   captureSubtitles.js が動的インジェクトされ、即材に整形字幕を取得する
-   整形字幕を即座に background.js へ送信する
-   messageHandler が処理を引き継ぐ
-   取得した字幕データや進行状況含め、`State<iStatus>`を更新する
-   `startInjectControllerScript()`を実行する

つまり字幕データを送信したら問答無用で startInjectControllerScript()が実行されてしまう

ならばこうすればいいかな

-   もしも`State<iStatus>._state.progress.capturing`が true の時だけ controller.js をインジェクトする

```TypeScript
// 変更前: contentScriptMessageHandler()

if (rest.subtitles) {

    await stateList
    .caller<iSubtitles>(nameOfState.subtitles)
    .setState({ subtitles: rest.subtitles });
    await refStatus.setState({
    progress: {
        ...progress,
        capturing: false,
        captured: true,
        stored: true,
    },
    });
    // 問題なく保存できたとして
    // controller.jsをinjectする
    await startInjectControllerScript();
}

// 変更後

if (rest.subtitles) {

    const isCapturing: boolean = progress.capturing;
    await stateList
    .caller<iSubtitles>(nameOfState.subtitles)
    .setState({ subtitles: rest.subtitles });
    await refStatus.setState({
    progress: {
        ...progress,
        capturing: false,
        captured: true,
        stored: true,
    },
    });
    //
    // capturing: trueだったならば
    // インジェクト開始するためのフラグであったことを意味し
    // controller.jsをインジェクトする
    //
    if(isCapturing) {
        await startInjectControllerScript();
    }
}


```

##### contentScript.js を inject してからの処理おさらい

前提シナリオ：udemy 講義ページが開かれたページにタブで移動したとき

background.js:

-   chrome.tabs.onActivated.addListener()が contentScript.js を動的 inject する
-   contentScript.js がシングルメッセージで`activated: true`を送信する
-   background.js はそれを受けて初期化を開始する(この時点では State は生成されていないので初期化はまだだよ)
-   background.js::initialize()を実行する
-   initializeState()で初期値を設定する
-   letExtensionsSendStatus()で content script や popup からステータスを送信してもらって、各 State に初期ステータスを保存させる
    **前提シナリオでは popup は起動していない**のでそれを踏まえること
    つまりこのシナリオでは contentScript のステータスだけ取得できればいいようにする
    popup はユーザが操作したときに更新すればいい

...ここまでで、popup にて`RUN`ボタンが押されるまでの準備ができていればいいわけである

明日はこれの確認を行う

#### 1/11

やること：

-   昨日の確認: RUN ボタンが押されるまでの準備ができているか？

##### RUN ボタンを押すまでの準備ができているか

確認できるエラー：

1. getState()なんて存在しない@background.js

letExtensionSendStatus で contentScript からステータスを送信してもらったときに
language プロパティを contentScriptMessageHandler が受け取った時の処理で
getState なんて存在しないと表示した

たぶん

```TypeScript
// background.ts::_contentScriptMessageHandler
        if (!rest.language) {

            // ...中略
        }
```

この条件がよくない
これだと language というプロパティがない場合でも反応する

要 codesandbox で確認

```TypeScript
// background.ts::_contentScriptMessageHandler
        if (rest.language === false) {

            // ...中略
        }
```

2. response が undefined だから complete プロパティにアクセスできない@contentScript.js

sendMessagePromise()を正しく使うには
結構作り直しが発生する模様

理由は

-   sendMessage で複数のプロパティを含むメッセージを受信したとき、sendResponse()をﾌﾟﾛﾊﾟﾃｨ一つずつに返してしまっている
    なので受信側は一つだけでも処理が完了したら送信側へ完了したよ～と信号を
    送ってしまっているのだ

これのせいで promise が解決しないでエラーの原因になっている

これの解決策として
sendResponse()に渡すオブジェクトをメッセージプロパティの処理ごとに「追加」していき
最後に sendResponse()すればいいのでは？

```TypeScript
// contentScript.ts

// NOTE:
//
// 最後に一度だけsendResponse()するようにした
//
chrome.runtime.onMessage.addListener(
    async (
        message: iMessage,
        sender,
        sendResponse: (response?: iResponse) => void
    ): Promise<boolean> => {

        const { from, order, to } = message;
        const response: iResponse = {
            from: extensionNames.contentScript,
            to: from
        };
        if (
            to !== extensionNames.contentScript ||
            from !== extensionNames.background
        )
            return;

        try {
            // ORDERS:
            if (order && order.length) {
                // SEND STATUS
                if (order.includes(orderNames.sendStatus)) {
                    const isEnglish: boolean = isSubtitleEnglish();
                    const isOpen: boolean = isTranscriptOpen();
                    const title: string = document.querySelector<HTMLElement>(
                        SELECTORS.sectionTitle
                    ).innerText;
                    // if (sendResponse) {
                        // //
                        // // DEBUG:
                        // //
                        //
                        //
                        //     from: extensionNames.contentScript,
                        //     to: extensionNames.background,
                        //     language: isEnglish,
                        //     transcriptExpanded: isOpen,
                        //     title: title,
                        //     complete: true,
                        // });
                        // //
                        // //
                        // await sendResponse({
                        //     from: extensionNames.contentScript,
                        //     to: extensionNames.background,
                        //     language: isEnglish,
                        //     transcriptExpanded: isOpen,
                        //     title: title,
                        //     complete: true,
                        // });
                        response.language = isEnglish;
                        response.transcriptExpanded = isOpen;
                        response.title = title;
                    // } else {
                    //     console.error(
                    //         'Got Send Status order but there is no sendResponse() method included'
                    //     );
                    // }
                }
            }
            // SEND SECTION TITLE
            if (order.includes(orderNames.sendSectionTitle)) {
                // await sendTitle();
                const title: string = document.querySelector<HTMLElement>(
                    SELECTORS.sectionTitle
                ).innerText;
                // //
                // // DEBUG:
                // //
                //
                //
                //     from: extensionNames.contentScript,
                //     to: extensionNames.background,
                //     title: title,
                //     complete: true,
                // });
                // //
                // //
                // if (sendResponse) {
                //     await sendResponse({
                //         from: extensionNames.contentScript,
                //         to: extensionNames.background,
                //         title: title,
                //         complete: true,
                //     });
                // } else {
                //     console.error(
                //         'Got Send Section Title order but there is no sendResponse() method included'
                //     );
                // }
                response.title = title;
            }
            response.complete = true;
            sendResponse(response);
            return true;
        }
        catch(err) {
            console.error(err.message);
        }
    }
);

```

```TypeScript
// background.ts

const contentScriptMessageHandler = async (
    m: messageTemplate
): Promise<void> => {
    try {

        const { message, sendResponse } = m;
        await _contentScriptMessageHandler(message);
        // 変更なし！
        if (sendResponse) sendResponse({ complete: true });
    } catch (e) {
        console.error(e);
    }
};

/*
    _contentScriptMessageHandler
    _____________________________________________________
    @param m: iMessage | iResponse
    Returns Promise<iResponse>

    contentScriptMessageHandler()から呼び出される
    メッセージ送信側のsendMessagePromise()はsendResponse()必須である
    対応のため、iResponseを返す
    実際のsendResponse()はcontentScriptMessageHandler()が行う
    ...と思ったけれどorderを受け取らない限り返事に何か含める必要はないので
    (今のところ)実装はしない
*/
const _contentScriptMessageHandler = async (
    m: iMessage | iResponse
): Promise<void> => {
    // 変更なし!
};

// 変更有
const controllerMessageHandler = async (m: messageTemplate): Promise<void> => {

    try {
        const { message, sendResponse } = m;
        const { order, ...rest } = message;
        const response: iResponse = {
            from: extensionNames.background;
            to: message.from
        };
        const refStatus: State<iStatus> = stateList.caller<iStatus>(
            nameOfState.status
        );

        // 初期化完了として、字幕データを送信する
        if (rest.activated) {
            const { scripts } = await refStatus.getState();
            await refStatus.setState({
                scripts: {
                    ...scripts,
                    controller: extensionStatus.working,
                },
            });
            const { subtitles } = await stateList
                .caller<iSubtitles>(nameOfState.subtitles)
                .getState();
            // if (sendResponse)
            //     sendResponse({
            //         from: extensionNames.background,
            //         to: extensionNames.controller,
            //         subtitles: subtitles,
            //         complete: true,
            //     });
            //
            // NOTE: added
            //
            response.subtitles = subtitles;
        }
        response.complete = true;
        sendResponse(response);
    } catch (err) {
        if (err === chrome.runtime.lastError) {
            console.error(err.message);
        } else {

        }
    }
};

/*
    captureSubtitleMessageHandler
    ______________________________________________

    captureSubtitles.jsからのメッセージは
    subtitlesプロパティを送信してくる場合のみ

    なので返事はcomplete: trueだけおくればいい

*/
const captureSubtitleMessageHandler = async (
    m: messageTemplate
): Promise<void> => {
    try {
        const { message, sendResponse } = m;
        const { order, ...rest } = message;
        const response: iResponse = {
            from: extensionNames.background;
            to: message.from
        };
        const refStatus: State<iStatus> = stateList.caller<iStatus>(
            nameOfState.status
        );
        const { pageStatus, progress, scripts } = await refStatus.getState();

        // 取得した整形字幕があれば
        if (rest.subtitles) {

            const isCapturing: boolean = progress.capturing;
            await stateList
                .caller<iSubtitles>(nameOfState.subtitles)
                .setState({ subtitles: rest.subtitles });
            await refStatus.setState({
                progress: {
                    ...progress,
                    capturing: false,
                    captured: true,
                    stored: true,
                },
            });

            sendResponse({ complete: true });

            //
            // capturing: trueだったならば
            // インジェクト開始するためのフラグであったことを意味し
            // controller.jsをインジェクトする
            //
            if (isCapturing) {
                await startInjectControllerScript();
            }
        }
    } catch (err) {
        console.error(err.message);
    }
};


const popupMessageHandler = async (m: messageTemplate): Promise<void> => {
    try {

        const { message } = m;
        const { order, ...rest } = message;
        const refStatus: State<iStatus> = stateList.caller<iStatus>(
            nameOfState.status
        );
        if (order && order.length) {
            if (order.includes(orderNames.injectCaptureSubtitleScript)) {
                await startInjectCaptureSubtitleScript();
            }
        }
        if (rest.activated) {
            // update state
            const { scripts } = await refStatus.getState();
            const newStatus = { popup: extensionStatus.working };
            await refStatus.setState({
                scripts: {
                    ...scripts,
                    ...newStatus,
                },
            });
        }
        //
        // NOTE: Added
        //
        sendResponse({complete: true});
    } catch (e) {
        console.error(e);
    }
};

```

tab 切替による contentScript.js のインジェクトと、background.js の State 関連の初期化は大体解決した

残る問題は、
contentScript.ts から送信された activated: true メッセージに対する sendResponse()がめちゃ遅いことである
これはいったん、
contentScript.ts の sendMessagePromise()呼び出しを
sendResponse()不要の chrome.runtime.sendMe

```TypeScript
const initialize = async (): Promise<void> => {

    try {

        // このawait呼び出しを...
        await sendMessagePromise({
            from: extensionNames.contentScript,
            to: extensionNames.background,
            activated: true,
        });

        // ...省略
};

const initialize = async (): Promise<void> => {

    try {

        // 同期呼び出しにすることによって回避する
        sendMessagePromise({
            from: extensionNames.contentScript,
            to: extensionNames.background,
            activated: true,
        });

        // ...省略
};
```

##### chrome tips: message-passing とかで Promise はちゃんとどちらか返さないと runtime.lastError になるよ!

教訓

##### 次の課題

-   State に保存したデータは正しいか
    とくに section title は正しく保存されていない...
-   RUN してみて
-   動画切替時の対応

##### State に保存したデータは正しいか

log をとってみる
setState()したときに set した値と getState()で取得できる値の違いを確認する

おさらい

-   State に保存するデータはネスト以下の値を変更する場合、setState する前に済ませておくこと

#### 1/14

やること：

-   State の修正
    ~section title が正しく保存できていない~
    いらなくなった

-   section title のスクレイピングの修正
    これもいらなくなった

-   chrome.tabs.onUpdated での URL 変更検知機能の実装
    済

##### section title のスクレイピングの修正

section title を取得することをやめて、
chrome.tabs.onUpdated.addListener()で動画が切り替わったのかを取得するようにする

理由：
セレクタに問題があるのではなくて、なぜだか Udemy の講義ページでタイトルがロードされていない時がある

##### chrome.tabs.onUpdated での URL 変更検知機能の実装

実装完了

crome.tabs.onUpdated.addListener()で...

```
{status: 'loading', url: 'https://www.udemy.com/course/chrome-extension/learn/lecture/25575692#content'}
```

が来た時に

前回の URL と今回の URL を比較して
異なっていたら「動画が切り替わった」判断とする

Udemy の講義ページ URL は...

-   URL は#以前まではすべて共通である
-   動画が切り替わると URL も変化する

なので共通の部分だけ比較して前回の URL と変化していたら
動画が切り替わった判定とする

```TypeScript
// background.ts

chrome.tabs.onUpdated.addListener(
    async (
        tabId: number,
        changeInfo: chrome.tabs.TabChangeInfo,
        Tab: chrome.tabs.Tab
    ): Promise<void> => {

        const { status, url } = changeInfo;

        if (status === 'loading') {
            const refUrlState: State<iContentUrl> = await stateList
                .caller<iContentUrl>(nameOfState.contentUrl);
            const prev: iContentUrl = await refUrlState.getState();
            const currentUrl: string = splitStringBySeparater(url, '#');
            if ( currentUrl !== prev.url) {

                await refUrlState.setState({url: currentUrl});
                // TODO:
                //
                // リセット機能の呼出
                // リセット機能の実装
                //
                // ちなみにstatus === "complete"は待たない
                // 待っても意味がない
            }
        }
    }
);

const checkTabIsCorrect = async (): Promise<number> => {
  // https://www.udemy.com/course/*
  try {
    const tab: chrome.tabs.Tab = await tabsQuery();
    const pattern = /https:\/\/www.udemy.com\/course\/*/gm;
    const result: RegExpMatchArray = tab.url.match(pattern);
    if (result) {
      return tab.id;
    } else {
      return null;
    }
  } catch (err) {
    if (err === chrome.runtime.lastError) {
      console.error(err.message);
    } else {

    }
  }
};

// helpers.tsへ
const tabsQuery = async (): Promise<chrome.tabs.Tab> => {
    try {
        const w: chrome.windows.Window = await chrome.windows.getCurrent();
        const tabs: chrome.tabs.Tab[] = await chrome.tabs.query({
        active: true,
        windowId: w.id,
        });
        return tabs[0];
    }
    catch(err) {
        console.error(err.message);
    }
}

// helpers.tsへ
export const splitStringBySeparater = (target: string, separater: string): string => {
    if(target.indexOf(separater) === -1) return target;
    return target.slice(0, target.indexOf(separater));
};

```

#### 1/16

やること

-   拡張機能を ON にしてから matchURL をロードしたときに初期化する機能の実装

いまのところ初期化するには、
予め開いてある Udemy 講義ページのタブへ、拡張機能をオンにしてからタブ切り替えで
移動したときだけ初期化できる

これを拡張機能が ON になっているときに
講義ページへ直接移動したとき（つまりロードを伴って移動したとき）
初期化するようにする

残っているタスク

-   section title を送る機能を削除
-   リセット機能
-   エラーハンドリング
-   見た目をはシンプルあんど綺麗に

##### 実装： ロードしてから初期化

どういう条件ならば初期化していいのか？

-   拡張機能が ON である
    まぁ当然ですが

-   isInitialized()が false を返す
    つまり State が初期化されていないし
    contentScript.js も inject されていない

URL が udemy 講義ページなのかチェックする関数ほしい

```TypeScript
chrome.tabs.onUpdated.addListener(
    async (
        tabId: number,
        changeInfo: chrome.tabs.TabChangeInfo,
        Tab: chrome.tabs.Tab
    ): Promise<void> => {
        const { status, url } = changeInfo;
        // Udemy講義ページ以外のURLのupdateは無視する
        if(!isUrlCorrect(url)) return;



        // もしもstatusがloadingで
        // isInitialized()がfalseを返すならば
        if(status === "loading" && !isInitialized()) {
            // 初期化していない

            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['contentScript.js'],
            });
        }
        // 初期化済以降のloadingに関しては...
        else if (status === 'loading' && isInitialized()) {
            const refUrlState: State<iContentUrl> =
                await stateList.caller<iContentUrl>(nameOfState.contentUrl);
            const prev: iContentUrl = await refUrlState.getState();
            const currentUrl: string = splitStringBySeparater(url, '#');
            if (currentUrl !== prev.url) {

                await refUrlState.setState({ url: currentUrl });
                // TODO:
                //
                // リセット機能の呼出
                // リセット機能の実装
                //
                // ちなみにstatus === "complete"は待たない
                // 待っても意味がない
            }
        }
    }
);


/*
    isUrlCorrect
    _______________________________________________

    引数として渡されたURLが、
    Udemy講義ページのURLなのか否か判定して
    真偽値を返す
*/
const isUrlCorrect = (url: string): boolean => {
    const pattern = /https:\/\/www.udemy.com\/course\/*/gm;
    return url.match(pattern) ? true : false;
}

```

確認にあたって:

-   一時的に background.js::chrome.tabs.onActivated をコメントアウトしている
-   manifest.json の content script 静的 inject を削除した

控え

```JSON
    "content_scripts": [
        {
            "matches": ["https://www.udemy.com/course/*"],
            "js": ["contentScript.js"],
            "run_at": "document_idle"
        }
    ]

```

わかったこと：

-   **すでに開いているページの「リロード」の時は changeInfo に url が含まれない！！！**
    なので明確にローディングとリロードを区別しないといかんぞよ

確認できた問題：

Udemy の講義ページへリンクで（つまりタブの切り替えじゃない方法で）移動すると、
何度も chrome.tabs.onUpdated が反応して
changeInfo.status.loading が渡される

今の条件分岐だと
なんども content script を inject することになる

初めて Udemy 講義ページへ移動したときのログ：

```bash
BACKGROUND UPDATED...

# 初めのローディング
{status: 'loading', url: 'https://www.udemy.com/course/typescript-the-complete-developers-guide/learn/lecture/15066762'}

# content scriptがinjectされるけど...
 INJECT contentScript.js...
BACKGROUND UPDATED...
{favIconUrl: 'https://www.udemy.com/staticx/udemy/images/v8/favicon-32x32.png'}
BACKGROUND UPDATED...
 {title: "Typescript: The Complete Developer's Guide | Udemy"}
 BACKGROUND UPDATED...
 {status: 'complete'}
 BACKGROUND UPDATED...

#  2度目のローディングが入る...多分SPAとかだから？
 {status: 'loading', url: 'https://www.udemy.com/course/typescript-the-comple…developers-guide/learn/lecture/15066762#questions'}
#  現在の条件分岐だと、再度injectされてしまう!!
 INJECT contentScript.js...
 BACKGROUND UPDATED...
 {status: 'complete'}
 BACKGROUND UPDATED...
 {favIconUrl: 'https://www.udemy.com/staticx/udemy/images/v8/favicon-32x32.png'}
[background.ts] onMessage
 Message from content script...
contentScript.js has been injected successfully
 BACKGROUND INITIALIZE...
 SETUP STATE...
 INITIALIZE STATE...
#
# contentScript.jsが二重にinjectされてしまっているのが確認できる
```

正常な場合：

```log
BACKGROUND UPDATED...
{status: 'loading'}
INJECT contentScript.js...
BACKGROUND UPDATED...
{favIconUrl: 'https://www.udemy.com/staticx/udemy/images/v8/favicon-32x32.png'}
BACKGROUND UPDATED...
{status: 'complete'}
[background.ts] onMessage
Message from content script...
contentScript.js has been injected successfully
BACKGROUND INITIALIZE...
SETUP STATE...
INITIALIZE STATE...
```

もはやすべて popup で RUN されてから
全部を始めればいいのでは？

そうすれば全て丸く収まるのでは？

#### popup が RUN されてからすべて始める仕様を検討する

1. そもそも RUN する前に content script を inject しないといけない理由とは？

静的 inejct の content script の名残である
静的 inject に合わせていたから RUN 以前に処理を行うこととしただけである

コンテントスクリプトが ON でないとスクレイピングがうまくいかないから
これは本当にスクレイピングがうまくいかないのか？
確認

勝手にやっててくれていると便利だから

2. 処理順序をおさらいする

-   tab 移動による動的 inject:

拡張機能を ON にする
tab を切り替えて、Udemy 講義ページへ移動する
tabs.query を確認して matchURL か確認する
isInitialized()で初期化が済んでいるか確認する
match かつ初期化が済んでいない場合、content script を動的 inject する

--- 以下、共通 ---

contentScript.js がインジェクトできたら activated: true を送信する
background.js はその送信を持って initialize()を実行して初期化を開始する
setupStates(): State インスタンスの生成と stateList への登録、localstorage の clear
initializeStates(): STate インスタンスへ初期値を与える
letExtensionSendStatus(): contentScript.js からステータスを送信させて、messagehandler で State を更新する

-   onUpdated による動的 inject:

拡張機能を ON にする
Udemy 講義ページへ移動する
chrome.tabs.onUpdated が反応する
tab と url が正しいことと、isInitialized()が false を返すことを確認する
すべて true ならば contentScript.js を動的 inject する

--- 以下、共通 ---

解決したい問題は？

onUpdated だよりの content script の inject は inject の重複をもたらすこと

なので popup で RUN してからすべて初めてみる

#### 1/18

NOTE: popup から全て始める前の仕様の git log

6ae4875c24b0279a826c18e984ab0132d4e49d9a

やること

-   popup の RUN ボタンが押されてからすべて始める仕様に変更するか検討
-   検討結果の実行
-   caputureSubtitles.js を inject してからの動作の確認
-   リセット機能
-   エラーハンドリング
-   見た目をいい感じに

##### 事前スクレイピングが必要なのか検討

**結論：POPUP の RUN ボタンが押されてからすべて始める仕様にする**

そもそもスクレイピングは必須なのか再考

1. Transcript は ON にしないとダメか？

字幕要素 Transcript が ON でないと現れない。つまり、スクレイピングできない
これができないと何が問題かといえば
そもそも字幕をスクレイピングできない

2. RUN する前に字幕を英語にしておかないとダメか

英語を訳すことが前提のアプリケーションなので英語であることは必須

3. RUN してから「トランスクリプトと英語が ON じゃないよ」というやりなおし警告を表示するのはありか

別にありだと思う
なので事前のスクレイピングもしなくていいといえばしなくていい

ここで架けられている天秤は

-   二重 inject される可能性があるけど事前 inject する
-   または RUN してから「やりなおし」表示するけど確実に inject する

結局のところ、事前 inject したところで「やりなおし」警告を発することにはなる
(ユーザーが使い方無視して RUN する場合もあるし...)

ならば RUN してからすべて開始する仕様のほうが解りやすくていいかも

##### popup の RUN ボタンが押されたらすべて始める仕様に変更する

今の仕様

タブの切替またはページへのアクセスによって content script をインジェクトし、初期化していた

これを popup の RUN ボタンが押されてから inject と初期化、ExTranscript の挿入完了までを一気に行う仕様にする

拡張機能の ON
ユーザ操作による popup の表示
POPUP には
「トランスクリプトを ON にして」
「英語字幕を選択して」
の 2 つの表示と
RUN ボタンを表示させる

RUN ボタンを押す
POPUP から background へ初期化して＆RUN 押されたメッセージ
background は isInitialized()の戻り値に応じて
false: 初期化
または
true: 字幕取得
開始

    初期化処理開始
        contentScript.jsのinject
        contentScript.jsからのactivated: true信号の受信
        initialize()の実行 background.jsの初期化開始
        Stateの生成完了
        contentScript.jsへステータスを送信させる信号の送信
        contentScript.jsからのステータス受信
        ステータスをStateへ保存してtranscriptがOnか英語字幕なのかどうか調査する
        ON && 英語でない場合やり直しをさせるメッセージをPOPUPへ送信する

    POPUPのやり直し警告の表示
        やり直し警告(ブラウザのアラート)の表示

    字幕取得処理開始
        popupからRUNボタン押されたメッセージの受信
        contentScript.jsと通信して、onで英語であることを確認
        処理中表示してのメッセージをPOPUPへむけて送信
        (popupは処理中であることを表示する)
        captureSubtitles.jsの動的inject
        captureSubtitles.jsから字幕データを取得する
        Stateに字幕データを保存する
        controller.jsを動的injectする
        controller.jsの初期化完了次第完了メッセージ送信する
        background.jsは受信次第popupへ完了メッセージ送信する
        (popupは生成完了の旨を表示する)

##### popup でページが無効な URL かどうか判断できるのか？

React を使っているので
useEffect を用いる

結局 chrome.tabs.query を使うことに他ならず
つまり Promise を扱うことになる

これは useEffect で非同期関数を渡していいのか
または
background と通信して URL ｇ有効か確認するの

天秤になる

解決策例?

https://tyotto-good.com/blog/avoid-useeffect-mistakes
https://qiita.com/daishi/items/4423878a1cd7a0ab69eb

React Hooks useEffect で非同期処理をするときの注意

1. useEffect には cleanup 関数を返すこと

async 関数をコールバックとして登録してはならない
理由は Promise を返してしまうから

```JavaScript

// 問題あり
useEffect(async () => {
  await new Promise(r => setTimeout(r, 1000));

}, []);


// 解決策
const sleep = ms => new Promise(r => setTimeout(r, ms));

useEffect(() => {
  const f = async () => {
    await new Promise(r => setTimeout(r, 1000));

  };
  f();
}, []);
```

でもこれだと非同期関数が同期的に呼び出されているから
非同期関数の内部の処理が完了する前に次の処理に進んでしまう...

大丈夫なん？

この辺は state で制御した方がいいかも...

```TypeScript
// popup.tsx

import { tabsQuery } from "../utils/helpers";

// ひとまず毎度レンダリング時にチェックするとして...
// checkTabIsCorrectは外に出すとして
useEffect(() =>{

    const checkTabIsCorrect = async(): Promise<boolean> => {
        const tabs: chrome.tabs.Tab = await tabsQuery();
        const pattern = /https:\/\/www.udemy.com\/course\/*/gm;
        const result: RegExpMatchArray = tab.url.match(pattern);
        return result ? true: false;
    };
        // 同期呼出なので大丈夫か？

        checkTabIsCorrect()
            .then((result) =>
            .catch((err) => console.error(err));
})
```

動作確認した
ひとまず popup 自身でも確認はできた

then()以下の処理を決める

true ならばボタンを有効化する
false ならばボタンは表示しないまたは無効化させてメッセージを表示する
ということで state を追加する

```TypeScript
// popup.tsx

// popupを表示したときのタブのurlが正しければtrue
const [matchedPage. setMatchedPage] = useState<boolean>(false);

useEffect(() =>{

    checkTabIsCorrect()
        .then((result) => {
            setMatchedPage(result);
        })
        .catch((err) => console.error(err));
});

const checkTabIsCorrect = async(): Promise<boolean> => {
    const tabs: chrome.tabs.Tab = await tabsQuery();
    const pattern = /https:\/\/www.udemy.com\/course\/*/gm;
    const result: RegExpMatchArray = tab.url.match(pattern);
    return result ? true: false;
};


const generateWarning = (): JSX.Element => {
    return <p>This extension works only https://www.udemy.com/course/*</p>;
}

return (
    <div className="container">
        {matchedPage ? genarateWarning(): ''}
        <p>{generateDescription(complete)}</p>
        <button onClick={buttonHandler} disabled={complete}>
            RUN
        </button>
        {loading ? loadingComponent() : ''}
        {complete ? completedComponent() : ''}
    </div>
);
```

popup は activated を送信する意味がないな...
結局 RUN ボタンが押されたらすべて初期化含めて始まるので
State が生成される前に送信しても意味ないな

background.ts の修正

popup の run からすべて始まるので
popup からの activated: true は送信する意味がない
なのでこれを無効にすること

popup からの run メッセージを修正と
受信側の処理の修正

#### 1/19

やること：

-   popup の RUN ボタンを押してからすべての初期化を始める機能へ修正する

検討すること：

-   background.js::chrome.onInstalled において State の初期化を済ませておく

ただし常にメモリを圧迫しない、storage を圧迫しないことが条件で
これらを把握して検証できれば実装してもいい

残っているタスク:

-   section title を送る機能を削除
-   リセット機能
-   エラーハンドリング
-   見た目をはシンプルあんど綺麗に

おさらい：

1. 初期化をする前に確認すること

-   active tab は Udemy 講義ページであること
-   または tab が正しうちに State<iTabId>に正しい tabId を保存させる

ならば State だけ onInstalled 時点で生成しておいて常に待機させるのはありか？

それは結局メモリをどれだけ常に圧迫するのかという問題と
ローカル・ストレージを常にどれだけ圧迫するのかという問題が
天秤にかけられる

メモリとかの使用率の調べ方

https://www.cnet.com/how-to/how-to-check-memory-usage-of-chrome-extensions/#:~:text=Fortunately%2C%20Chrome%20has%20a%20built,go%20to%20Tools%20%3E%20Task%20Manager.

onInstalled で初期化(State の生成だけ)済ませてみる

```TypeScript

chrome.runtime.onInstalled.addListener(
    async (details: chrome.runtime.InstalledDetails) => {



        if(!isInitialized()) {
            await setupState();
            // iStatusだけ初期化する
            const refStatus: State<iStatus> = stateList.caller<iStatus>(nameOfState.status);
            if (!refStatus) return;

            await refStatus.clearStorage();
            await refStatus.setState({
                scripts: {
                    popup: extensionStatus.notWorking,
                    contentScript: extensionStatus.notWorking,
                    controller: extensionStatus.notWorking,
                },
                pageStatus: {
                    isTranscriptOn: false,
                    isEnglish: false,
                    isWindowTooSmall: false,
                },
                progress: {
                    capturing: false,
                    captured: false,
                    stored: false,
                    restructured: false,
                },
            });
        }
    }
);

```

これだけならば
HEAP snapshot: 910kb

常にメモリにあっても問題なさそう...

2. 初期化の流れ

// onInstalled で State の生成を済ませてあるとする
// NEW
popup から RUN メッセージが送信される
tabId と URL を State へ保存する
popup の status を working にする（もはや意味がない気がするけれども...）
content script を inject する
~contentScript.js がインジェクトできたら activated: true を送信する~
~background.js はその送信を持って initialize()を実行して初期化を開始する~
~initializeStates(): STate インスタンスへ初期値を与える~
contentScript から初期値を送信させる
State を必要に応じて更新する
letExtensionSendStatus(): contentScript.js からステータスを送信させて、messagehandler で State を更新する

```TypeScript
// constants.ts


```

```TypeScript
// constants.ts

export const orderNames = {
// NOTE:
//
// Add new order
//
// As order to initialize all and start inserting ExTranscript
    run: "run",
  // Inject content script order
  injectCaptureSubtitleScript: "injectCaptureSubtitleScript",
  injectExTranscriptScript: "injectExTranscriptScript",
  // From background to contentScript
  sendStatus: "sendStatus",
  // from controller to background
  sendSubtitles: "sendSubtitles",
  // from contentScript to background
  sendSectionTitle: "sendSectionTitle",
  // order to disconnect port
  disconnect: "disconnect",
} as const;

// background.ts

chrome.runtime.onInstalled.addListener(
    async (details: chrome.runtime.InstalledDetails) => {



        if (!isInitialized()) {
            await setupStates();
            // iStatusだけ初期化する
            const refStatus: State<iStatus> = stateList.caller<iStatus>(
                nameOfState.status
            );

            await refStatus.setState({
                scripts: {
                    popup: extensionStatus.notWorking,
                    contentScript: extensionStatus.notWorking,
                    controller: extensionStatus.notWorking,
                },
                pageStatus: {
                    isTranscriptOn: false,
                    isEnglish: false,
                    isWindowTooSmall: false,
                },
                progress: {
                    capturing: false,
                    captured: false,
                    stored: false,
                    restructured: false,
                },
            });
        }
    }
);




const popupMessageHandler = async (m: messageTemplate): Promise<void> => {
    try {

        const { message, sendResponse } = m;
        const { order, ...rest } = message;
        // const refStatus: State<iStatus> = stateList.caller<iStatus>(
        //     nameOfState.status
        // );
        if (order && order.length) {
            // if (order.includes(orderNames.injectCaptureSubtitleScript)) {
            //     await startInjectCaptureSubtitleScript();
            // }

            if(order.includes(orderNames.run)){
                // 初期化が済んでいなければ初期化を実行する
                if(!isInitialized()){

                    await chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        files: ['contentScript.js'],
                    });
                }
                // 済んでいればState<iStatus>をチェックして続きを実行する
                else {

                }
            }
        }
        if (rest.activated) {

        }
        if(sendResponse) sendResponse({ complete: true });
    } catch (e) {
        console.error(e);
    }
};

```

拡張機能が ON になったら
chrome.runtime.onInstalled で setupState, State<iStatus>だけ初期化完了しているとして

初期化~ExTranscript 展開完了までのプロセス

-   [ユーザ] popup で RUN クリック

    -   [popup] run が押されたことを background へメッセージ送信
    -   [background] (もしまだしていなければ) contentScript.js の inject
    -   [background] contentScript.js のステータス送信を要請
    -   [contentScript] background.js へステータス送信
    -   [background] contentScript.js の初期値を State へ反映
    -   [background] State の値を調査
        もしも準備完了ならばそのまま captureSubtitles.js を inject
        そうでないならば popup へキャンセルしたことを送信
        -   [popup] popup への反映(注意：トランスクリプトを ON にすること、英語字幕を選択すること)
            アラート表示で最初に戻る
    -   [background] (もしまだしていなければ) captureSubtitles.js を inject
    -   [captureSubtitles] 字幕データを background へ送信
    -   [background] 字幕データを State へ保存
    -   [background] controller.js を inject
    -   [background] controller.js 正常動作確認
    -   [background] popup へ完了メッセージ送信
    -   [popup] complete を表示

    -   どこかしらでエラーが起こったら popup へエラー表示させるようにメッセージを送信させる

chrome extension を開発してよくある流れ

background script が content script を inject した
content script がインジェクトと初期完了して、完了したよメッセージを送信する
メッセージ受信関数が処理の続きのポイントとなる

ということで
処理がメッセージハンドラ関数に移りやすい

疎結合のシステムで実装しないとすぐにスパゲッティコードになりそう

メッセージハンドラをどう扱うべきか

-   model に変更を施すだけにする
    メッセージを受けて何をするのかに関心を置かない

-   model の変更を検知するオブザーバを設置する
    モデルの変化に応じて background script と連携する

-   model を作る

#### 1/20

中規模設計に関する話

https://qiita.com/yuku_t/items/961194a5443b618a4cac

user-interface layer:
ユーザに情報を表示、入力を解釈する層
application layer:  
 ドメイン層のオブジェクトを強調させる ビジネスロジックに関心がない
domain layer:
ビジネスロジックを表現する
infrastructure layer:
上位レイヤーを支える技術

MVC に適用すると

ユーザインタフェイス層： View
アプリケーション層：Controller
ドメイン層：Model

気を付けること

-   Model は Controller や View でどう呼び出されるのか知るべきでない
-   Controller は View が何を描くのか知るべきでない

開発中のアプリケーションに当てはめる

ユーザインタフェイス：
popup.tsx, bottomTranscriptView.ts, sidebarTranscriptView.ts

アプリケーション層：
background.ts, controller.ts

ドメイン層：
(・・?

わからん:
contentScript.ts, captureSubtitle.ts

なんとか MVC の設計思想に合わせるために設計をまとめ中

ダイアグラムの参考に

https://www.acroquest.co.jp/webworkshop/programing_course/note.html

https://c4model.com/
