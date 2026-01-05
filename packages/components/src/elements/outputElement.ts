import { Raycaster, Vector2 } from "three";
import { BaseElement } from "./baseElement";
import type { Context } from "../core/context";

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
