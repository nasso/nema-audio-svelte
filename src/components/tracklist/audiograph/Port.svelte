<script lang="ts">
  import type { NodeInput } from "@api/graph";
  import type { NodeMap } from "./Viewport.svelte";
  import type { Writable } from "svelte/store";
  import { writable } from "svelte/store";
  import { getContext } from "svelte";
  import { spring } from "svelte/motion";
  import { CTX_VIEWPORT_NODE_MAP } from "./Viewport.svelte";
  import Link from "./Link.svelte";

  export let input: NodeInput = undefined;
  export let links: Set<NodeInput> = undefined;
  export let size: number = 16;
  export let color: string = "var(--color-foreground-2)";
  export let absolute: boolean = false;
  export let x: number = 0;
  export let y: number = 0;
  export let stiffness:
    | number
    | ((offset: { x: number; y: number }) => number) = undefined;

  const localNodeMap: NodeMap = getContext(CTX_VIEWPORT_NODE_MAP);

  let elem: Element | HTMLElement | SVGElement = undefined;
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
  let destRects: DOMRect[] = [];
  let destUnsubs: (() => void)[] = [];
  let elemRect: DOMRect;

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
      return localNodeMap
        ?.get(link.node)
        ?.get(link.input)
        ?.subscribe((val) => {
          destRects[index] = val;
        });
    });
  }
  $: if (input) {
    let inputMap = localNodeMap.get(input.node);

    if (!inputMap) {
      inputMap = new Map();
      localNodeMap.set(input.node, inputMap);
    }

    let rect = inputMap.get(input.input);

    if (!rect) {
      rect = writable(null);
      inputMap.set(input.input, rect);
    }

    rect.set(elemRect);
  }

  $: filled = dragging;
  $: linkWidth = 2;

  function handlePointerDown(this: HTMLElement, e: PointerEvent) {
    if (e.button !== 0) {
      return;
    }
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

    &.filled .circle {
      stroke-width: 100%;
    }

    &.absolute {
      position: absolute;

      transform: translate(-50%, -50%) translate(var(--x), var(--y));
    }
  }
</style>

<div
  on:pointerdown={handlePointerDown}
  on:dragstart={() => (dragging = true)}
  on:dragend={() => {
    dragging = false;
    $dragOffset = { x: 0, y: 0 };
  }}
  class="graph-port"
  class:filled
  class:absolute
  style={`
    color: ${color};
    --x: ${x}px;
    --y: ${y}px;
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

    {#if links && elemRect}
      {#each [...links] as link, i}
        {#if destRects[i]}
          <Link
            {linkWidth}
            {stiffness}
            x={size / 2}
            y={size / 2}
            source={elemRect}
            target={destRects[i]} />
        {/if}
      {/each}
    {/if}
  </svg>
</div>
