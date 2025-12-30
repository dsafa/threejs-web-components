import { RendererElement } from "./elements/rendererElement";

export const install = () => {
  window.customElements.define("twc-renderer", RendererElement);
};
