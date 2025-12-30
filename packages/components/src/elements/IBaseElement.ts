import type { Context } from "../core/context";

export interface IBaseElement extends HTMLElement {
  isBaseElement: true;

  getRootContext: () => Context | null;
}

export const isBaseElement = (
  htmlElement: HTMLElement
): htmlElement is IBaseElement => {
  return (htmlElement as IBaseElement).isBaseElement === true;
};
