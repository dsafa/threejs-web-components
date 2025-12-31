import { MaterialElement } from "./materialElement";
import { MeshBasicMaterial } from "three";

export class BasicMaterialElement extends MaterialElement {
  private _material = new MeshBasicMaterial({
    color: "white",
  });

  override connectedCallback() {
    super.connectedCallback();

    if (this.target) {
      this.target.material = this._material;
    }
  }
}
