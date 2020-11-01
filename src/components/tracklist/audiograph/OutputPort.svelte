<script lang="ts">
  import type { NodeInput } from "@api/graph";
  import type { ViewportContext } from "./Viewport.svelte";

  import { createEventDispatcher } from "svelte";
  import { spring } from "svelte/motion";
  import drag from "@app/utils/drag";
  import { pointAdd, rectCenter } from "@app/utils/geom";
  import Link from "./Link.svelte";

  export let context: ViewportContext;
  export let links: Set<NodeInput> = undefined;
  export let size: number = 16;
  export let color: string = "var(--color-foreground-2)";

  const dispatch = createEventDispatcher();

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
      return context.nodeMap
        .get(link.node)
        ?.get(link.input)
        ?.subscribe((val) => {
          destRects[index] = val;
        });
    });
  }
</script>

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

<div
  use:drag={{ button: 0, capture: false, element: context.viewportElem, offset: dragOffset }}
  on:dragstart={() => {
    dragging = true;
    dispatch('wireout');
  }}
  on:dragend={() => {
    dragging = false;
    $dragOffset = { x: 0, y: 0 };
  }}
  class="output-port"
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
        <g style="pointer-events: none">
          {#if dragging}
            <Link
              source={rectCenter(elemRect)}
              target={pointAdd(rectCenter(elemRect), $dragOffset)} />
          {/if}
        </g>

        {#if links}
          {#each [...links] as _, i}
            {#if destRects[i]}
              <Link
                linkWidth="var(--link-width)"
                source={rectCenter(elemRect)}
                target={rectCenter(destRects[i])} />
            {/if}
          {/each}
        {/if}
      </g>
    {/if}
  </svg>
</div>
