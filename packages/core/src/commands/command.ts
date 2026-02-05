/**
 * Abstract base class for all commands.
 */

import { Document } from "../primitives/document.ts";

export abstract class Command {
  abstract apply(doc: Document): void;
  abstract undo(doc: Document): void;
}
