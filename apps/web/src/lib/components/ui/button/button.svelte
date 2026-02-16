<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  import { cn } from "$lib/utils.js";

  type ButtonVariant = "primary" | "secondary" | "tertiary";
  type ButtonSize = "md" | "icon-md" | "icon-lg";

  type ButtonProps = HTMLButtonAttributes & {
    variant?: ButtonVariant;
    size?: ButtonSize;
  };

  let {
    class: className,
    variant = "tertiary",
    size = "md",
    type = "button",
    disabled,
    children,
    ...others
  }: ButtonProps = $props();
</script>

<button
  class={cn(
    "cursor-pointer inline-flex items-center justify-center text-neutral-50 rounded-md transition-colors ease-out duration-150",
    size === "md" && "h-7 px-2 min-w-20 text-sm [&_svg]:size-3",
    size === "icon-md" && "size-7 [&_svg]:size-3",
    size === "icon-lg" && "size-8 [&_svg]:size-4",
    variant === "tertiary" && "hover:bg-neutral-700/50",
    className,
  )}
  {type}
  {disabled}
  {...others}
>
  {@render children?.()}
</button>
