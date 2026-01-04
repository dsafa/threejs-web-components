import { Matrix4, Object3D, Quaternion, Vector3 } from "three";
import { BaseElement } from "../baseElement";
import type { INodeElement } from "./INodeElement";
import { getParentObject, invokeCommandOnTarget } from "./nodeUtils";

const styleProperties = ["transform"];

const tempMatrix = new Matrix4();

export abstract class NodeElement<TObjectType extends Object3D = Object3D>
  extends BaseElement
  implements INodeElement
{
  public readonly isNodeElement = true;

  public object: TObjectType;

  protected internals;

  private readonly _initial = {
    position: new Vector3(),
    quaternion: new Quaternion(),
    scale: new Vector3(1, 1, 1),
  };

  constructor(object: TObjectType) {
    super();

    this.object = object;
    this.internals = this.attachInternals();
  }

  override connectedCallback() {
    this._initial.position.copy(this.object.position);
    this._initial.quaternion.copy(this.object.quaternion);
    this._initial.scale.copy(this.object.scale);

    super.connectedCallback();

    const parent = getParentObject(this);

    if (parent) {
      parent.object.add(this.object);
    }

    this.setDefaults();

    const context = this.getRootContext();
    if (context) {
      context.addEventListener(
        "hover-changed",
        ({ objectId }) => {
          const isHovered = objectId === this.object.id;
          if (isHovered) {
            this.internals.states.add("hovered");
          } else {
            this.internals.states.delete("hovered");
          }
        },
        { signal: this.connectedSignal }
      );

      context.addEventListener(
        "object-selected-changed",
        ({ objectId }) => {
          const selected = objectId === this.object.id;
          if (selected) {
            this.internals.states.add("selected");
          } else {
            this.internals.states.delete("selected");
          }
        },
        { signal: this.connectedSignal }
      );

      context.addEventListener(
        "on-object-click",
        ({ objectId }) => {
          const isThisObject = objectId === this.object.id;
          if (!isThisObject) {
            return;
          }

          invokeCommandOnTarget(this);
        },
        { signal: this.connectedSignal }
      );
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.object.removeFromParent();
  }

  override onStyleChange(property: string, value: string) {
    switch (property) {
      case "transform": {
        parseTransform(value, this.object.matrix);

        tempMatrix
          .compose(
            this._initial.position,
            this._initial.quaternion,
            this._initial.scale
          )
          .multiply(this.object.matrix)
          .decompose(
            this.object.position,
            this.object.quaternion,
            this.object.scale
          );

        this.object.updateMatrix();

        break;
      }
      default:
        break;
    }
  }

  override getObservedStyles(): string[] {
    return styleProperties;
  }

  private setDefaults() {
    this.setAttribute(
      "position",
      JSON.stringify(this.object.position.toArray())
    );
    this.setAttribute(
      "quaternion",
      JSON.stringify(this.object.quaternion.toArray())
    );
    this.setAttribute("scale", JSON.stringify(this.object.scale.toArray()));
    this.setAttribute("three-id", this.object.id.toString());
    this.setAttribute("type", this.object.type);
    if (this.object.name) {
      this.setAttribute("name", this.object.name);
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
