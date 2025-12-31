import { Matrix4, Object3D } from "three";
import { BaseElement } from "../baseElement";
import type { INodeElement } from "./INodeElement";
import { getParentObject } from "./nodeUtils";
import { createStyleObserver } from "../styleObserver";

const styleProperties = ["transform"];

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

    createStyleObserver({
      element: this,
      properties: styleProperties,
      onUpdate: this.onStyleChange.bind(this),
      signal: this.connectedSignal,
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.object.removeFromParent();
  }

  protected onStyleChange(property: string, value: string) {
    switch (property) {
      case "transform": {
        parseTransform(value, this.object.matrix);
        this.object.matrix.decompose(
          this.object.position,
          this.object.quaternion,
          this.object.scale
        );
        break;
      }
      default:
        break;
    }
  }
}

const parseTransform = (transformString: string, matrix: Matrix4) => {
  if (!transformString.startsWith("matrix")) {
    matrix.identity();
    return;
  }

  let matrixArray = transformString
    .split("(")[1]
    .split(")")[0]
    .split(",")
    .map((value) => Number.parseFloat(value.trim()));

  if (matrixArray.length === 6) {
    matrixArray = [
      // 1
      matrixArray[0],
      matrixArray[1],
      0,
      0,
      //2
      matrixArray[2],
      matrixArray[3],
      0,
      0,
      //3
      0,
      0,
      1,
      0,
      //4
      matrixArray[4],
      matrixArray[5],
      0,
      1,
    ];
  }

  matrix.fromArray(matrixArray);
};
