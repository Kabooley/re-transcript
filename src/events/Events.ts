/*********************************************************
 * Events.ts
 *
 * Required part of Model class.
 * Control the registration of events to objects and event firing.
 *
 *
 **/
import { iProps, Callback } from '../utils/constants';

export class Events<T> {
    public events: { [key: string]: Callback<T>[] };
    constructor() {
        this.events = {};
        this.on = this.on.bind(this);
        this.trigger = this.trigger.bind(this);
    }

    on(eventName: string, callback: Callback<T>): void {
        const handlers = this.events[eventName] || [];
        handlers.push(callback);
        this.events[eventName] = handlers;
    }

    trigger(eventName: string, prop: iProps<T>): void {
        const handlers = this.events[eventName];
        if (handlers === undefined || !handlers.length) return;
        handlers.forEach((cb) => {
            cb(prop);
        });
    }
}
