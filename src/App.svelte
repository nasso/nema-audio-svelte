<script lang="ts">
  import Pane from './components/Pane.svelte';
  import SplitPane from './components/SplitPane.svelte';
  import Toolbar from './app/Toolbar.svelte';
</script>

<main>
  <Toolbar />
  <SplitPane reverse>
    <SplitPane split_pos={200} direction="row">
      <Pane />
      <Pane />
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
