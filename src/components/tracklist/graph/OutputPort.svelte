<script lang="ts">
  import type { Effect, Output } from "@api/graph";
  import type { Point } from "@app/utils/geom";
  import type { ViewportContext } from "./Graph.svelte";

  import { createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  import { rectCenter } from "@app/utils/geom";

  export let context: ViewportContext;
  export let output: Output<Effect>;
  export let size: number = 16;
  export let color: string = "var(--color-foreground-2)";

  const dispatch = createEventDispatcher();

  let elem: Element | HTMLElement | SVGElement = undefined;
  let elemCenter: Point;

  $: if (elem) {
    // be reactive to output.node and output.output
    // when the node moves, output.node is changed because it contains the
    // position
    output;
    context.xscroll;

    // update the center of this port
    elemCenter = rectCenter(elem.getBoundingClientRect());
  }

  // maintain ourselves in the outputMap
  $: if (output) {
    // get the (number => point) map for this node
    let outputMap = context.nodeMap.get(output.node);

    // it can be undefined if this is the first output (id=0)
    if (!outputMap) {
      // create it empty
      outputMap = new Map();

      // assign it to the nodeMap
      context.nodeMap.set(output.node, outputMap);
    }

    // get the store storing the point
    let point = outputMap.get(output.output);

    // it can be undefined if this is the first time we set it
    if (!point) {
      // create an empty store for it
      point = writable(null);

      // assign it to this node's outputMap
      outputMap.set(output.output, point);
    }

    // update it
    point.set(elemCenter);
  }
</script>

<div
  on:pointerdown={(e) => {
    if (e.button !== 0) {
      return;
    }

    dispatch("wireout", { portElem: e.currentTarget });
  }}
  bind:this={elem}
  class="output-port"
  style={`
    color: ${color};
  `}
>
  <svg width={size} height={size}>
    <clipPath id="hole-clip">
      <circle cx="0%" cy="0%" r="50%" />
    </clipPath>

    <g class="port-group">
      <circle
        clip-path="url('#hole-clip')"
        cx="0%"
        cy="0%"
        r="50%"
        stroke="currentColor"
        stroke-width="50%"
        fill="none"
        class="circle"
      />
    </g>
  </svg>
</div>

<style lang="scss">
  .output-port {
    line-height: 0;
    --scale: 0.5;
    --link-width: 2px;

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
      --link-width: 4px;
    }
  }
</style>
