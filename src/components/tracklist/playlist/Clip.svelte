<script lang="ts">
  import type { Clip } from "@api/playlist";
  import { AudioClip } from "@api/audio";
  import AudioWaveform from "./AudioWaveform.svelte";
  import project from "@app/stores/project";

  export let clip: Clip;
  export let selected: boolean = false;
  export let viewRegion: [number, number];
  export let snap: number;
  export let secWidth: number;
  export let color = "var(--color-red)";

  enum ResizeSide {
    Start = "start",
    End = "end",
  }

  let visibleRange: [number, number];
  $: visibleRange = [
    Math.max(viewRegion[0] - clip.start - clip.extentPast, 0) + clip.extentPast,
    clip.extent + Math.min(viewRegion[1] - clip.start - clip.extent, 0),
  ];

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
          clip.extentPast = Math.max(
            Math.min(t, clip.extent - $project.quantum),
            -clip.start
          );
        } else {
          clip.extent = Math.max(t, clip.extentPast + $project.quantum);
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

<div
  on:pointerdown
  class="clip"
  class:selected
  style={`
    --clip-color: ${color};
    transform: translateX(${Math.round(
      (clip.start + clip.extentPast) * secWidth
    )}px);
  `}
>
  <div class="resize-handle" use:resizer={ResizeSide.Start} />
  <div
    class="content"
    style={`width: ${Math.round(Math.max(clip.totalExtent * secWidth, 1))}px`}
  >
    <header>
      <h3>{clip.name}</h3>
    </header>
    <div
      class="data"
      style={`
        transform: translateX(${-clip.extentPast * secWidth}px);
        width: ${clip.length * secWidth}px;
      `}
    >
      {#if clip instanceof AudioClip}
        <AudioWaveform blob={clip.blob} {visibleRange} />
      {/if}
    </div>
  </div>
  <div class="resize-handle" use:resizer={ResizeSide.End} />
</div>

<style lang="scss">
  .clip {
    display: flex;

    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;

    color: var(--color-foreground-0);

    --header-background-opacity: 0.6;
    --header-background-color: var(--clip-color);
    --header-foreground-color: var(--color-foreground-0);
    --background-opacity: 0.05;
    --background-tint: 0;

    &.selected {
      --background-tint: 0.15;
      --header-background-opacity: 0.8;
    }

    &::before {
      content: "";

      display: inline-block;
      border-radius: var(--corner-radius);

      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      background-color: var(--color-accent);
      opacity: var(--background-tint);

      transition: opacity var(--anim-short);
    }

    .content {
      display: flex;
      flex-direction: column;

      border-radius: var(--corner-radius);
      overflow: hidden;

      position: relative;

      header {
        flex-shrink: 0;

        position: relative;
        color: var(--header-foreground-color);

        &::before {
          content: "";

          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;

          background: var(--header-background-color);
          opacity: var(--header-background-opacity);

          transition: opacity var(--anim-short);
        }

        h3 {
          position: sticky;
          font-size: 11px;
          padding: 2px 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      &::before {
        content: "";

        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;

        border-radius: inherit;
        background: var(--color-foreground-0);
        opacity: var(--background-opacity);

        transition: opacity var(--anim-short);
      }

      .data {
        flex-shrink: 0;
        flex-grow: 1;
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
