<script lang="ts">
  import project from "../stores/project";
  import uiState from "../stores/ui";
  import FlexSpace from "./FlexSpace.svelte";
  import NewTrackHead from "./NewTrackHead.svelte";
  import SplitBar from "./SplitBar.svelte";
  import SplitPane from "./SplitPane.svelte";
  import TrackHead from "./TrackHead.svelte";
  import VStack from "./VStack.svelte";
</script>

<style lang="scss">
  .tracklist {
    display: grid;
    overflow: hidden;

    .content {
      flex-grow: 1;
      display: grid;
    }
  }
</style>

<div class="tracklist">
  <SplitPane
    direction="row"
    min={150}
    snaps={[150, 200, 250]}
    bind:splitpos={$uiState.trackHeadsWidth}>
    <VStack spacing={1}>
      <VStack spacing={2}>
        {#each $project.tracks as track}
          <TrackHead bind:track />
          <SplitBar
            bind:position={track.height}
            snaps={[1, 2, 3, 4].map((x) => 64 * x)}
            min={64} />
        {/each}
      </VStack>
      <FlexSpace />
      <NewTrackHead />
    </VStack>
    <div class="content">
      <slot />
    </div>
  </SplitPane>
</div>
