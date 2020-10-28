<script lang="ts">
  export let size: number = 16;
  export let color: string = "var(--color-foreground-2)";

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
  }
</style>

<div class="graph-port">
  <svg width={size} height={size} class:wired>
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
