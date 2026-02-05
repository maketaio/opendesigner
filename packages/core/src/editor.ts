/**
 * Editor class - the application layer.
 * Orchestrates primitives and commands to provide the final API.
 * Handles selection, rendering, viewport, history, and React integration.
 */

import type { Point } from "./primitives/geometry.ts";
import {
  hitTestRotationZone,
  applyRotationTransform,
} from "./primitives/geometry.ts";
import { Document } from "./primitives/document.ts";
import { Group } from "./primitives/group.ts";
import { Path } from "./primitives/path.ts";
import {
  drawSelectionBox,
  drawHandles,
  SELECTION_COLOR,
} from "./primitives/selection.ts";
import { Command } from "./commands/index.ts";

export type HitTestResult =
  | { type: "object"; objectId: string }
  | { type: "handle"; objectId: string; handleIndex: number }
  | { type: "rotation"; objectId: string }
  | { type: "path-point"; objectId: string; segmentIndex: number }
  | { type: "canvas" };

export class Editor {
  private document: Document;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dpr: number;
  private displayWidth: number = 0;
  private displayHeight: number = 0;
  private maxHistorySize: number;
  private listeners = new Set<() => void>();
  private panX = 0;
  private panY = 0;
  private zoomLevel = 1;
  private zoomLimits = { min: 0.1, max: 10 };

  selectedIds = new Set<string>();
  undoStack: Command[] = [];
  redoStack: Command[] = [];
  enteredGroupId: string | null = null;
  enteredGroupStack: string[] = [];
  editingPathId: string | null = null;
  handleSize: number = 8;

  constructor(options: {
    canvas: HTMLCanvasElement;
    devicePixelRatio?: number;
    maxHistorySize?: number;
  }) {
    this.canvas = options.canvas;
    this.dpr = options.devicePixelRatio ?? window.devicePixelRatio ?? 1;
    this.maxHistorySize = options.maxHistorySize ?? 100;

    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get 2D rendering context");
    }
    this.ctx = ctx;

    this.document = new Document();
    this.updateCanvasSize();
  }

  // Document read access

  get(id: string) {
    return this.document.get(id);
  }

  getObjects() {
    return this.document.getOrderedObjects();
  }

  // Viewport

  get zoom() {
    return this.zoomLevel;
  }

  pan(delta: Point) {
    this.panX += delta.x;
    this.panY += delta.y;
    this.render();
  }

  zoomAt(screenPoint: Point, newZoom: number) {
    const canvasPoint = this.screenToCanvas(screenPoint);
    this.zoomLevel = Math.min(Math.max(newZoom, this.zoomLimits.min), this.zoomLimits.max);
    this.panX = screenPoint.x - canvasPoint.x * this.zoomLevel;
    this.panY = screenPoint.y - canvasPoint.y * this.zoomLevel;
    this.render();
  }

  zoomBy(screenPoint: Point, factor: number) {
    this.zoomAt(screenPoint, this.zoomLevel * factor);
  }

  screenToCanvas(screenPoint: Point): Point {
    return {
      x: (screenPoint.x - this.panX) / this.zoomLevel,
      y: (screenPoint.y - this.panY) / this.zoomLevel,
    };
  }

  canvasToScreen(canvasPoint: Point): Point {
    return {
      x: canvasPoint.x * this.zoomLevel + this.panX,
      y: canvasPoint.y * this.zoomLevel + this.panY,
    };
  }

  // Subscriptions

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  apply(cmd: Command) {
    cmd.apply(this.document);
    this.undoStack.push(cmd);
    this.redoStack = [];

    if (this.undoStack.length > this.maxHistorySize) {
      this.undoStack = this.undoStack.slice(-this.maxHistorySize);
    }

    this.notify();
    this.render();
  }

  undo() {
    const cmd = this.undoStack.pop();
    if (cmd) {
      cmd.undo(this.document);
      this.redoStack.push(cmd);
      this.notify();
      this.render();
    }
  }

  redo() {
    const cmd = this.redoStack.pop();
    if (cmd) {
      cmd.apply(this.document);
      this.undoStack.push(cmd);
      this.notify();
      this.render();
    }
  }

  canUndo() {
    return this.undoStack.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  select(id: string) {
    if (!this.selectedIds.has(id)) {
      this.selectedIds.add(id);
      this.notify();
      this.render();
    }
  }

  deselect(id: string) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
      this.notify();
      this.render();
    }
  }

  selectOnly(id: string) {
    this.selectedIds.clear();
    this.selectedIds.add(id);
    this.notify();
    this.render();
  }

  selectMultiple(ids: string[]) {
    this.selectedIds = new Set(ids);
    this.notify();
    this.render();
  }

  clearSelection() {
    if (this.selectedIds.size > 0) {
      this.selectedIds.clear();
      this.notify();
      this.render();
    }
  }

  toggleSelection(id: string) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
    this.notify();
    this.render();
  }

  enterGroup(groupId: string) {
    const group = this.document.get(groupId);
    if (!(group instanceof Group)) return;

    if (this.enteredGroupId) {
      this.enteredGroupStack.push(this.enteredGroupId);
    }
    this.enteredGroupId = groupId;
    this.selectedIds.clear();
    this.notify();
    this.render();
  }

  exitGroup() {
    if (this.enteredGroupStack.length > 0) {
      this.enteredGroupId = this.enteredGroupStack.pop()!;
    } else {
      this.enteredGroupId = null;
    }
    this.selectedIds.clear();
    this.notify();
    this.render();
  }

  exitAllGroups() {
    this.enteredGroupId = null;
    this.enteredGroupStack = [];
    this.selectedIds.clear();
    this.notify();
    this.render();
  }

  enterPathEditMode(pathId: string) {
    const path = this.document.get(pathId);
    if (!(path instanceof Path)) return;

    this.editingPathId = pathId;
    this.selectedIds = new Set([pathId]);
    this.notify();
    this.render();
  }

  exitPathEditMode() {
    this.editingPathId = null;
    this.notify();
    this.render();
  }

  hitTest(screenPoint: Point): HitTestResult {
    const canvasPoint = this.screenToCanvas(screenPoint);
    const scaledHandleSize = this.handleSize / this.zoomLevel;

    for (const id of this.selectedIds) {
      const obj = this.document.get(id);
      if (!obj || !obj.visible) continue;

      const bounds = obj.getBounds();

      if (hitTestRotationZone(canvasPoint, bounds, scaledHandleSize)) {
        return { type: "rotation", objectId: id };
      }

      if (obj instanceof Path && this.editingPathId === id) {
        const segmentIndex = obj.hitTestPoints(canvasPoint, scaledHandleSize);
        if (segmentIndex !== null) {
          return { type: "path-point", objectId: id, segmentIndex };
        }
      }

      const handles = obj.getHandlePositions(scaledHandleSize);
      for (let i = 0; i < handles.length; i++) {
        const handle = handles[i];
        if (
          canvasPoint.x >= handle.x &&
          canvasPoint.x <= handle.x + handle.width &&
          canvasPoint.y >= handle.y &&
          canvasPoint.y <= handle.y + handle.height
        ) {
          return { type: "handle", objectId: id, handleIndex: i };
        }
      }
    }

    const ordered = this.document.getOrderedObjects();
    for (let i = ordered.length - 1; i >= 0; i--) {
      const obj = ordered[i];
      if (!obj.visible || obj.locked) continue;

      if (obj.containsPoint(canvasPoint)) {
        return { type: "object", objectId: obj.id };
      }
    }

    return { type: "canvas" };
  }

  updateCanvasSize() {
    const rect = this.canvas.getBoundingClientRect();
    this.displayWidth = rect.width;
    this.displayHeight = rect.height;

    this.canvas.width = this.displayWidth * this.dpr;
    this.canvas.height = this.displayHeight * this.dpr;
  }

  render() {
    const { ctx, dpr } = this;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.translate(this.panX, this.panY);
    ctx.scale(this.zoomLevel, this.zoomLevel);

    const orderedObjects = this.document.getOrderedObjects();
    for (const obj of orderedObjects) {
      if (!obj.visible) continue;

      const isInEnteredPath = this.isObjectInEnteredPath(obj.id);

      ctx.save();

      if (this.enteredGroupId && !isInEnteredPath) {
        ctx.globalAlpha = 0.3;
      }

      ctx.translate(obj.x, obj.y);

      if (obj.rotation !== 0) {
        const bounds = obj.getBounds();
        const centerX = bounds.x - obj.x + bounds.width / 2;
        const centerY = bounds.y - obj.y + bounds.height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate(obj.rotation);
        ctx.translate(-centerX, -centerY);
      }

      ctx.globalAlpha *= obj.opacity;
      obj.render(ctx);

      ctx.restore();
    }

    if (this.enteredGroupId) {
      this.renderEnteredGroupIndicator();
    }

    if (this.selectedIds.size > 0) {
      this.renderSelection();
    }
  }

  private renderSelection() {
    const { ctx } = this;
    const lineWidth = 1 / this.zoomLevel;
    const scaledHandleSize = this.handleSize / this.zoomLevel;

    for (const id of this.selectedIds) {
      const obj = this.document.get(id);
      if (!obj || !obj.visible) continue;

      const bounds = obj.getBounds();

      ctx.save();
      applyRotationTransform(ctx, bounds, obj.rotation);

      if (obj instanceof Path && this.editingPathId === obj.id) {
        ctx.strokeStyle = SELECTION_COLOR;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        for (const segment of obj.segments) {
          switch (segment.type) {
            case "move":
              ctx.moveTo(obj.x + segment.x, obj.y + segment.y);
              break;
            case "line":
              ctx.lineTo(obj.x + segment.x, obj.y + segment.y);
              break;
            case "cubic":
              ctx.bezierCurveTo(
                obj.x + segment.cp1x,
                obj.y + segment.cp1y,
                obj.x + segment.cp2x,
                obj.y + segment.cp2y,
                obj.x + segment.x,
                obj.y + segment.y,
              );
              break;
            case "quadratic":
              ctx.quadraticCurveTo(
                obj.x + segment.cpx,
                obj.y + segment.cpy,
                obj.x + segment.x,
                obj.y + segment.y,
              );
              break;
            case "close":
              ctx.closePath();
              break;
          }
        }
        if (obj.closed) ctx.closePath();
        ctx.stroke();
        drawHandles(
          ctx,
          obj.getPointHandlePositions(scaledHandleSize),
          lineWidth,
        );
      } else {
        drawSelectionBox(ctx, bounds, lineWidth);
        drawHandles(ctx, obj.getHandlePositions(scaledHandleSize), lineWidth);
      }

      ctx.restore();
    }
  }

  private isObjectInEnteredPath(objectId: string) {
    if (!this.enteredGroupId) return true;
    if (objectId === this.enteredGroupId) return true;
    return this.enteredGroupStack.includes(objectId);
  }

  private renderEnteredGroupIndicator() {
    if (!this.enteredGroupId) return;

    const group = this.document.get(this.enteredGroupId);
    if (!(group instanceof Group)) return;

    const bounds = group.getBounds();
    const { ctx } = this;
    const lineWidth = 1 / this.zoomLevel;
    const padding = 4 / this.zoomLevel;

    ctx.save();
    applyRotationTransform(ctx, bounds, group.rotation);

    ctx.strokeStyle = SELECTION_COLOR;
    ctx.lineWidth = lineWidth;
    ctx.setLineDash([4 / this.zoomLevel, 4 / this.zoomLevel]);
    ctx.strokeRect(
      bounds.x - padding,
      bounds.y - padding,
      bounds.width + padding * 2,
      bounds.height + padding * 2,
    );
    ctx.setLineDash([]);

    ctx.restore();
  }

  destroy() {
    this.document = new Document();
    this.undoStack = [];
    this.redoStack = [];
    this.selectedIds.clear();
    this.listeners.clear();
  }
}
