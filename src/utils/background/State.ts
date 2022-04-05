/********************************************************
 * State class
 * ______________________________________________________
 *
 * NOTE:
 * 前提 : chrome.storage.localの使用
 * インスタンスには必ずオブジェクトを渡すこと
 * stringやnumberなどそのまま渡さないこと
 * 必ずkey-valueペアのオブジェクトを渡すこと
 *
 *
 * UPDATE:
 * - <TYPE extends object>でobjectだよってTypeScriptエンジンに伝えることができる
 *
 * ******************************************************/
import { LocalStorage } from "../LocalStorage";
import { deepCopier } from "../helpers";

// @param key {string}: key for chrome.storage.local
class State<TYPE extends object> {
  private _state: TYPE;
  private _localStorage: LocalStorage<TYPE>;
  private _key: string;

  constructor(key: string) {
    this._key = key;
    this._localStorage = new LocalStorage<TYPE>(this._key);
  }

  async setState(prop: {
    [Property in keyof TYPE]?: TYPE[Property];
  }): Promise<void> {
    this._state = {
      ...this._state,
      ...prop,
    };
    try {
      await this._localStorage.save(this._state);
    } catch (err) {
      if (err === chrome.runtime.lastError) {
        console.error(err.message);
      } else {
        console.log(err);
      }
    }
  }

  async getState(): Promise<TYPE> {
    try {
      const s: TYPE = await this._localStorage.load();
      this._state = {
        ...this._state,
        ...s,
      };
      return deepCopier(this._state);
    } catch (err) {
      if (err === chrome.runtime.lastError) {
        console.error(err.message);
      } else {
        console.log(err);
      }
    }
  }

  async clearStorage(): Promise<void> {
    try {
      await this._localStorage.clearAll();
    } catch (err) {
      if (err === chrome.runtime.lastError) {
        console.error(err.message);
      } else {
        console.log(err);
      }
    }
  }
}

export default State;

// --- USAGE -------------------------------------------------
//
// もしもbackground.tsへ組み込むことになっていたらとして...
//
// chrome.runtime.onInstalled.addListener(
//   async (details: chrome.runtime.InstalledDetails) => {
//       console.log('BACKGROUND RUNNING...');
//       console.log(details.reason);

//       stateList.clearStorage("stateExtension");
//       stateList.setState<iState>("stateExtension", {
//           scripts: {
//               popup: 'notWorking',
//               contentScript: 'notWorking',
//               controller: 'notWorking',
//               option: 'notWorking',
//           },
//           pageStatus: {
//               isTranscriptOn: false,
//               isEnglish: false,
//               isWindowTooSmall: false,
//           },
//           progress: {
//               capturing: false,
//               captured: false,
//               stored: false,
//               restructured: false,
//           },
//       })
//   }
// );

// // set up
// const setupState = (): void => {
//   // state of iState
//   const key__extensionState: string = 'key__local_storage_state';
//   const stateExtension = new State<iState>(key__extensionState);

//   // state of subtitle_piece[]
//   const key__subtitles: string = 'key__local_storage_subtitle';
//   const stateSubtitles = new State<subtitle_piece[]>(key__subtitles);

//   // state of tabId
//   const key__tabId: string = 'key__tabId';
//   const stateTabId = new State<number>(key__tabId);

//   // state of sectionTitle
//   const key__sectionTitle: string = 'key__sectionTitle';
//   const stateSectionTitle = new State<string>(key__sectionTitle);

//   // Register instances.
//   stateList.register<iState>("stateExtension", stateExtension);
//   stateList.register<subtitle_piece[]>("stateSubtitles", stateSubtitles);
//   stateList.register<number>("stateTabId", stateTabId);
//   stateList.register<string>("stateSectionTitle", stateSectionTitle);
// };

// // ---- MODULES --------------------------------------------------

// interface iStateList {
//   register: <TYPE>(name: string, instance: State<TYPE>) => void;
//   unregister: (name: string) => void;
//   setState: <TYPE>(name: string, data: TYPE) => Promise<void>;
//   getState: <TYPE>(name: string)=> Promise<TYPE>;
//   clearStorage:(name: string) => Promise<void>;
// };

// // Stateのインスタンスを保存しておく場所
// // インスタンスをどこからでも呼出せるようにするためと、
// // インスタンスをグローバル変数にしたくないからこんな面倒をしている
// //
// // background scriptがアンロードされる可能性を考えて
// // 再ロードされても大丈夫にしておく
// // ということで内部でインスタンスを呼び出し、登録する
// const stateList: iStateList = (function () {
//     console.log("stateList module invoked");
//   // _list will store these properties.
//   // この場合の_listのAnnotationの仕方がわからない
//   // _list = {
//   //     stateSectionTitle: stateSectionTitle,
//   //     stateExtension: stateExtension,
//   //     stateSubtitles: stateSubtitles,
//   //     stateTabId: stateTabId,
//   // }
//   var _list = {};
//   setupState();

//   return {
//       register: <TYPE>(name: string, instance: State<TYPE>): void => {
//           _list[name] = instance;
//       },
//       unregister: (name: string): void => {
//           // これでinstanceもさくじょしていることになるかしら
//           delete _list[name];
//       },
//       setState: async <TYPE>(name: string, data: TYPE): Promise<void> => {
//           await _list[name].setState(data);
//       },
//       // Genericsは手続きが面倒かしら?
//       getState: async <TYPE>(name: string): Promise<TYPE> => {
//           return _list[name].getState();
//       },
//       clearStorage: async(name: string): Promise<void> => {
//           await _list[name].clearStorage();
//       },
//       // 以下の呼出が問題を起こさなければこっちのほうがいいんだけどね
//       // caller: <TYPE>(name: string): State<TYPE> => {
//       //     return _list[name];
//       // }

//   };
// })();

// // USAGE stateList
// const current = stateList.getState<iState>("stateExtension");
