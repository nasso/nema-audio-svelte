<script lang="ts">
  import project from "../stores/project";
  import PlaylistTrack from "./PlaylistTrack.svelte";
  import VStack from "./VStack.svelte";
</script>

<VStack spacing={4}>
  {#each $project.tracks as track}
    <PlaylistTrack bind:track />
  {/each}
</VStack>
