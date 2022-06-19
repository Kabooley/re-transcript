/*********************************************
 * MODEL
 *
 * *******************************************/
import { Attributes } from '../attributes/Attributes';
import { Events } from '../events/Events';
import { iProps } from '../utils/constants';

export class Model<T> {
    constructor(private attributes: Attributes<T>, private events: Events<T>) {}

    get get() {
        return this.attributes.get;
    }

    get on() {
        return this.events.on;
    }

    get trigger() {
        return this.events.trigger;
    }

    set(prop: iProps<T>) {
        this.attributes.set(prop);
        // NOTE: DO PASS prop
        this.events.trigger('change', prop);
    }
}
