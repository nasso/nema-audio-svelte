<script lang="ts">
  import { AudioTrack } from "@api/audio";
  import project from "@app/stores/project";
  import Icon from "@components/Icon.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function handleClick() {
    const track = new AudioTrack();

    $project.tracks = [...$project.tracks, track];
    dispatch("newtrack", track);
  }
</script>

<style lang="scss">
  @use '@app/scss/normalize';

  .new-track-head {
    @include normalize.button;

    flex-shrink: 0;

    display: flex;
    height: 64px;
    align-items: center;
    justify-content: center;

    font-size: 24px;
    color: var(--color-foreground-2);

    background-color: var(--color-background-0);
    border-radius: 8px;

    transition: background-color var(--anim-short), color var(--anim-short);

    &:hover,
    &:focus {
      background-color: var(--color-background-2);
      color: var(--color-foreground-0);
    }

    &:active {
      background-color: var(--color-background-1);
      color: var(--color-foreground-1);
    }
  }
</style>

<button class="new-track-head" on:click={handleClick}>
  <Icon name="edit/plus" />
</button>
