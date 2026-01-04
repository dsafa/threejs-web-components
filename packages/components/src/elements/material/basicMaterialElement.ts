import { MeshBasicMaterial } from "three";
import { MaterialElement } from "./materialElement";

const styleProperties = ["visibility", "opacity", "color"];

export class BasicMaterialElement extends MaterialElement {
  private _material = new MeshBasicMaterial({
    color: "white",
  });

  public get material() {
    return this._material;
  }

  override connectedCallback() {
    super.connectedCallback();

    if (this.target) {
      this.target.material = this._material;
    }

    this.setDefaults();
  }

  override getObservedStyles() {
    return styleProperties;
  }

  override onStyleChange(property: string, value: string) {
    switch (property) {
      case "visibility": {
        this._material.visible = value === "visible";
        break;
      }
      case "opacity": {
        this._material.opacity = Number.parseFloat(value);
        this._material.transparent = this._material.opacity !== 1;
        this._material.needsUpdate = true;
        break;
      }
      case "color": {
        this._material.color.set(value);
        break;
      }
      default:
        break;
    }
  }

  private setDefaults() {
    this.setAttribute("color", this._material.color.getHexString());
  }
}
