import type { Bounds } from "../primitives/geometry.ts";
import { Document } from "../primitives/document.ts";
import { Rect } from "../primitives/rect.ts";
import { Ellipse } from "../primitives/ellipse.ts";
import { Text } from "../primitives/text.ts";
import { Command } from "./command.ts";

export class ResizeCommand extends Command {
  private objectId: string;
  private oldBounds: Bounds;
  private newBounds: Bounds;

  constructor(objectId: string, oldBounds: Bounds, newBounds: Bounds) {
    super();
    this.objectId = objectId;
    this.oldBounds = oldBounds;
    this.newBounds = newBounds;
  }

  apply(doc: Document) {
    this.applyBounds(doc, this.newBounds);
  }

  undo(doc: Document) {
    this.applyBounds(doc, this.oldBounds);
  }

  private applyBounds(doc: Document, bounds: Bounds) {
    const obj = doc.get(this.objectId);
    if (!obj) return;

    obj.x = bounds.x;
    obj.y = bounds.y;

    if (obj instanceof Rect || obj instanceof Text) {
      obj.width = bounds.width;
      obj.height = bounds.height;
    } else if (obj instanceof Ellipse) {
      obj.radiusX = bounds.width / 2;
      obj.radiusY = bounds.height / 2;
    }
  }
}
