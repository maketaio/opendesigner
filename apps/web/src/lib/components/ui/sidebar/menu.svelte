<script lang="ts">
  import { cn } from "$lib/utils";
  import type { SvelteHTMLElements } from "svelte/elements";

  let {
    children,
    class: className,
    ...others
  }: SvelteHTMLElements["ul"] = $props();
</script>

<ul class={cn("flex flex-col gap-1.5", className)} {...others}>
  {@render children?.()}
</ul>
