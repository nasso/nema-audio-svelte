<script lang="ts" context="module">
  import type { Writable } from "svelte/store";
  import type { AudioGraphNode, NodeInput } from "@api/graph";
  import { writable } from "svelte/store";

  export type InputMap = Map<number, Writable<DOMRect>>;
  export type NodeMap = WeakMap<AudioGraphNode, InputMap>;

  export interface ViewportContext {
    nodeMap: NodeMap;
    viewportElem?: Element;
    wireConnect?: (input: NodeInput) => void;
  }

  export const VIEWPORT_CONTEXT = "viewport-node-map";
</script>

<script lang="ts">
  import project from "@app/stores/project";
  import VStack from "@components/layout/VStack.svelte";
  import { setContext } from "svelte";
  import Node from "./Node.svelte";
  import Port from "./Port.svelte";

  export let xscroll: number;

  let context: Writable<ViewportContext> = writable({
    nodeMap: new WeakMap(),
  });

  setContext(VIEWPORT_CONTEXT, context);
</script>

<style lang="scss">
  .graph-viewport {
    position: relative;

    overflow: hidden;

    .track-outputs {
      position: absolute;

      .track {
        display: inline-flex;
        height: var(--track-height);
        flex-direction: column;
        justify-content: space-evenly;
      }
    }
  }
</style>

<div class="graph-viewport" bind:this={$context.viewportElem}>
  <div
    class="graph-content"
    style={`
      transform: translateX(${-xscroll}px);
    `}>
    <div class="track-outputs">
      <VStack spacing={4}>
        {#each $project.tracks as track}
          <div class="track" style={`--track-height: ${track.height}px`}>
            <Port links={track.outputs.get(0)} />
          </div>
        {/each}
      </VStack>
    </div>
    {#each [...$project.graph.nodes] as node}
      <Node bind:node />
    {/each}
  </div>
</div>
