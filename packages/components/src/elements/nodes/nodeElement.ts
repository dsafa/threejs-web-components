import { BaseElement } from "../baseElement";
import { Object3D } from "three";

export abstract class NodeElement<
  TObjectType extends Object3D = Object3D
> extends BaseElement {
  protected object: TObjectType;

  constructor(object: TObjectType) {
    super();

    this.object = object;
  }

  override connectedCallback() {
    super.connectedCallback();
  }
}
