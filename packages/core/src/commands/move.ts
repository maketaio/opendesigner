import type { Point } from "../primitives/geometry.ts";
import { Document } from "../primitives/document.ts";
import { Command } from "./command.ts";

export class MoveCommand extends Command {
  private objectIds: string[];
  private delta: Point;

  constructor(objectIds: string[], delta: Point) {
    super();
    this.objectIds = objectIds;
    this.delta = delta;
  }

  apply(doc: Document) {
    for (const id of this.objectIds) {
      const obj = doc.get(id);
      if (obj) {
        obj.x += this.delta.x;
        obj.y += this.delta.y;
      }
    }
  }

  undo(doc: Document) {
    for (const id of this.objectIds) {
      const obj = doc.get(id);
      if (obj) {
        obj.x -= this.delta.x;
        obj.y -= this.delta.y;
      }
    }
  }
}
