<script lang="ts">
  import Button from "../components/Button.svelte";

  export let playing: boolean = false;

  $: icon = playing ? "media/pause_circle_filled" : "media/play_arrow";

  function handleClick() {
    playing = !playing;
  }
</script>

<Button {icon} on:click={handleClick} />
