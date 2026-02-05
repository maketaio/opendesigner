/**
 * Color and styling types.
 */

export type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type Fill = {
  type: "solid";
  color: Color;
};

export type Stroke = {
  color: Color;
  width: number;
};

/**
 * Parse a hex color string to a Color object.
 * Supports formats: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
 */
export function hexToColor(hex: string): Color {
  // Remove leading #
  const h = hex.startsWith("#") ? hex.slice(1) : hex;

  let r: number,
    g: number,
    b: number,
    a: number = 1;

  if (h.length === 3) {
    // #RGB
    r = parseInt(h[0] + h[0], 16);
    g = parseInt(h[1] + h[1], 16);
    b = parseInt(h[2] + h[2], 16);
  } else if (h.length === 4) {
    // #RGBA
    r = parseInt(h[0] + h[0], 16);
    g = parseInt(h[1] + h[1], 16);
    b = parseInt(h[2] + h[2], 16);
    a = parseInt(h[3] + h[3], 16) / 255;
  } else if (h.length === 6) {
    // #RRGGBB
    r = parseInt(h.slice(0, 2), 16);
    g = parseInt(h.slice(2, 4), 16);
    b = parseInt(h.slice(4, 6), 16);
  } else if (h.length === 8) {
    // #RRGGBBAA
    r = parseInt(h.slice(0, 2), 16);
    g = parseInt(h.slice(2, 4), 16);
    b = parseInt(h.slice(4, 6), 16);
    a = parseInt(h.slice(6, 8), 16) / 255;
  } else {
    throw new Error(`Invalid hex color format: ${hex}`);
  }

  return { r, g, b, a };
}

/**
 * Convert a Color object to a CSS rgba() string.
 */
export function colorToCss(color: Color) {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
}
