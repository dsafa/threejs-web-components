import { BaseElement } from "./baseElement";
import type { Context } from "../core/context";
import { Raycaster, Vector2 } from "three";

export class OutputElement extends BaseElement {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    const canvas = this.querySelector("canvas");

    const context = this.getRootContext();

    if (canvas && context) {
      context.createRenderer(canvas);
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

    let lastHoveredObjectId: number | undefined = undefined;
    canvas.addEventListener(
      "pointermove",
      ({ offsetX, offsetY }) => {
        if (!context.activeCamera || !context.scene) {
          return;
        }

        const { width, height } = canvas.getBoundingClientRect();
        mouseVec.x = (offsetX / width) * 2 - 1;
        mouseVec.y = -(offsetY / height) * 2 + 1;

        raycaster.setFromCamera(mouseVec, context.activeCamera);

        const [intersect] = raycaster.intersectObject(context.scene, true);
        const objectId = intersect?.object.id;

        if (lastHoveredObjectId === objectId) {
          return;
        }

        lastHoveredObjectId = objectId;

        context.dispatchEvent({
          type: "hover-changed",
          objectId: objectId ?? null,
        });

        context.queueRender();
      },
      {
        signal: this.connectedSignal,
      }
    );
  }
}
