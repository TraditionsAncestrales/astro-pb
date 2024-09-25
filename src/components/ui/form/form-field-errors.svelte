<script lang="ts">
  import { cn } from "@/lib/utils.js";
  import * as FormPrimitive from "formsnap";

  type $$Props = FormPrimitive.FieldErrorsProps & {
    errorClasses?: string | undefined | null;
  };

  let className: $$Props["class"] = undefined;
  export { className as class };
  export let errorClasses: $$Props["class"] = undefined;
</script>

<FormPrimitive.FieldErrors
  class={cn("text-sm font-medium text-destructive", className)}
  {...$$restProps}
  let:errors
  let:fieldErrorsAttrs
  let:errorAttrs
>
  <slot {errors} {fieldErrorsAttrs} {errorAttrs}>
    {#if errors.at(-1)}
      <div {...errorAttrs} class={cn(errorClasses)}>{errors.at(-1)}</div>
    {/if}
  </slot>
</FormPrimitive.FieldErrors>
