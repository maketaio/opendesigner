import {
  type Color,
  type Fill,
  type Hsva,
  hexToColor,
  colorToHex,
  colorToCss,
  colorToHsva,
  hsvaToColor,
  colorEquals,
} from "./fill";

export type Stroke = {
  color: Color;
  width: number;
  style: "solid" | "dashed" | "dotted";
  position: "inside" | "outside" | "center";
};

export type Node = FrameNode;

export type FrameNode = {
  id: string;
  name: string;
  type: "frame";
  parent: string | null;
  order: string;
  styles: FrameStyles;
};

export type FrameStyles = {
  fill: Fill;
  stroke: Stroke;
};

export {
  type Color,
  type Fill,
  type Hsva,
  hexToColor,
  colorToHex,
  colorToCss,
  colorToHsva,
  hsvaToColor,
  colorEquals,
};
