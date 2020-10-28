<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import type { Track } from "@app/stores/project";
  import { PluginTrack } from "@app/stores/project";
  import HStack from "@components/layout/HStack.svelte";
  import VStack from "@components/layout/VStack.svelte";
  import Checkbox from "@components/control/Checkbox.svelte";
  import Knob from "@components/control/Knob.svelte";

  export let track: Track;

  const dispatch = createEventDispatcher();

  function handleMuteContextMenu(this: HTMLElement, e: MouseEvent) {
    // no we're not contextmenu-ing
    e.preventDefault();

    // this is just the best way to handle right clicks on the web. boo!!
    dispatch("solo", track);
  }
</script>

<style lang="scss">
  .track-head {
    display: grid;
    background: var(--color-background-1);
    height: var(--track-height);
    border-radius: 8px;

    flex-shrink: 0;

    h2,
    h3 {
      margin: 0;
    }

    h2 {
      font-size: 12px;
    }

    h3 {
      font-size: 10px;
      color: var(--color-foreground-2);
    }

    .knobs {
      margin-left: auto;
    }

    h2,
    h3,
    .knobs {
      transition: opacity var(--anim-short);
    }

    &.disabled {
      --color-accent: var(--color-foreground-1);

      h2,
      h3,
      .knobs {
        opacity: 0.5;
      }
    }
  }
</style>

<article
  class="track-head"
  class:disabled={!track.enabled}
  style={`--track-height: ${track.height}px`}>
  <HStack align="center">
    <HStack hpad={16} vpad={8} spacing={8} align="center">
      <Checkbox
        size={10}
        bind:checked={track.enabled}
        on:contextmenu={handleMuteContextMenu} />
      <VStack>
        <h2>{track.name}</h2>
        {#if track instanceof PluginTrack}
          <h3>{track.plugin}</h3>
        {/if}
      </VStack>
    </HStack>
    <div class="knobs">
      <VStack spacing={8} hpad={8}>
        {#if track instanceof PluginTrack}
          <Knob type="absolute" bind:value={track.volume} />
          <Knob type="relative" bind:value={track.pan} />
        {/if}
      </VStack>
    </div>
  </HStack>
</article>