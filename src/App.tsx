import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  useCallback,
} from "react";
import {
  Editor,
  Rect,
  Ellipse,
  Path,
  Text,
  AddCommand,
  hexToColor,
} from "@opendesigner/core";

function createDemoEditor(canvas: HTMLCanvasElement) {
  const editor = new Editor({ canvas });

  editor.apply(
    new AddCommand(
      new Rect({
        x: 50,
        y: 50,
        width: 200,
        height: 150,
        name: "Blue Rectangle",
        fill: { type: "solid", color: hexToColor("#3b82f6") },
        stroke: { color: hexToColor("#1d4ed8"), width: 2 },
      }),
    ),
  );

  editor.apply(
    new AddCommand(
      new Rect({
        x: 300,
        y: 80,
        width: 180,
        height: 120,
        cornerRadius: 20,
        name: "Red Rounded Rect",
        fill: { type: "solid", color: hexToColor("#ef4444") },
      }),
    ),
  );

  editor.apply(
    new AddCommand(
      new Ellipse({
        x: 100,
        y: 280,
        radiusX: 100,
        radiusY: 60,
        name: "Green Ellipse",
        fill: { type: "solid", color: hexToColor("#22c55e") },
        stroke: { color: hexToColor("#15803d"), width: 3 },
      }),
    ),
  );

  editor.apply(
    new AddCommand(
      new Rect({
        x: 150,
        y: 200,
        width: 200,
        height: 200,
        name: "Purple Transparent",
        fill: { type: "solid", color: { r: 153, g: 51, b: 204, a: 0.5 } },
        opacity: 0.8,
      }),
    ),
  );

  editor.apply(
    new AddCommand(
      new Rect({
        x: 450,
        y: 250,
        width: 150,
        height: 80,
        name: "Rotated Orange",
        fill: { type: "solid", color: hexToColor("#f97316") },
        rotation: Math.PI / 6,
      }),
    ),
  );

  editor.apply(
    new AddCommand(
      new Ellipse({
        x: 550,
        y: 50,
        radiusX: 50,
        radiusY: 50,
        name: "Yellow Circle",
        fill: { type: "solid", color: hexToColor("#facc15") },
        stroke: { color: hexToColor("#a16207"), width: 2 },
      }),
    ),
  );

  editor.apply(
    new AddCommand(
      new Rect({
        x: 400,
        y: 400,
        width: 100,
        height: 100,
        name: "Hidden Rectangle",
        fill: { type: "solid", color: hexToColor("#000000") },
        visible: false,
      }),
    ),
  );

  editor.apply(
    new AddCommand(
      new Rect({
        x: 350,
        y: 380,
        width: 120,
        height: 80,
        cornerRadius: 8,
        name: "Stroke Only",
        stroke: { color: hexToColor("#6366f1"), width: 4 },
      }),
    ),
  );

  editor.apply(
    new AddCommand(
      new Ellipse({
        x: 500,
        y: 380,
        radiusX: 70,
        radiusY: 40,
        name: "Rotated Ellipse",
        fill: { type: "solid", color: hexToColor("#ec4899") },
        rotation: -Math.PI / 4,
      }),
    ),
  );

  editor.apply(
    new AddCommand(
      Path.line({
        x: 700,
        y: 100,
        endX: 850,
        endY: 200,
        name: "Diagonal Line",
        stroke: { color: hexToColor("#0891b2"), width: 3 },
      }),
    ),
  );

  editor.apply(
    new AddCommand(
      new Path({
        x: 700,
        y: 250,
        segments: [
          { type: "move", x: 50, y: 0 },
          { type: "line", x: 100, y: 100 },
          { type: "line", x: 0, y: 100 },
          { type: "close" },
        ],
        closed: true,
        name: "Triangle Path",
        fill: { type: "solid", color: hexToColor("#84cc16") },
        stroke: { color: hexToColor("#4d7c0f"), width: 2 },
      }),
    ),
  );

  editor.apply(
    new AddCommand(
      new Path({
        x: 820,
        y: 250,
        segments: [
          { type: "move", x: 50, y: 20 },
          { type: "cubic", cp1x: 50, cp1y: 0, cp2x: 0, cp2y: 0, x: 0, y: 40 },
          {
            type: "cubic",
            cp1x: 0,
            cp1y: 80,
            cp2x: 50,
            cp2y: 80,
            x: 50,
            y: 100,
          },
          {
            type: "cubic",
            cp1x: 50,
            cp1y: 80,
            cp2x: 100,
            cp2y: 80,
            x: 100,
            y: 40,
          },
          {
            type: "cubic",
            cp1x: 100,
            cp1y: 0,
            cp2x: 50,
            cp2y: 0,
            x: 50,
            y: 20,
          },
        ],
        closed: true,
        name: "Curved Path",
        fill: { type: "solid", color: hexToColor("#f43f5e") },
      }),
    ),
  );

  editor.apply(
    new AddCommand(
      new Text({
        x: 700,
        y: 50,
        text: "Hello Canvas!",
        fontSize: 24,
        fontFamily: "system-ui, sans-serif",
        fontWeight: 600,
        name: "Title Text",
        fill: { type: "solid", color: hexToColor("#1e293b") },
      }),
    ),
  );

  editor.apply(
    new AddCommand(
      new Text({
        x: 700,
        y: 400,
        text: "Shapes Demo",
        fontSize: 18,
        textAlign: "left",
        name: "Subtitle",
        fill: { type: "solid", color: hexToColor("#64748b") },
      }),
    ),
  );

  editor.undoStack = [];

  return editor;
}

function useEditor(editor: Editor | null) {
  const canUndo = useSyncExternalStore(
    editor?.subscribe ?? (() => () => {}),
    () => editor?.canUndo() ?? false,
  );
  const canRedo = useSyncExternalStore(
    editor?.subscribe ?? (() => () => {}),
    () => editor?.canRedo() ?? false,
  );
  const selectedCount = useSyncExternalStore(
    editor?.subscribe ?? (() => () => {}),
    () => editor?.selectedIds.size ?? 0,
  );

  return { canUndo, canRedo, selectedCount };
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [editor, setEditor] = useState<Editor | null>(null);

  useEffect(() => {
    if (canvasRef.current && !editor) {
      const newEditor = createDemoEditor(canvasRef.current);
      newEditor.render();
      setEditor(newEditor);
    }
    return () => editor?.destroy();
  }, [editor]);

  useEffect(() => {
    const handleResize = () => {
      if (editor) {
        editor.updateCanvasSize();
        editor.render();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [editor]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editor) return;

      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        editor.undo();
      }

      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z") ||
        ((e.ctrlKey || e.metaKey) && e.key === "y")
      ) {
        e.preventDefault();
        editor.redo();
      }

      if (e.key === "Escape") {
        if (editor.editingPathId) {
          editor.exitPathEditMode();
        } else if (editor.enteredGroupId) {
          editor.exitGroup();
        } else {
          editor.clearSelection();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editor]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!editor) return;

      const rect = canvasRef.current!.getBoundingClientRect();
      const screenPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const hit = editor.hitTest(screenPoint);

      if (hit.type === "object") {
        if (e.shiftKey) {
          editor.toggleSelection(hit.objectId);
        } else {
          editor.selectOnly(hit.objectId);
        }
      } else if (hit.type === "canvas") {
        editor.clearSelection();
      }
    },
    [editor],
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!editor) return;

      const rect = canvasRef.current!.getBoundingClientRect();
      const screenPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const hit = editor.hitTest(screenPoint);

      if (hit.type === "object") {
        const obj = editor.get(hit.objectId);
        if (obj instanceof Path) {
          editor.enterPathEditMode(hit.objectId);
        }
      }
    },
    [editor],
  );

  const { canUndo, canRedo, selectedCount } = useEditor(editor);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 10,
          display: "flex",
          gap: 8,
          background: "white",
          padding: 8,
          borderRadius: 4,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <button
          onClick={() => editor?.undo()}
          disabled={!canUndo}
          style={{ padding: "4px 12px" }}
        >
          Undo
        </button>
        <button
          onClick={() => editor?.redo()}
          disabled={!canRedo}
          style={{ padding: "4px 12px" }}
        >
          Redo
        </button>
        <span style={{ padding: "4px 8px", color: "#666" }}>
          Selected: {selectedCount}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

export default App;
