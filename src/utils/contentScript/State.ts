/*************************************************************
 * State class
 *
 *
 * ../contentScript/controller.tsなどで使われるためのもの
 * ../background/background.tsのためのものと混同しないこと
 *
 * Observableのインスタンスを必須とする
 * ObservableはObserverデザインパターンのsubjectである
 * Stateはpublicとしてこのインスタンスを登録し
 * あとからobserverを登録できる
 * **********************************************************/

import Observable from "../Observable";

class State<TYPE extends object> {
  private _state: TYPE;
  public observable: Observable<TYPE>;
  constructor(s: TYPE, o: Observable<TYPE>) {
    this.observable = o;
    this._state = { ...s };
  }

  setState(prop: {
    [Property in keyof TYPE]?: TYPE[Property];
  }): void {
    const prev: TYPE = { ...this._state };
    // _stateは一段階の深さなので
    // コピーはspread構文で充分
    this._state = {
      ...this._state,
      ...prop,
    };
    this.observable.notify(prop, prev);
  }

  getState(): TYPE {
    // _stateは一段階の深さなので
    // コピーはspread構文で充分
    return { ...this._state };
  }
}

export default State;
