<script lang="ts">
  import player from "@app/stores/player";
  import project from "@app/stores/project";

  import Button from "@components/control/Button.svelte";
  import Icon from "@components/Icon.svelte";

  let playing: boolean = $player.playing;

  $: icon = playing ? "media/pause_circle_filled" : "media/play_arrow";

  function handleClick() {
    $player = $player.toggle($project);
    playing = $player.playing;
  }
</script>

<Button on:click={handleClick}>
  <Icon
    name={icon}
    preload={["media/pause_circle_filled", "media/play_arrow"]}
  />
</Button>
