/**
 * Group class - container for other objects.
 */

import type { Point, Bounds } from "./geometry.ts";
import { rotatePoint, applyRotationTransform } from "./geometry.ts";
import { CanvasObject } from "./object.ts";

export class Group extends CanvasObject {
  children: CanvasObject[];

  constructor(props: {
    x: number;
    y: number;
    children: CanvasObject[];
    name?: string;
    rotation?: number;
    opacity?: number;
    visible?: boolean;
    locked?: boolean;
  }) {
    super(props);
    this.children = props.children;
  }

  protected defaultName(): string {
    return "Group";
  }

  getBounds(): Bounds {
    if (this.children.length === 0) {
      return { x: this.x, y: this.y, width: 0, height: 0 };
    }

    const childrenBounds = this.computeChildrenBounds();
    return {
      x: this.x + childrenBounds.x,
      y: this.y + childrenBounds.y,
      width: childrenBounds.width,
      height: childrenBounds.height,
    };
  }

  private computeChildrenBounds(): Bounds {
    if (this.children.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const child of this.children) {
      const bounds = child.getBounds();

      if (child.rotation !== 0) {
        const corners = [
          { x: bounds.x, y: bounds.y },
          { x: bounds.x + bounds.width, y: bounds.y },
          { x: bounds.x, y: bounds.y + bounds.height },
          { x: bounds.x + bounds.width, y: bounds.y + bounds.height },
        ];

        const center = {
          x: bounds.x + bounds.width / 2,
          y: bounds.y + bounds.height / 2,
        };

        for (const corner of corners) {
          const rotated = rotatePoint(corner, center, child.rotation);
          minX = Math.min(minX, rotated.x);
          minY = Math.min(minY, rotated.y);
          maxX = Math.max(maxX, rotated.x);
          maxY = Math.max(maxY, rotated.y);
        }
      } else {
        minX = Math.min(minX, bounds.x);
        minY = Math.min(minY, bounds.y);
        maxX = Math.max(maxX, bounds.x + bounds.width);
        maxY = Math.max(maxY, bounds.y + bounds.height);
      }
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  containsPoint(point: Point): boolean {
    if (!this.visible) return false;

    let localPoint = {
      x: point.x - this.x,
      y: point.y - this.y,
    };

    if (this.rotation !== 0) {
      const bounds = this.getBounds();
      const centerX = bounds.x - this.x + bounds.width / 2;
      const centerY = bounds.y - this.y + bounds.height / 2;
      localPoint = rotatePoint(
        localPoint,
        { x: centerX, y: centerY },
        -this.rotation,
      );
    }

    for (const child of this.children) {
      if (!child.visible) continue;
      // Adjust point for child's position
      const childPoint = {
        x: localPoint.x + this.x,
        y: localPoint.y + this.y,
      };
      if (child.containsPoint(childPoint)) {
        return true;
      }
    }

    return false;
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const child of this.children) {
      if (!child.visible) continue;

      ctx.save();
      ctx.translate(child.x, child.y);

      if (child.rotation !== 0) {
        const childBounds = child.getBounds();
        const localBounds = {
          x: childBounds.x - child.x,
          y: childBounds.y - child.y,
          width: childBounds.width,
          height: childBounds.height,
        };
        applyRotationTransform(ctx, localBounds, child.rotation);
      }

      ctx.globalAlpha *= child.opacity;
      child.render(ctx);
      ctx.restore();
    }
  }

  clone(): Group {
    const group = new Group({
      x: this.x,
      y: this.y,
      children: this.children.map((c) => c.clone()),
      name: this.name,
      rotation: this.rotation,
      opacity: this.opacity,
      visible: this.visible,
      locked: this.locked,
    });
    group.id = this.id;
    group.order = this.order;
    return group;
  }

  /**
   * Create a group from objects, converting them to local coordinates.
   */
  static fromObjects(objects: CanvasObject[], name: string = "Group"): Group {
    if (objects.length === 0) {
      return new Group({ x: 0, y: 0, children: [], name });
    }

    // Compute union bounds
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const obj of objects) {
      const bounds = obj.getBounds();

      if (obj.rotation !== 0) {
        const corners = [
          { x: bounds.x, y: bounds.y },
          { x: bounds.x + bounds.width, y: bounds.y },
          { x: bounds.x, y: bounds.y + bounds.height },
          { x: bounds.x + bounds.width, y: bounds.y + bounds.height },
        ];

        const center = {
          x: bounds.x + bounds.width / 2,
          y: bounds.y + bounds.height / 2,
        };

        for (const corner of corners) {
          const rotated = rotatePoint(corner, center, obj.rotation);
          minX = Math.min(minX, rotated.x);
          minY = Math.min(minY, rotated.y);
          maxX = Math.max(maxX, rotated.x);
          maxY = Math.max(maxY, rotated.y);
        }
      } else {
        minX = Math.min(minX, bounds.x);
        minY = Math.min(minY, bounds.y);
        maxX = Math.max(maxX, bounds.x + bounds.width);
        maxY = Math.max(maxY, bounds.y + bounds.height);
      }
    }

    // Convert children to group-local coordinates
    const localChildren = objects.map((obj) => {
      const clone = obj.clone();
      clone.x = obj.x - minX;
      clone.y = obj.y - minY;
      return clone;
    });

    return new Group({
      x: minX,
      y: minY,
      children: localChildren,
      name,
    });
  }
}
