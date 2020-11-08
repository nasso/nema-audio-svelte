<script lang="ts">
  import type { Track } from "@api/playlist";

  import { writable } from "svelte/store";
  import { tick } from "svelte/internal";

  import drag from "@components/actions/drag";
  import project from "@app/stores/project";
  import uiState, { TracklistMode } from "@app/stores/ui";
  import FlexSpace from "@components/layout/FlexSpace.svelte";
  import SplitBar from "@components/layout/SplitBar.svelte";
  import SplitPane from "@components/layout/SplitPane.svelte";
  import VStack from "@components/layout/VStack.svelte";
  import NewTrackHead from "./NewTrackHead.svelte";
  import TrackHead from "./TrackHead.svelte";
  import Playlist from "./playlist/Playlist.svelte";
  import Graph from "./graph/Graph.svelte";

  let tracklist: HTMLElement;
  let playlist: Playlist;
  let graph: Graph;
  let scrollDelta = writable({
    x: 0,
    y: 0,
  });

  $: if (tracklist) {
    tracklist.scrollTop += $scrollDelta.y;
  }

  $: switch ($uiState.tracklistMode) {
    case TracklistMode.Playlist:
      playlist?.scrollBy($scrollDelta.x);
      break;
    case TracklistMode.Graph:
      graph?.scrollBy($scrollDelta.x);
      break;
  }

  function handleSolo(e: CustomEvent<Track<any>>) {
    const track = e.detail;

    const isSolo = $project.tracks.every((t) => t.enabled === (t === track));

    // enable all the tracks if this track was the only one enabled
    for (let i = 0; i < $project.tracks.length; i++) {
      $project.tracks[i].enabled = isSolo || $project.tracks[i] === track;
    }
  }

  async function handleNewTrack() {
    await tick();
    tracklist.scrollTop = tracklist.scrollHeight - tracklist.clientHeight;
  }
</script>

<style lang="scss">
  .tracklist {
    display: grid;
    overflow: hidden;
    overflow-y: scroll;

    .content {
      flex-grow: 1;
      display: grid;
    }
  }
</style>

<div
  bind:this={tracklist}
  class="tracklist"
  use:drag={{ button: 1, offset: scrollDelta, invert: true, relative: true }}>
  <SplitPane
    direction="row"
    min={150}
    snaps={[150, 200, 250]}
    bind:splitpos={$uiState.trackHeadsWidth}>
    <VStack spacing={1}>
      <VStack spacing={2}>
        {#each $project.tracks as track}
          <TrackHead bind:track on:solo={handleSolo} />
          <SplitBar
            bind:position={track.height}
            snaps={[1, 2, 3, 4].map((x) => 64 * x)}
            min={64} />
        {/each}
      </VStack>
      <FlexSpace />
      <NewTrackHead on:newtrack={handleNewTrack} />
    </VStack>
    <div class="content">
      {#if $uiState.tracklistMode === TracklistMode.Playlist}
        <Playlist bind:this={playlist} />
      {:else if $uiState.tracklistMode === TracklistMode.Graph}
        <Graph bind:this={graph} />
      {/if}
    </div>
  </SplitPane>
</div>
