export default class EventEmitter {
    constructor() {
        this._events = {
            "*": [],
        };
    }

    trigger(eventName, evtData) {
        eventName.split(" ").forEach((evtName) => {
            // trigger a global event event
            this._events["*"].forEach((evt) => evt.fn.call(evt.scope, evtName, evtData));
            // if there are any listeners to this event
            // then fire their handlers
            if (this._events[evtName]) {
                this._events[evtName].forEach((evt) => {
                    evt.fn.call(evt.scope, evtData);
                });
            }
        });
        return this;
    }

    /**
     * Emit events from pusher
     *
     * @param {string} label Event name
     * @param {*} data Event data
     * @memberof Pusher
     */
    emit(label, data) {
        this.trigger(label, data);
    }

    on(eventName, fn, scope) {
        if (!this._events[eventName]) this._events[eventName] = [];
        this._events[eventName].push({
            eventName,
            fn,
            scope: scope || this,
        });
        return this;
    }

    off(eventName, fn) {
        if (!this._events[eventName]) return this;
        if (!fn) {
            this._events[eventName] = [];
        }
        this._events[eventName] = this._events[eventName].filter((evt) => {
            return evt.fn !== fn;
        });
        return this;
    }

    once(eventName, fn, scope) {
        const func = () => {
            fn.call(scope, ...arguments);
            this.off(eventName, func);
        };
        return this.on(eventName, func, scope);
    }
}
