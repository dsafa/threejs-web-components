import { Object3D } from "three";
import { RendererElement } from "./elements/rendererElement";
import { OutputElement } from "./elements/outputElement";
import { SceneElement } from "./elements/nodes/sceneElement";
import { Object3dElement } from "./elements/nodes/object3dElement";

export const install = () => {
  Object3D.DEFAULT_MATRIX_AUTO_UPDATE = false;
  Object3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = false;

  const components: [string, typeof HTMLElement][] = [
    ["twc-renderer", RendererElement],
    ["twc-scene", SceneElement],
    ["twc-output", OutputElement],
    ["twc-object3d", Object3dElement],
  ];

  for (const [name, element] of components) {
    window.customElements.define(name, element);
  }
};
