import {
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
    if (context.activeCamera) {
      this._controls.camera = context.activeCamera as PerspectiveCamera;
    }

    if (context.canvas) {
      this._controls.connect(context.canvas);
    }

    if (context.scene) {
      this._controls.fitToBox(context.scene, true, {
        paddingBottom: 1,
        paddingTop: 1,
      });
      this._controls.rotatePolarTo(1);
    }

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

    const render = () => {
      context.queueRender();
    };

    this._controls.addEventListener("update", render);
    this._controls.addEventListener("wake", render);
    this._controls.addEventListener("controlstart", render);
    this._controls.addEventListener("control", render);
    this._controls.addEventListener("transitionstart", render);
    this._controls.addEventListener("controlend", render);
    this._controls.addEventListener("rest", render);
    this._controls.addEventListener("sleep", render);
    this._controls.addEventListener("rest", render);
  }
}
