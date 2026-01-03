import type { Context } from "../core/context";

export interface IBaseElement extends HTMLElement {
  isBaseElement: true;

  getRootContext: () => Context | null;

  getAncestor: () => IBaseElement | null;

  attach: (context: Context, ancestor: IBaseElement) => void;
}

export const isBaseElement = (
  htmlElement: HTMLElement
): htmlElement is IBaseElement => {
  return (htmlElement as IBaseElement).isBaseElement === true;
};
