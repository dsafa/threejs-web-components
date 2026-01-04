import type { Material } from "three";

export interface MaterialUpdateEventDetail {
  material: Material;
}

export interface MaterialUpdateEvent
  extends CustomEvent<MaterialUpdateEventDetail> {}

export const MaterialUpdateEventType = "MaterialUpdate";
