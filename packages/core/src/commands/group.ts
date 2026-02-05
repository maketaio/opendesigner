import { Document } from "../primitives/document.ts";
import { CanvasObject } from "../primitives/object.ts";
import { Group } from "../primitives/group.ts";
import { Command } from "./command.ts";

export class GroupCommand extends Command {
  private group: Group;
  private childIds: string[];
  private removedObjects: CanvasObject[] = [];

  constructor(group: Group, childIds: string[]) {
    super();
    this.group = group;
    this.childIds = childIds;
  }

  apply(doc: Document) {
    this.removedObjects = [];
    for (const id of this.childIds) {
      const obj = doc.get(id);
      if (obj) {
        this.removedObjects.push(obj);
        doc.remove(id);
      }
    }
    doc.add(this.group);
  }

  undo(doc: Document) {
    doc.remove(this.group.id);
    for (const obj of this.removedObjects) {
      doc.add(obj);
    }
  }
}
