export type StackDirection = "horizontal" | "vertical";
export type StackAlignment = "start" | "center" | "end";
export type StackDistribution = "start" | "center" | "end" | "space-between";

export type StackLayout = {
  type: "stack";
  direction: StackDirection;
  gap: number;
  align: StackAlignment;
  distribute: StackDistribution;
};

export type Layout = StackLayout;

export type Size =
  | { type: "fixed"; value: number }
  | { type: "hug" }
  | { type: "fill" };

export type Dimensions = {
  width: Size;
  height: Size;
};

export type Padding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

const alignMap: Record<StackAlignment, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
};

const distributeMap: Record<StackDistribution, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  "space-between": "space-between",
};

function sizeToCss(size: Size) {
  if (size.type === "fixed") return `${size.value}px`;
  if (size.type === "hug") return "fit-content";
  return "100%";
}

export function layoutStyle(layout: Layout) {
  if (layout.type === "stack") {
    const direction = layout.direction === "horizontal" ? "row" : "column";
    const parts = [
      "display: flex",
      `flex-direction: ${direction}`,
      `align-items: ${alignMap[layout.align]}`,
      `justify-content: ${distributeMap[layout.distribute]}`,
    ];

    if (layout.gap > 0) {
      parts.push(`gap: ${layout.gap}px`);
    }

    return parts.join("; ");
  }

  return "";
}

export function dimensionsStyle(dimensions: Dimensions) {
  return `width: ${sizeToCss(dimensions.width)}; height: ${sizeToCss(dimensions.height)}`;
}

export function paddingStyle(padding: Padding) {
  if (
    padding.top === 0 &&
    padding.right === 0 &&
    padding.bottom === 0 &&
    padding.left === 0
  ) {
    return "";
  }

  return `padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;
}
