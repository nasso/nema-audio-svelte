<script lang="ts">
  import type { Clip } from "@api/playlist";

  export let clip: Clip;
  export let visualScale: number;
  export let color = "var(--color-red)";
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
  class="clip"
  style={`
    --clip-color: ${color};
    transform: translateX(${clip.start * visualScale}px);
  `}>
  <div
    class="region master"
    style={`
    width: ${Math.min(clip.length, clip.extent) * visualScale}px;
  `} />
  {#if clip.extent > clip.length}
    <div
      class="region instance"
      style={`
      width: ${(clip.extent - clip.length) * visualScale}px;
    `} />
  {/if}
</div>
