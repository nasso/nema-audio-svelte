<script lang="ts">
  import type { Source } from "@api/graph";
  import type { Clip, Track } from "@api/playlist";
  import type { Point } from "@app/utils/geom";

  import project from "@app/stores/project";
  import uiState from "@app/stores/ui";
  import VStack from "@components/layout/VStack.svelte";
  import { spring } from "svelte/motion";
  import PlaylistTrack from "./Track.svelte";

  export let xscroll: number;

  let beatWidth: number;
  let barWidth: number;
  let snap: number;
  let movedClip: { clip: Clip; start: number; track: Track<Source> } = null;
  let pointerStart: Point;
  let animatedZoom = spring($uiState.playlistBarWidth, {
    stiffness: 0.25,
    damping: 1.0,
  });

  $: $animatedZoom = $uiState.playlistBarWidth;
  $: barWidth = $animatedZoom;

  $: {
    // snap is 1 bar by default
    snap = 1;
    beatWidth = barWidth;

    for (let i = 0; i < 4 && beatWidth / 2 >= 15; i++) {
      beatWidth /= 2;
      snap /= 2;
    }
  }

  function handleWheel(this: HTMLElement, e: WheelEvent) {
    if (e.ctrlKey) {
      e.preventDefault();

      const delta = Math.sign(e.deltaY);

      $uiState.playlistBarWidth = Math.min(
        1000,
        $uiState.playlistBarWidth * (1.0 - delta * 0.25)
      );
    }
  }

  function handleGlobalKeyDown(this: HTMLElement, e: KeyboardEvent) {
    if (e.key === "Alt") {
      e.preventDefault();
    }
  }

  function handleGlobalKeyUp(this: HTMLElement, e: KeyboardEvent) {
    if (e.key === "Alt") {
      e.preventDefault();
    }
  }
</script>

<svelte:window on:keydown={handleGlobalKeyDown} on:keyup={handleGlobalKeyUp} />

<div
  on:wheel={handleWheel}
  on:pointerdown={(e) => {
    if (e.button !== 0) {
      return;
    }

    pointerStart = { x: e.clientX, y: e.clientY };
  }}
  on:pointerup={(e) => {
    if (e.button !== 0) {
      return;
    }

    movedClip = null;
  }}
  on:pointermove={(e) => {
    if (movedClip) {
      const delta = e.clientX - pointerStart.x;
      let start = movedClip.start + delta / barWidth;

      if (!e.altKey) {
        start = Math.round(start / snap) * snap;
      }

      start = Math.max(0, start);
      movedClip.clip.start = start;

      $project.tracks = $project.tracks;
    }
  }}>
  <VStack spacing={4}>
    {#each $project.tracks as track}
      <PlaylistTrack
        bind:track
        {xscroll}
        {beatWidth}
        {barWidth}
        {snap}
        on:pointerenter={() => {
          if (movedClip) {
            movedClip.track.remove(movedClip.clip);
            track = track.insert(movedClip.clip);
            movedClip.track = track;
          }
        }}
        on:cliptake={(e) => {
          movedClip = { clip: e.detail, start: e.detail.start, track };
        }} />
    {/each}
  </VStack>
</div>
