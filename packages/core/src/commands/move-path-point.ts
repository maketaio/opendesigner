import { Document } from "../primitives/document.ts";
import { Path, type PathSegment } from "../primitives/path.ts";
import { Command } from "./command.ts";

export class MovePathPointCommand extends Command {
  private objectId: string;
  private segmentIndex: number;
  private oldSegment: PathSegment;
  private newSegment: PathSegment;

  constructor(
    objectId: string,
    segmentIndex: number,
    oldSegment: PathSegment,
    newSegment: PathSegment,
  ) {
    super();
    this.objectId = objectId;
    this.segmentIndex = segmentIndex;
    this.oldSegment = oldSegment;
    this.newSegment = newSegment;
  }

  apply(doc: Document) {
    const obj = doc.get(this.objectId);
    if (obj instanceof Path) {
      obj.segments[this.segmentIndex] = this.newSegment;
    }
  }

  undo(doc: Document) {
    const obj = doc.get(this.objectId);
    if (obj instanceof Path) {
      obj.segments[this.segmentIndex] = this.oldSegment;
    }
  }
}
