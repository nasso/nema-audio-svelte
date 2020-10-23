<script lang="ts">
  import ToolbarButton from './ToolbarButton.svelte';
  import TempoInput from '../components/TempoInput.svelte';

  let bpm = 128;
</script>

<nav>
  <div class="group left">
    <div class="subgroup">
      <ToolbarButton icon="basic/stopwatch" />
      <TempoInput bind:value={bpm} />
    </div>

    <div class="subgroup">
      <ToolbarButton icon="misc/dot_05_xl" />
    </div>
  </div>

  <div class="group center">
    <div class="subgroup">
      <ToolbarButton icon="media/skip_previous" />
      <ToolbarButton icon="media/repeat" />
    </div>

    <div class="subgroup">
      <ToolbarButton icon="media/fast_rewind" />
      <ToolbarButton icon="media/play_arrow" />
      <ToolbarButton icon="media/fast_forward" />
    </div>

    <div class="subgroup">
      <ToolbarButton icon="edit/list_ul" />
      <ToolbarButton icon="basic/path" />
    </div>
  </div>

  <div class="group right">
    <div class="subgroup">
      <ToolbarButton icon="basic/share" />
    </div>
  </div>
</nav>

<style lang="scss">
  nav {
    flex-grow: 0;
    height: 28px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 1fr;
    grid-template-areas: "left center right";

    @each $side in (left, right, center) {
      .#{$side} {
        grid-area: $side;
        justify-self: $side;
      }
    }

    .group, .subgroup {
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
