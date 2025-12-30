import { NodeElement } from "./nodeElement";
import { Object3D } from "three";

export class Object3dElement extends NodeElement {
  constructor() {
    super(new Object3D());
  }
}
