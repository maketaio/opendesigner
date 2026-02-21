import { type Color, colorToCss } from "./styles/color";

export type TextRun = {
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  color: Color;
  lineHeight: number;
  letterSpacing: number;
};

export type TextNode = {
  id: string;
  name: string;
  type: "text";
  content: TextRun[];
  textAlign: "left" | "center" | "right";
};

const textDefaults: Omit<TextNode, "id" | "type"> = {
  name: "Text",
  content: [] as TextRun[],
  textAlign: "left",
};

export const textRunDefaults: Omit<TextRun, "text"> = {
  fontSize: 14,
  fontFamily: "Inter, sans-serif",
  fontWeight: 400,
  color: { r: 9, g: 9, b: 11, a: 1 },
  lineHeight: 1.5,
  letterSpacing: 0,
};

export function createTextRun(
  opts: Pick<TextRun, "text"> & Partial<Omit<TextRun, "text">>,
): TextRun {
  return { ...textRunDefaults, ...opts };
}

export function createText(
  opts: Pick<TextNode, "id"> & Partial<Omit<TextNode, "id" | "type">>,
): TextNode {
  return { type: "text", ...textDefaults, ...opts };
}

export function textRunStyle(run: TextRun) {
  return [
    `font-size: ${run.fontSize}px`,
    `font-family: ${run.fontFamily}`,
    `font-weight: ${run.fontWeight}`,
    `color: ${colorToCss(run.color)}`,
    `line-height: ${run.lineHeight}`,
    `letter-spacing: ${run.letterSpacing}px`,
  ].join("; ");
}

export function textStyle(node: TextNode) {
  return `text-align: ${node.textAlign}`;
}
