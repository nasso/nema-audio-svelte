<script lang="ts">
  import project from "@app/stores/project";
  import uiState from "@app/stores/ui";
  import VStack from "@components/layout/VStack.svelte";
  import { spring } from "svelte/motion";
  import PlaylistTrack from "./Track.svelte";

  export let xscroll: number;

  let animatedZoom = spring($uiState.playlistBarWidth, {
    stiffness: 0.25,
    damping: 1.0,
  });

  $: $animatedZoom = $uiState.playlistBarWidth;

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
</script>

<div on:wheel={handleWheel}>
  <VStack spacing={4}>
    {#each $project.tracks as track}
      <PlaylistTrack bind:track {xscroll} visualScale={$animatedZoom} />
    {/each}
  </VStack>
</div>
