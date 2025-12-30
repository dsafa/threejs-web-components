import { Scene, WebGLRenderer } from "three";

export class Context {
  private _renderer?: WebGLRenderer;

  private _scene?: Scene;

  constructor() {}

  public get scene() {
    return this._scene;
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
}
