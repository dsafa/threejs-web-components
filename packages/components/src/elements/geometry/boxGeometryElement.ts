import { GeometryElement } from "./geometryElement";
import { BoxGeometry } from "three";

export class BoxGeometryElement extends GeometryElement {
  static observedAttributes = ["width", "height", "depth"];

  private _updating = false;

  attributeChangedCallback() {
    this.onUpdate();
  }

  private onUpdate = () => {
    if (this._updating) {
      return;
    }

    this._updating = true;

    window.queueMicrotask(() => {
      this.updateGeometry();
      this._updating = false;
    });
  };

  private updateGeometry() {
    const width = this.getDimension("width");
    const height = this.getDimension("height");
    const depth = this.getDimension("depth");

    this.setGeometry(new BoxGeometry(width, height, depth));
  }

  private getDimension(name: string) {
    const attributeValue = this.getAttribute(name) ?? "1";

    const value = Number.parseFloat(attributeValue);

    if (Number.isFinite(value)) {
      return value;
    }

    return 1;
  }
}
