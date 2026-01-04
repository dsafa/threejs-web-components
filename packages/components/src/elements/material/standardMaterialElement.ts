import { MeshStandardMaterial } from "three";
import { MaterialElement } from "./materialElement";

const styleProperties = ["color"];

export class StandardMaterialElement extends MaterialElement<MeshStandardMaterial> {
  constructor() {
    super(new MeshStandardMaterial());
  }

  override connectedCallback() {
    super.connectedCallback();
  }

  override getObservedStyles() {
    return [...super.getObservedStyles(), ...styleProperties];
  }

  override onStyleChange(property: string, value: string) {
    super.onStyleChange(property, value);

    switch (property) {
      case "color": {
        this.material.color.set(value);
        break;
      }
      default:
        break;
    }
  }
}
