import { BaseElement } from "./baseElement";

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
      console.log(context);
    }
  }

  disconnectedCallback() {}
}
