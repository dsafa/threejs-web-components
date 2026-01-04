import { NodeElement } from "./nodeElement";
import { Object3D } from "three";

export class Object3dElement extends NodeElement {
  constructor(object3d = new Object3D()) {
    super(object3d);
  }
}
