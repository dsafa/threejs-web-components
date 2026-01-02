import { BaseElement } from "./baseElement";
import type { Context } from "../core/context";
import { Raycaster, Vector2 } from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

const template = `
<style>
  #root { display: grid; place-content: center; position: relative; width: fit-content; }
  #overlay { position: absolute; width: 100%; height: 100%; pointer-events: none; }
  #overlay > * { pointer-events: all; }
</style>
<div id='root'><slot></slot><div id='overlay'/></div>
`;

export class OutputElement extends BaseElement {
  private _shadowRoot;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    super.connectedCallback();

    const canvas = this.querySelector("canvas");

    const context = this.getRootContext();

    this._shadowRoot.innerHTML = template;

    if (canvas && context) {
      context.createRenderer(
        canvas,
        this._shadowRoot.getElementById("overlay")!
      );
      this.setup(context, canvas);
      console.log(context);
    }
  }

  disconnectedCallback() {}

  private setup(context: Context, canvas: HTMLCanvasElement) {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      context.updateSize(entry.contentRect.width, entry.contentRect.height);
    });

    observer.observe(canvas);

    const raycaster = new Raycaster();
    const mouseVec = new Vector2();

    const handleRaycast = (event: MouseEvent) => {
      if (!context.activeCamera || !context.scene) {
        return null;
      }

      const { width, height } = canvas.getBoundingClientRect();
      mouseVec.x = (event.offsetX / width) * 2 - 1;
      mouseVec.y = -(event.offsetY / height) * 2 + 1;

      raycaster.setFromCamera(mouseVec, context.activeCamera);

      const [intersect] = raycaster.intersectObject(context.scene, true);
      const objectId = intersect?.object.id;

      return objectId;
    };

    canvas.addEventListener(
      "pointermove",
      (event) => {
        const objectId = handleRaycast(event);

        context.hoveredObjectId = objectId;
      },
      {
        signal: this.connectedSignal,
      }
    );

    canvas.addEventListener(
      "click",
      (event) => {
        const objectId = handleRaycast(event);
        context.selectedObjectId = objectId;

        if (objectId) {
          context.dispatchEvent({ type: "on-object-click", objectId });
        }
      },
      {
        signal: this.connectedSignal,
      }
    );
  }
}
