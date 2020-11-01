<script lang="ts">
  import type { NodeInput } from "@api/graph";
  import type { ViewportContext } from "./Viewport.svelte";

  import { createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";

  export let context: ViewportContext;
  export let input: NodeInput = undefined;
  export let size: number = 16;
  export let color: string = "var(--color-foreground-2)";

  const dispatch = createEventDispatcher();

  let elem: Element | HTMLElement | SVGElement = undefined;
  let elemRect: DOMRect;

  $: {
    input;
    elemRect = elem?.getBoundingClientRect();
  }

  $: if (input) {
    let inputMap = context.nodeMap.get(input.node);

    if (!inputMap) {
      inputMap = new Map();
      context.nodeMap.set(input.node, inputMap);
    }

    let rect = inputMap.get(input.input);

    if (!rect) {
      rect = writable(null);
      inputMap.set(input.input, rect);
    }

    rect.set(elemRect);
  }
</script>

<style lang="scss">
  .graph-port {
    line-height: 0;
    --scale: 0.5;

    svg {
      overflow: visible;
    }

    .port-group {
      transition: transform var(--anim-short);

      transform: translate(50%, 50%) scale(var(--scale));
    }

    .circle {
      transition: stroke-width var(--anim-short);
    }

    &:hover {
      --scale: 0.75;
    }
  }
</style>

<div
  on:pointerup={(e) => {
    if (input) {
      dispatch('connect');
    }
  }}
  class="graph-port"
  style={`
    color: ${color};
  `}>
  <svg width={size} height={size} bind:this={elem}>
    <g class="port-group">
      <circle cx="0%" cy="0%" r="25%" fill="currentColor" class="circle" />
    </g>
  </svg>
</div>
