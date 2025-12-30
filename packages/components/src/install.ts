import { TWCRenderer } from "./renderer";

export const install = () => {
  window.customElements.define("twc-renderer", TWCRenderer);
};
