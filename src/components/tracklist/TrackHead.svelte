<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import type { Source } from "@api/graph";
  import type { Track } from "@api/timeline";

  import HStack from "@components/layout/HStack.svelte";
  import VStack from "@components/layout/VStack.svelte";
  import { grow } from "@components/layout/Stack.svelte";
  import Checkbox from "@components/control/Checkbox.svelte";
  import Knob from "@components/control/Knob.svelte";
  import TextSpring from "@components/TextSpring.svelte";

  export let selected: boolean = false;
  export let track: Track<Source<any>>;

  const dispatch = createEventDispatcher();

  // this is just the best way to handle right clicks on the web. boo!!
  function handleMuteContextMenu(this: HTMLElement, e: MouseEvent) {
    // no we're not contextmenu-ing
    e.preventDefault();

    dispatch("solo", track);
  }
</script>

<article
  class="track-head"
  class:selected
  class:disabled={!track.enabled}
  on:pointerdown
  style={`--track-height: ${track.height}px`}
>
  <HStack align="center">
    <div use:grow>
      <HStack hpad={16} vpad={8} spacing={8} align="center">
        <Checkbox
          size={10}
          bind:checked={track.enabled}
          on:contextmenu={handleMuteContextMenu}
        />
        <div use:grow>
          <VStack>
            <h2><TextSpring>{track.name}</TextSpring></h2>
            {#if track.description}
              <h3>{track.description}</h3>
            {/if}
          </VStack>
        </div>
      </HStack>
    </div>
    <div class="knobs">
      <VStack spacing={8} hpad={8}>
        {#each track.mod.parameters as param}
          <Knob
            type={param.type}
            min={param.min}
            max={param.max}
            bind:value={param.value}
            disabled={!track.enabled}
          />
        {/each}
      </VStack>
    </div>
  </HStack>
</article>

<style lang="scss">
  .track-head {
    display: grid;
    background: var(--color-background-1);
    height: var(--track-height);
    border-radius: var(--corner-radius);
    flex-shrink: 0;

    overflow: hidden;
    position: relative;

    &::before {
      content: "";

      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;

      width: calc(var(--corner-radius) / 2);
      background: var(--color-accent);

      opacity: 0.25;

      transition: opacity var(--anim-short);
    }

    &.selected {
      background: var(--color-background-2);

      &::before {
        opacity: 1;
      }
    }

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
