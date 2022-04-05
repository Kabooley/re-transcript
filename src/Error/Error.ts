export type uError = ErrorBase | DomManipulationError | PageStatusNotReadyError;

class Err {
    public message: string;
    public name: string;
    constructor(message) {
        this.message = message;
        this.name = 'Error'; // (組み込みのエラークラスごとに異なる名前)
    }
}

export class ErrorBase extends Err {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class DomManipulationError extends ErrorBase {
    constructor(message) {
        super(message);
        this.name = 'DomManipulationError';
    }
}

/***********
 * Among contentScript.js
 * Thrown if subtitle is not English, or Transcript is not opened
 * */
export class PageStatusNotReadyError extends ErrorBase {
    constructor(message) {
        super(message);
        this.name = 'PageStatusNotReadyError';
    }
}
