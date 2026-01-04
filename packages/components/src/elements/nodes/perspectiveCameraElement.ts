import { NodeElement } from "./nodeElement";
import { PerspectiveCamera } from "three";

export class PerspectiveCameraElement extends NodeElement<PerspectiveCamera> {
  constructor() {
    super(new PerspectiveCamera());
  }

  override connectedCallback() {
    super.connectedCallback();

    const context = this.getRootContext();

    if (!context) {
      return;
    }

    this.object.far = 5000;
    context.addEventListener(
      "size-changed",
      ({ height, width }) => {
        this.object.aspect = width / height;
      },
      {
        signal: this.connectedSignal,
      }
    );
  }
}
