import { type Background, backgroundStyle } from "./styles/background";
import {
  type BorderRadius,
  borderRadiusStyle,
  type Borders,
  bordersStyle,
} from "./styles/border";
import { opacityStyle, type Shadow, shadowStyle } from "./styles/effect";
import {
  type Dimensions,
  dimensionsStyle,
  type Layout,
  layoutStyle,
  type Padding,
  paddingStyle,
} from "./styles/layout";

export type FrameNode = {
  id: string;
  name: string;
  type: "frame";
  children: string[];
  background: Background;
  borders: Borders;
  dimensions: Dimensions;
  borderRadius: BorderRadius;
  layout: Layout;
  padding: Padding;
  opacity: number;
  shadow: Shadow;
};

const frameDefaults: Omit<FrameNode, "id" | "type"> = {
  name: "Frame",
  children: [],
  background: { type: "solid", color: { r: 0, g: 0, b: 0, a: 0 } },
  borders: {
    color: { r: 0, g: 0, b: 0, a: 0 },
    style: "solid",
    widths: { top: 0, right: 0, bottom: 0, left: 0 },
  },
  dimensions: { width: { type: "hug" }, height: { type: "hug" } },
  borderRadius: { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 },
  layout: {
    type: "stack",
    direction: "vertical",
    gap: 0,
    align: "start",
    distribute: "start",
  },
  padding: { top: 0, right: 0, bottom: 0, left: 0 },
  opacity: 1,
  shadow: { color: { r: 0, g: 0, b: 0, a: 0 }, x: 0, y: 0, blur: 0, spread: 0 },
};

export function createFrame(
  opts: Pick<FrameNode, "id"> & Partial<Omit<FrameNode, "id" | "type">>,
): FrameNode {
  return { type: "frame", ...frameDefaults, ...opts };
}

export function frameStyle(node: FrameNode) {
  const parts = [
    backgroundStyle(node.background),
    bordersStyle(node.borders),
    borderRadiusStyle(node.borderRadius),
    dimensionsStyle(node.dimensions),
    layoutStyle(node.layout),
    paddingStyle(node.padding),
    opacityStyle(node.opacity),
    shadowStyle(node.shadow),
  ].filter((s) => s !== "");

  return parts.join("; ");
}
