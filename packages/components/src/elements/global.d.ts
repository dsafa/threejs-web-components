declare global {
  interface CommandEvent extends Event {
    readonly source: EventTarget;
    readonly command: string;
  }

  interface HTMLElementEventMap {
    command: CommandEvent;
  }
}

export {};
