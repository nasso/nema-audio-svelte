<script lang="ts">
  import type { Align } from "./Stack.svelte";
  import Stack from "./Stack.svelte";

  export let align: Align = "stretch";
  export let hpad: number = 0;
  export let vpad: number = 0;
  export let inline: boolean = false;
  export let reverse: boolean = false;
  export let spacing: number = 0;
</script>

<Stack dir="horizontal" {align} {hpad} {vpad} {inline} {reverse} {spacing}>
  <slot />
</Stack>
