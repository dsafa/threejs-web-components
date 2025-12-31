import { Color, Scene } from "three";
import { NodeElement } from "./nodeElement";
import { createStyleObserver } from "../styleObserver";

const styleProperties = ["background-color"];

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

    createStyleObserver({
      element: this,
      properties: styleProperties,
      onUpdate: this.onStyleUpdate.bind(this),
      signal: this.connectedSignal,
    });
  }

  private onStyleUpdate(property: string, value: string) {
    switch (property) {
      case "background-color": {
        this.object.background = new Color(value);

        break;
      }
      default:
        break;
    }
  }
}
