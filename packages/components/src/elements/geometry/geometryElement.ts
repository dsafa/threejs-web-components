import { BaseElement } from "../baseElement";
import { getParentObject } from "../nodes/nodeUtils";
import { type Mesh } from "three";

export class GeometryElement extends BaseElement {
  protected target: Mesh | null = null;

  override connectedCallback() {
    const parentObject = getParentObject(this);

    if (parentObject && parentObject.object.type === "Mesh") {
      this.target = parentObject.object as Mesh;
    } else {
      console.warn("Geometry not attach to mesh");
    }
  }

  override disconnectedCallback() {
    this.target = null;
  }
}
