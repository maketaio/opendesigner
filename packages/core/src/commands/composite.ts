import { Document } from "../primitives/document.ts";
import { Command } from "./command.ts";

export class CompositeCommand extends Command {
  private commands: Command[];

  constructor(commands: Command[]) {
    super();
    this.commands = commands;
  }

  apply(doc: Document) {
    for (const cmd of this.commands) {
      cmd.apply(doc);
    }
  }

  undo(doc: Document) {
    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo(doc);
    }
  }
}
