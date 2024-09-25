<script lang="ts" module>
  // TYPES *********************************************************************************************************************************
  export type FormButtonProps = Button.ButtonProps;
</script>

<script lang="ts">
  import * as Button from "@/components/ui/button";

  let { children, ...rest }: FormButtonProps = $props();
</script>

<Button.Root type="submit" {...rest}>
  {@render children?.()}
</Button.Root>
