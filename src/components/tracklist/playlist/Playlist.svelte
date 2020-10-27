<script lang="ts">
  import project from "@app/stores/project";
  import VStack from "@components/layout/VStack.svelte";
  import PlaylistTrack from "./PlaylistTrack.svelte";

  export let xscroll: number;
</script>

<VStack spacing={4}>
  {#each $project.tracks as track}
    <PlaylistTrack bind:track {xscroll} />
  {/each}
</VStack>
