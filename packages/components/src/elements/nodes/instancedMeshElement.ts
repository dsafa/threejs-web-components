import {
  Object3D,
  BufferGeometry,
  InstancedMesh,
  MeshBasicMaterial,
} from "three";
import { NodeElement } from "./nodeElement";
import {
  GeometryUpdateEventType,
  type GeometryUpdateEvent,
} from "../geometry/geometryUpdateEvent";
import {
  MaterialUpdateEventType,
  type MaterialUpdateEvent,
} from "../material/materialUpdateEvent";
import { buffer } from "three/src/nodes/TSL.js";

const INITIAL_MAX_COUNT = 100;

export class InstancedMeshElement extends NodeElement<InstancedMesh> {
  private _updateQueued = false;

  constructor(
    instancedMesh = new InstancedMesh(
      new BufferGeometry(),
      new MeshBasicMaterial(),
      INITIAL_MAX_COUNT
    )
  ) {
    super(instancedMesh);
  }

  override connectedCallback() {
    super.connectedCallback();

    this.addEventListener(
      GeometryUpdateEventType,
      (event) => {
        const geometryEvent = event as GeometryUpdateEvent;
        this.object.geometry = geometryEvent.detail.geometry;
      },
      { signal: this.connectedSignal }
    );

    this.addEventListener(
      MaterialUpdateEventType,
      (event) => {
        const materialEvent = event as MaterialUpdateEvent;
        this.object.material = materialEvent.detail.material;
      },
      { signal: this.connectedSignal }
    );

    this.addEventListener("InstanceMatrixUpdated", () => this.queueUpdate(), {
      signal: this.connectedSignal,
    });

    const mutationObserver = new MutationObserver(() => {
      this.queueUpdate();
    });

    mutationObserver.observe(this, { childList: true });

    this.connectedSignal.addEventListener("abort", () => {
      mutationObserver.disconnect();
    });

    this.update();
  }

  private update() {
    this._updateQueued = false;

    const instanceChildren = Array.from(this.children).filter(
      (c) => c instanceof InstanceElement
    );

    this.object.count = Math.min(instanceChildren.length, INITIAL_MAX_COUNT);

    for (let i = 0; i < instanceChildren.length; i++) {
      this.object.setMatrixAt(i, instanceChildren[i].object.matrix);
    }

    this.object.instanceMatrix.needsUpdate = true;
  }

  public queueUpdate() {
    if (this._updateQueued) {
      return;
    }

    window.queueMicrotask(() => {
      this.update();
    });
  }
}

export class InstanceElement extends NodeElement {
  constructor() {
    super(new Object3D());
    this.object.matrixAutoUpdate = false;
    this.object.matrixWorldAutoUpdate = false;
  }

  override onStyleChange(property: string, value: string) {
    super.onStyleChange(property, value);

    if (property === "transform") {
      this.dispatchEvent(
        new CustomEvent("InstanceMatrixUpdated", { bubbles: true })
      );
    }
  }
}
