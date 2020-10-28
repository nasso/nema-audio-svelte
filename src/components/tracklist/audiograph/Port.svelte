<script lang="ts">
  export let size: number = 16;
  export let color: string = "var(--color-foreground-2)";
  export let absolute: boolean = false;
  export let x: number = 0;
  export let y: number = 0;

  let wired: boolean = false;
</script>

<style lang="scss">
  .graph-port {
    line-height: 0;
    --scale: 0.5;

    .global-group {
      transition: transform var(--anim-short);

      transform: translate(50%, 50%) scale(var(--scale));
    }

    .circle {
      transition: stroke-width var(--anim-short);
    }

    &:hover,
    &.wired {
      --scale: 0.75;

      &.wired .circle {
        stroke-width: 100%;
      }
    }

    &.absolute {
      position: absolute;

      transform: translate(-50%, -50%) translate(var(--x), var(--y));
    }
  }
</style>

<div
  class="graph-port"
  class:wired
  class:absolute
  style={`
    --x: ${x}px;
    --y: ${y}px;
  `}>
  <svg width={size} height={size}>
    <clipPath id="clip">
      <circle cx="0%" cy="0%" r="50%" />
    </clipPath>

    <g class="global-group">
      <circle
        clip-path="url('#clip')"
        cx="0%"
        cy="0%"
        r="50%"
        stroke={color}
        stroke-width="50%"
        fill="none"
        class="circle" />
    </g>
  </svg>
</div>
