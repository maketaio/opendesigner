<script lang="ts">
  import type { SvelteHTMLElements } from "svelte/elements";

  import { cn } from "$lib/utils";

  let {
    children,
    class: className,
    ...others
  }: SvelteHTMLElements["ul"] = $props();
</script>

<ul class={cn("flex flex-col gap-1.5", className)} {...others}>
  {@render children?.()}
</ul>
