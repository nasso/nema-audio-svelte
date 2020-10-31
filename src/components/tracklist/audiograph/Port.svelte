<script lang="ts">
  import type { Writable } from "svelte/store";
  import type { NodeInput } from "@api/graph";
  import type { ViewportContext } from "./Viewport.svelte";
  import { writable } from "svelte/store";
  import { getContext } from "svelte";
  import { spring } from "svelte/motion";
  import drag from "@app/utils/drag";
  import { pointAdd, rectCenter } from "@app/utils/geom";
  import { VIEWPORT_CONTEXT } from "./Viewport.svelte";
  import Link from "./Link.svelte";

  export let input: NodeInput = undefined;
  export let links: Set<NodeInput> = undefined;
  export let size: number = 16;
  export let color: string = "var(--color-foreground-2)";

  const viewportContext: Writable<ViewportContext> = getContext(
    VIEWPORT_CONTEXT
  );

  let elem: Element | HTMLElement | SVGElement = undefined;
  let destRects: DOMRect[] = [];
  let destUnsubs: (() => void)[] = [];
  let elemRect: DOMRect;
  let dragging: boolean = false;
  let dragOffset = spring(
    {
      x: 0,
      y: 0,
    },
    {
      stiffness: 0.25,
      damping: 1,
    }
  );

  $: {
    input;
    links;
    elemRect = elem?.getBoundingClientRect();
  }

  $: if (links) {
    for (let unsub of destUnsubs) {
      if (unsub) {
        unsub();
      }
    }

    destRects = new Array(links.size);
    destUnsubs = [...links].map((link, index) => {
      return $viewportContext.nodeMap
        .get(link.node)
        ?.get(link.input)
        ?.subscribe((val) => {
          destRects[index] = val;
        });
    });
  }

  $: if (input) {
    let inputMap = $viewportContext.nodeMap.get(input.node);

    if (!inputMap) {
      inputMap = new Map();
      $viewportContext.nodeMap.set(input.node, inputMap);
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
  use:drag={{ button: 0, capture: $viewportContext.viewportElem, offset: dragOffset }}
  on:dragstart={() => {
    dragging = true;
  }}
  on:dragend={() => {
    dragging = false;
    $dragOffset = { x: 0, y: 0 };
  }}
  class="graph-port"
  style={`
    color: ${color};
  `}>
  <svg width={size} height={size} bind:this={elem}>
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
        class="circle" />
    </g>

    {#if elemRect}
      <g transform={`translate(${-elemRect.x} ${-elemRect.y})`}>
        {#if dragging}
          <Link
            source={rectCenter(elemRect)}
            target={pointAdd(rectCenter(elemRect), $dragOffset)} />
        {/if}

        {#if links}
          {#each [...links] as link, i}
            {#if destRects[i]}
              <Link
                source={rectCenter(elemRect)}
                target={rectCenter(destRects[i])} />
            {/if}
          {/each}
        {/if}
      </g>
    {/if}
  </svg>
</div>
