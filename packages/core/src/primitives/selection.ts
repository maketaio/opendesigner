/**
 * Selection rendering utilities.
 */

import type { Bounds } from "./geometry.ts";


export const SELECTION_COLOR = "#0ea5e9"; // sky-500
export const HANDLE_FILL = "#ffffff";
export const HANDLE_STROKE = "#0ea5e9";

/**
 * Draw a selection box around bounds.
 */
export function drawSelectionBox(
  ctx: CanvasRenderingContext2D,
  bounds: Bounds,
  lineWidth: number = 1,
) {
  ctx.strokeStyle = SELECTION_COLOR;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash([]);
  ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
}

/**
 * Draw selection handles at the given positions.
 */
export function drawHandles(
  ctx: CanvasRenderingContext2D,
  handles: Bounds[],
  lineWidth: number = 1,
) {
  ctx.fillStyle = HANDLE_FILL;
  ctx.strokeStyle = HANDLE_STROKE;
  ctx.lineWidth = lineWidth;

  for (const handle of handles) {
    ctx.fillRect(handle.x, handle.y, handle.width, handle.height);
    ctx.strokeRect(handle.x, handle.y, handle.width, handle.height);
  }
}
