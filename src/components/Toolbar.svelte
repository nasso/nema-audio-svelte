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

    <div class="subgroup">
      <Button>
        <Icon name="misc/dot_05_xl" />
      </Button>
    </div>
  </div>

  <div class="group center">
    <div class="subgroup">
      <ToggleButton icon="media/skip_previous" selected />
      <ToggleButton icon="media/repeat" selected />
    </div>

    <div class="subgroup">
      <Button>
        <Icon name="media/fast_rewind" />
      </Button>
      <PlayButton />
      <Button>
        <Icon name="media/fast_forward" />
      </Button>
    </div>

    <div class="subgroup">
      <TabbedControl
        bind:selected={$uiState.currentView}
        tabs={[{ icon: 'edit/list_ul', name: 'playlist' }, { icon: 'basic/path', name: 'audio_graph' }]} />
    </div>
  </div>

  <div class="group right">
    <div class="subgroup">
      <Button>
        <Icon name="basic/share" />
      </Button>
    </div>
  </div>
</nav>
