<script lang="ts" module>
  // TYPES *********************************************************************************************************************************
  // @ts-ignore
  export type ButtonProps = Omit<ButtonPrimitive.Props, "on:copy"> & { intent?: Intent };

  // STYLES ********************************************************************************************************************************
  export const btnIntent = (intent: Intent) => [bg(intent), hoverBg(intent), disabledBg(intent), focusRing(intent)].join(" ");

  export const BUTTON = tv({
    base: `flex items-center font-medium rounded px-5 py-2.5 
    disabled:cursor-not-allowed
    focus:ring-4 focus:outline-none`,
    variants: {
      intent: {
        dark: [text("white"), btnIntent("dark")],
        light: [text("dark"), btnIntent("light")],
        primary: [text("white"), btnIntent("primary")],
        secondary: [text("white"), btnIntent("secondary")],
        white: [text("dark"), btnIntent("white")],
      },
    },
    defaultVariants: { intent: "primary" },
  });
</script>

<script lang="ts">
  import { cn } from "@/lib/utils.js";
  import { bg, disabledBg, focusRing, hoverBg, text, type Intent } from "@/styles/ui";
  import { Button as ButtonPrimitive } from "bits-ui";
  import { tv } from "tailwind-variants";

  // PROPS *********************************************************************************************************************************
  let { builders = [], children, class: className, intent, ...rest }: ButtonProps = $props();
</script>

<ButtonPrimitive.Root type="button" {builders} class={cn(BUTTON({ intent, className }))} {...rest}>
  {@render children?.()}
</ButtonPrimitive.Root>
