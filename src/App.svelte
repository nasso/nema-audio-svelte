<script lang="ts">
  import { ui } from "@app/stores/settings";
  import Pane from "@components/Pane.svelte";
  import SplitPane from "@components/layout/SplitPane.svelte";
  import Toolbar from "@components/toolbar/Toolbar.svelte";
  import Tracklist from "@components/tracklist/Tracklist.svelte";
  import player from "./stores/player";
  import project from "./stores/project";

  const paneSnaps = [200];

  let releasedSpacebar = true;
</script>

<svelte:window
  on:keydown={(e) => {
    if (e.key === " " && releasedSpacebar) {
      releasedSpacebar = false;

      $player = $player.toggle($project);
    }
  }}
  on:keyup={(e) => {
    if (e.key === " ") {
      releasedSpacebar = true;
    }
  }}
/>

<main>
  <Toolbar />
  <SplitPane bind:splitpos={$ui.bottomPaneHeight} reverse snaps={paneSnaps}>
    <SplitPane
      bind:splitpos={$ui.sidePaneWidth}
      direction="row"
      snaps={paneSnaps}
    >
      <Pane />
      <Tracklist />
    </SplitPane>
    <Pane />
  </SplitPane>
</main>

<style lang="scss">
  main {
    position: relative;
    margin: 0;
    padding: 4px;

    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100vw;
    height: 100vh;

    background: var(--color-background-0);
    color: var(--color-foreground-0);

    justify-content: stretch;

    & > :global(*) {
      flex-grow: 1;
    }
  }
</style>
