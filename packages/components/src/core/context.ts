import { WebGLRenderer } from "three";

interface Params {
  renderer: WebGLRenderer;
}

export class Context {
  private _renderer?: WebGLRenderer;

  constructor() {}
}
