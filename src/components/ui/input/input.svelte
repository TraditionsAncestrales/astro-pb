<script lang="ts" module>
  // TYPES *********************************************************************************************************************************
  export type InputProps = HTMLInputAttributes;

  // STYLES ********************************************************************************************************************************
  export const INPUT = tv({
    base: `flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background 
    file:border-0 file:bg-transparent file:text-sm file:font-medium 
    placeholder:text-muted-foreground 
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 
    disabled:cursor-not-allowed disabled:opacity-50
    aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive`,
  });
</script>

<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { tv } from "tailwind-variants";

  // PROPS *********************************************************************************************************************************
  let { class: className, value = $bindable(), ...rest }: InputProps = $props();
</script>

<input class={INPUT({ className })} bind:value {...rest} />
