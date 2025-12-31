import { BaseElement } from "../baseElement";
import { getParentObject } from "../nodes/nodeUtils";
import { BoxGeometry, DoubleSide, MeshBasicMaterial, type Mesh } from "three";

export class GeometryElement extends BaseElement {
  private _target: Mesh | null = null;

  override connectedCallback() {
    const parentObject = getParentObject(this);

    if (parentObject && parentObject.object.type === "Mesh") {
      this._target = parentObject.object as Mesh;
      this._target.geometry = new BoxGeometry(1, 1, 1);
      this._target.material = new MeshBasicMaterial({
        color: "white",
        side: DoubleSide,
        wireframe: true,
      });
    } else {
      console.warn("Geometry not attach to mesh");
    }
  }

  override disconnectedCallback() {
    this._target = null;
  }
}
