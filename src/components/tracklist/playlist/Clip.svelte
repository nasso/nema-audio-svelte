<script lang="ts" context="module">
  enum ResizeSide {
    Start = "start",
    End = "end",
  }
</script>

<script lang="ts">
  import type { Clip } from "@api/playlist";
  import { createEventDispatcher } from "svelte";

  export let clip: Clip;
  export let snap: number;
  export let barWidth: number;
  export let color = "var(--color-red)";

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
        time: side === ResizeSide.Start ? clip.start : clip.extent,
        start: clip.start,
        extent: clip.extent,
      };

      const pointermove = (e: PointerEvent) => {
        const dt = (e.clientX - start.x) / barWidth;
        let t = start.time + dt;

        if (!e.altKey) {
          t = Math.round(t / snap) * snap;
        }

        if (side === ResizeSide.Start) {
          clip.start = t;
          clip.extent = start.extent - t + start.start;
        } else {
          clip.extent = t;
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

      &::before {
        content: "";

        opacity: 0.5;

        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;

        background: var(--clip-color);
      }

      .data {
        background: var(--clip-color);
      }
    }

    .resize-handle {
      flex-basis: 0;

      position: relative;
      width: 0px;

      cursor: ew-resize;

      &::before {
        content: "";

        position: absolute;
        top: 0;
        left: -4px;
        bottom: 0;
        width: 8px;
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
  <div class="resize-handle" use:resizer={'start'} />
  <div class="content" style={`width: ${clip.extent * barWidth}px`}>
    <div class="data" style={`width: ${clip.length * barWidth}px`} />
  </div>
  <div class="resize-handle" use:resizer={'end'} />
</div>
