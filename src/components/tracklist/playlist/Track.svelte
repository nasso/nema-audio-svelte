<script lang="ts">
  import type { Track } from "@api/playlist";
  import project from "@app/stores/project";
  import Clip from "./Clip.svelte";

  export let track: Track<any>;
  export let viewRegion: [number, number];
  export let snap: number;
  export let secWidth: number;
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

      background-size: var(--snap-width) 1px;
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
  on:pointerenter
  style={`
    height: ${track.height}px;
    --xscroll: ${viewRegion[0] * secWidth}px;
    --snap-width: ${snap * secWidth}px;
    --bar-width: ${$project.barsToTime(1) * secWidth}px;
    --beat-width: ${$project.beatsToTime(1) * secWidth}px;
  `}>
  <div class="clips">
    {#each track.clips as clip}
      <Clip
        bind:clip
        {secWidth}
        {snap}
        visibleRange={[Math.max(viewRegion[0] - clip.start - clip.extentPast, 0) + clip.extentPast, clip.extent + Math.min(viewRegion[1] - clip.start - clip.extent, 0)]}
        on:cliptake />
    {/each}
  </div>
</div>
