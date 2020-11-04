<script lang="ts">
  import uiState from "@app/stores/ui";
  import Pane from "@components/Pane.svelte";
  import SplitPane from "@components/layout/SplitPane.svelte";
  import Toolbar from "@components/toolbar/Toolbar.svelte";
  import Tracklist from "@components/tracklist/Tracklist.svelte";

  const paneSnaps = [200];
</script>

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

<main>
  <Toolbar />
  <SplitPane
    bind:splitpos={$uiState.bottomPaneHeight}
    reverse
    snaps={paneSnaps}>
    <SplitPane
      bind:splitpos={$uiState.sidePaneWidth}
      direction="row"
      snaps={paneSnaps}>
      <Pane />
      <Tracklist />
    </SplitPane>
    <Pane />
  </SplitPane>
</main>
