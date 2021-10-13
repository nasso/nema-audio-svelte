<script lang="ts">
  import { GraphNode } from "@api/graph";

  import type { ModuleDesc } from "@app/stores/modules";
  import { modules } from "@app/stores/modules";
  import project from "@app/stores/project";
  import { TracklistMode, ui } from "@app/stores/settings";
  import VStack from "@components/layout/VStack.svelte";

  import Pane from "@components/Pane.svelte";

  $: sortedModules = $modules.sort((a, b) => a.name.localeCompare(b.name));

  function addNode(mod: ModuleDesc) {
    const node = new GraphNode({
      effect: new mod.class(),
      x: 100,
      y: 100,
    });

    project.update((p) => {
      p.graph.nodes.add(node);
      return p;
    });
  }
</script>

<Pane>
  {#if $ui.tracklistMode === TracklistMode.Timeline}
    <!-- TODO: file browser here (samples etc...) -->
  {:else if $ui.tracklistMode === TracklistMode.Graph}
    <VStack>
      {#each sortedModules as mod}
        <button on:click={() => addNode(mod)}>{mod.name}</button>
      {/each}
    </VStack>
  {/if}
</Pane>

<style lang="scss">
  button {
    all: unset;
    padding: 8px;
    margin: 2px 4px;
    background-color: var(--color-background-2);
    border-radius: var(--corner-radius);

    &:hover {
      background-color: var(--color-background-0);
    }

    transition: background-color var(--anim-short);
  }
</style>
