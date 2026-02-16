<script lang="ts">
  import { Tabs as TabsPrimitive } from "bits-ui";

  import { cn } from "$lib/utils.js";

  let { class: className, ...others }: TabsPrimitive.ContentProps = $props();
</script>

<TabsPrimitive.Content
  class={cn("flex-1 outline-none", className)}
  {...others}
/>
