<script lang="ts">
  import type { Clip } from "@api/playlist";

  import { createEventDispatcher, onMount } from "svelte";
  import { AbstractClip, Track } from "@api/playlist";
  import { AudioClip } from "@api/audio";
  import project from "@app/stores/project";
  import player from "@app/stores/player";
  import ClipComponent from "./Clip.svelte";

  export let track: Track<any>;
  export let viewRegion: [number, number];
  export let snap: number;
  export let secWidth: number;
  export let selectedClips: Set<Clip>;

  const dispatch = createEventDispatcher();

  let backgroundCanvas: HTMLCanvasElement;
  let backgroundWidth: number;
  let backgroundHeight: number;
  let backgroundFrame: number;
  let ctx: CanvasRenderingContext2D;

  let ghostClip: AbstractClip = null;
  const audioTypes = /^audio\/.+/;

  async function insertAudioClip(time: number, name: string, blob: Blob) {
    const buffer = await $player.decodeBlob(blob);
    const clip = new AudioClip(name, blob, 0, buffer.duration);

    clip.start = time;
    track.clips = [...track.clips, clip];
  }

  function computeDropTime(e: MouseEvent) {
    const target = e.currentTarget;
    let time = viewRegion[0] + e.clientX / secWidth;

    if (target instanceof HTMLElement) {
      const rect = target.getBoundingClientRect();

      time -= rect.x / secWidth;
    }

    if (!e.altKey) {
      time = Math.round(time / snap) * snap;
    }

    return time;
  }

  function handleDragOver(e: DragEvent) {
    if (e.dataTransfer.types.includes("Files")) {
      const time = computeDropTime(e);

      if (!ghostClip) {
        ghostClip = new AbstractClip("Audio clip");
        ghostClip.length = ghostClip.extent = $project.barsToTime(1);
      }

      ghostClip.start = time;

      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }
  }

  function handleDragLeave(e: DragEvent) {
    ghostClip = null;
  }

  function handleDrop(this: HTMLElement, e: DragEvent) {
    e.preventDefault();
    ghostClip = null;

    const files = e.dataTransfer.files;
    const time = computeDropTime(e);

    for (const file of files) {
      if (file.type.match(audioTypes)) {
        insertAudioClip(time, file.name, file);
      }
    }
  }

  function drawRegions(
    ctx: CanvasRenderingContext2D,
    width: number,
    divwidth: number,
    scroll: number
  ) {
    const xoffset = scroll % (divwidth * 2);

    ctx.beginPath();
    for (let i = 1; i * divwidth - xoffset < width; i += 2) {
      ctx.rect(i * divwidth - xoffset, 0, divwidth, 1);
    }
  }

  function drawDivisions(
    ctx: CanvasRenderingContext2D,
    width: number,
    divwidth: number,
    scroll: number
  ) {
    const xoffset = scroll % divwidth;

    ctx.beginPath();
    for (let i = 0; i * divwidth - xoffset < width; i++) {
      ctx.moveTo(i * divwidth - xoffset, 0);
      ctx.lineTo(i * divwidth - xoffset, 1);
    }
  }

  function redrawBackground() {
    backgroundFrame ?? cancelAnimationFrame(backgroundFrame);

    backgroundFrame = requestAnimationFrame(() => {
      if (!backgroundCanvas) {
        return;
      }

      ctx = ctx ?? backgroundCanvas.getContext("2d");

      backgroundCanvas.width = backgroundWidth * window.devicePixelRatio;
      backgroundCanvas.height = backgroundHeight * window.devicePixelRatio;

      const height = backgroundCanvas.height;

      const style = getComputedStyle(backgroundCanvas);
      const color = style.getPropertyValue("--color-background-0");
      const bg = style.getPropertyValue("--color-background-1");

      backgroundFrame = null;

      ctx.save();
      {
        ctx.scale(1, height);

        ctx.strokeStyle = color;
        ctx.fillStyle = bg;

        drawRegions(
          ctx,
          backgroundWidth,
          $project.barsToTime(4) * secWidth,
          viewRegion[0] * secWidth
        );
        ctx.fill();

        drawDivisions(
          ctx,
          backgroundWidth,
          snap * secWidth,
          viewRegion[0] * secWidth
        );
        ctx.globalAlpha = 0.5;
        ctx.stroke();

        drawDivisions(
          ctx,
          backgroundWidth,
          $project.barsToTime(1) * secWidth,
          viewRegion[0] * secWidth
        );
        ctx.globalAlpha = 1;
        ctx.stroke();
      }
      ctx.restore();
    });
  }

  $: {
    // redraw when any of these change
    $project.tempo;
    $project.signature;
    backgroundWidth;
    backgroundHeight;
    viewRegion;
    secWidth;

    redrawBackground();
  }
</script>

<style lang="scss">
  .track {
    border-radius: var(--corner-radius);

    background: var(--color-background-2);

    transition: opacity var(--anim-short);

    position: relative;
    overflow: hidden;

    &.disabled {
      opacity: 0.5;
    }

    .grid {
      position: absolute;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      color: var(--color-background-0);
    }

    .clips,
    .ghost-clip {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;

      transform: translateX(calc(var(--xscroll) * -1));
    }

    .ghost-clip {
      opacity: 0.5;
      pointer-events: none;
    }
  }
</style>

<div
  class="track"
  class:disabled={!track.enabled}
  on:pointerenter
  on:dragover={handleDragOver}
  on:dragleave={handleDragLeave}
  on:drop={handleDrop}
  style={`
    height: ${track.height}px;
    --xscroll: ${viewRegion[0] * secWidth}px;
    --snap-width: ${snap * secWidth}px;
    --bar-width: ${$project.barsToTime(1) * secWidth}px;
    --beat-width: ${$project.beatsToTime(1) * secWidth}px;
  `}>
  <canvas
    class="grid"
    bind:this={backgroundCanvas}
    bind:clientWidth={backgroundWidth}
    bind:clientHeight={backgroundHeight} />
  <div class="clips">
    {#each track.clips as clip (clip)}
      <ClipComponent
        bind:clip
        selected={selectedClips.has(clip)}
        {secWidth}
        {snap}
        {viewRegion}
        on:pointerdown={(e) => dispatch('pointerdownclip', { clip, e })} />
    {/each}
  </div>

  <div class="ghost-clip">
    {#if ghostClip}
      <ClipComponent
        bind:clip={ghostClip}
        {secWidth}
        {snap}
        {viewRegion}
        on:cliptake />
    {/if}
  </div>
</div>
