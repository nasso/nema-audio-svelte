<script lang="ts">
  import Pane from "./components/Pane.svelte";
  import SplitPane from "./components/SplitPane.svelte";
  import Toolbar from "./components/Toolbar.svelte";
  import uiState from "./stores/ui";
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
  <SplitPane bind:split_pos={$uiState.bottomPaneHeight} reverse>
    <SplitPane bind:split_pos={$uiState.sidePaneWidth} direction="row">
      <Pane />
      {#if $uiState.currentView === 'playlist'}
        <div>this is the playlist</div>
      {:else if $uiState.currentView === 'audio_graph'}
        <div>this is the audio graph</div>
      {/if}
    </SplitPane>
    <Pane />
  </SplitPane>
</main>
