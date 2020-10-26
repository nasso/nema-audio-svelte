<script lang="ts">
  import type { Track } from "@app/stores/project";

  export let track: Track;
  export let xscroll: number;
</script>

<style lang="scss">
  .track {
    --background-xshift: calc(-1px - var(--xscroll));

    height: var(--track-height);

    border-radius: 8px;

    background-size: 80px 1px, 640px 1px;
    background-position: var(--background-xshift) 0px;
    background-image: linear-gradient(
        to right,
        var(--color-background-0) 1px,
        transparent 1px
      ),
      linear-gradient(
        to right,
        var(--color-background-2) 320px,
        var(--color-background-1) 320px
      );

    transition: opacity var(--anim-short);

    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      display: inline-block;

      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      background-size: 20px 1px;
      background-position: var(--background-xshift) 0px;
      background-image: linear-gradient(
        to right,
        var(--color-background-0) 1px,
        transparent 1px
      );

      opacity: 0.5;
    }

    &.disabled {
      opacity: 0.5;
    }
  }
</style>

<div
  class="track"
  class:disabled={!track.enabled}
  style={`
    --track-height: ${track.height}px;
    --xscroll: ${xscroll}px;
  `} />
