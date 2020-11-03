<script lang="ts">
  import type { Clip } from "@api/playlist";
  import { writable } from "svelte/store";
  import drag from "@components/actions/drag";

  export let clip: Clip;
  export let barWidth: number;
  export let snap: number;
  export let color = "var(--color-red)";

  let dragging = false;
  let dragOffset = writable({ x: 0, y: 0 });

  $: if (dragging && snap) {
    const withoutSnap = clip.start + $dragOffset.x / barWidth;
    const snapped = Math.round(withoutSnap / snap) * snap;

    $dragOffset.x = (snapped - clip.start) * barWidth;
  }
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
  use:drag={{ button: 0, offset: dragOffset }}
  on:dragstart={() => (dragging = true)}
  on:dragend={() => {
    clip.start += $dragOffset.x / barWidth;
    $dragOffset = { x: 0, y: 0 };
    dragging = false;
  }}
  class="clip"
  style={`
    --clip-color: ${color};
    transform: translateX(${clip.start * barWidth + $dragOffset.x}px);
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
