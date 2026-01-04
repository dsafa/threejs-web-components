import { Mesh } from "three";
import { NodeElement } from "./nodeElement";
import {
  GeometryUpdateEventType,
  type GeometryUpdateEvent,
} from "../geometry/geometryUpdateEvent";
import {
  MaterialUpdateEventType,
  type MaterialUpdateEvent,
} from "../material/materialUpdateEvent";

export class MeshElement extends NodeElement<Mesh> {
  constructor(mesh = new Mesh()) {
    super(mesh);
  }

  override connectedCallback() {
    super.connectedCallback();

    this.addEventListener(
      GeometryUpdateEventType,
      (event) => {
        const geometryEvent = event as GeometryUpdateEvent;
        this.object.geometry = geometryEvent.detail.geometry;
      },
      { signal: this.connectedSignal }
    );

    this.addEventListener(
      MaterialUpdateEventType,
      (event) => {
        const materialEvent = event as MaterialUpdateEvent;
        this.object.material = materialEvent.detail.material;
      },
      { signal: this.connectedSignal }
    );
  }
}
