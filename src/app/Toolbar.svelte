<script lang="ts">
  import Button from "../components/Button.svelte";
  import TempoInput from "../components/TempoInput.svelte";
  import ToggleButton from "../components/ToggleButton.svelte";
  import PlayButton from "./PlayButton.svelte";

  let bpm = 128;
</script>

<style lang="scss">
  nav {
    flex-grow: 0;
    height: 28px;
    display: flex;
    justify-content: space-between;

    .left,
    .right {
      flex: 2;
    }

    .left {
      justify-content: flex-start;
    }

    .right {
      justify-content: flex-end;
    }

    .group,
    .subgroup {
      display: inline-flex;
      flex-direction: row;
    }

    .group {
      gap: 32px;
    }

    .subgroup {
      gap: 4px;
    }
  }
</style>

<nav>
  <div class="group left">
    <div class="subgroup">
      <Button icon="basic/stopwatch" />
      <TempoInput bind:value={bpm} />
    </div>

    <div class="subgroup">
      <Button icon="misc/dot_05_xl" />
    </div>
  </div>

  <div class="group center">
    <div class="subgroup">
      <ToggleButton icon="media/skip_previous" selected />
      <ToggleButton icon="media/repeat" selected />
    </div>

    <div class="subgroup">
      <Button icon="media/fast_rewind" />
      <PlayButton />
      <Button icon="media/fast_forward" />
    </div>

    <div class="subgroup">
      <Button icon="edit/list_ul" />
      <Button icon="basic/path" />
    </div>
  </div>

  <div class="group right">
    <div class="subgroup">
      <Button icon="basic/share" />
    </div>
  </div>
</nav>
