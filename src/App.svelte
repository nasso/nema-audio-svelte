<script lang="ts">
  import Pane from "./components/Pane.svelte";
  import SplitPane from "./components/SplitPane.svelte";
  import Toolbar from "./components/Toolbar.svelte";
  import Tracklist from "./components/Tracklist.svelte";
  import VStack from "./components/VStack.svelte";
  import project, { PluginTrack } from "./stores/project";
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
      <Tracklist>
        {#if $uiState.currentView === 'playlist'}
          <VStack spacing={4}>
            {#each $project.tracks as track}
              <div style="height: var(--track-height)">
                {track.enabled ? 'enabled' : 'disabled'}
                {#if track instanceof PluginTrack}
                  volume({Math.round(track.volume * 100)}%) pan({Math.round(track.pan * 100)}%)
                {/if}
              </div>
            {/each}
          </VStack>
        {:else if $uiState.currentView === 'audio_graph'}
          <div>this is the audio graph</div>
        {/if}
      </Tracklist>
    </SplitPane>
    <Pane />
  </SplitPane>
</main>
