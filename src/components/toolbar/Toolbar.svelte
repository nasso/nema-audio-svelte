<script lang="ts">
  import { TracklistMode, ui } from "@app/stores/settings";
  import Icon from "@components/Icon.svelte";
  import Button from "@components/control/Button.svelte";
  import TabbedControl from "@components/control/TabbedControl.svelte";
  import ToggleButton from "@components/control/ToggleButton.svelte";
  import TempoInput from "./TempoInput.svelte";
  import PlayButton from "./PlayButton.svelte";
  import project from "@app/stores/project";
  import player from "@app/stores/player";
</script>

<nav>
  <div class="group left">
    <div class="subgroup">
      <Button>
        <Icon name="basic/stopwatch" />
      </Button>
      <TempoInput bind:value={$project.tempo} />
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
      bind:selected={$ui.tracklistMode}
      tabs={[
        { icon: "edit/list_ul", name: TracklistMode.Timeline },
        { icon: "basic/path", name: TracklistMode.Graph },
      ]}
    />
  </div>

  <div class="group right">
    <Button>
      <Icon name="basic/share" />
    </Button>
  </div>
</nav>

<style lang="scss">
  nav {
    flex-shrink: 0;
    flex-grow: 0;
    height: 28px;
    display: flex;
    justify-content: space-between;
    font-size: 16px;

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
