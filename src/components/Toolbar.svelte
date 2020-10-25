<script lang="ts">
  import Icon from "../components/Icon.svelte";
  import Button from "../components/Button.svelte";
  import TabbedControl from "../components/TabbedControl.svelte";
  import TempoInput from "../components/TempoInput.svelte";
  import ToggleButton from "../components/ToggleButton.svelte";
  import PlayButton from "../components/PlayButton.svelte";
  import uiState from "../stores/ui";

  let bpm = 128;
</script>

<style lang="scss">
  nav {
    flex-shrink: 0;
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
      <Button>
        <Icon name="basic/stopwatch" />
      </Button>
      <TempoInput bind:value={bpm} />
    </div>

    <Button>
      <Icon name="misc/dot_05_xl" />
    </Button>
  </div>

  <div class="group center">
    <div class="subgroup">
      <Button>
        <Icon name="media/skip_previous" />
      </Button>
      <PlayButton />
      <ToggleButton icon="media/repeat" selected />
    </div>

    <TabbedControl
      bind:selected={$uiState.currentView}
      tabs={[{ icon: 'edit/list_ul', name: 'playlist' }, { icon: 'basic/path', name: 'audio_graph' }]} />
  </div>

  <div class="group right">
    <Button>
      <Icon name="basic/share" />
    </Button>
  </div>
</nav>
