<script lang="ts">
  import type { Clip } from "@api/playlist";

  import { createEventDispatcher } from "svelte";
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
</script>

<style lang="scss">
  .track {
    --background-xshift: calc(-1px - var(--xscroll));
    --bar-group-width: calc(var(--bar-width) * 8);

    border-radius: var(--corner-radius);

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
