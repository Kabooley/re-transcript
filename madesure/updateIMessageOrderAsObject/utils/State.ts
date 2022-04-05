/********************************************************
 * State class
 * ______________________________________________________
 *
 * 注意：
 * インスタンスには必ずオブジェクトを渡すこと
 * stringやnumberなどそのまま渡さないこと
 * 必ずkey-valueペアのオブジェクトを渡すこと
 *
 *
 *
 * ******************************************************/
 import { LocalStorage } from './LocalStorage';
 import { deepCopier } from './helpers';
 
 export class State<TYPE> {
     private _state: TYPE;
     private _localStorage: LocalStorage<TYPE>;
     private _key: string;
 
     constructor(key: string) {
         this._key = key;
         this._localStorage = new LocalStorage<TYPE>(this._key);
     }
 
     async setState(prop: {
         [Property in keyof TYPE]: TYPE[Property];
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
 