import { BaseElement } from "../baseElement";
import { getParentObject } from "../nodes/nodeUtils";
import { type Mesh } from "three";

export class MaterialElement extends BaseElement {
  protected target: Mesh | null = null;

  override connectedCallback() {
    super.connectedCallback();

    const parentObject = getParentObject(this);

    if (parentObject && parentObject.object.type === "Mesh") {
      this.target = parentObject.object as Mesh;
    } else {
      console.warn("Material not attach to mesh");
    }
  }

  override disconnectedCallback() {
    this.target = null;
  }
}
