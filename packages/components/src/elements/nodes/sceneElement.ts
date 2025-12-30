import { NodeElement } from "./nodeElement";
import { Scene } from "three";

export class SceneElement extends NodeElement<Scene> {
  constructor() {
    super(new Scene());
  }

  connectedCallback() {
    super.connectedCallback();

    const context = this.getRootContext();
    if (context) {
      context.createScene(this.object);
    }
  }
}
