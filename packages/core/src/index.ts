// Types
export type { Point, Bounds } from "./primitives/geometry.ts";
export type { Color, Fill, Stroke } from "./primitives/styles.ts";
export type { PathSegment } from "./primitives/path.ts";

// Object classes
export { CanvasObject } from "./primitives/object.ts";
export { Rect } from "./primitives/rect.ts";
export { Ellipse } from "./primitives/ellipse.ts";
export { Path } from "./primitives/path.ts";
export { Text } from "./primitives/text.ts";
export { Group } from "./primitives/group.ts";

// Style utilities
export { hexToColor, colorToCss } from "./primitives/styles.ts";

// Document
export { Document } from "./primitives/document.ts";

// Commands
export {
  Command,
  MoveCommand,
  ResizeCommand,
  RotateCommand,
  AddCommand,
  RemoveCommand,
  GroupCommand,
  UngroupCommand,
  MovePathPointCommand,
  CompositeCommand,
} from "./commands/index.ts";

// Editor
export { Editor, type HitTestResult } from "./editor.ts";
