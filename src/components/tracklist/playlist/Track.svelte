<script lang="ts">
  import type { Source } from "@api/graph";
  import type { Track } from "@api/playlist";
  import Clip from "./Clip.svelte";

  export let track: Track<Source>;
  export let xscroll: number;
  export let barWidth: number;
  export let beatWidth: number;
  export let snap: number;
</script>

<style lang="scss">
  .track {
    --background-xshift: calc(-1px - var(--xscroll));
    --bar-group-width: calc(var(--bar-width) * 8);

    border-radius: 8px;

    background-size: var(--bar-width) 1px, calc(var(--bar-group-width) * 2) 1px;
    background-position: var(--background-xshift) 0px;
    background-image: linear-gradient(
        to right,
        var(--color-background-0) 1px,
        transparent 1px
      ),
      linear-gradient(
        to right,
        var(--color-background-2) var(--bar-group-width),
        var(--color-background-1) var(--bar-group-width)
      );

    transition: opacity var(--anim-short);

    position: relative;
    overflow: hidden;

    &.disabled {
      opacity: 0.5;
    }

    &::before {
      content: "";
      display: inline-block;

      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      background-size: var(--beat-width) 1px;
      background-position: var(--background-xshift) 0px;
      background-image: linear-gradient(
        to right,
        var(--color-background-0) 1px,
        transparent 1px
      );

      opacity: 0.5;
    }

    .clips {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;

      transform: translateX(calc(var(--xscroll) * -1));
    }
  }
</style>

<div
  class="track"
  class:disabled={!track.enabled}
  style={`
    height: ${track.height}px;
    --xscroll: ${xscroll}px;
    --bar-width: ${barWidth}px;
    --beat-width: ${beatWidth}px;
  `}>
  <div class="clips">
    {#each track.clips as clip}
      <Clip bind:clip {barWidth} {snap} />
    {/each}
  </div>
</div>
