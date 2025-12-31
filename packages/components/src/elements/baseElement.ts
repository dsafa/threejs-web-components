import type { Context } from "../core/context";
import { Accessor } from "./elementUtils";
import type { IBaseElement } from "./IBaseElement";

export class BaseElement extends HTMLElement implements IBaseElement {
  public readonly isBaseElement = true;

  private _accessor: Accessor;

  private _abortController = new AbortController();

  constructor() {
    super();

    this._accessor = new Accessor(this);
  }

  protected get connectedSignal() {
    return this._abortController.signal;
  }

  connectedCallback() {
    this._abortController = new AbortController();
  }

  disconnectedCallback() {
    this._accessor.clear();
    this._abortController.abort();
  }

  public getRootContext(): Context | null {
    return this._accessor.getRootContext();
  }

  public getAncestor(): IBaseElement | null {
    return this._accessor.getAncestor();
  }
}
