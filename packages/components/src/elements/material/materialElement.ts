import { BaseElement } from "../baseElement";
import { Material } from "three";
import { MaterialUpdateEventType } from "./materialUpdateEvent";

const styleProperties = ["visibility", "opacity"];

export class MaterialElement<
  TMaterial extends Material = Material
> extends BaseElement {
  public material: TMaterial;

  constructor(material: TMaterial) {
    super();
    this.material = material;
  }

  override connectedCallback() {
    super.connectedCallback();

    if (this.material.name) {
      this.setAttribute("name", this.material.name);
    }

    this.setAttribute("type", this.material.type);

    this.dispatchUpdateEvent();
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

  protected dispatchUpdateEvent() {
    this.dispatchEvent(
      new CustomEvent(MaterialUpdateEventType, {
        bubbles: true,
        detail: { material: this.material },
      })
    );
  }
}
