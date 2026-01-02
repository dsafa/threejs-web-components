import { NodeElement } from "./nodeElement";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

export class HtmlNodeElement extends NodeElement<CSS2DObject> {
  constructor() {
    super(new CSS2DObject(document.createElement("div")));
  }

  override connectedCallback() {
    super.connectedCallback();

    for (const child of this.children) {
      this.object.element.appendChild(child);
    }
  }
}
