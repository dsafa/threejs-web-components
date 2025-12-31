import { RendererElement } from "./elements/rendererElement";
import { OutputElement } from "./elements/outputElement";
import { GeometryElement } from "./elements/geometry/geometryElement";
import { SceneElement } from "./elements/nodes/sceneElement";
import { Object3dElement } from "./elements/nodes/object3dElement";
import { MeshElement } from "./elements/nodes/meshElement";
import { PerspectiveCameraElement } from "./elements/nodes/perspectiveCameraElement";
import { CameraControlsElement } from "./elements/cameraControlsElement";

export const install = () => {
  const components: [string, typeof HTMLElement][] = [
    ["twc-renderer", RendererElement],
    ["twc-scene", SceneElement],
    ["twc-output", OutputElement],
    ["twc-object3d", Object3dElement],
    ["twc-mesh", MeshElement],
    ["twc-geometry", GeometryElement],
    ["twc-perspective-camera", PerspectiveCameraElement],
    ["twc-camera-controls", CameraControlsElement],
  ];

  for (const [name, element] of components) {
    window.customElements.define(name, element);
  }
};
