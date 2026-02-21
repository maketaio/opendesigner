<script lang="ts">
  import {
    type Node,
    nodeStyle,
    type Page,
    resolveChildren,
    screenStyle,
    textRunStyle,
  } from "@opendesigner/core";

  type Props = {
    page: Page;
    selection: string | null;
  };

  let { page, selection = $bindable() }: Props = $props();

  let panX = $state(0);
  let panY = $state(0);
  let zoom = $state(1);

  let selectionRect = $state<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
</script>

{#snippet renderNode(node: Node)}
  <!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
  <div
    data-id={node.id}
    style={nodeStyle(node)}
    onclick={(e) => {
      e.stopPropagation();
      selection = node.id;
    }}
  >
    {#if node.type === "text"}
      {#each node.content as run, i (i)}
        <span style={textRunStyle(run)}>{run.text}</span>
      {/each}
    {:else if node.type === "frame"}
      {#each resolveChildren(page.nodes, node.children) as child (child.id)}
        {@render renderNode(child)}
      {/each}
    {/if}
  </div>
{/snippet}

<!-- svelte-ignore a11y_no_noninteractive_element_interactions, a11y_click_events_have_key_events -->
<div
  role="application"
  aria-label="Design canvas"
  class="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl overflow-hidden relative"
  onclick={() => {
    selection = null;
  }}
  {@attach (node) => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey) {
        const rect = node.getBoundingClientRect();
        const mx = e.clientX - rect.left - node.clientLeft;
        const my = e.clientY - rect.top - node.clientTop;
        const newZoom = Math.min(
          Math.max(zoom * Math.pow(2, -e.deltaY / 150), 0.1),
          10,
        );
        panX = mx - ((mx - panX) / zoom) * newZoom;
        panY = my - ((my - panY) / zoom) * newZoom;
        zoom = newZoom;
      } else {
        panX -= e.deltaX;
        panY -= e.deltaY;
      }
    };
    node.addEventListener("wheel", onWheel, { passive: false });

    $effect(() => {
      // Subscribe to pan/zoom so the outline updates
      /* eslint-disable @typescript-eslint/no-unused-expressions */
      panX;
      panY;
      zoom;
      /* eslint-enable @typescript-eslint/no-unused-expressions */

      if (!selection) {
        selectionRect = null;
        return;
      }
      const target = node.querySelector(`[data-id="${selection}"]`);
      if (!target) {
        selectionRect = null;
        return;
      }
      const canvasRect = node.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      selectionRect = {
        x: targetRect.left - canvasRect.left - node.clientLeft,
        y: targetRect.top - canvasRect.top - node.clientTop,
        w: targetRect.width,
        h: targetRect.height,
      };
    });

    return () => node.removeEventListener("wheel", onWheel);
  }}
>
  <div
    style="transform: translate({panX}px, {panY}px) scale({zoom}); transform-origin: 0 0"
  >
    {#each resolveChildren(page.nodes, page.children) as node (node.id)}
      {#if node.type === "screen"}
        {@const screen = node}
        <div
          class="absolute text-xs text-neutral-400 select-none whitespace-nowrap"
          style="left: {screen.x}px; top: {screen.y - 24}px"
        >
          {screen.name}
        </div>
        <!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
        <div
          data-id={screen.id}
          class="absolute overflow-hidden"
          style="left: {screen.x}px; top: {screen.y}px; {screenStyle(screen)}"
          onclick={(e) => {
            e.stopPropagation();
            selection = screen.id;
          }}
        >
          {#each resolveChildren(page.nodes, screen.children) as child (child.id)}
            {@render renderNode(child)}
          {/each}
        </div>
      {/if}
    {/each}
  </div>

  {#if selectionRect}
    <div
      class="absolute pointer-events-none z-10 outline-2 outline-blue-500"
      style="left: {selectionRect.x}px; top: {selectionRect.y}px; width: {selectionRect.w}px; height: {selectionRect.h}px"
    ></div>
  {/if}
</div>
