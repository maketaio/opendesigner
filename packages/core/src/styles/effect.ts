import { type Color, colorToCss } from "./color";

export type Shadow = {
  color: Color;
  x: number;
  y: number;
  blur: number;
  spread: number;
};

export function shadowStyle(shadow: Shadow) {
  if (
    shadow.x === 0 &&
    shadow.y === 0 &&
    shadow.blur === 0 &&
    shadow.spread === 0
  ) {
    return "";
  }

  return `box-shadow: ${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${colorToCss(shadow.color)}`;
}

export function opacityStyle(opacity: number) {
  if (opacity === 1) {
    return "";
  }

  return `opacity: ${opacity}`;
}
