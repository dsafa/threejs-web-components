import { BaseElement } from "../baseElement";
import { getParentObject } from "../nodes/nodeUtils";
import { Material, type Mesh } from "three";

const styleProperties = ["visibility", "opacity"];

export class MaterialElement<
  TMaterial extends Material = Material
> extends BaseElement {
  protected target: Mesh | null = null;

  public material: TMaterial;

  constructor(material: TMaterial) {
    super();
    this.material = material;
  }

  override connectedCallback() {
    super.connectedCallback();

    const parentObject = getParentObject(this);

    if (parentObject && parentObject.object.type === "Mesh") {
      this.target = parentObject.object as Mesh;
      this.target.material = this.material;
    } else {
      console.warn("Material not attach to mesh");
    }

    this.setAttribute("name", this.material.name);
    this.setAttribute("type", this.material.type);
  }

  override disconnectedCallback() {
    this.target = null;
  }

  override getObservedStyles() {
    return styleProperties;
  }

  override onStyleChange(property: string, value: string) {
    switch (property) {
      case "visibility": {
        this.material.visible = value === "visible";
        break;
      }
      case "opacity": {
        this.material.opacity = Number.parseFloat(value);
        this.material.transparent = this.material.opacity !== 1;
        this.material.needsUpdate = true;
        break;
      }

      default:
        break;
    }
  }
}
