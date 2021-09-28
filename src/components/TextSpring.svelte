<script lang="ts">
  export let shrinklimit = 0.8;

  let available = 1;
  let original_width = 1;

  const clamp = (x: number, min: number, max: number) => {
    return Math.min(Math.max(x, min), max);
  };

  $: scale_x = clamp(available / original_width, shrinklimit, 1);
</script>

<div class="root" bind:clientWidth={available}>
  <div class="original" bind:clientWidth={original_width}>
    <slot />
  </div>
  <div
    class="shrinked"
    class:scrolling={original_width * shrinklimit > available}
    style={`
      --scale-x: ${scale_x};
      --scroll-time: ${(original_width - available) / 20}s;
    `}
  >
    <slot />
  </div>
</div>

<style lang="scss">
  .root {
    display: block;

    position: relative;
    height: 1.2em;

    overflow: hidden;
  }

  .original {
    opacity: 0;

    overflow: hidden;
    white-space: nowrap;
    position: absolute;
  }

  .shrinked {
    white-space: nowrap;
    position: absolute;
    left: 0;

    transform-origin: left;
    transform: scaleX(var(--scale-x));

    &.scrolling {
      @keyframes scrolltext {
        from,
        20%,
        to {
          left: 0%;
          transform: scaleX(var(--scale-x)) translateX(0%);
        }

        75%,
        90% {
          left: 100%;
          transform: scaleX(var(--scale-x)) translateX(-100%);
        }
      }

      animation: scrolltext var(--scroll-time) linear;
      animation-iteration-count: infinite;
      animation-direction: repeat;
    }
  }
</style>
