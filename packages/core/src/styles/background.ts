import { type Color, colorToCss } from "./color";

export type GradientStop = {
  offset: number;
  color: string;
};

export type Background =
  | { type: "solid"; color: Color }
  | { type: "gradient"; stops: GradientStop[]; angle: number }
  | { type: "image"; src: string; fit: "cover" | "contain" | "fill" };

export function backgroundStyle(bg: Background) {
  if (bg.type === "solid") {
    return `background-color: ${colorToCss(bg.color)}`;
  }

  if (bg.type === "gradient") {
    const stops = bg.stops
      .map((s) => `${s.color} ${s.offset * 100}%`)
      .join(", ");
    return `background: linear-gradient(${bg.angle}deg, ${stops})`;
  }

  return `background-image: url(${bg.src}); background-size: ${bg.fit}`;
}
