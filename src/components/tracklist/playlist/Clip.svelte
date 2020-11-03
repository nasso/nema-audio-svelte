<script lang="ts">
  import type { Clip } from "@api/playlist";
  import { createEventDispatcher } from "svelte";

  export let clip: Clip;
  export let barWidth: number;
  export let color = "var(--color-red)";

  const dispatch = createEventDispatcher();
</script>

<style lang="scss">
  .clip {
    display: flex;

    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;

    border-radius: 8px;
    overflow: hidden;

    .region {
      background: var(--clip-color);

      &.instance {
        opacity: 0.5;
      }
    }
  }
</style>

<div
  on:pointerdown={(e) => {
    if (e.button !== 0) {
      return;
    }

    dispatch('cliptake', clip);
  }}
  class="clip"
  style={`
    --clip-color: ${color};
    transform: translateX(${clip.start * barWidth}px);
  `}>
  <div
    class="region master"
    style={`
    width: ${Math.min(clip.length, clip.extent) * barWidth}px;
  `} />
  {#if clip.extent > clip.length}
    <div
      class="region instance"
      style={`
      width: ${(clip.extent - clip.length) * barWidth}px;
    `} />
  {/if}
</div>
