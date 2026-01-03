import { NodeElement } from "./nodeElement";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

const template = `<div id='container' style='position:absolute;z-index:1;'><slot/></div>`;

export class HtmlNodeElement extends NodeElement<CSS2DObject> {
  private _shadowRoot;

  constructor() {
    super(new CSS2DObject(document.createElement("div")));

    this._shadowRoot = this.attachShadow({ mode: "open" });
  }

  override connectedCallback() {
    super.connectedCallback();

    this._shadowRoot.innerHTML = template;
    const containerElement = this._shadowRoot.getElementById("container")!;
    const elementProxy = this.object.element;

    const context = this.getRootContext();
    if (context) {
      context.addEventListener(
        "render-end",
        () => {
          const computedStyles = window.getComputedStyle(elementProxy);

          containerElement.style.setProperty(
            "transform",
            "translate(-50%, -50%) " +
              computedStyles.getPropertyValue("transform")
          );
        },
        { signal: this.connectedSignal }
      );
    }
  }

  override getObservedStyles() {
    return [];
  }
}
