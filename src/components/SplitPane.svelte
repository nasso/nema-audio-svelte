<script>
  import SplitBar from "./SplitBar.svelte";

  export let direction = "column";
  export let splitpos = 200;
  export let reverse = false;
</script>

<style lang="scss">
  .split-pane {
    display: inline-grid;
    gap: 2px;
    min-height: 0;
    min-width: 0;

    $pane-size: calc(var(--split-pos, 50%) - 2px);
    $alt-pane-size: calc(100% - var(--split-pos, 50%) - 2px);

    &.horizontal {
      grid-template-columns: $pane-size 0px $alt-pane-size;

      &.reverse {
        grid-template-columns: $alt-pane-size 0px $pane-size;
      }

      grid-template-areas: "first splitter second";
    }

    &.vertical {
      grid-template-rows: $pane-size 0px $alt-pane-size;

      &.reverse {
        grid-template-rows: $alt-pane-size 0px $pane-size;
      }

      grid-template-areas:
        "first"
        "splitter"
        "second";
    }

    .splitter {
      grid-area: splitter;

      display: grid;
    }

    & > :global(*) {
      &:nth-child(1) {
        grid-area: first;
      }

      &:nth-child(2) {
        grid-area: second;
      }
    }
  }
</style>

<div
  class:vertical={direction === 'column'}
  class:horizontal={direction === 'row'}
  class:reverse
  class="split-pane"
  style={`--split-pos: ${splitpos}px`}>
  <slot />
  <div class="splitter">
    <SplitBar bind:position={splitpos} {direction} {reverse} />
  </div>
</div>
