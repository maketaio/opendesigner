import {
  type Borders,
  type Color,
  createFrame,
  createScreen,
  createText,
  createTextRun,
  type Document,
  type FrameNode,
  type Page,
  type Size,
} from "@opendesigner/core";

// shadcn/ui zinc palette
const zinc950: Color = { r: 9, g: 9, b: 11, a: 1 };
const zinc500: Color = { r: 113, g: 113, b: 122, a: 1 };
const zinc400: Color = { r: 161, g: 161, b: 170, a: 1 };
const zinc200: Color = { r: 228, g: 228, b: 231, a: 1 };
const zinc100: Color = { r: 244, g: 244, b: 245, a: 1 };
const zinc50: Color = { r: 250, g: 250, b: 250, a: 1 };
const white: Color = { r: 255, g: 255, b: 255, a: 1 };

const allBorders: Borders = {
  color: zinc200,
  style: "solid",
  widths: { top: 1, right: 1, bottom: 1, left: 1 },
};
const bottomBorder: Borders = {
  color: zinc200,
  style: "solid",
  widths: { top: 0, right: 0, bottom: 1, left: 0 },
};

const fixed = (w: number, h: number): Pick<FrameNode, "dimensions"> => ({
  dimensions: {
    width: { type: "fixed", value: w },
    height: { type: "fixed", value: h },
  },
});

const fill: Size = { type: "fill" };
const hug: Size = { type: "hug" };

const hStack = (gap = 0): Pick<FrameNode, "layout"> => ({
  layout: {
    type: "stack",
    direction: "horizontal",
    gap,
    align: "center",
    distribute: "start",
  },
});

const vStack = (gap = 0): Pick<FrameNode, "layout"> => ({
  layout: {
    type: "stack",
    direction: "vertical",
    gap,
    align: "start",
    distribute: "start",
  },
});

const pad = (
  top: number,
  right: number,
  bottom: number,
  left: number,
): Pick<FrameNode, "padding"> => ({
  padding: { top, right, bottom, left },
});

const bg = (color: Color): Pick<FrameNode, "background"> => ({
  background: { type: "solid", color },
});

const rounded = (r: number): Pick<FrameNode, "borderRadius"> => ({
  borderRadius: { topLeft: r, topRight: r, bottomRight: r, bottomLeft: r },
});

const heading = (text: string, size = 24) =>
  createTextRun({ text, fontSize: size, fontWeight: 600, color: zinc950 });

const body = (text: string, color = zinc950) =>
  createTextRun({ text, fontSize: 14, color });

const muted = (text: string) =>
  createTextRun({ text, fontSize: 14, color: zinc500 });

const small = (text: string, color = zinc500) =>
  createTextRun({ text, fontSize: 12, color });

const mockPages: Page[] = [
  {
    id: "page-1",
    name: "Auth Flow",
    children: ["screen-1", "screen-2"],
    nodes: {
      "screen-1": createScreen({
        id: "screen-1",
        name: "Login",
        x: 100,
        y: 100,
        ...bg(zinc100),
        width: 390,
        height: 844,
        children: ["login-root"],
      }),
      "screen-2": createScreen({
        id: "screen-2",
        name: "Sign Up",
        x: 590,
        y: 100,
        ...bg(zinc100),
        width: 390,
        height: 844,
        children: ["signup-root"],
      }),
      // --- Login screen ---
      "login-root": createFrame({
        id: "login-root",
        name: "Login Root",
        children: ["login-header", "login-body"],
        ...bg(zinc100),
        dimensions: { width: fill, height: fill },
        ...vStack(0),
      }),
      "login-header": createFrame({
        id: "login-header",
        name: "Header",
        children: ["login-logo"],
        ...bg(white),
        ...fixed(390, 56),
        ...hStack(8),
        ...pad(0, 24, 0, 24),
        borders: bottomBorder,
      }),
      "login-logo": createText({
        id: "login-logo",
        name: "Logo",
        content: [
          createTextRun({
            text: "Acme Inc",
            fontSize: 16,
            fontWeight: 700,
            color: zinc950,
          }),
        ],
      }),
      "login-body": createFrame({
        id: "login-body",
        name: "Body",
        children: ["login-card"],
        dimensions: { width: fill, height: fill },
        ...bg(zinc100),
        layout: {
          type: "stack",
          direction: "vertical",
          gap: 0,
          align: "center",
          distribute: "center",
        },
      }),
      "login-card": createFrame({
        id: "login-card",
        name: "Card",
        children: [
          "login-title",
          "login-desc",
          "login-email-label",
          "login-email",
          "login-pass-label",
          "login-pass",
          "login-btn",
          "login-forgot",
        ],
        ...bg(white),
        ...fixed(340, -1),
        dimensions: { width: { type: "fixed", value: 340 }, height: hug },
        ...vStack(16),
        ...pad(32, 24, 32, 24),
        ...rounded(12),
        borders: allBorders,
        shadow: {
          color: { r: 0, g: 0, b: 0, a: 0.08 },
          x: 0,
          y: 2,
          blur: 8,
          spread: 0,
        },
      }),
      "login-title": createText({
        id: "login-title",
        name: "Title",
        content: [heading("Sign in")],
      }),
      "login-desc": createText({
        id: "login-desc",
        name: "Description",
        content: [muted("Enter your email below to sign in to your account")],
      }),
      "login-email-label": createText({
        id: "login-email-label",
        name: "Email Label",
        content: [body("Email", zinc950)],
      }),
      "login-email": createFrame({
        id: "login-email",
        name: "Email Input",
        children: ["login-email-placeholder"],
        ...bg(white),
        dimensions: { width: fill, height: { type: "fixed", value: 40 } },
        ...pad(0, 12, 0, 12),
        ...rounded(6),
        borders: allBorders,
        layout: {
          type: "stack",
          direction: "horizontal",
          gap: 0,
          align: "center",
          distribute: "start",
        },
      }),
      "login-email-placeholder": createText({
        id: "login-email-placeholder",
        name: "Placeholder",
        content: [muted("m@example.com")],
      }),
      "login-pass-label": createText({
        id: "login-pass-label",
        name: "Password Label",
        content: [body("Password", zinc950)],
      }),
      "login-pass": createFrame({
        id: "login-pass",
        name: "Password Input",
        children: ["login-pass-placeholder"],
        ...bg(white),
        dimensions: { width: fill, height: { type: "fixed", value: 40 } },
        ...pad(0, 12, 0, 12),
        ...rounded(6),
        borders: allBorders,
        layout: {
          type: "stack",
          direction: "horizontal",
          gap: 0,
          align: "center",
          distribute: "start",
        },
      }),
      "login-pass-placeholder": createText({
        id: "login-pass-placeholder",
        name: "Placeholder",
        content: [
          createTextRun({
            text: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
            fontSize: 14,
            color: zinc500,
          }),
        ],
      }),
      "login-btn": createFrame({
        id: "login-btn",
        name: "Sign In Button",
        children: ["login-btn-text"],
        ...bg(zinc950),
        dimensions: { width: fill, height: { type: "fixed", value: 40 } },
        ...rounded(6),
        layout: {
          type: "stack",
          direction: "horizontal",
          gap: 0,
          align: "center",
          distribute: "center",
        },
      }),
      "login-btn-text": createText({
        id: "login-btn-text",
        name: "Button Text",
        content: [
          createTextRun({
            text: "Sign In",
            fontSize: 14,
            fontWeight: 500,
            color: white,
          }),
        ],
        textAlign: "center",
      }),
      "login-forgot": createText({
        id: "login-forgot",
        name: "Forgot Password",
        content: [small("Forgot your password?", zinc500)],
        textAlign: "center",
      }),

      // --- Signup screen ---
      "signup-root": createFrame({
        id: "signup-root",
        name: "Signup Root",
        children: ["signup-header", "signup-body"],
        ...bg(zinc100),
        dimensions: { width: fill, height: fill },
        ...vStack(0),
      }),
      "signup-header": createFrame({
        id: "signup-header",
        name: "Header",
        children: ["signup-logo"],
        ...bg(white),
        ...fixed(390, 56),
        ...hStack(8),
        ...pad(0, 24, 0, 24),
        borders: bottomBorder,
      }),
      "signup-logo": createText({
        id: "signup-logo",
        name: "Logo",
        content: [
          createTextRun({
            text: "Acme Inc",
            fontSize: 16,
            fontWeight: 700,
            color: zinc950,
          }),
        ],
      }),
      "signup-body": createFrame({
        id: "signup-body",
        name: "Body",
        children: ["signup-card"],
        dimensions: { width: fill, height: fill },
        ...bg(zinc100),
        layout: {
          type: "stack",
          direction: "vertical",
          gap: 0,
          align: "center",
          distribute: "center",
        },
      }),
      "signup-card": createFrame({
        id: "signup-card",
        name: "Card",
        children: [
          "signup-title",
          "signup-desc",
          "signup-name-label",
          "signup-name",
          "signup-email-label",
          "signup-email",
          "signup-pass-label",
          "signup-pass",
          "signup-btn",
          "signup-signin",
        ],
        ...bg(white),
        dimensions: { width: { type: "fixed", value: 340 }, height: hug },
        ...vStack(16),
        ...pad(32, 24, 32, 24),
        ...rounded(12),
        borders: allBorders,
        shadow: {
          color: { r: 0, g: 0, b: 0, a: 0.08 },
          x: 0,
          y: 2,
          blur: 8,
          spread: 0,
        },
      }),
      "signup-title": createText({
        id: "signup-title",
        name: "Title",
        content: [heading("Create an account")],
      }),
      "signup-desc": createText({
        id: "signup-desc",
        name: "Description",
        content: [muted("Enter your information to get started")],
      }),
      "signup-name-label": createText({
        id: "signup-name-label",
        name: "Name Label",
        content: [body("Name", zinc950)],
      }),
      "signup-name": createFrame({
        id: "signup-name",
        name: "Name Input",
        children: ["signup-name-placeholder"],
        ...bg(white),
        dimensions: { width: fill, height: { type: "fixed", value: 40 } },
        ...pad(0, 12, 0, 12),
        ...rounded(6),
        borders: allBorders,
        layout: {
          type: "stack",
          direction: "horizontal",
          gap: 0,
          align: "center",
          distribute: "start",
        },
      }),
      "signup-name-placeholder": createText({
        id: "signup-name-placeholder",
        name: "Placeholder",
        content: [muted("John Doe")],
      }),
      "signup-email-label": createText({
        id: "signup-email-label",
        name: "Email Label",
        content: [body("Email", zinc950)],
      }),
      "signup-email": createFrame({
        id: "signup-email",
        name: "Email Input",
        children: ["signup-email-placeholder"],
        ...bg(white),
        dimensions: { width: fill, height: { type: "fixed", value: 40 } },
        ...pad(0, 12, 0, 12),
        ...rounded(6),
        borders: allBorders,
        layout: {
          type: "stack",
          direction: "horizontal",
          gap: 0,
          align: "center",
          distribute: "start",
        },
      }),
      "signup-email-placeholder": createText({
        id: "signup-email-placeholder",
        name: "Placeholder",
        content: [muted("m@example.com")],
      }),
      "signup-pass-label": createText({
        id: "signup-pass-label",
        name: "Password Label",
        content: [body("Password", zinc950)],
      }),
      "signup-pass": createFrame({
        id: "signup-pass",
        name: "Password Input",
        children: ["signup-pass-placeholder"],
        ...bg(white),
        dimensions: { width: fill, height: { type: "fixed", value: 40 } },
        ...pad(0, 12, 0, 12),
        ...rounded(6),
        borders: allBorders,
        layout: {
          type: "stack",
          direction: "horizontal",
          gap: 0,
          align: "center",
          distribute: "start",
        },
      }),
      "signup-pass-placeholder": createText({
        id: "signup-pass-placeholder",
        name: "Placeholder",
        content: [
          createTextRun({
            text: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
            fontSize: 14,
            color: zinc500,
          }),
        ],
      }),
      "signup-btn": createFrame({
        id: "signup-btn",
        name: "Create Account Button",
        children: ["signup-btn-text"],
        ...bg(zinc950),
        dimensions: { width: fill, height: { type: "fixed", value: 40 } },
        ...rounded(6),
        layout: {
          type: "stack",
          direction: "horizontal",
          gap: 0,
          align: "center",
          distribute: "center",
        },
      }),
      "signup-btn-text": createText({
        id: "signup-btn-text",
        name: "Button Text",
        content: [
          createTextRun({
            text: "Create Account",
            fontSize: 14,
            fontWeight: 500,
            color: white,
          }),
        ],
        textAlign: "center",
      }),
      "signup-signin": createText({
        id: "signup-signin",
        name: "Sign In Link",
        content: [small("Already have an account? Sign in", zinc500)],
        textAlign: "center",
      }),
    },
  },
  {
    id: "page-2",
    name: "Dashboard",
    children: ["screen-3"],
    nodes: {
      "screen-3": createScreen({
        id: "screen-3",
        name: "Dashboard",
        x: 100,
        y: 100,
        ...bg(zinc100),
        width: 1280,
        height: 800,
        children: ["dash-root"],
      }),
      "dash-root": createFrame({
        id: "dash-root",
        name: "Dashboard Root",
        children: ["dash-sidebar", "dash-main"],
        dimensions: { width: fill, height: fill },
        ...hStack(0),
      }),
      "dash-sidebar": createFrame({
        id: "dash-sidebar",
        name: "Sidebar",
        children: ["dash-sidebar-logo", "dash-nav"],
        ...bg(zinc950),
        ...fixed(240, -1),
        dimensions: { width: { type: "fixed", value: 240 }, height: fill },
        ...vStack(24),
        ...pad(20, 16, 20, 16),
      }),
      "dash-sidebar-logo": createText({
        id: "dash-sidebar-logo",
        name: "Logo",
        content: [
          createTextRun({
            text: "Acme Inc",
            fontSize: 16,
            fontWeight: 700,
            color: white,
          }),
        ],
      }),
      "dash-nav": createFrame({
        id: "dash-nav",
        name: "Navigation",
        children: ["dash-nav-1", "dash-nav-2", "dash-nav-3", "dash-nav-4"],
        dimensions: { width: fill, height: hug },
        ...vStack(4),
      }),
      "dash-nav-1": createFrame({
        id: "dash-nav-1",
        name: "Nav - Dashboard",
        children: ["dash-nav-1-text"],
        ...bg({ r: 39, g: 39, b: 42, a: 1 }),
        dimensions: { width: fill, height: { type: "fixed", value: 36 } },
        ...pad(0, 12, 0, 12),
        ...rounded(6),
        layout: {
          type: "stack",
          direction: "horizontal",
          gap: 0,
          align: "center",
          distribute: "start",
        },
      }),
      "dash-nav-1-text": createText({
        id: "dash-nav-1-text",
        name: "Text",
        content: [
          createTextRun({
            text: "Dashboard",
            fontSize: 14,
            fontWeight: 500,
            color: zinc50,
          }),
        ],
      }),
      "dash-nav-2": createFrame({
        id: "dash-nav-2",
        name: "Nav - Customers",
        children: ["dash-nav-2-text"],
        dimensions: { width: fill, height: { type: "fixed", value: 36 } },
        ...pad(0, 12, 0, 12),
        ...rounded(6),
        layout: {
          type: "stack",
          direction: "horizontal",
          gap: 0,
          align: "center",
          distribute: "start",
        },
      }),
      "dash-nav-2-text": createText({
        id: "dash-nav-2-text",
        name: "Text",
        content: [
          createTextRun({ text: "Customers", fontSize: 14, color: zinc400 }),
        ],
      }),
      "dash-nav-3": createFrame({
        id: "dash-nav-3",
        name: "Nav - Products",
        children: ["dash-nav-3-text"],
        dimensions: { width: fill, height: { type: "fixed", value: 36 } },
        ...pad(0, 12, 0, 12),
        ...rounded(6),
        layout: {
          type: "stack",
          direction: "horizontal",
          gap: 0,
          align: "center",
          distribute: "start",
        },
      }),
      "dash-nav-3-text": createText({
        id: "dash-nav-3-text",
        name: "Text",
        content: [
          createTextRun({ text: "Products", fontSize: 14, color: zinc400 }),
        ],
      }),
      "dash-nav-4": createFrame({
        id: "dash-nav-4",
        name: "Nav - Settings",
        children: ["dash-nav-4-text"],
        dimensions: { width: fill, height: { type: "fixed", value: 36 } },
        ...pad(0, 12, 0, 12),
        ...rounded(6),
        layout: {
          type: "stack",
          direction: "horizontal",
          gap: 0,
          align: "center",
          distribute: "start",
        },
      }),
      "dash-nav-4-text": createText({
        id: "dash-nav-4-text",
        name: "Text",
        content: [
          createTextRun({ text: "Settings", fontSize: 14, color: zinc400 }),
        ],
      }),
      "dash-main": createFrame({
        id: "dash-main",
        name: "Main Content",
        children: ["dash-topbar", "dash-content"],
        ...bg(white),
        dimensions: { width: fill, height: fill },
        ...vStack(0),
      }),
      "dash-topbar": createFrame({
        id: "dash-topbar",
        name: "Top Bar",
        children: ["dash-topbar-title"],
        ...bg(white),
        dimensions: { width: fill, height: { type: "fixed", value: 56 } },
        ...pad(0, 24, 0, 24),
        borders: bottomBorder,
        layout: {
          type: "stack",
          direction: "horizontal",
          gap: 0,
          align: "center",
          distribute: "start",
        },
      }),
      "dash-topbar-title": createText({
        id: "dash-topbar-title",
        name: "Title",
        content: [
          createTextRun({
            text: "Dashboard",
            fontSize: 16,
            fontWeight: 600,
            color: zinc950,
          }),
        ],
      }),
      "dash-content": createFrame({
        id: "dash-content",
        name: "Content",
        children: ["dash-stats", "dash-table-card"],
        dimensions: { width: fill, height: fill },
        ...vStack(24),
        ...pad(24, 24, 24, 24),
      }),
      "dash-stats": createFrame({
        id: "dash-stats",
        name: "Stats Row",
        children: ["dash-stat-1", "dash-stat-2", "dash-stat-3"],
        dimensions: { width: fill, height: hug },
        ...hStack(16),
      }),
      "dash-stat-1": createFrame({
        id: "dash-stat-1",
        name: "Total Revenue",
        children: ["dash-stat-1-label", "dash-stat-1-value"],
        ...bg(white),
        dimensions: { width: fill, height: hug },
        ...vStack(4),
        ...pad(20, 20, 20, 20),
        ...rounded(8),
        borders: allBorders,
      }),
      "dash-stat-1-label": createText({
        id: "dash-stat-1-label",
        name: "Label",
        content: [small("Total Revenue", zinc500)],
      }),
      "dash-stat-1-value": createText({
        id: "dash-stat-1-value",
        name: "Value",
        content: [heading("$45,231", 28)],
      }),
      "dash-stat-2": createFrame({
        id: "dash-stat-2",
        name: "Customers",
        children: ["dash-stat-2-label", "dash-stat-2-value"],
        ...bg(white),
        dimensions: { width: fill, height: hug },
        ...vStack(4),
        ...pad(20, 20, 20, 20),
        ...rounded(8),
        borders: allBorders,
      }),
      "dash-stat-2-label": createText({
        id: "dash-stat-2-label",
        name: "Label",
        content: [small("Customers", zinc500)],
      }),
      "dash-stat-2-value": createText({
        id: "dash-stat-2-value",
        name: "Value",
        content: [heading("+2,350", 28)],
      }),
      "dash-stat-3": createFrame({
        id: "dash-stat-3",
        name: "Active Now",
        children: ["dash-stat-3-label", "dash-stat-3-value"],
        ...bg(white),
        dimensions: { width: fill, height: hug },
        ...vStack(4),
        ...pad(20, 20, 20, 20),
        ...rounded(8),
        borders: allBorders,
      }),
      "dash-stat-3-label": createText({
        id: "dash-stat-3-label",
        name: "Label",
        content: [small("Active Now", zinc500)],
      }),
      "dash-stat-3-value": createText({
        id: "dash-stat-3-value",
        name: "Value",
        content: [heading("+573", 28)],
      }),
      "dash-table-card": createFrame({
        id: "dash-table-card",
        name: "Recent Orders",
        children: [
          "dash-table-header",
          "dash-table-row-head",
          "dash-table-row-1",
          "dash-table-row-2",
          "dash-table-row-3",
        ],
        ...bg(white),
        dimensions: { width: fill, height: hug },
        ...vStack(0),
        ...rounded(8),
        borders: allBorders,
      }),
      "dash-table-header": createFrame({
        id: "dash-table-header",
        name: "Table Header",
        children: ["dash-table-header-text"],
        dimensions: { width: fill, height: hug },
        ...pad(16, 20, 16, 20),
        borders: bottomBorder,
      }),
      "dash-table-header-text": createText({
        id: "dash-table-header-text",
        name: "Title",
        content: [
          createTextRun({
            text: "Recent Orders",
            fontSize: 16,
            fontWeight: 600,
            color: zinc950,
          }),
        ],
      }),
      "dash-table-row-head": createFrame({
        id: "dash-table-row-head",
        name: "Column Headers",
        children: ["dash-th-1", "dash-th-2", "dash-th-3"],
        ...bg(zinc100),
        dimensions: { width: fill, height: { type: "fixed", value: 40 } },
        ...pad(0, 20, 0, 20),
        layout: {
          type: "stack",
          direction: "horizontal",
          gap: 0,
          align: "center",
          distribute: "start",
        },
      }),
      "dash-th-1": createText({
        id: "dash-th-1",
        name: "Customer",
        content: [small("Customer", zinc500)],
      }),
      "dash-th-2": createFrame({
        id: "dash-th-2",
        name: "Spacer",
        dimensions: { width: fill, height: hug },
        children: ["dash-th-2-text"],
      }),
      "dash-th-2-text": createText({
        id: "dash-th-2-text",
        name: "Status",
        content: [small("Status", zinc500)],
      }),
      "dash-th-3": createText({
        id: "dash-th-3",
        name: "Amount",
        content: [small("Amount", zinc500)],
        textAlign: "right",
      }),
      "dash-table-row-1": createFrame({
        id: "dash-table-row-1",
        name: "Row 1",
        children: ["dash-r1-name", "dash-r1-spacer", "dash-r1-amount"],
        dimensions: { width: fill, height: { type: "fixed", value: 48 } },
        ...pad(0, 20, 0, 20),
        borders: bottomBorder,
        layout: {
          type: "stack",
          direction: "horizontal",
          gap: 0,
          align: "center",
          distribute: "start",
        },
      }),
      "dash-r1-name": createText({
        id: "dash-r1-name",
        name: "Name",
        content: [body("Olivia Martin")],
      }),
      "dash-r1-spacer": createFrame({
        id: "dash-r1-spacer",
        name: "Spacer",
        dimensions: { width: fill, height: hug },
        children: ["dash-r1-status"],
      }),
      "dash-r1-status": createText({
        id: "dash-r1-status",
        name: "Status",
        content: [
          createTextRun({
            text: "Completed",
            fontSize: 12,
            color: { r: 22, g: 163, b: 74, a: 1 },
          }),
        ],
      }),
      "dash-r1-amount": createText({
        id: "dash-r1-amount",
        name: "Amount",
        content: [body("$1,999.00")],
        textAlign: "right",
      }),
      "dash-table-row-2": createFrame({
        id: "dash-table-row-2",
        name: "Row 2",
        children: ["dash-r2-name", "dash-r2-spacer", "dash-r2-amount"],
        dimensions: { width: fill, height: { type: "fixed", value: 48 } },
        ...pad(0, 20, 0, 20),
        borders: bottomBorder,
        layout: {
          type: "stack",
          direction: "horizontal",
          gap: 0,
          align: "center",
          distribute: "start",
        },
      }),
      "dash-r2-name": createText({
        id: "dash-r2-name",
        name: "Name",
        content: [body("Jackson Lee")],
      }),
      "dash-r2-spacer": createFrame({
        id: "dash-r2-spacer",
        name: "Spacer",
        dimensions: { width: fill, height: hug },
        children: ["dash-r2-status"],
      }),
      "dash-r2-status": createText({
        id: "dash-r2-status",
        name: "Status",
        content: [
          createTextRun({
            text: "Processing",
            fontSize: 12,
            color: { r: 234, g: 179, b: 8, a: 1 },
          }),
        ],
      }),
      "dash-r2-amount": createText({
        id: "dash-r2-amount",
        name: "Amount",
        content: [body("$39.00")],
        textAlign: "right",
      }),
      "dash-table-row-3": createFrame({
        id: "dash-table-row-3",
        name: "Row 3",
        children: ["dash-r3-name", "dash-r3-spacer", "dash-r3-amount"],
        dimensions: { width: fill, height: { type: "fixed", value: 48 } },
        ...pad(0, 20, 0, 20),
        layout: {
          type: "stack",
          direction: "horizontal",
          gap: 0,
          align: "center",
          distribute: "start",
        },
      }),
      "dash-r3-name": createText({
        id: "dash-r3-name",
        name: "Name",
        content: [body("Isabella Nguyen")],
      }),
      "dash-r3-spacer": createFrame({
        id: "dash-r3-spacer",
        name: "Spacer",
        dimensions: { width: fill, height: hug },
        children: ["dash-r3-status"],
      }),
      "dash-r3-status": createText({
        id: "dash-r3-status",
        name: "Status",
        content: [
          createTextRun({
            text: "Completed",
            fontSize: 12,
            color: { r: 22, g: 163, b: 74, a: 1 },
          }),
        ],
      }),
      "dash-r3-amount": createText({
        id: "dash-r3-amount",
        name: "Amount",
        content: [body("$299.00")],
        textAlign: "right",
      }),
    },
  },
];

export function getDocument(id: string): Document {
  return {
    id,
    name: "My new project",
    pages: mockPages.map((p) => ({ id: p.id, name: p.name })),
  };
}

export function getPage(_docId: string, pageId: string) {
  return mockPages.find((p) => p.id === pageId);
}
