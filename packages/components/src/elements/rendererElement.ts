import { Context } from "../core/context";
import { BaseElement } from "./baseElement";

const template = `
<style>
  #root { display: grid; place-content: center; position: relative; width: fit-content; overflow: hidden; }
  #overlay { position: absolute; width: 100%; height: 100%; pointer-events: none; }
  #overlay > * { pointer-events: all; }
</style>
<div id='root'><slot></slot><div id='overlay'/></div>
`;

export class RendererElement extends BaseElement {
  private readonly _rootContext: Context;

  private readonly _shadowRoot;

  constructor() {
    super();

    this._rootContext = new Context();
    this._shadowRoot = this.attachShadow({ mode: "open" });
  }

  override getRootContext() {
    return this._rootContext;
  }

  override connectedCallback() {
    super.connectedCallback();

    this._shadowRoot.innerHTML = template;

    this._rootContext.createCssRenderer(
      this._shadowRoot.getElementById("overlay")!
    );
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
  }
}
