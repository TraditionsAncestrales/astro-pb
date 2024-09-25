<script lang="ts" module>
  // TYPES *********************************************************************************************************************************
  export type TextareaProps = Omit<HTMLTextareaAttributes, "value"> & { value?: string };

  // STYLES ********************************************************************************************************************************
  export const TEXTAREA = tv({
    base: `flex min-h-[80px] w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background 
    placeholder:text-muted-foreground 
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 
    disabled:cursor-not-allowed disabled:opacity-50
    aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive`,
  });
</script>

<script lang="ts">
  import type { HTMLTextareaAttributes } from "svelte/elements";
  import { tv } from "tailwind-variants";

  // PROPS *********************************************************************************************************************************
  let { class: className, value = $bindable(), ...rest }: TextareaProps = $props();
</script>

<textarea bind:value class={TEXTAREA({ className })} {...rest}></textarea>
