import { Group } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { NodeElement } from "./nodeElement";
import type { Mesh, Object3D } from "three";
import type { MeshElement } from "./meshElement";
import type { GeometryElement } from "../geometry/geometryElement";
import type { BasicMaterialElement } from "../material/basicMaterialElement";
import type { IBaseElement } from "../IBaseElement";
import type { INodeElement } from "./INodeElement";
import type { StandardMaterialElement } from "../material/standardMaterialElement";
import { adoptKeyframes, invokeCommandOnTarget } from "./nodeUtils";

const template = `<slot/>`;

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

    this._shadowRoot.innerHTML = template;

    adoptKeyframes(this, this._shadowRoot);

    const context = this.getRootContext();
    if (!context) {
      return;
    }

    this._loader.manager = context.loadingManager;
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

      const partList = node.element.getAttribute("part")?.split(" ") ?? [];
      partList.push("root");
      node.element.setAttribute("part", partList.join(" "));

      this._shadowRoot.appendChild(node.element);

      const styles = new CSSStyleSheet();
      buildDOM(node, styles);
      this._shadowRoot.adoptedStyleSheets.push(styles);

      invokeCommandOnTarget(this);
    });
  }
}

const buildDOM = (node: SceneElementNode, cssRules: CSSStyleSheet) => {
  for (const rule of node.cssRules) {
    cssRules.insertRule(rule);
  }

  for (const childNode of node.children) {
    node.element.appendChild(childNode.element);
    buildDOM(childNode, cssRules);
  }
};

interface SceneElementNode {
  element: IBaseElement;
  children: SceneElementNode[];
  cssRules: string[];
}

const sceneToElementNodes = (object: Object3D): SceneElementNode => {
  let element: INodeElement;
  let children: SceneElementNode[] = [];
  let cssRules: string[] = [];

  switch (object.type) {
    case "Group": {
      element = document.createElement("twc-group") as INodeElement;
      element.object.copy(object, false);
      break;
    }
    case "PerspectiveCamera":
    case "Object3D": {
      element = document.createElement("twc-object3d") as INodeElement;
      element.object.copy(object, false);
      break;
    }
    case "Mesh": {
      ({ element, children, cssRules } = meshToElements(object as Mesh));
      break;
    }
    default:
      throw new Error("Unhandled type " + object.type);
  }

  const parts = [`Type-${element.object.type}`, element.object.name].filter(
    Boolean
  );
  element.setAttribute("part", parts.join(" "));

  element.object.castShadow = true;
  element.object.receiveShadow = true;

  for (const childObject of object.children) {
    children.push(sceneToElementNodes(childObject));
  }

  return {
    element,
    children,
    cssRules,
  };
};

const materialStyleTemplate = "twc-mesh[three-id='$id']{color:$color;}";

const meshToElements = (mesh: Mesh) => {
  const meshElement = document.createElement("twc-mesh") as MeshElement;
  meshElement.object.copy(mesh, false);

  const children: SceneElementNode[] = [];
  const cssRules: string[] = [];

  if (mesh.material && !Array.isArray(mesh.material)) {
    if (mesh.material.type === "MeshBasicMaterial") {
      const materialElement = document.createElement(
        "twc-basic-material"
      ) as BasicMaterialElement;
      materialElement.material.copy(mesh.material);

      cssRules.push(
        materialStyleTemplate
          .replace(
            "$color",
            "#" + materialElement.material.color.getHexString()
          )
          .replace("$id", meshElement.object.id.toString())
      );

      children.push({ element: materialElement, children: [], cssRules: [] });
    } else if (mesh.material.type === "MeshStandardMaterial") {
      const materialElement = document.createElement(
        "twc-standard-material"
      ) as StandardMaterialElement;
      materialElement.material.copy(mesh.material);

      cssRules.push(
        materialStyleTemplate
          .replace(
            "$color",
            "#" + materialElement.material.color.getHexString()
          )
          .replace("$id", meshElement.object.id.toString())
      );

      children.push({ element: materialElement, children: [], cssRules: [] });
    }
  }

  if (mesh.geometry) {
    const geometryElement = document.createElement(
      "twc-geometry"
    ) as GeometryElement;
    geometryElement.setGeometry(mesh.geometry);

    children.push({ element: geometryElement, children: [], cssRules: [] });
  }

  return {
    element: meshElement,
    children,
    cssRules,
  };
};
