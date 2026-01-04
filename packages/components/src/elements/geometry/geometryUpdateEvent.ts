import type { BufferGeometry } from "three";

export interface GeometryUpdateEventDetail {
  geometry: BufferGeometry;
}

export interface GeometryUpdateEvent
  extends CustomEvent<GeometryUpdateEventDetail> {}

export const GeometryUpdateEventType = "GeometryUpdate";
