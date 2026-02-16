<script lang="ts">
  import { Separator as SeparatorPrimitive } from "bits-ui";

  import { cn } from "$lib/utils.js";

  let { class: className, ...others }: SeparatorPrimitive.RootProps = $props();
</script>

<SeparatorPrimitive.Root
  class={cn(
    "bg-neutral-700 shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:min-h-full data-[orientation=vertical]:w-px",
    className,
  )}
  {...others}
/>
