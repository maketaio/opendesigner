<script lang="ts">
  import type { Document, Page } from "@opendesigner/core";

  import Canvas from "./canvas.svelte";
  import Inspector from "./inspector.svelte";
  import Sidebar from "./sidebar.svelte";

  type Props = {
    document: Document;
    page: Page;
  };

  let { document, page = $bindable() }: Props = $props();

  let selection = $state<string | null>(null);
</script>

<div class="flex bg-neutral-900 p-4 gap-4 h-svh">
  <Sidebar {document} {page} bind:selection />
  <Canvas {page} bind:selection />
  {#if selection && page.nodes[selection]}
    <Inspector bind:node={page.nodes[selection]} />
  {/if}
</div>
