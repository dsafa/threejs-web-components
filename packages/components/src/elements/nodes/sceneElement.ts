import { Color, DirectionalLight, HemisphereLight, Scene } from "three";
import { NodeElement } from "./nodeElement";

const styleProperties = ["background-color"];

export class SceneElement extends NodeElement<Scene> {
  constructor() {
    super(new Scene());

    const env = new HemisphereLight();
    const directional = new DirectionalLight();
    directional.intensity = 2;

    this.object.add(env, directional);
  }

  connectedCallback() {
    super.connectedCallback();

    const context = this.getRootContext();
    if (context) {
      context.createScene(this.object);
    }
  }

  override onStyleChange(property: string, value: string) {
    super.onStyleChange(property, value);

    switch (property) {
      case "background-color": {
        this.object.background = new Color(value);

        break;
      }
      default:
        break;
    }
  }

  override getObservedStyles() {
    return [...super.getObservedStyles(), ...styleProperties];
  }
}
