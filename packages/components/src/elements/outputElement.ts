import { BaseElement } from "./baseElement";
import type { Context } from "../core/context";

export class OutputElement extends BaseElement {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    const canvas = this.querySelector("canvas");

    const context = this.getRootContext();

    if (canvas && context) {
      context.createRenderer(canvas);
      this.setup(context, canvas);
      console.log(context);
    }
  }

  disconnectedCallback() {}

  private setup(context: Context, canvas: HTMLCanvasElement) {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      context.updateSize(entry.contentRect.width, entry.contentRect.height);
    });

    observer.observe(canvas);
  }
}
