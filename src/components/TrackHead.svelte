<script lang="ts">
  import type { Track } from "../stores/project";
  import { PluginTrack } from "../stores/project";
  import Checkbox from "./Checkbox.svelte";
  import FlexSpace from "./FlexSpace.svelte";
  import HStack from "./HStack.svelte";
  import Knob from "./Knob.svelte";
  import VStack from "./VStack.svelte";

  export let track: Track;
</script>

<style lang="scss">
  .track-head {
    display: grid;
    background: var(--color-background-1);
    height: var(--track-height);
    border-radius: 8px;

    flex-shrink: 0;

    h1,
    h2 {
      margin: 0;
    }

    h1 {
      font-size: 12px;
    }

    h2 {
      font-size: 10px;
      color: var(--color-foreground-2);
    }
  }
</style>

<article
  class="track-head"
  class:disabled={!track.enabled}
  style={`--track-height: ${track.height}px`}>
  <HStack align="center">
    <HStack hpad={16} vpad={8} spacing={8} align="center">
      <Checkbox size={8} bind:checked={track.enabled} />
      <VStack>
        <h1>{track.name}</h1>
        {#if track instanceof PluginTrack}
          <h2>{track.plugin}</h2>
        {/if}
      </VStack>
    </HStack>
    <FlexSpace />
    <VStack spacing={8} hpad={8}>
      {#if track instanceof PluginTrack}
        <Knob type="absolute" bind:value={track.volume} />
        <Knob type="relative" bind:value={track.pan} />
      {/if}
    </VStack>
  </HStack>
</article>
