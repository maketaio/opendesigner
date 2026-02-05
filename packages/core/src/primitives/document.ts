/**
 * Document class that owns a collection of canvas objects.
 * This is the data layer - no rendering or UI concerns.
 */

import { CanvasObject, generateId } from "./object.ts";

export class Document {
  id: string;
  name: string;
  objects: Map<string, CanvasObject>;

  constructor(name: string = "Untitled") {
    this.id = generateId();
    this.name = name;
    this.objects = new Map();
  }

  /**
   * Add an object to the document.
   */
  add(obj: CanvasObject): void {
    this.objects.set(obj.id, obj);
  }

  /**
   * Remove an object from the document.
   */
  remove(id: string): CanvasObject | undefined {
    const obj = this.objects.get(id);
    this.objects.delete(id);
    return obj;
  }

  /**
   * Get an object by ID.
   */
  get(id: string): CanvasObject | undefined {
    return this.objects.get(id);
  }

  /**
   * Check if an object exists.
   */
  has(id: string): boolean {
    return this.objects.has(id);
  }

  /**
   * Get all objects sorted by z-order (first = bottom, last = top).
   */
  getOrderedObjects(): CanvasObject[] {
    return Array.from(this.objects.values()).sort((a, b) =>
      a.order.localeCompare(b.order),
    );
  }

  /**
   * Get the number of objects.
   */
  get size(): number {
    return this.objects.size;
  }

  /**
   * Iterate over all objects.
   */
  [Symbol.iterator](): Iterator<CanvasObject> {
    return this.objects.values();
  }
}
