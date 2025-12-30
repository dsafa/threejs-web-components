import { BaseElement } from "../baseElement";
import { Object3D } from "three";

export abstract class NodeElement<
  TObjectType extends Object3D = Object3D
> extends BaseElement {
  public readonly isNodeElement = true;

  protected object: TObjectType;

  constructor(object: TObjectType) {
    super();

    this.object = object;
  }

  override connectedCallback() {
    super.connectedCallback();

    const parent = this.getParentObject();

    if (parent) {
      parent.object.add(this.object);
    }
  }

  private getParentObject() {
    const ancestor = this.getAncestor();

    if (ancestor && isNodeElement(ancestor)) {
      return ancestor;
    }

    return null;
  }
}

const isNodeElement = (element: HTMLElement): element is NodeElement => {
  return (element as NodeElement).isNodeElement === true;
};
