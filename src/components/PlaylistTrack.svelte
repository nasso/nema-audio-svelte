<script lang="ts">
  import type { Track } from "../stores/project";

  export let track: Track;
</script>

<style lang="scss">
  .track {
    height: var(--track-height);

    border-radius: 8px;

    background-size: 80px 1px, 640px 1px;
    background-position: -1px 0px, 0px 0px;
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
      background-position: -1px 0px;
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
  style={`--track-height: ${track.height}px`} />
