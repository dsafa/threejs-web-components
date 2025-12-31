import type { Context } from "../core/context";
import { isBaseElement, type IBaseElement } from "./IBaseElement";

export class Accessor {
  private _htmlElement;

  // Undefined if not cached
  private _context: Context | null | undefined = undefined;

  private _ancestor: IBaseElement | null | undefined = undefined;

  constructor(htmlElement: HTMLElement) {
    this._htmlElement = htmlElement;
  }

  public clear() {
    this._context = undefined;
    this._ancestor = undefined;
  }

  public getRootContext(): Context | null {
    if (this._context !== undefined) {
      return this._context;
    }

    const ancestor = this.getAncestor();
    if (!ancestor) {
      return null;
    }

    return ancestor.getRootContext();
  }

  public getAncestor(): IBaseElement | null {
    if (this._ancestor !== undefined) {
      return this._ancestor;
    }

    let parentElement: HTMLElement | null = this._htmlElement.parentElement;
    while (parentElement != null && !isBaseElement(parentElement)) {
      parentElement = parentElement.parentElement;
    }

    this._ancestor = parentElement;

    return this._ancestor;
  }
}
