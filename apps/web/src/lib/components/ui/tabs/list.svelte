<script lang="ts">
  import { Tabs as TabsPrimitive } from "bits-ui";

  import { cn } from "$lib/utils.js";

  let { class: className, ...others }: TabsPrimitive.ListProps = $props();
</script>

<TabsPrimitive.List class={cn("inline-flex gap-1", className)} {...others} />
