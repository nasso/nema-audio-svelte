<script lang="ts">
  import type { Effect, Output } from "@api/graph";
  import type { Point } from "@app/utils/geom";
  import type { ViewportContext } from "./Graph.svelte";

  import { createEventDispatcher, onDestroy } from "svelte";
  import { rectCenter } from "@app/utils/geom";
  import Link from "./Link.svelte";

  export let context: ViewportContext;
  export let link: Output<Effect>;
  export let size: number = 8;
  export let color: string = "var(--color-foreground-2)";

  const dispatch = createEventDispatcher();

  let elem: HTMLElement = null;
  let linkTarget: Point = null;
  let linkTargetUnsub: () => void = null;

  // unlink!
  $: if (!link) {
    linkTarget = null;

    if (linkTargetUnsub) {
      linkTargetUnsub();
      linkTargetUnsub = null;
    }
  }

  // link!
  $: if (link && elem) {
    if (linkTargetUnsub) {
      linkTargetUnsub();
      linkTargetUnsub = null;
    }

    linkTargetUnsub = context.nodeMap
      .get(link.node)
      ?.get(link.output)
      ?.subscribe((val) => {
        if (val) {
          const rect = elem.getBoundingClientRect();
          const center = rectCenter(rect, true);

          linkTarget = {
            x: val.x - rect.left - center.x,
            y: val.y - rect.top - center.y,
          };
        }
      });
  }

  onDestroy(() => {
    if (linkTargetUnsub) {
      linkTargetUnsub();
    }
  });
</script>

<div
  on:pointerup={(e) => e.button === 0 && dispatch("connect")}
  on:pointerdown={(e) => e.button === 0 && dispatch("wiretake")}
  bind:this={elem}
  class="graph-port"
  style={`
    color: ${color};
  `}
>
  <svg width={size} height={size}>
    <circle
      class="port-dot"
      style="r: var(--dot-size)"
      cx={size / 2}
      cy={size / 2}
      fill="currentColor"
    />
  </svg>

  {#if linkTarget}
    <svg class="link">
      <Link source={{ x: 0, y: 0 }} target={linkTarget} />
    </svg>
  {/if}
</div>

<style lang="scss">
  .graph-port {
    padding: 4px;
    position: relative;
    line-height: 0;
    --dot-size: 25%;

    &:hover {
      --dot-size: 40%;
    }

    .port-dot {
      transition: r var(--anim-short);
    }

    .link {
      color: var(--color-foreground-2);
      overflow: visible;
      position: absolute;
      top: 50%;
      left: 50%;
      pointer-events: none;
    }
  }
</style>
