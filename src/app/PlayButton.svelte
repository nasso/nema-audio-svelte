<script lang="ts">
  import ToolbarButton from "./ToolbarButton.svelte";

  export let playing: boolean = false;

  $: icon = playing ? "media/pause_circle_filled" : "media/play_arrow";

  function handleClick() {
    playing = !playing;
  }
</script>

<ToolbarButton {icon} on:click={handleClick} />
