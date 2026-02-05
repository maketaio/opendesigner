import { Document } from "../primitives/document.ts";
import { CanvasObject } from "../primitives/object.ts";
import { Group } from "../primitives/group.ts";
import { Command } from "./command.ts";

export class UngroupCommand extends Command {
  private group: Group;
  private restoredObjects: CanvasObject[] = [];

  constructor(group: Group) {
    super();
    this.group = group;
  }

  apply(doc: Document) {
    doc.remove(this.group.id);
    this.restoredObjects = [];
    for (const child of this.group.children) {
      const worldChild = child.clone();
      worldChild.x += this.group.x;
      worldChild.y += this.group.y;
      worldChild.rotation += this.group.rotation;
      worldChild.opacity *= this.group.opacity;
      this.restoredObjects.push(worldChild);
      doc.add(worldChild);
    }
  }

  undo(doc: Document) {
    for (const obj of this.restoredObjects) {
      doc.remove(obj.id);
    }
    doc.add(this.group);
  }
}
