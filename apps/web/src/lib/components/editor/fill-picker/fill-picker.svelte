<script lang="ts">
  import { PercentIcon } from "@lucide/svelte";
  import {
    type Fill,
    colorToHex,
    colorToCss,
    hexToColor,
  } from "@opendesigner/core";
  import { Popover } from "bits-ui";
  import ColorPicker from "./color-picker.svelte";
  import {
    TabsRoot,
    TabsList,
    TabsTrigger,
    TabsContent,
  } from "$lib/components/ui/tabs";

  let {
    value = $bindable({
      type: "solid",
      color: { r: 217, g: 217, b: 217, a: 1 },
    }),
  }: {
    value?: Fill;
  } = $props();

  const getInputColor = () => {
    return value.type === "solid" ? colorToHex(value.color) : "";
  };

  const getInputAlpha = () => {
    return value.type === "solid"
      ? parseFloat((value.color.a * 100).toFixed(2))
      : 0;
  };

  let inputColor = $derived(getInputColor());
  let inputAlpha = $derived(getInputAlpha());
</script>

<Popover.Root>
  {#if value.type === "solid"}
    <div
      class="flex px-2 items-center border border-neutral-700 h-7 rounded-md focus-within:border-blue-500 text-sm text-neutral-50"
    >
      <Popover.Trigger
        class="size-4 cursor-pointer"
        style="
          background:
            linear-gradient(to bottom right, {colorToHex(
          value.color,
        )} 50%, transparent 50%),
            linear-gradient({colorToCss(value.color)}, {colorToCss(
          value.color,
        )}),
            repeating-conic-gradient(var(--color-neutral-600) 0% 25%, transparent 0% 50%);
          background-size: auto, auto, 8px 8px;
        "
        aria-label="Pick color"
      ></Popover.Trigger>
      <input
        class="flex-2 min-w-0 outline-none h-full px-2"
        bind:value={inputColor}
        onblur={(e) => {
          const parsed = hexToColor(e.currentTarget.value);
          if (parsed) {
            value = { type: "solid", color: parsed };
          } else {
            inputColor = getInputColor();
          }
        }}
      />
      <input
        class="flex-1 min-w-0 outline-none border-l border-neutral-700 h-full px-2"
        bind:value={inputAlpha}
        onblur={(e) => {
          if (value.type !== "solid") {
            return;
          }

          const n = parseFloat(e.currentTarget.value);
          if (!Number.isNaN(n) && n >= 0 && n <= 100) {
            value = {
              type: "solid",
              color: { ...value.color, a: n / 100 },
            };
          } else {
            inputAlpha = getInputAlpha();
          }
        }}
      />
      <PercentIcon class="size-4" />
    </div>
  {/if}
  <Popover.Content
    align="start"
    side="left"
    sideOffset={8}
    alignOffset={-4}
    class="bg-neutral-800 border border-neutral-700 rounded-lg p-4 w-60"
  >
    <TabsRoot>
      <TabsList>
        <TabsTrigger value="solid">Solid</TabsTrigger>
        <TabsTrigger value="gradient">Gradient</TabsTrigger>
        <TabsTrigger value="image">Image</TabsTrigger>
      </TabsList>
      <TabsContent value="solid">
        {#if value.type === "solid"}
          <ColorPicker bind:value={value.color} />
        {/if}
      </TabsContent>
    </TabsRoot>
  </Popover.Content>
</Popover.Root>
