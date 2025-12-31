type EventHandler<TEvent> = (event: TEvent) => void;

type Listener = {
  handler: (event: unknown) => void;
  signal?: AbortSignal;
  once?: boolean;
  didInvoke: boolean;
  invoke: (event: unknown) => boolean;
};

export class Dispatcher<TEventMap extends {}> {
  private readonly _listeners: Map<string, Listener[]> = new Map();

  public addEventListener<TEventName extends keyof TEventMap & string>(
    eventName: TEventName,
    handler: EventHandler<TEventMap[TEventName]>,
    options?: { signal?: AbortSignal; once?: boolean }
  ) {
    const listeners = this._listeners.get(eventName) ?? [];

    const listener = {
      handler: handler as () => void,
      once: options?.once,
      signal: options?.signal,
      didInvoke: false,
      invoke(event: unknown) {
        if ((this.once || (this.signal?.aborted ?? false)) && this.didInvoke) {
          return false;
        }

        this.didInvoke = true;
        this.handler(event);

        if (this.once) {
          return false;
        }

        return true;
      },
    } satisfies Listener;

    listeners.push(listener);

    this._listeners.set(eventName, listeners);
  }

  public removeEventListener<TEventName extends keyof TEventMap & string>(
    eventName: TEventName,
    handler: EventHandler<TEventMap[TEventName]>
  ) {
    const listeners = this._listeners.get(eventName) ?? [];

    const index = listeners.findIndex(
      (listener) => listener.handler === handler
    );

    if (index >= 0) {
      listeners.splice(index, 1);
    }
  }

  public dispatchEvent<TEventName extends keyof TEventMap & string>(
    event: { type: TEventName } & TEventMap[TEventName]
  ) {
    const toRemove: number[] = [];
    const listeners = this._listeners.get(event.type) ?? [];

    for (let i = 0; i < listeners.length; i++) {
      if (!listeners[i].invoke(event)) {
        toRemove.push(i);
      }
    }

    this.removeListeners(event.type, toRemove);
  }

  private removeListeners(eventName: string, index: number[]) {
    const indexSet = new Set(index);
    const newListeners: Listener[] = [];
    const currentListeners = this._listeners.get(eventName) ?? [];

    for (let i = 0; i < currentListeners.length; i++) {
      if (!indexSet.has(i)) {
        newListeners.push(currentListeners[i]);
      }
    }

    this._listeners.set(eventName, newListeners);
  }
}
