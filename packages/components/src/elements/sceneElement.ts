import { BaseElement } from "./baseElement";

export class SceneElement extends BaseElement {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    const context = this.getRootContext();
    if (context) {
      context.createScene();
    }
  }
}
