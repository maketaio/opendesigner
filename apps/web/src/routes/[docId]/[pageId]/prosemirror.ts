import {
  colorToCss,
  createText,
  cssToColor,
  hasParagraphStyleOverrides,
  hasRunStyleOverrides,
  type Paragraph,
  type ParagraphStyle,
  paragraphStyle,
  type ResolvedTypographyStyle,
  resolveParagraphStyle,
  resolveRunStyle,
  type RunStyle,
  runStyle,
  type TextAlign,
  type TextNode,
  type TypographyStyle,
} from "@dashedhq/core";
import {
  type AttributeSpec,
  type Mark,
  type MarkSpec,
  type Node as PMNode,
  Schema,
} from "prosemirror-model";
import { EditorState, Plugin } from "prosemirror-state";
import { Decoration, DecorationSet, type EditorView } from "prosemirror-view";

// -- PM attr types (null = "not set", falls back to node default) --

type RunAttrs = {
  fontSize: number | null;
  fontFamily: string | null;
  fontWeight: number | null;
  color: string | null;
  letterSpacing: number | null;
};

type ParagraphAttrs = {
  lineHeight: number | null;
  textAlign: TextAlign | null;
};

// -- Converters: model <-> PM attrs --

function runStyleToAttrs(run: RunStyle): RunAttrs {
  return {
    fontSize: run.fontSize ?? null,
    fontFamily: run.fontFamily ?? null,
    fontWeight: run.fontWeight ?? null,
    color: run.color ? colorToCss(run.color) : null,
    letterSpacing: run.letterSpacing ?? null,
  };
}

function attrsToRunStyle(attrs: RunAttrs): RunStyle {
  const run: RunStyle = {};
  if (attrs.fontSize !== null) run.fontSize = attrs.fontSize;
  if (attrs.fontFamily !== null) run.fontFamily = attrs.fontFamily;
  if (attrs.fontWeight !== null) run.fontWeight = attrs.fontWeight;
  if (attrs.color !== null) run.color = cssToColor(attrs.color);
  if (attrs.letterSpacing !== null) run.letterSpacing = attrs.letterSpacing;
  return run;
}

function paragraphStyleToAttrs(p: ParagraphStyle): ParagraphAttrs {
  return {
    textAlign: p.textAlign ?? null,
    lineHeight: p.lineHeight ?? null,
  };
}

function attrsToParagraphStyle(attrs: ParagraphAttrs): ParagraphStyle {
  const p: ParagraphStyle = {};
  if (attrs.textAlign !== null) p.textAlign = attrs.textAlign;
  if (attrs.lineHeight !== null) p.lineHeight = attrs.lineHeight;
  return p;
}

function marksToRunStyle(marks: readonly Mark[]): RunStyle {
  const mark = schema.marks.textStyle.isInSet(marks);
  if (!mark) return {};
  return attrsToRunStyle(mark.attrs as RunAttrs);
}

// -- Schema --

const textStyleMark: MarkSpec = {
  attrs: {
    fontSize: { default: null },
    fontFamily: { default: null },
    fontWeight: { default: null },
    color: { default: null },
    letterSpacing: { default: null },
  } satisfies Record<keyof RunAttrs, AttributeSpec>,
  toDOM(mark) {
    return [
      "span",
      { style: runStyle(attrsToRunStyle(mark.attrs as RunAttrs)) },
      0,
    ];
  },
};

export const schema = new Schema({
  nodes: {
    doc: {
      content: "paragraph+",
    },
    paragraph: {
      content: "text*",
      attrs: {
        textAlign: { default: null },
        lineHeight: { default: null },
      } satisfies Record<keyof ParagraphAttrs, AttributeSpec>,
      toDOM(node) {
        return [
          "p",
          {
            style: paragraphStyle(
              attrsToParagraphStyle(node.attrs as ParagraphAttrs),
            ),
          },
          0,
        ];
      },
    },
    text: { inline: true },
  },
  marks: {
    textStyle: textStyleMark,
  },
});

export const selectionHighlightPlugin = new Plugin({
  props: {
    decorations(state) {
      const { from, to, empty } = state.selection;
      if (empty) return DecorationSet.empty;
      return DecorationSet.create(state.doc, [
        Decoration.inline(from, to, {
          style:
            "background-color: color-mix(in oklch, var(--color-blue-500) 30%, transparent)",
        }),
      ]);
    },
  },
});

// -- Model <-> PM document conversion --

export function nodeToDoc(node: TextNode): PMNode {
  if (!node.content.length) {
    throw new Error(
      `Text node ${node.id} - ${node.name} must have at least one paragraph to convert to ProseMirror document!`,
    );
  }

  const pmParagraphs = node.content.map((p) => {
    const inlineContent = p.content.map((run) => {
      const marks = hasRunStyleOverrides(run)
        ? [schema.marks.textStyle.create(runStyleToAttrs(run))]
        : undefined;
      return schema.text(run.text, marks);
    });

    return schema.nodes.paragraph.create(
      paragraphStyleToAttrs(p),
      inlineContent,
    );
  });

  return schema.nodes.doc.create(null, pmParagraphs);
}

export function docToNode(doc: PMNode, base: TextNode): TextNode {
  const content: Paragraph[] = [];

  doc.forEach((child) => {
    if (child.type !== schema.nodes.paragraph) return;

    const paragraph: Paragraph = {
      ...attrsToParagraphStyle(child.attrs as ParagraphAttrs),
      content: [],
    };

    child.forEach((inline) => {
      if (!inline.isText || !inline.text) return;
      paragraph.content.push({
        text: inline.text,
        ...marksToRunStyle(inline.marks),
      });
    });

    content.push(paragraph);
  });

  return createText({
    id: base.id,
    name: base.name,
    content,
    textAlign: base.textAlign,
    lineHeight: base.lineHeight,
    fontSize: base.fontSize,
    fontFamily: base.fontFamily,
    fontWeight: base.fontWeight,
    color: base.color,
    letterSpacing: base.letterSpacing,
  });
}

// -- Active style (selection query) --

export function getActiveTypographyStyle(
  state: EditorState,
  base: TextNode,
): ResolvedTypographyStyle {
  const { $from, from, to, empty } = state.selection;

  if (empty) {
    const marks = state.storedMarks || $from.marks();
    return {
      ...resolveRunStyle([marksToRunStyle(marks)], base),
      ...resolveParagraphStyle(
        [attrsToParagraphStyle($from.parent.attrs as ParagraphAttrs)],
        base,
      ),
    };
  }

  const runStyles: RunStyle[] = [];
  const paragraphStyles: ParagraphStyle[] = [];

  state.doc.nodesBetween(from, to, (node) => {
    if (node.type === schema.nodes.paragraph) {
      paragraphStyles.push(attrsToParagraphStyle(node.attrs as ParagraphAttrs));
    }
    if (node.isText) {
      runStyles.push(marksToRunStyle(node.marks));
    }
  });

  return {
    ...resolveRunStyle(runStyles, base),
    ...resolveParagraphStyle(paragraphStyles, base),
  };
}

// -- Style mutation --

export function setTypographyStyle(
  view: EditorView,
  style: Partial<TypographyStyle>,
) {
  const { state } = view;
  const { $from, from, to, empty } = state.selection;
  const markType = schema.marks.textStyle;
  let tr = state.tr;

  if (hasParagraphStyleOverrides(style)) {
    state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.type !== schema.nodes.paragraph) return;
      const existing = attrsToParagraphStyle(node.attrs as ParagraphAttrs);
      tr = tr.setNodeMarkup(
        pos,
        undefined,
        paragraphStyleToAttrs({ ...existing, ...style }),
      );
    });
  }

  if (!hasRunStyleOverrides(style)) {
    if (tr.docChanged) view.dispatch(tr);
    return;
  }

  if (empty) {
    const existing = marksToRunStyle(state.storedMarks || $from.marks());
    const merged: RunStyle = { ...existing, ...style };

    if (hasRunStyleOverrides(merged)) {
      tr = tr.addStoredMark(markType.create(runStyleToAttrs(merged)));
    } else {
      tr = tr.removeStoredMark(markType);
    }

    view.dispatch(tr);
    return;
  }

  state.doc.nodesBetween(from, to, (node, pos) => {
    if (!node.isText) return;

    const nodeFrom = Math.max(from, pos);
    const nodeTo = Math.min(to, pos + node.nodeSize);
    const existing = marksToRunStyle(node.marks);
    const merged: RunStyle = { ...existing, ...style };

    if (hasRunStyleOverrides(merged)) {
      tr = tr.addMark(
        nodeFrom,
        nodeTo,
        markType.create(runStyleToAttrs(merged)),
      );
    } else {
      tr = tr.removeMark(nodeFrom, nodeTo, markType);
    }
  });

  view.dispatch(tr);
}
