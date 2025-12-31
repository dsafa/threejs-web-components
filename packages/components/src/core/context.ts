import { Camera, Clock, Scene, Vector2, WebGLRenderer } from "three";
import { Dispatcher } from "./dispatcher";

interface EventMap {
  "active-camera-changed": {};
  "render-start": {
    delta: number;
    markUpdated: () => void;
  };
  "size-changed": {
    width: number;
    height: number;
  };
}

export class Context extends Dispatcher<EventMap> {
  private _renderer?: WebGLRenderer;

  private _scene?: Scene;

  private _activeCamera?: Camera;

  private _animationFrame: number | null = null;

  private _clock = new Clock();

  private _tempVec2 = new Vector2();

  constructor() {
    super();
  }

  public get scene() {
    return this._scene;
  }

  public get activeCamera() {
    return this._activeCamera;
  }

  public get canvas() {
    return this._renderer?.domElement;
  }

  public size() {
    this._renderer?.getSize(this._tempVec2);

    return { width: this._tempVec2.x, height: this._tempVec2.height };
  }

  public createRenderer(canvasElement: HTMLCanvasElement) {
    if (this._renderer) {
      throw new Error("Renderer already exists");
    }

    this._renderer = new WebGLRenderer({ canvas: canvasElement });
    return this._renderer;
  }

  public createScene(scene: Scene) {
    if (this._scene) {
      throw new Error("Scene already exists");
    }

    this._scene = scene;
    return this._scene;
  }

  public updateSize(width: number, height: number) {
    this._renderer?.setSize(width, height);
    this.dispatchEvent({ type: "size-changed", width, height });
  }

  public setActiveCamera(camera: Camera) {
    this._activeCamera = camera;
    this.queueRender();
    this.dispatchEvent({ type: "active-camera-changed" });
  }

  public queueRender() {
    if (this._animationFrame == null) {
      this._clock.start();
      this._animationFrame = window.requestAnimationFrame(
        this.onAnimationFrame.bind(this)
      );
    }
  }

  private onAnimationFrame() {
    if (!this._renderer || !this._scene || !this._activeCamera) {
      return;
    }

    const delta = this._clock.getDelta();

    let didUpdate = false;
    const renderStartInfo = {
      type: "render-start",
      delta,
      markUpdated: () => {
        didUpdate = true;
      },
    } as const;

    this.dispatchEvent(renderStartInfo);

    this._animationFrame = null;

    if (didUpdate) {
      this._renderer.render(this._scene, this._activeCamera);

      this.queueRender();
    } else {
      this._clock.stop();
    }
  }
}
