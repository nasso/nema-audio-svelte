<script lang="ts">
  import type { Source } from "@api/graph";
  import type { Clip, Track } from "@api/playlist";
  import type { Point } from "@app/utils/geom";

  import { spring } from "svelte/motion";
  import project from "@app/stores/project";
  import VStack from "@components/layout/VStack.svelte";
  import PlaylistTrack from "./Track.svelte";
  import player from "@app/stores/player";

  let cursorPos = 0;
  let playlistWidth = 300;
  let viewRegion: [number, number] = [0, 20];
  let beatWidth: number;
  let barWidth: number;
  let snap: number;
  let movedClip: { clip: Clip; start: number; track: Track<Source> } = null;
  let pointerStart: Point;
  let animatedViewRegion = spring(viewRegion, {
    stiffness: 0.25,
    damping: 1.0,
  });

  export function scrollBy(xdelta: number) {
    const span = viewRegion[1] - viewRegion[0];

    viewRegion[0] = Math.max(0, viewRegion[0] + xdelta / barWidth);
    viewRegion[1] = viewRegion[0] + span;
  }

  $: $animatedViewRegion = viewRegion;

  $: barWidth =
    playlistWidth / ($animatedViewRegion[1] - $animatedViewRegion[0]);

  $: if ($player.playing) {
    const update = () => {
      cursorPos =
        ($project.timeToBars($player.currentTime) - $animatedViewRegion[0]) *
        barWidth;
      requestAnimationFrame(update);
    };

    update();
  } else {
    cursorPos =
      ($project.timeToBars($player.startCursor) - $animatedViewRegion[0]) *
      barWidth;
  }

  $: console.log($player.currentTime, $player.startCursor);

  $: {
    // snap is 1 bar by default
    snap = 1;
    beatWidth = barWidth;

    for (let i = 0; i < 4 && beatWidth / 2 >= 15; i++) {
      beatWidth /= 2;
      snap /= 2;
    }
  }

  function initPlaylistWidth(node: HTMLElement) {
    playlistWidth = node.getBoundingClientRect().width;
  }

  function handleWheel(this: HTMLElement, e: WheelEvent) {
    if (e.ctrlKey) {
      e.preventDefault();

      const rect = this.getBoundingClientRect();
      const wheelDelta = Math.sign(e.deltaY);
      const scaling = 1.0 + wheelDelta * 0.1;
      const aimedTime = viewRegion[0] + (e.clientX - rect.left) / barWidth;

      for (let i = 0; i < 2; i++) {
        const t = viewRegion[i];
        const d = t - aimedTime;

        viewRegion[i] = Math.max(0, aimedTime + d * scaling);
      }
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

<style lang="scss">
  .playlist {
    position: relative;

    overflow: hidden;

    .cursor {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 1px;

      background: var(--color-accent);

      opacity: 0.5;

      transform: translateX(var(--x));
    }
  }
</style>

<svelte:window
  on:keydown={handleGlobalKeyDown}
  on:keyup={handleGlobalKeyUp}
  on:pointerup={(e) => {
    if (e.button !== 0) {
      return;
    }

    movedClip = null;
  }} />

<div
  class="playlist"
  use:initPlaylistWidth
  bind:clientWidth={playlistWidth}
  on:wheel={handleWheel}
  on:pointerdown={(e) => {
    if (e.button !== 0) {
      return;
    }

    pointerStart = { x: e.clientX, y: e.clientY };
  }}
  on:pointermove={(e) => {
    if (movedClip) {
      const delta = e.clientX - pointerStart.x;
      let start = movedClip.start + delta / barWidth;

      if (!e.altKey) {
        start = Math.round(start / snap) * snap;
      }

      start = Math.max(-movedClip.clip.extentPast, start);
      movedClip.clip.start = start;

      $project.tracks = $project.tracks;
    }
  }}>
  <VStack spacing={4}>
    {#each $project.tracks as track}
      <PlaylistTrack
        bind:track
        viewRegion={$animatedViewRegion}
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
  <div class="cursor" style={`--x: ${cursorPos}px`} />
</div>
