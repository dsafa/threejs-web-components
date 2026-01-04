import { NodeElement } from "./nodeElement";
import { Mesh } from "three";

export class MeshElement extends NodeElement<Mesh> {
  constructor(mesh = new Mesh()) {
    super(mesh);
  }
}
