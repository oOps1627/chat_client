type Subscription<T> = (data: T) => void;

type Unsubscribe = () => void;

export class Observable<T = unknown> {
   private _handlers: Subscription<T>[] = [];

    emit(value: T): void {
        this._handlers.forEach((handler) => handler(value));
    }

    subscribe(handler: Subscription<T>): Unsubscribe {
        this._handlers.push(handler);

        return () => this.unsubscribe(handler);
    }

    unsubscribe(handler: Subscription<T>): void {
        const handlerIndex = this._handlers.findIndex((item) => item === handler);
        this._handlers.slice(handlerIndex, 1);
    }
}
