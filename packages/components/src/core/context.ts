import { Scene, WebGLRenderer } from "three";

interface Params {
  renderer: WebGLRenderer;
}

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

  public createScene() {
    if (this._scene) {
      throw new Error("Scene already exists");
    }

    this._scene = new Scene();
    return this._scene;
  }
}
