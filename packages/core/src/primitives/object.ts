/**
 * Base CanvasObject class and utilities.
 */

import type { Point, Bounds } from "./geometry.ts";
import type { Fill, Stroke } from "./styles.ts";
import { getCornerHandlePositions } from "./geometry.ts";
import { generateKeyBetween } from "fractional-indexing";

export function generateId(): string {
  return crypto.randomUUID();
}

export abstract class CanvasObject {
  id: string;
  name: string;
  order: string;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  fill?: Fill;
  stroke?: Stroke;

  constructor(props: {
    x: number;
    y: number;
    name?: string;
    rotation?: number;
    opacity?: number;
    visible?: boolean;
    locked?: boolean;
    fill?: Fill;
    stroke?: Stroke;
  }) {
    this.id = generateId();
    this.order = generateKeyBetween(null, null);
    this.x = props.x;
    this.y = props.y;
    this.name = props.name ?? this.defaultName();
    this.rotation = props.rotation ?? 0;
    this.opacity = props.opacity ?? 1;
    this.visible = props.visible ?? true;
    this.locked = props.locked ?? false;
    this.fill = props.fill;
    this.stroke = props.stroke;
  }

  protected abstract defaultName(): string;
  abstract getBounds(): Bounds;
  abstract containsPoint(point: Point): boolean;
  abstract render(ctx: CanvasRenderingContext2D): void;
  abstract clone(): CanvasObject;

  getHandlePositions(handleSize: number): Bounds[] {
    return getCornerHandlePositions(this.getBounds(), handleSize);
  }

  protected transformToLocal(point: Point): Point {
    let x = point.x - this.x;
    let y = point.y - this.y;

    if (this.rotation !== 0) {
      const bounds = this.getBounds();
      const centerX = bounds.x - this.x + bounds.width / 2;
      const centerY = bounds.y - this.y + bounds.height / 2;

      x -= centerX;
      y -= centerY;

      const cos = Math.cos(-this.rotation);
      const sin = Math.sin(-this.rotation);
      const rx = x * cos - y * sin;
      const ry = x * sin + y * cos;

      x = rx + centerX;
      y = ry + centerY;
    }

    return { x, y };
  }
}
