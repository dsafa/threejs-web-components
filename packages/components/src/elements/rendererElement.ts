import { Context } from "../core/context";
import { BaseElement } from "./baseElement";

export class RendererElement extends BaseElement {
  private readonly _rootContext: Context;

  constructor() {
    super();

    this._rootContext = new Context();
  }

  override getRootContext() {
    return this._rootContext;
  }

  override connectedCallback() {
    super.connectedCallback();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
  }
}
