/**
 * Path class - vector path with segments.
 */

import type { Point, Bounds } from "./geometry.ts";
import type { Fill, Stroke } from "./styles.ts";
import { colorToCss } from "./styles.ts";
import { getCornerHandlePositions, pointInBounds } from "./geometry.ts";
import { CanvasObject } from "./object.ts";

export type PathSegment =
  | { type: "move"; x: number; y: number }
  | { type: "line"; x: number; y: number }
  | {
      type: "cubic";
      cp1x: number;
      cp1y: number;
      cp2x: number;
      cp2y: number;
      x: number;
      y: number;
    }
  | { type: "quadratic"; cpx: number; cpy: number; x: number; y: number }
  | { type: "close" };

export class Path extends CanvasObject {
  segments: PathSegment[];
  closed: boolean;

  constructor(props: {
    x: number;
    y: number;
    segments: PathSegment[];
    closed?: boolean;
    name?: string;
    rotation?: number;
    opacity?: number;
    visible?: boolean;
    locked?: boolean;
    fill?: Fill;
    stroke?: Stroke;
  }) {
    super(props);
    this.segments = props.segments;
    this.closed = props.closed ?? false;
  }

  protected defaultName(): string {
    return "Path";
  }

  getBounds(): Bounds {
    if (this.segments.length === 0) {
      return { x: this.x, y: this.y, width: 0, height: 0 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const seg of this.segments) {
      if (seg.type === "close") continue;
      minX = Math.min(minX, seg.x);
      minY = Math.min(minY, seg.y);
      maxX = Math.max(maxX, seg.x);
      maxY = Math.max(maxY, seg.y);

      if (seg.type === "cubic") {
        minX = Math.min(minX, seg.cp1x, seg.cp2x);
        minY = Math.min(minY, seg.cp1y, seg.cp2y);
        maxX = Math.max(maxX, seg.cp1x, seg.cp2x);
        maxY = Math.max(maxY, seg.cp1y, seg.cp2y);
      } else if (seg.type === "quadratic") {
        minX = Math.min(minX, seg.cpx);
        minY = Math.min(minY, seg.cpy);
        maxX = Math.max(maxX, seg.cpx);
        maxY = Math.max(maxY, seg.cpy);
      }
    }

    return {
      x: this.x + minX,
      y: this.y + minY,
      width: Math.max(maxX - minX, 1),
      height: Math.max(maxY - minY, 1),
    };
  }

  containsPoint(point: Point): boolean {
    if (!this.visible) return false;
    const local = this.transformToLocal(point);
    const bounds = this.getBounds();

    return (
      local.x >= bounds.x - this.x &&
      local.x <= bounds.x - this.x + bounds.width &&
      local.y >= bounds.y - this.y &&
      local.y <= bounds.y - this.y + bounds.height
    );
  }

  getHandlePositions(handleSize: number): Bounds[] {
    // Path uses point handles in edit mode, corner handles otherwise
    return getCornerHandlePositions(this.getBounds(), handleSize);
  }

  getPointHandlePositions(handleSize: number): Bounds[] {
    const half = handleSize / 2;
    const handles: Bounds[] = [];

    for (const segment of this.segments) {
      if (segment.type === "close") continue;
      handles.push({
        x: this.x + segment.x - half,
        y: this.y + segment.y - half,
        width: handleSize,
        height: handleSize,
      });
    }

    return handles;
  }

  hitTestPoints(point: Point, handleSize: number): number | null {
    const half = handleSize / 2;

    for (let i = 0; i < this.segments.length; i++) {
      const segment = this.segments[i];
      if (segment.type === "close") continue;

      const bounds: Bounds = {
        x: this.x + segment.x - half,
        y: this.y + segment.y - half,
        width: handleSize,
        height: handleSize,
      };

      if (pointInBounds(point, bounds)) {
        return i;
      }
    }

    return null;
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.segments.length === 0) return;

    ctx.beginPath();

    for (const segment of this.segments) {
      switch (segment.type) {
        case "move":
          ctx.moveTo(segment.x, segment.y);
          break;
        case "line":
          ctx.lineTo(segment.x, segment.y);
          break;
        case "cubic":
          ctx.bezierCurveTo(
            segment.cp1x,
            segment.cp1y,
            segment.cp2x,
            segment.cp2y,
            segment.x,
            segment.y,
          );
          break;
        case "quadratic":
          ctx.quadraticCurveTo(segment.cpx, segment.cpy, segment.x, segment.y);
          break;
        case "close":
          ctx.closePath();
          break;
      }
    }

    if (this.closed) {
      ctx.closePath();
    }

    if (this.fill) {
      ctx.fillStyle = colorToCss(this.fill.color);
      ctx.fill();
    }

    if (this.stroke) {
      ctx.strokeStyle = colorToCss(this.stroke.color);
      ctx.lineWidth = this.stroke.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
  }

  clone(): Path {
    const path = new Path({
      x: this.x,
      y: this.y,
      segments: this.segments.map((s) => ({ ...s })),
      closed: this.closed,
      name: this.name,
      rotation: this.rotation,
      opacity: this.opacity,
      visible: this.visible,
      locked: this.locked,
      fill: this.fill,
      stroke: this.stroke,
    });
    path.id = this.id;
    path.order = this.order;
    return path;
  }

  /**
   * Create a line (path with 2 segments).
   */
  static line(props: {
    x: number;
    y: number;
    endX: number;
    endY: number;
    name?: string;
    stroke?: Stroke;
    rotation?: number;
    opacity?: number;
    visible?: boolean;
    locked?: boolean;
  }): Path {
    const path = new Path({
      x: props.x,
      y: props.y,
      segments: [
        { type: "move", x: 0, y: 0 },
        { type: "line", x: props.endX - props.x, y: props.endY - props.y },
      ],
      closed: false,
      name: props.name ?? "Line",
      stroke: props.stroke,
      rotation: props.rotation,
      opacity: props.opacity,
      visible: props.visible,
      locked: props.locked,
    });
    return path;
  }
}
