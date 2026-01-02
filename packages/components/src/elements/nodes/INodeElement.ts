import type { IBaseElement } from "../IBaseElement";
import type { Object3D } from "three";

export interface INodeElement<TObjectType extends Object3D = Object3D>
  extends IBaseElement {
  readonly isNodeElement: true;
  readonly object: TObjectType;
}

export const isNodeElement = (element: Element): element is INodeElement => {
  return (element as INodeElement).isNodeElement === true;
};
