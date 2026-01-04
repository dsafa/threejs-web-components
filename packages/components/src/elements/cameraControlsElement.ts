import {
  Camera,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Spherical,
  Box3,
  PerspectiveCamera,
  Sphere,
  Raycaster,
} from "three";
import CameraControls from "camera-controls";
import { BaseElement } from "./baseElement";
import type { Context } from "../core/context";
import type { NodeElement } from "./nodes/nodeElement";
import { parseCommand } from "../core/command";
import { degToRad } from "three/src/math/MathUtils.js";
import { isNodeElement } from "./nodes/INodeElement";
import { time } from "three/src/nodes/TSL.js";

const subsetOfTHREE = {
  Vector2: Vector2,
  Vector3: Vector3,
  Vector4: Vector4,
  Quaternion: Quaternion,
  Matrix4: Matrix4,
  Spherical: Spherical,
  Box3: Box3,
  Sphere: Sphere,
  Raycaster: Raycaster,
};

CameraControls.install({ THREE: subsetOfTHREE });

export class CameraControlsElement extends BaseElement {
  private readonly _controls = new CameraControls(new PerspectiveCamera());

  private readonly _internals;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  override connectedCallback() {
    super.connectedCallback();

    const context = this.getRootContext();
    if (!context) {
      return;
    }

    this.setup(context, this.connectedSignal);

    context.queueRender();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
  }

  private setup(context: Context, abortSignal: AbortSignal) {
    if (context.canvas) {
      this._controls.connect(context.canvas);
    }

    const radiusAttribute = this.getAttribute("radius");
    let radius = 20;
    if (radiusAttribute) {
      radius = Number.parseFloat(radiusAttribute);
    }

    const target = new Vector3();
    const targetAttribute = this.getArrayAttribute("target");
    if (targetAttribute.length) {
      target.fromArray(targetAttribute);
    }

    this._controls.fitToSphere(new Sphere(target, radius), true);
    this._controls.rotatePolarTo(1);

    context.addEventListener(
      "render-start",
      ({ delta, markUpdated }) => {
        const needsUpdate = this._controls.update(delta);
        if (needsUpdate) {
          markUpdated();
        }
      },
      { signal: abortSignal }
    );

    this.attachCommands(context, abortSignal);
    this.attachControlEvents(context, abortSignal);
    this.attachCamera(context);

    const observer = new MutationObserver(() => {
      this.attachCamera(context);
    });

    observer.observe(this, { childList: true });

    abortSignal.addEventListener(
      "abort",
      () => {
        observer.disconnect();
      },
      { once: true }
    );
  }

  private attachCamera(context: Context) {
    const activeCameraId = this.getAttribute("for");

    const cameraElement = activeCameraId
      ? (this.ownerDocument.getElementById(
          activeCameraId
        ) as NodeElement<PerspectiveCamera>)
      : this.querySelector<NodeElement<PerspectiveCamera>>("[type$=Camera]");

    if (cameraElement) {
      this._controls.camera = cameraElement.object;
      context.setActiveCamera(cameraElement.object);
    }
  }

  private attachControlEvents(context: Context, abortSignal: AbortSignal) {
    let active = false;
    let action = 0;

    const render = () => {
      const states = this._internals.states;

      if (active !== this._controls.active) {
        active = this._controls.active;
        if (active) {
          states.add("active");
        } else {
          states.delete("active");
        }
      }

      if (action !== this._controls.currentAction) {
        action = this._controls.currentAction;
        if (action & CameraControls.ACTION.ROTATE) {
          states.add("rotate");
        } else {
          states.delete("rotate");
        }

        if (action & CameraControls.ACTION.TRUCK) {
          states.add("pan");
        } else {
          states.delete("pan");
        }
      }

      context.queueRender();
    };

    if (context.canvas) {
      let timeout: number = 0;

      context.canvas.addEventListener(
        "wheel",
        (event) => {
          if (timeout) {
            return;
          }

          this._internals.states.add("dolly");
          const direction = event.deltaY > 0 ? "dolly-out" : "dolly-in";
          this._internals.states.add(direction);

          timeout = window.setTimeout(() => {
            timeout = 0;
            this._internals.states.delete("dolly");
            this._internals.states.delete(direction);
          }, 200);
        },
        {
          signal: this.connectedSignal,
          capture: true,
          passive: true,
        }
      );
    }

    this._controls.addEventListener("update", render);
    this._controls.addEventListener("wake", render);
    this._controls.addEventListener("controlstart", render);
    this._controls.addEventListener("control", render);
    this._controls.addEventListener("transitionstart", render);
    this._controls.addEventListener("controlend", render);
    this._controls.addEventListener("rest", render);
    this._controls.addEventListener("sleep", render);
    this._controls.addEventListener("rest", render);

    abortSignal.addEventListener(
      "abort",
      () => {
        this._controls.removeEventListener("update", render);
        this._controls.removeEventListener("wake", render);
        this._controls.removeEventListener("controlstart", render);
        this._controls.removeEventListener("control", render);
        this._controls.removeEventListener("transitionstart", render);
        this._controls.removeEventListener("controlend", render);
        this._controls.removeEventListener("rest", render);
        this._controls.removeEventListener("sleep", render);
        this._controls.removeEventListener("rest", render);
      },
      { once: true }
    );
  }

  private attachCommands(context: Context, abortSignal: AbortSignal) {
    const handleCommand = (event: CommandEvent) => {
      const command = parseCommand(event.command);

      switch (command.name) {
        case "fit": {
          if (
            event.source &&
            event.source instanceof Element &&
            isNodeElement(event.source)
          ) {
            this._controls.fitToSphere(event.source.object, true);
          } else if (context.scene) {
            this._controls.fitToSphere(context.scene, true);
          }

          break;
        }
        case "rotate": {
          if (command.args.azimuth) {
            const value = Number.parseFloat(command.args.azimuth);
            if (Number.isFinite(value)) {
              this._controls.rotate(degToRad(value), 0, true);
            }
          }

          if (command.args.polar) {
            const value = Number.parseFloat(command.args.polar);
            if (Number.isFinite(value)) {
              this._controls.rotate(0, degToRad(value), true);
            }
          }
          break;
        }
        default:
          break;
      }
    };

    this.addEventListener("command", handleCommand, { signal: abortSignal });
  }
}
