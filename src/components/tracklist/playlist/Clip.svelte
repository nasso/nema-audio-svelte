<script lang="ts">
  import type { Clip } from "@api/playlist";
  import { createEventDispatcher } from "svelte";
  import { AudioClip } from "@api/audio";
  import AudioWaveform from "./AudioWaveform.svelte";

  export let clip: Clip;
  export let visibleRange: [number, number];
  export let snap: number;
  export let secWidth: number;
  export let color = "var(--color-red)";

  enum ResizeSide {
    Start = "start",
    End = "end",
  }

  const dispatch = createEventDispatcher();

  function resizer(node: HTMLElement, side: ResizeSide) {
    function handlePointerDown(this: HTMLElement, e: PointerEvent) {
      if (e.button !== 0) {
        return;
      }

      e.stopPropagation();
      e.preventDefault();

      const start = {
        x: e.clientX,
        timePoint: side === ResizeSide.Start ? clip.extentPast : clip.extent,
        extent: clip.extent,
      };

      const pointermove = (e: PointerEvent) => {
        const dt = (e.clientX - start.x) / secWidth;
        let t = start.timePoint + dt;

        if (!e.altKey) {
          t = Math.round(t / snap) * snap;
        }

        if (side === ResizeSide.Start) {
          clip.extentPast = Math.max(Math.min(t, 0), -clip.start);
        } else {
          clip.extent = Math.max(t, 0);
        }
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

    node.addEventListener("pointerdown", handlePointerDown);

    return {
      update(newSide: ResizeSide) {
        side = newSide;
      },

      destroy() {
        node.removeEventListener("pointerdown", handlePointerDown);
      },
    };
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

      position: relative;

      &::before,
      &::after {
        content: "";

        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;

        border-radius: inherit;
      }

      &::before {
        background: var(--color-background-2);
      }

      &::after {
        border: 1px solid var(--color-foreground-2);
        opacity: 0.5;
      }

      .data {
        flex-shrink: 0;
        background: var(--color-background-0);
      }
    }

    .resize-handle {
      flex-basis: 0;

      position: relative;
      width: 0px;

      cursor: ew-resize;

      &::after {
        content: "";

        position: absolute;
        top: 0;
        left: -4px;
        bottom: 0;
        width: 8px;

        z-index: 1;
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
    transform: translateX(${(clip.start + clip.extentPast) * secWidth}px);
  `}>
  <div class="resize-handle" use:resizer={'start'} />
  <div
    class="content"
    style={`width: ${Math.max(clip.totalExtent * secWidth, 1)}px`}>
    <div
      class="data"
      style={`
        transform: translateX(${-clip.extentPast * secWidth}px);
        width: ${clip.length * secWidth}px
      `}>
      {#if clip instanceof AudioClip}
        <AudioWaveform blob={clip.blob} {visibleRange} />
      {/if}
    </div>
  </div>
  <div class="resize-handle" use:resizer={'end'} />
</div>
