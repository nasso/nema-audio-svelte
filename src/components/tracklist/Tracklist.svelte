<script lang="ts">
  import type { Track } from "@api/project";

  import { writable } from "svelte/store";
  import { tick } from "svelte/internal";

  import drag from "@app/utils/drag";
  import project from "@app/stores/project";
  import uiState from "@app/stores/ui";
  import FlexSpace from "@components/layout/FlexSpace.svelte";
  import SplitBar from "@components/layout/SplitBar.svelte";
  import SplitPane from "@components/layout/SplitPane.svelte";
  import VStack from "@components/layout/VStack.svelte";
  import NewTrackHead from "./NewTrackHead.svelte";
  import TrackHead from "./TrackHead.svelte";
  import type { Source } from "@api/graph";

  let tracklist: HTMLElement;
  let scroll = writable({
    x: 0,
    y: 0,
  });

  $: if (tracklist) {
    tracklist.scrollTop = $scroll.y;
    // the user-agent clamps scrollTop for us... tysm user-agent :)
    // we'll kindly steal your value :)
    $scroll.y = tracklist.scrollTop;
  }

  $: $scroll.x = Math.max(0, $scroll.x);

  function handleSolo(e: CustomEvent<Track<any>>) {
    const track = e.detail;

    const isSolo = $project.tracks.every((t) => t.enabled === (t === track));

    // enable all the tracks if this track was the only one enabled
    for (let i = 0; i < $project.tracks.length; i++) {
      $project.tracks[i].enabled = isSolo || $project.tracks[i] === track;
    }
  }

  function handleScroll(this: HTMLElement) {
    // $scroll.x = this.scrollLeft;
    // SIKE! don't touch horizontal scrolling, we take care of it without the ua

    $scroll.y = this.scrollTop;
  }

  async function handleNewTrack() {
    await tick();
    $scroll.y = tracklist.scrollHeight - tracklist.clientHeight;
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
  use:drag={{ button: 1, offset: scroll, invert: true }}
  on:scroll={handleScroll}>
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
      <slot xscroll={$scroll.x} />
    </div>
  </SplitPane>
</div>
