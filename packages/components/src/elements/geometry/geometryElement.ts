import { BufferGeometry } from "three";
import { BaseElement } from "../baseElement";
import { GeometryUpdateEventType } from "./geometryUpdateEvent";

export class GeometryElement extends BaseElement {
  public geometry = new BufferGeometry();

  public setGeometry(geometry: BufferGeometry) {
    this.geometry = geometry;
    this.dispatchUpdateEvent();
    this.getRootContext()?.queueRender();
  }

  protected dispatchUpdateEvent() {
    this.dispatchEvent(
      new CustomEvent(GeometryUpdateEventType, {
        bubbles: true,
        detail: { geometry: this.geometry },
      })
    );
  }
}
