import { Camera, Clock, Scene, Vector2, WebGLRenderer } from "three";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
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
  "hover-changed": {
    objectId: number | null;
  };
  "object-selected-changed": {
    objectId: number | null;
  };
  "on-object-click": {
    objectId: number;
  };
}

export class Context extends Dispatcher<EventMap> {
  private _renderer?: WebGLRenderer;

  private _scene?: Scene;

  private _activeCamera?: Camera;

  private _animationFrame: number | null = null;

  private _clock = new Clock();

  private _tempVec2 = new Vector2();

  private _willRender = 0;

  private _hoveredObjectId: number | null = null;

  private _selectedObjectId: number | null = null;

  private _cssRenderer?: CSS2DRenderer;

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

  public get hoveredObjectId() {
    return this._hoveredObjectId;
  }

  public set hoveredObjectId(value: number | null) {
    if (this._hoveredObjectId === value) {
      return;
    }

    this.dispatchEvent({ type: "hover-changed", objectId: value });
  }

  public get selectedObjectId() {
    return this._selectedObjectId;
  }

  public set selectedObjectId(value: number | null) {
    if (this._selectedObjectId === value) {
      return;
    }

    this.dispatchEvent({ type: "object-selected-changed", objectId: value });
  }

  public size() {
    this._renderer?.getSize(this._tempVec2);

    return { width: this._tempVec2.x, height: this._tempVec2.height };
  }

  public createRenderer(
    canvasElement: HTMLCanvasElement,
    containerElement: HTMLElement
  ) {
    if (this._renderer) {
      throw new Error("Renderer already exists");
    }

    this._renderer = new WebGLRenderer({
      canvas: canvasElement,
      antialias: true,
    });

    this._cssRenderer = new CSS2DRenderer({ element: containerElement });

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
    this._cssRenderer?.setSize(width, height);
    this.dispatchEvent({ type: "size-changed", width, height });
  }

  public setActiveCamera(camera: Camera) {
    this._activeCamera = camera;
    this.queueRender();
    this.dispatchEvent({ type: "active-camera-changed" });
  }

  public queueRender(force = true) {
    if (this._animationFrame == null) {
      this._clock.start();
      this._willRender = force ? 10 : 0;
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

    let didUpdate = this._willRender > 0;
    const renderStartInfo = {
      type: "render-start",
      delta,
      markUpdated: () => {
        didUpdate = true;
      },
    } as const;

    this.dispatchEvent(renderStartInfo);

    this._animationFrame = null;
    this._willRender--;

    if (didUpdate) {
      this._renderer.render(this._scene, this._activeCamera);
      this._cssRenderer?.render(this._scene, this._activeCamera);

      this.queueRender(this._willRender > 0);
    } else {
      this._clock.stop();
    }
  }
}
