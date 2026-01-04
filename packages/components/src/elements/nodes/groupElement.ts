import { Group } from "three";
import { NodeElement } from "./nodeElement";

export class GroupElement extends NodeElement<Group> {
  constructor(group = new Group()) {
    super(group);
  }
}
