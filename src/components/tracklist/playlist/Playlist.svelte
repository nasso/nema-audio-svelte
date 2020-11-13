<script lang="ts">
  import type { Source } from "@api/graph";
  import type { Clip, Track } from "@api/playlist";
  import type { Point } from "@app/utils/geom";
  import type { Player } from "@api/player";

  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import project from "@app/stores/project";
  import player from "@app/stores/player";
  import { shortcuts } from "@components/actions/commands";
  import VStack from "@components/layout/VStack.svelte";
  import PlaylistTrack from "./Track.svelte";

  interface MovedClip<C extends Clip> {
    clip: C;
    start: number;
    track: Track<Source<Player>>;
  }

  let selectedClips: Set<Clip> = new Set();
  let cursorPos = 0;
  let playlistWidth = 300;
  let viewRegion: [number, number] = [0, 20];
  let secWidth: number;
  let snap: number;
  let movedClip: MovedClip<Clip> = null;
  let pointerStart: Point;
  let animatedViewRegion = tweened(viewRegion, {
    duration: 100,
    easing: cubicOut,
  });

  export function scrollBy(xdelta: number) {
    const span = viewRegion[1] - viewRegion[0];

    viewRegion[0] = Math.max(0, viewRegion[0] + xdelta / secWidth);
    viewRegion[1] = viewRegion[0] + span;
  }

  $: animatedViewRegion.set([viewRegion[0], viewRegion[1]]);

  $: secWidth =
    playlistWidth / ($animatedViewRegion[1] - $animatedViewRegion[0]);

  $: {
    // snap is 1 bar by default
    snap = $project.barsToTime(1);

    for (let i = 0; i < 8 && (snap / 2) * secWidth >= 15; i++) {
      snap /= 2;
    }

    if ((snap / 2) * secWidth >= 20) {
      snap = $project.quantum;
    }
  }

  $: if ($player.playing) {
    const update = () => {
      if ($player.playing) {
        cursorPos = ($player.currentTime - $animatedViewRegion[0]) * secWidth;
        requestAnimationFrame(update);
      }
    };

    update();
  } else {
    cursorPos = ($player.startCursor - $animatedViewRegion[0]) * secWidth;
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
      const aimedTime =
        $animatedViewRegion[0] + (e.clientX - rect.left) / secWidth;

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
  use:shortcuts
  on:command={(e) => {
    switch (e.detail) {
      case 'playlist.clip.delete':
        for (const track of $project.tracks) {
          track.clips = track.clips.filter((clip) => !selectedClips.has(clip));
        }

        selectedClips.clear();
        selectedClips = selectedClips;
        break;
      case 'playlist.clip.duplicate':
        for (const track of $project.tracks) {
          const duplicatedClips = track.clips.filter((clip) =>
            selectedClips.has(clip)
          );

          for (const clip of duplicatedClips) {
            // create a clone and leave it here
            track.clips.push(clip.duplicate());

            // move the selected clip forward
            clip.start += clip.totalExtent;
          }
        }

        selectedClips = selectedClips;
        break;
    }
  }}
  on:pointerdown|capture={(e) => {
    if (e.button !== 0) {
      return;
    }

    if (!e.shiftKey) {
      selectedClips.clear();
      selectedClips = selectedClips;
    }

    pointerStart = { x: e.clientX, y: e.clientY };
  }}
  on:pointermove={(e) => {
    if (movedClip) {
      const delta = e.clientX - pointerStart.x;
      let start = movedClip.start + delta / secWidth;

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
        {secWidth}
        {snap}
        {selectedClips}
        on:pointerenter={() => {
          if (movedClip && track.mod.canPlay(movedClip.clip)) {
            movedClip.track.clips = movedClip.track.clips.filter((clip) => clip !== movedClip.clip);
            track.clips = [...track.clips, movedClip.clip];
            movedClip.track = track;
          }
        }}
        on:pointerdownclip={(e) => {
          if (e.detail.e.button !== 0) {
            return;
          }

          movedClip = { clip: e.detail.clip, start: e.detail.clip.start, track };
          selectedClips = selectedClips.add(e.detail.clip);
        }} />
    {/each}
  </VStack>
  <div class="cursor" style={`--x: ${cursorPos}px`} />
</div>
