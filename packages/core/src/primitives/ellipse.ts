/**
 * Ellipse class - ellipse/circle shape.
 */

import type { Point, Bounds } from "./geometry.ts";
import type { Fill, Stroke } from "./styles.ts";
import { colorToCss } from "./styles.ts";
import { CanvasObject } from "./object.ts";

export class Ellipse extends CanvasObject {
  radiusX: number;
  radiusY: number;

  constructor(props: {
    x: number;
    y: number;
    radiusX: number;
    radiusY: number;
    name?: string;
    rotation?: number;
    opacity?: number;
    visible?: boolean;
    locked?: boolean;
    fill?: Fill;
    stroke?: Stroke;
  }) {
    super(props);
    this.radiusX = props.radiusX;
    this.radiusY = props.radiusY;
  }

  protected defaultName(): string {
    return "Ellipse";
  }

  getBounds(): Bounds {
    return {
      x: this.x,
      y: this.y,
      width: this.radiusX * 2,
      height: this.radiusY * 2,
    };
  }

  containsPoint(point: Point): boolean {
    if (!this.visible) return false;
    const local = this.transformToLocal(point);

    const cx = this.radiusX;
    const cy = this.radiusY;
    const dx = (local.x - cx) / this.radiusX;
    const dy = (local.y - cy) / this.radiusY;

    return dx * dx + dy * dy <= 1;
  }

  render(ctx: CanvasRenderingContext2D): void {
    const { radiusX, radiusY } = this;

    ctx.beginPath();
    ctx.ellipse(radiusX, radiusY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.closePath();

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

  clone(): Ellipse {
    const ellipse = new Ellipse({
      x: this.x,
      y: this.y,
      radiusX: this.radiusX,
      radiusY: this.radiusY,
      name: this.name,
      rotation: this.rotation,
      opacity: this.opacity,
      visible: this.visible,
      locked: this.locked,
      fill: this.fill,
      stroke: this.stroke,
    });
    ellipse.id = this.id;
    ellipse.order = this.order;
    return ellipse;
  }
}
