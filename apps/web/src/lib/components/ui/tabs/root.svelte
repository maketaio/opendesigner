<script lang="ts">
  import { Tabs as TabsPrimitive } from "bits-ui";

  import { cn } from "$lib/utils.js";

  let {
    value = $bindable(""),
    class: className,
    ...others
  }: TabsPrimitive.RootProps = $props();
</script>

<TabsPrimitive.Root
  bind:value
  class={cn("flex flex-col gap-4", className)}
  {...others}
/>
