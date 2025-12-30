import { RendererElement } from "./elements/rendererElement";
import { SceneElement } from "./elements/sceneElement";
import { OutputElement } from "./elements/outputElement";

export const install = () => {
  const components: [string, typeof HTMLElement][] = [
    ["twc-renderer", RendererElement],
    ["twc-scene", SceneElement],
    ["twc-output", OutputElement],
  ];

  for (const [name, element] of components) {
    window.customElements.define(name, element);
  }
};
