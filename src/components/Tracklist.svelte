<script lang="ts">
  import project from "../stores/project";
  import TrackHead from "./TrackHead.svelte";
  import VStack from "./VStack.svelte";
</script>

<style lang="scss">
  .tracklist {
    --track-height: 64px;

    display: flex;
    flex-direction: row;
    gap: 4px;

    .content {
      flex-grow: 1;
    }
  }
</style>

<div class="tracklist">
  <VStack spacing={4}>
    {#each $project.tracks as track}
      <TrackHead bind:track />
    {/each}
  </VStack>
  <div class="content">
    <slot />
  </div>
</div>
