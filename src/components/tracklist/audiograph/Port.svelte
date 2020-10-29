<script lang="ts">
  import drag from "@app/utils/drag";
  import { spring } from "svelte/motion";

  export let size: number = 16;
  export let color: string = "var(--color-foreground-2)";
  export let absolute: boolean = false;
  export let x: number = 0;
  export let y: number = 0;
  export let stiffness:
    | number
    | ((offset: { x: number; y: number }) => number) = ({ x }) =>
    1 + 1 / (-1 - Math.abs(x) / 300);

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

  $: stiffnessValue = Math.max(
    0,
    Math.min(
      1,
      typeof stiffness === "number" ? stiffness : stiffness({ ...$dragOffset })
    )
  );
  $: invStiffness = 1.0 - stiffnessValue;
  $: filled = dragging;
  $: linkWidth = dragging ? 4 : 2;
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
  use:drag={{ button: 0, offset: dragOffset }}
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
        class="circle" />
    </g>

    <path
      style="transition: opacity var(--anim-short)"
      transform={`translate(${size / 2} ${size / 2})`}
      opacity={dragging ? 1 : 0}
      fill="none"
      stroke="currentColor"
      stroke-width={linkWidth}
      stroke-linecap="round"
      d={`
        M 0,0
        c ${$dragOffset.x * invStiffness},${0}
          ${$dragOffset.x * stiffnessValue},${$dragOffset.y}
          ${$dragOffset.x},${$dragOffset.y}
      `} />
  </svg>
</div>
