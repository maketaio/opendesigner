import { Document } from "../primitives/document.ts";
import { CanvasObject } from "../primitives/object.ts";
import { Command } from "./command.ts";

export class RemoveCommand extends Command {
  private object: CanvasObject;

  constructor(object: CanvasObject) {
    super();
    this.object = object;
  }

  apply(doc: Document) {
    doc.remove(this.object.id);
  }

  undo(doc: Document) {
    doc.add(this.object);
  }
}
