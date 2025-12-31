import { Object3D } from "three";
import { BaseElement } from "../baseElement";
import type { INodeElement } from "./INodeElement";
import { getParentObject } from "./nodeUtils";

export abstract class NodeElement<TObjectType extends Object3D = Object3D>
  extends BaseElement
  implements INodeElement
{
  public readonly isNodeElement = true;

  public object: TObjectType;

  constructor(object: TObjectType) {
    super();

    this.object = object;
  }

  override connectedCallback() {
    super.connectedCallback();

    const parent = getParentObject(this);

    if (parent) {
      parent.object.add(this.object);
    }

    this.setAttribute("type", this.object.type);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.object.removeFromParent();
  }
}
