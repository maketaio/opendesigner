/**
 * 2D geometry types and utilities.
 */

export type Point = {
  x: number;
  y: number;
};

export type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Test if a point is inside a bounding box.
 */
export function pointInBounds(point: Point, bounds: Bounds): boolean {
  return (
    point.x >= bounds.x &&
    point.x <= bounds.x + bounds.width &&
    point.y >= bounds.y &&
    point.y <= bounds.y + bounds.height
  );
}

/**
 * Rotate a point around an origin by an angle.
 */
export function rotatePoint(point: Point, origin: Point, angle: number): Point {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  return {
    x: origin.x + dx * cos - dy * sin,
    y: origin.y + dx * sin + dy * cos,
  };
}

/**
 * Get corner handle positions for a bounding box.
 */
export function getCornerHandlePositions(
  bounds: Bounds,
  handleSize: number,
): Bounds[] {
  const half = handleSize / 2;

  return [
    // top-left
    {
      x: bounds.x - half,
      y: bounds.y - half,
      width: handleSize,
      height: handleSize,
    },
    // top-right
    {
      x: bounds.x + bounds.width - half,
      y: bounds.y - half,
      width: handleSize,
      height: handleSize,
    },
    // bottom-left
    {
      x: bounds.x - half,
      y: bounds.y + bounds.height - half,
      width: handleSize,
      height: handleSize,
    },
    // bottom-right
    {
      x: bounds.x + bounds.width - half,
      y: bounds.y + bounds.height - half,
      width: handleSize,
      height: handleSize,
    },
  ];
}

/**
 * Get rotation zone positions (areas outside corners for rotation).
 */
function getRotationZones(
  bounds: Bounds,
  handleSize: number,
  zoneSize: number,
): Bounds[] {
  const offset = handleSize / 2 + 2;

  return [
    // top-left
    {
      x: bounds.x - offset - zoneSize,
      y: bounds.y - offset - zoneSize,
      width: zoneSize,
      height: zoneSize,
    },
    // top-right
    {
      x: bounds.x + bounds.width + offset,
      y: bounds.y - offset - zoneSize,
      width: zoneSize,
      height: zoneSize,
    },
    // bottom-left
    {
      x: bounds.x - offset - zoneSize,
      y: bounds.y + bounds.height + offset,
      width: zoneSize,
      height: zoneSize,
    },
    // bottom-right
    {
      x: bounds.x + bounds.width + offset,
      y: bounds.y + bounds.height + offset,
      width: zoneSize,
      height: zoneSize,
    },
  ];
}

/**
 * Test if a point is in any rotation zone for a bounding box.
 */
export function hitTestRotationZone(
  point: Point,
  bounds: Bounds,
  handleSize: number,
  zoneSize: number = 12,
): boolean {
  const zones = getRotationZones(bounds, handleSize, zoneSize);
  for (const zone of zones) {
    if (pointInBounds(point, zone)) {
      return true;
    }
  }
  return false;
}

/**
 * Apply rotation transform around the center of bounds.
 * Call ctx.save() before and ctx.restore() after.
 */
export function applyRotationTransform(
  ctx: CanvasRenderingContext2D,
  bounds: Bounds,
  rotation: number,
) {
  if (rotation === 0) return;
  const centerX = bounds.x + bounds.width / 2;
  const centerY = bounds.y + bounds.height / 2;
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  ctx.translate(-centerX, -centerY);
}
