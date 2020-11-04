<script lang="ts">
  import type { Clip } from "@api/playlist";
  import { createEventDispatcher } from "svelte";

  export let clip: Clip;
  export let snap: number;
  export let barWidth: number;
  export let color = "var(--color-red)";

  const dispatch = createEventDispatcher();

  function handleResizePointerDown(this: HTMLElement, e: PointerEvent) {
    if (e.button !== 0) {
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startExtent = clip.extent;

    const pointermove = (e: PointerEvent) => {
      const deltaX = e.clientX - startX;
      let extent = startExtent + deltaX / barWidth;

      if (!e.altKey) {
        extent = Math.round(extent / snap) * snap;
      }

      clip.extent = extent;
    };

    const pointerup = (e: PointerEvent) => {
      this.removeEventListener("pointermove", pointermove);
      this.removeEventListener("pointerup", pointerup);
      this.releasePointerCapture(e.pointerId);
    };

    this.addEventListener("pointermove", pointermove);
    this.addEventListener("pointerup", pointerup);
    this.setPointerCapture(e.pointerId);
  }
</script>

<style lang="scss">
  .clip {
    display: flex;

    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;

    .content {
      display: flex;

      border-radius: 8px;
      overflow: hidden;

      .region {
        background: var(--clip-color);

        &.instance {
          opacity: 0.5;
        }
      }
    }

    .resize-handle {
      position: absolute;
      top: 0;
      right: -4px;
      bottom: 0;
      width: 8px;

      display: grid;

      cursor: ew-resize;
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
  <div class="content">
    <div
      class="region master"
      style={`width: ${Math.min(clip.length, clip.extent) * barWidth}px`} />
    {#if clip.extent > clip.length}
      <div
        class="region instance"
        style={`width: ${(clip.extent - clip.length) * barWidth}px`} />
    {/if}
  </div>
  <div class="resize-handle" on:pointerdown={handleResizePointerDown} />
</div>
