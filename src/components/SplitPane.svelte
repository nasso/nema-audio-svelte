<script>
  import SplitBar from './SplitBar.svelte';

  export let direction = 'column';
  export let split_pos = 200;
  export let reverse = false;
</script>

<style lang="scss">
  .split-pane {
    display: inline-grid;
    gap: 2px;

    $pane-width: calc(var(--split-pos, 50%) - 4px / 2);

    &.horizontal {
      grid-template-columns: $pane-width 0px auto;

      &.reverse {
        grid-template-columns: auto 0px $pane-width;
      }

      grid-template-areas: 'first splitter second';
    }

    &.vertical {
      grid-template-rows: $pane-width 0px auto;

      &.reverse {
        grid-template-rows: auto 0px $pane-width;
      }

      grid-template-areas:
        'first'
        'splitter'
        'second';
    }

    .splitter {
      grid-area: splitter;
      position: relative;
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
  style={`--split-pos: ${split_pos}px`}
>
  <slot />
  <div class='splitter'>
    <SplitBar bind:split_pos {direction} {reverse} />
  </div>
</div>
