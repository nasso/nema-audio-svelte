<script lang="ts">
  import Button from "./Button.svelte";
  import Icon from "./Icon.svelte";

  export let playing: boolean = false;

  $: icon = playing ? "media/pause_circle_filled" : "media/play_arrow";

  function handleClick() {
    playing = !playing;
  }
</script>

<Button on:click={handleClick}>
  <Icon
    name={icon}
    preload={['media/pause_circle_filled', 'media/play_arrow']} />
</Button>
