import type { IBaseElement } from "../IBaseElement";
import { isNodeElement } from "./INodeElement";

export const getParentObject = (element: IBaseElement) => {
  let ancestor = element.getAncestor();

  while (ancestor && !isNodeElement(ancestor)) {
    ancestor = ancestor.getAncestor();
  }

  return ancestor;
};
