/**
 * Rect class - rectangle shape.
 */

import type { Point, Bounds } from "./geometry.ts";
import type { Fill, Stroke } from "./styles.ts";
import { colorToCss } from "./styles.ts";
import { CanvasObject } from "./object.ts";

export class Rect extends CanvasObject {
  width: number;
  height: number;
  cornerRadius: number;

  constructor(props: {
    x: number;
    y: number;
    width: number;
    height: number;
    cornerRadius?: number;
    name?: string;
    rotation?: number;
    opacity?: number;
    visible?: boolean;
    locked?: boolean;
    fill?: Fill;
    stroke?: Stroke;
  }) {
    super(props);
    this.width = props.width;
    this.height = props.height;
    this.cornerRadius = props.cornerRadius ?? 0;
  }

  protected defaultName(): string {
    return "Rectangle";
  }

  getBounds(): Bounds {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  containsPoint(point: Point): boolean {
    if (!this.visible) return false;
    const local = this.transformToLocal(point);
    return (
      local.x >= 0 &&
      local.x <= this.width &&
      local.y >= 0 &&
      local.y <= this.height
    );
  }

  render(ctx: CanvasRenderingContext2D): void {
    const { width, height, cornerRadius } = this;

    if (cornerRadius > 0) {
      const maxRadius = Math.min(width, height) / 2;
      const r = Math.min(cornerRadius, maxRadius);

      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(width - r, 0);
      ctx.arcTo(width, 0, width, r, r);
      ctx.lineTo(width, height - r);
      ctx.arcTo(width, height, width - r, height, r);
      ctx.lineTo(r, height);
      ctx.arcTo(0, height, 0, height - r, r);
      ctx.lineTo(0, r);
      ctx.arcTo(0, 0, r, 0, r);
      ctx.closePath();
    } else {
      ctx.beginPath();
      ctx.rect(0, 0, width, height);
    }

    if (this.fill) {
      ctx.fillStyle = colorToCss(this.fill.color);
      ctx.fill();
    }

    if (this.stroke) {
      ctx.strokeStyle = colorToCss(this.stroke.color);
      ctx.lineWidth = this.stroke.width;
      ctx.stroke();
    }
  }

  clone(): Rect {
    const rect = new Rect({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      cornerRadius: this.cornerRadius,
      name: this.name,
      rotation: this.rotation,
      opacity: this.opacity,
      visible: this.visible,
      locked: this.locked,
      fill: this.fill,
      stroke: this.stroke,
    });
    rect.id = this.id;
    rect.order = this.order;
    return rect;
  }
}
