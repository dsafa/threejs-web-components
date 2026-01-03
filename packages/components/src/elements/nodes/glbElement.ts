import { Group } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { NodeElement } from "./nodeElement";
import type { Mesh, Object3D } from "three";
import type { MeshElement } from "./meshElement";
import type { GeometryElement } from "../geometry/geometryElement";
import type { BasicMaterialElement } from "../material/basicMaterialElement";
import type { IBaseElement } from "../IBaseElement";

export class GLBElement extends NodeElement<Group> {
  static observedAttributes = ["src"];

  private readonly _loader = new GLTFLoader();

  private readonly _shadowRoot;

  constructor() {
    super(new Group());
    this._shadowRoot = this.attachShadow({ mode: "open" });
  }

  override connectedCallback() {
    super.connectedCallback();

    const context = this.getRootContext();
    if (!context) {
      return;
    }

    this._loader.manager = context.loadingManager;

    this._shadowRoot.innerHTML = "";
  }

  attributeChangedCallback() {
    const src = this.getAttribute("src");
    if (src) {
      this.handleLoadSrc(src);
    }
  }

  private handleLoadSrc(src: string) {
    const context = this.getRootContext();
    if (!context) {
      return;
    }

    const signal = this.connectedSignal;
    this._loader.load(src, (object) => {
      if (signal.aborted) {
        return;
      }

      const node = sceneToElementNodes(object.scene);
      node.element.attach(context, this);

      buildDOM(node);

      this._shadowRoot.appendChild(node.element);
    });
  }
}

const buildDOM = (node: SceneElementNode) => {
  for (const childNode of node.children) {
    node.element.appendChild(childNode.element);
    buildDOM(childNode);
  }
};

interface SceneElementNode {
  element: IBaseElement;
  children: SceneElementNode[];
}

const sceneToElementNodes = (object: Object3D): SceneElementNode => {
  let element: IBaseElement;
  let children: SceneElementNode[] = [];

  switch (object.type) {
    case "Group":
    case "Object3D": {
      element = document.createElement("twc-object3d") as IBaseElement;
      break;
    }
    case "Mesh": {
      ({ element, children } = meshToElements(object as Mesh));
      break;
    }
    default:
      throw new Error("Unhandled type " + object.type);
  }

  for (const childObject of object.children) {
    children.push(sceneToElementNodes(childObject));
  }

  return {
    element,
    children,
  };
};

const meshToElements = (mesh: Mesh): SceneElementNode => {
  const meshElement = document.createElement("twc-mesh") as MeshElement;
  meshElement.object.copy(mesh);

  const children = [];

  if (mesh.material && !Array.isArray(mesh.material)) {
    const materialElement = document.createElement(
      "twc-basic-material"
    ) as BasicMaterialElement;
    materialElement.style.color = "white";
    materialElement.material.copy(mesh.material);

    children.push({ element: materialElement, children: [] });
  }

  if (mesh.geometry) {
    const geometryElement = document.createElement(
      "twc-geometry"
    ) as GeometryElement;
    geometryElement.setGeometry(mesh.geometry);

    children.push({ element: geometryElement, children: [] });
  }

  return {
    element: meshElement,
    children,
  };
};
