import type { Context } from "../core/context";
import { Accessor } from "./elementUtils";
import type { IBaseElement } from "./IBaseElement";

export class BaseElement extends HTMLElement implements IBaseElement {
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

  public getRootContext(): Context | null {
    return this._accessor.getRootContext();
  }

  public getAncestor(): IBaseElement | null {
    return this._accessor.getAncestor();
  }
}
