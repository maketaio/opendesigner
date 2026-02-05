/**
 * Text class - text element.
 */

import type { Point, Bounds } from "./geometry.ts";
import type { Fill, Stroke } from "./styles.ts";
import { colorToCss } from "./styles.ts";
import { CanvasObject } from "./object.ts";

export class Text extends CanvasObject {
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  textAlign: "left" | "center" | "right";
  width: number;
  height: number;

  constructor(props: {
    x: number;
    y: number;
    text: string;
    width?: number;
    height?: number;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: number;
    textAlign?: "left" | "center" | "right";
    name?: string;
    rotation?: number;
    opacity?: number;
    visible?: boolean;
    locked?: boolean;
    fill?: Fill;
    stroke?: Stroke;
  }) {
    super(props);
    this.text = props.text;
    this.width = props.width ?? 200;
    this.height = props.height ?? 50;
    this.fontSize = props.fontSize ?? 16;
    this.fontFamily = props.fontFamily ?? "sans-serif";
    this.fontWeight = props.fontWeight ?? 400;
    this.textAlign = props.textAlign ?? "left";
  }

  protected defaultName(): string {
    return "Text";
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
    if (!this.text) return;

    ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    ctx.textAlign = this.textAlign;
    ctx.textBaseline = "top";

    let textX = 0;
    if (this.textAlign === "center") {
      textX = this.width / 2;
    } else if (this.textAlign === "right") {
      textX = this.width;
    }

    if (this.fill) {
      ctx.fillStyle = colorToCss(this.fill.color);
      ctx.fillText(this.text, textX, 0);
    }

    if (this.stroke) {
      ctx.strokeStyle = colorToCss(this.stroke.color);
      ctx.lineWidth = this.stroke.width;
      ctx.strokeText(this.text, textX, 0);
    }
  }

  clone(): Text {
    const text = new Text({
      x: this.x,
      y: this.y,
      text: this.text,
      width: this.width,
      height: this.height,
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,
      fontWeight: this.fontWeight,
      textAlign: this.textAlign,
      name: this.name,
      rotation: this.rotation,
      opacity: this.opacity,
      visible: this.visible,
      locked: this.locked,
      fill: this.fill,
      stroke: this.stroke,
    });
    text.id = this.id;
    text.order = this.order;
    return text;
  }
}
