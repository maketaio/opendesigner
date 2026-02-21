import { type Background, backgroundStyle } from "./styles/background";

export type ScreenNode = {
  id: string;
  name: string;
  type: "screen";
  children: string[];
  x: number;
  y: number;
  background: Background;
  width: number;
  height: number;
};

const screenDefaults: Omit<ScreenNode, "id" | "type"> = {
  name: "Screen",
  children: [],
  x: 0,
  y: 0,
  background: { type: "solid", color: { r: 255, g: 255, b: 255, a: 1 } },
  width: 390,
  height: 844,
};

export function createScreen(
  opts: Pick<ScreenNode, "id"> & Partial<Omit<ScreenNode, "id" | "type">>,
): ScreenNode {
  return { type: "screen", ...screenDefaults, ...opts };
}

export function screenStyle(screen: ScreenNode) {
  return [
    backgroundStyle(screen.background),
    `width: ${screen.width}px`,
    `height: ${screen.height}px`,
  ].join("; ");
}
