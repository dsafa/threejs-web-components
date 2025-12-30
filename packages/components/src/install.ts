import { RendererElement } from "./elements/rendererElement";
import { SceneElement } from "./elements/sceneElement";

export const install = () => {
  const components: [string, typeof HTMLElement][] = [
    ["twc-renderer", RendererElement],
    ["twc-scene", SceneElement],
  ];

  for (const [name, element] of components) {
    window.customElements.define(name, element);
  }
};
