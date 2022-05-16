/******************************************************
 * Attirbutes.ts
 *
 * Part of Model class and
 * controls the writing and reading of objects.
 *
 *
 * */
import { iProps } from '../utils/constants';

export class Attributes<T> {
    // Requires Storage instance
    constructor(private data: T) {
        this.set = this.set.bind(this);
        this.get = this.get.bind(this);
    }

    // prop can have part of data
    set(prop: iProps<T>): void {
        this.data = {
            ...this.data,
            ...prop,
        };
    }

    // get always returns all.
    get(): T {
        return { ...this.data };
    }
}
