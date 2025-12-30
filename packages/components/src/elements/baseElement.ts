import type { Context } from "../core/context";

export class BaseElement extends HTMLElement {
  public isBaseElement = true;

  private _context: Context | null | undefined = undefined;

  private _ancestor: BaseElement | null | undefined = undefined;

  connectedCallback() {}

  disconnectedCallback() {
    this._context = undefined;
    this._ancestor = undefined;
  }

  protected getContext(): Context | null {
    if (this._context !== undefined) {
      return this._context;
    }

    const ancestor = this.getAncestor();
    if (!ancestor) {
      return null;
    }

    return ancestor.getContext();
  }

  private getAncestor() {
    if (this._ancestor !== undefined) {
      return this._ancestor;
    }

    let parentElement: HTMLElement | null = this.parentElement;
    while (parentElement != null && !isBaseElement(parentElement)) {
      parentElement = parentElement.parentElement;
    }

    this._ancestor = parentElement;

    return this._ancestor;
  }
}

const isBaseElement = (
  htmlElement: HTMLElement
): htmlElement is BaseElement => {
  return (htmlElement as BaseElement).isBaseElement === true;
};
