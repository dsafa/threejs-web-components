import type { Context } from "../core/context";
import { Accessor } from "./elementUtils";
import type { IBaseElement } from "./IBaseElement";
import { createStyleObserver } from "./styleObserver";

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

    const observedStyles = this.getObservedStyles();

    if (observedStyles.length > 0) {
      createStyleObserver({
        element: this,
        properties: this.getObservedStyles(),
        onUpdate: this.onStyleChange.bind(this),
        signal: this.connectedSignal,
      });
    }
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

  public attach(context: Context, ancestor: IBaseElement) {
    this._accessor.attach(context, ancestor);
  }

  protected onStyleChange(_property: string, _value: string) {}

  protected getObservedStyles(): string[] {
    return [];
  }

  protected getArrayAttribute(name: string) {
    const attribute = this.getAttribute(name);
    if (!attribute) {
      return [];
    }

    try {
      const value = JSON.parse(attribute);
      if (!value) {
        return [];
      }

      if (!Array.isArray(value)) {
        return [];
      }

      return value;
    } catch {
      return [];
    }
  }
}
