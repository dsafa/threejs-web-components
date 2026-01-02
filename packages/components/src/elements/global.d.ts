declare global {
  interface CommandEvent extends Event {
    readonly source: EventTarget;
    readonly command: string;
    new (
      type?: string,
      init?: EventInit & { command?: string; source?: EventTarget }
    ): CommandEvent;
  }

  interface HTMLElementEventMap {
    command: CommandEvent;
  }

  var CommandEvent: CommandEvent;
}

export {};
