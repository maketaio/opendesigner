<script lang="ts">
  import {
    SmartphoneIcon,
    TabletIcon,
    PlusIcon,
    FrameIcon,
    MonitorIcon,
    TypeIcon,
    ImageIcon,
  } from "@lucide/svelte";
  import type { Node, Color } from "@opendesigner/core";

  import { Button } from "$lib/components/ui/button";
  import {
    TabsContent,
    TabsList,
    TabsTrigger,
    TabsRoot,
  } from "$lib/components/ui/tabs";
  import { Separator } from "$lib/components/ui/separator";
  import {
    SidebarMenuButton,
    SidebarMenu,
    SidebarMenuItem,
  } from "$lib/components/ui/sidebar";
  import { FillPicker } from "$lib/components/editor/fill-picker";

  let nodes = $state<Node[]>([
    {
      id: "1",
      name: "Solid Card",
      type: "frame",
      parent: null,
      order: "a0",
      styles: {
        fill: { type: "solid", color: { r: 59, g: 130, b: 246, a: 1 } },
        stroke: {
          color: { r: 30, g: 64, b: 175, a: 1 },
          width: 2,
          style: "solid",
          position: "inside",
        },
      },
    },
    {
      id: "2",
      name: "Gradient Card",
      type: "frame",
      parent: null,
      order: "a1",
      styles: {
        fill: {
          type: "gradient",
          stops: [
            { offset: 0, color: "#f97316" },
            { offset: 1, color: "#ec4899" },
          ],
          angle: 135,
        },
        stroke: {
          color: { r: 0, g: 0, b: 0, a: 0.2 },
          width: 1,
          style: "dashed",
          position: "outside",
        },
      },
    },
    {
      id: "3",
      name: "Image Card",
      type: "frame",
      parent: null,
      order: "a2",
      styles: {
        fill: {
          type: "image",
          src: "https://picsum.photos/300/200",
          fit: "cover",
        },
        stroke: {
          color: { r: 0, g: 0, b: 0, a: 0.5 },
          width: 3,
          style: "dotted",
          position: "center",
        },
      },
    },
    {
      id: "4",
      name: "Nested Child",
      type: "frame",
      parent: "1",
      order: "a0",
      styles: {
        fill: {
          type: "solid",
          color: { r: 255, g: 255, b: 255, a: 0.3 },
        },
        stroke: {
          color: { r: 255, g: 255, b: 255, a: 0.8 },
          width: 1,
          style: "solid",
          position: "center",
        },
      },
    },
  ]);

  let selected = $state<string | null>(null);
  let selectedNode = $derived(nodes.find((n) => n.id === selected) ?? null);
  let selectionRect = $state<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);

  let zoom = $state(1);
  let panX = $state(0);
  let panY = $state(0);
  let isPanning = $state(false);
  let lastMouse = { x: 0, y: 0 };
  let canvasEl: HTMLDivElement;

  $effect(() => {
    if (!canvasEl) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const factor = e.deltaY > 0 ? 0.95 : 1.05;
        const rect = canvasEl.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const newZoom = zoom * factor;
        panX = cx - (cx - panX) * (newZoom / zoom);
        panY = cy - (cy - panY) * (newZoom / zoom);
        zoom = newZoom;
      } else {
        panX -= e.deltaX;
        panY -= e.deltaY;
      }
    };
    canvasEl.addEventListener("wheel", onWheel, { passive: false });
    return () => canvasEl.removeEventListener("wheel", onWheel);
  });

  function handlePointerDown(e: PointerEvent) {
    if (e.button === 1) {
      isPanning = true;
      lastMouse = { x: e.clientX, y: e.clientY };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      e.preventDefault();
    }
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isPanning) return;
    panX += e.clientX - lastMouse.x;
    panY += e.clientY - lastMouse.y;
    lastMouse = { x: e.clientX, y: e.clientY };
  }

  function handlePointerUp(e: PointerEvent) {
    if (e.button === 1) isPanning = false;
  }

  function colorToCSS(c: Color): string {
    return `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`;
  }

  function nodeStyle(node: Node): string {
    const parts: string[] = [];
    const { fill, stroke } = node.styles;

    switch (fill.type) {
      case "solid":
        parts.push(`background: ${colorToCSS(fill.color)}`);
        break;
      case "gradient":
        parts.push(
          `background: linear-gradient(${fill.angle}deg, ${fill.stops.map((s) => `${s.color} ${s.offset * 100}%`).join(", ")})`,
        );
        break;
      case "image":
        parts.push(`background-image: url(${fill.src})`);
        parts.push(
          `background-size: ${fill.fit === "fill" ? "100% 100%" : fill.fit}`,
        );
        parts.push("background-repeat: no-repeat");
        break;
    }

    const strokeVal = `${stroke.width}px ${stroke.style} ${colorToCSS(stroke.color)}`;
    switch (stroke.position) {
      case "inside":
        parts.push(`outline: ${strokeVal}`);
        parts.push(`outline-offset: -${stroke.width}px`);
        break;
      case "outside":
        parts.push(`outline: ${strokeVal}`);
        parts.push(`outline-offset: 0px`);
        break;
      case "center":
        parts.push(`border: ${strokeVal}`);
        break;
    }

    return parts.join("; ");
  }

  function childrenOf(parentId: string | null): Node[] {
    return nodes
      .filter((n) => n.parent === parentId)
      .sort((a, b) => a.order.localeCompare(b.order));
  }

  function updateSelectionRect() {
    if (!selected || !canvasEl) {
      selectionRect = null;
      return;
    }
    const el = canvasEl.querySelector(`[data-id="${selected}"]`);
    if (!el) {
      selectionRect = null;
      return;
    }
    const canvasRect = canvasEl.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    selectionRect = {
      x: elRect.left - canvasRect.left - canvasEl.clientLeft,
      y: elRect.top - canvasRect.top - canvasEl.clientTop,
      w: elRect.width,
      h: elRect.height,
    };
  }

  $effect(() => {
    selected;
    zoom;
    panX;
    panY;
    updateSelectionRect();
  });
</script>

<div class="flex bg-neutral-900 p-4 gap-4 h-svh">
  <div class="w-64 flex flex-col gap-6">
    <div class="flex flex-col gap-1 px-2">
      <div class="text-neutral-50">My new project</div>
      <div class="text-xs">Draft</div>
    </div>
    <TabsRoot value="page" class="gap-4">
      <TabsList>
        <TabsTrigger value="page">Page</TabsTrigger>
        <TabsTrigger value="layers">Layers</TabsTrigger>
      </TabsList>
      <TabsContent value="page" class="flex flex-col gap-1">
        <SidebarMenu role="tablist">
          <SidebarMenuItem role="presentation">
            <SidebarMenuButton active>Login</SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem role="presentation">
            <SidebarMenuButton>Signup</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </TabsContent>
      <TabsContent value="layers" class="flex flex-col gap-1">
        {#snippet renderLayer(node: Node, depth: number)}
          <SidebarMenuItem role="treeitem">
            <SidebarMenuButton
              active={selected === node.id}
              onclick={() => (selected = node.id)}
              style="padding-left: {depth * 12 + 8}px"
            >
              {#if node.type === "frame"}
                <FrameIcon />
              {/if}
              {node.name}
            </SidebarMenuButton>
          </SidebarMenuItem>
          {#each childrenOf(node.id) as child (child.id)}
            {@render renderLayer(child, depth + 1)}
          {/each}
        {/snippet}
        <SidebarMenu role="tree">
          {#each childrenOf(null) as node (node.id)}
            {@render renderLayer(node, 0)}
          {/each}
        </SidebarMenu>
      </TabsContent>
    </TabsRoot>
  </div>
  {#snippet renderNode(node: Node)}
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div
      data-id={node.id}
      style={nodeStyle(node)}
      class="w-48 h-32 p-2"
      onclick={(e) => {
        e.stopPropagation();
        selected = node.id;
      }}
    >
      <span class="text-xs text-white/70 drop-shadow-sm">{node.name}</span>
      {#each childrenOf(node.id) as child (child.id)}
        {@render renderNode(child)}
      {/each}
    </div>
  {/snippet}

  <div
    bind:this={canvasEl}
    role="application"
    aria-label="Design canvas"
    class="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl overflow-hidden relative"
    onclick={() => (selected = null)}
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
  >
    <div
      style="transform: translate({panX}px, {panY}px) scale({zoom}); transform-origin: 0 0"
      class="absolute top-0 left-0 flex gap-8 p-8"
    >
      {#each childrenOf(null) as node (node.id)}
        {@render renderNode(node)}
      {/each}
    </div>

    {#if selectionRect}
      <div
        class="absolute pointer-events-none ring-2 ring-blue-500"
        style="left: {selectionRect.x}px; top: {selectionRect.y}px; width: {selectionRect.w}px; height: {selectionRect.h}px"
      ></div>
    {/if}

    <div
      class="absolute top-4 left-1/2 -translate-x-1/2 p-2 bg-neutral-800 border border-neutral-700 rounded-lg flex gap-2 z-10"
    >
      <Button size="icon-lg">
        <SmartphoneIcon />
      </Button>
      <Button size="icon-lg">
        <TabletIcon />
      </Button>
      <Button size="icon-lg">
        <MonitorIcon />
      </Button>
      <Separator orientation="vertical" />
      <Button size="icon-lg">
        <PlusIcon />
      </Button>
    </div>
    <div
      class="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 bg-neutral-800 border border-neutral-700 rounded-lg flex gap-2 z-10"
    >
      <Button size="icon-lg">
        <FrameIcon />
      </Button>
      <Button size="icon-lg">
        <TypeIcon />
      </Button>
      <Button size="icon-lg">
        <ImageIcon />
      </Button>
    </div>
  </div>
  {#if selectedNode}
    <div class="w-64 flex flex-col h-svh gap-6 overflow-y-auto">
      <div class="flex gap-2 items-center text-neutral-50">
        {#if selectedNode.type === "frame"}
          <FrameIcon class="size-4 text-neutral-400" />
        {/if}
        {selectedNode.name}
      </div>
      <FillPicker bind:value={selectedNode.styles.fill} />
    </div>
  {/if}
</div>
