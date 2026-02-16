<script lang="ts">
  import type { SvelteHTMLElements } from "svelte/elements";

  let { children, ...others }: SvelteHTMLElements["li"] = $props();
</script>

<li {...others}>
  {@render children?.()}
</li>
