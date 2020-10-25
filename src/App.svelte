<script lang="ts">
  import AudioGraph from "./components/AudioGraph.svelte";
  import Pane from "./components/Pane.svelte";
  import Playlist from "./components/Playlist.svelte";
  import SplitPane from "./components/SplitPane.svelte";
  import Toolbar from "./components/Toolbar.svelte";
  import Tracklist from "./components/Tracklist.svelte";
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
  <SplitPane bind:splitpos={$uiState.bottomPaneHeight} reverse>
    <SplitPane bind:splitpos={$uiState.sidePaneWidth} direction="row">
      <Pane />
      <Tracklist>
        {#if $uiState.currentView === 'playlist'}
          <Playlist />
        {:else if $uiState.currentView === 'audio_graph'}
          <AudioGraph />
        {/if}
      </Tracklist>
    </SplitPane>
    <Pane />
  </SplitPane>
</main>
