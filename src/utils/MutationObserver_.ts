/**************************************************
 * MutationObserver wrapper class
 *
 * NOTE: targetはNodeListOf<Element>だけで全く再利用性がない
 *
 * いまのところsrc/contentScript/controller.tsでしか使われていない
 * *************************************************/

class MutationObserver_ {
  public _callback: (mr: MutationRecord[]) => void;
  public _config: MutationObserverInit;
  public _target: NodeListOf<Element>;
  public _observer: MutationObserver;
  constructor(
    callback: (mr: MutationRecord[]) => void,
    config: MutationObserverInit,
    target: NodeListOf<Element>
  ) {
    this._callback = callback;
    this._config = config;
    this._target = target;
    this._observer = new MutationObserver(this._callback);
  }

  observe(): void {
    this._target.forEach((ts) => {
      this._observer.observe(ts, this._config);
    });
  }

  disconnect(): void {
    this._observer.disconnect();
  }
}

export default MutationObserver_;
