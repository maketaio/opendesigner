<script lang="ts">
  import {
    CaseSensitiveIcon,
    MoveVerticalIcon,
    TextAlignCenterIcon,
    TextAlignEndIcon,
    TextAlignStartIcon,
    TypeIcon,
  } from "@lucide/svelte";
  import type { TextNode } from "@opendesigner/core";
  import { ToggleGroup } from "bits-ui";

  import ColorInput from "./color-input.svelte";
  import NumberInput from "./number-input.svelte";

  type Props = {
    node: TextNode;
  };

  let { node = $bindable() }: Props = $props();

  let firstRun = $derived(node.content[0]);
</script>

{#if firstRun}
  <div class="flex flex-col gap-2">
    <div class="text-neutral-50 text-sm">Typography</div>
    <div class="grid grid-cols-2 gap-2">
      <NumberInput bind:value={firstRun.fontSize}>
        {#snippet startDecorator()}<TypeIcon />{/snippet}
      </NumberInput>
      <NumberInput bind:value={firstRun.fontWeight}>
        {#snippet startDecorator()}<span class="text-xs font-bold">W</span
          >{/snippet}
      </NumberInput>
      <NumberInput bind:value={firstRun.lineHeight}>
        {#snippet startDecorator()}<MoveVerticalIcon />{/snippet}
      </NumberInput>
      <NumberInput bind:value={firstRun.letterSpacing}>
        {#snippet startDecorator()}<CaseSensitiveIcon />{/snippet}
      </NumberInput>
    </div>
    <ColorInput bind:value={firstRun.color} />
    <ToggleGroup.Root
      type="single"
      bind:value={node.textAlign}
      class="grid grid-cols-3 bg-neutral-800 h-8 rounded-md"
    >
      <ToggleGroup.Item
        value="left"
        class="rounded-md cursor-pointer border border-transparent data-[state=on]:border-neutral-700 flex justify-center items-center [&_svg]:text-neutral-400 [&_svg]:size-4 data-[state=on]:[&_svg]:text-neutral-50 data-[state=on]:bg-neutral-900"
        ><TextAlignStartIcon /></ToggleGroup.Item
      >
      <ToggleGroup.Item
        value="center"
        class="rounded-md cursor-pointer border border-transparent data-[state=on]:border-neutral-700 flex justify-center items-center [&_svg]:text-neutral-400 [&_svg]:size-4 data-[state=on]:[&_svg]:text-neutral-50 data-[state=on]:bg-neutral-900"
        ><TextAlignCenterIcon /></ToggleGroup.Item
      >
      <ToggleGroup.Item
        value="right"
        class="rounded-md cursor-pointer border border-transparent data-[state=on]:border-neutral-700 flex justify-center items-center [&_svg]:text-neutral-400 [&_svg]:size-4 data-[state=on]:[&_svg]:text-neutral-50 data-[state=on]:bg-neutral-900"
        ><TextAlignEndIcon /></ToggleGroup.Item
      >
    </ToggleGroup.Root>
  </div>
{/if}
