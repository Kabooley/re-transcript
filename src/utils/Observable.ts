type iObserver<TYPE> = (
  prop: { [Property in keyof TYPE]?: TYPE[Property] },
  prev: TYPE
) => void;

class Observable<TYPE> {
  private _observers: iObserver<TYPE>[];
  constructor() {
    this._observers = [];
  }

  register(func: iObserver<TYPE>): void {
    this._observers.push(func);
  }

  unregister(func: iObserver<TYPE>): void {
    this._observers = this._observers.filter((o) => {
      return o !== func;
    });
  }

  notify(
    prop: { [Property in keyof TYPE]?: TYPE[Property] },
    prev: TYPE
  ): void {
    this._observers.forEach((o) => {
      o(prop, prev);
    });
  }
}

export default Observable;
