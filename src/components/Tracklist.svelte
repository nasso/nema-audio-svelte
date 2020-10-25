<script lang="ts">
  import project from "../stores/project";
  import SplitBar from "./SplitBar.svelte";
  import TrackHead from "./TrackHead.svelte";
  import VStack from "./VStack.svelte";
</script>

<style lang="scss">
  .tracklist {
    display: flex;
    flex-direction: row;
    gap: 4px;
    overflow: auto;

    .content {
      flex-grow: 1;
    }
  }
</style>

<div class="tracklist">
  <VStack spacing={2}>
    {#each $project.tracks as track}
      <TrackHead bind:track />
      <SplitBar
        bind:position={track.height}
        snaps={[1, 2, 3, 4].map((x) => 64 * x)}
        min={64} />
    {/each}
  </VStack>
  <div class="content">
    <slot />
  </div>
</div>
