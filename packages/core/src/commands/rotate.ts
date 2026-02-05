import type { Point } from "../primitives/geometry.ts";
import { Document } from "../primitives/document.ts";
import { Command } from "./command.ts";

export class RotateCommand extends Command {
  private objectId: string;
  private oldRotation: number;
  private newRotation: number;
  private oldPosition?: Point;
  private newPosition?: Point;

  constructor(
    objectId: string,
    oldRotation: number,
    newRotation: number,
    oldPosition?: Point,
    newPosition?: Point,
  ) {
    super();
    this.objectId = objectId;
    this.oldRotation = oldRotation;
    this.newRotation = newRotation;
    this.oldPosition = oldPosition;
    this.newPosition = newPosition;
  }

  apply(doc: Document) {
    const obj = doc.get(this.objectId);
    if (!obj) return;

    obj.rotation = this.newRotation;
    if (this.newPosition) {
      obj.x = this.newPosition.x;
      obj.y = this.newPosition.y;
    }
  }

  undo(doc: Document) {
    const obj = doc.get(this.objectId);
    if (!obj) return;

    obj.rotation = this.oldRotation;
    if (this.oldPosition) {
      obj.x = this.oldPosition.x;
      obj.y = this.oldPosition.y;
    }
  }
}
