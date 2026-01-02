import { RendererElement } from "./elements/rendererElement";
import { OutputElement } from "./elements/outputElement";
import { GeometryElement } from "./elements/geometry/geometryElement";
import { BoxGeometryElement } from "./elements/geometry/boxGeometryElement";
import { BasicMaterialElement } from "./elements/material/basicMaterialElement";
import { SceneElement } from "./elements/nodes/sceneElement";
import { Object3dElement } from "./elements/nodes/object3dElement";
import { MeshElement } from "./elements/nodes/meshElement";
import { HtmlNodeElement } from "./elements/nodes/htmlElement";
import { PerspectiveCameraElement } from "./elements/nodes/perspectiveCameraElement";
import { CameraControlsElement } from "./elements/cameraControlsElement";

export const install = () => {
  const components: [string, typeof HTMLElement][] = [
    ["twc-renderer", RendererElement],
    ["twc-scene", SceneElement],
    ["twc-output", OutputElement],
    ["twc-object3d", Object3dElement],
    ["twc-mesh", MeshElement],
    ["twc-html", HtmlNodeElement],
    ["twc-geometry", GeometryElement],
    ["twc-box-geometry", BoxGeometryElement],
    ["twc-perspective-camera", PerspectiveCameraElement],
    ["twc-camera-controls", CameraControlsElement],
    ["twc-basic-material", BasicMaterialElement],
  ];

  for (const [name, element] of components) {
    window.customElements.define(name, element);
  }
};
