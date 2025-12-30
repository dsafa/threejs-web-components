import type { IBaseElement } from "./IBaseElement";
import { Accessor } from "./elementUtils";

export class CanvasElement extends HTMLCanvasElement implements IBaseElement {
  public readonly isBaseElement = true;

  private _accessor: Accessor;

  constructor() {
    super();

    this._accessor = new Accessor(this);
  }

  connectedCallback() {}

  disconnectedCallback() {
    this._accessor.clear();
  }

  public getRootContext() {
    return this._accessor.getRootContext();
  }
}
