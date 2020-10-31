<script lang="ts" context="module">
  import type { Writable } from "svelte/store";
  import type { AudioGraphNode, Outputs } from "@api/graph";

  export type InputMap = Map<number, Writable<DOMRect>>;
  export type NodeMap = WeakMap<AudioGraphNode, InputMap>;

  export interface ViewportContext {
    nodeMap: NodeMap;
    viewportElem?: Element;
  }
</script>

<script lang="ts">
  import project from "@app/stores/project";
  import VStack from "@components/layout/VStack.svelte";
  import Node from "./Node.svelte";
  import Port from "./Port.svelte";

  export let xscroll: number;

  let context: ViewportContext = {
    nodeMap: new WeakMap(),
    viewportElem: null,
  };

  let wireSource: { node: Outputs; output: number } = null;

  function getViewport(node: HTMLElement) {
    context.viewportElem = node;
  }
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

<div class="graph-viewport" use:getViewport>
  <div
    class="graph-content"
    style={`
      transform: translateX(${-xscroll}px);
    `}>
    <div class="track-outputs">
      <VStack spacing={4}>
        {#each $project.tracks as track}
          <div class="track" style={`--track-height: ${track.height}px`}>
            <Port
              bind:context
              links={track.outputs.get(0)}
              on:wireout={() => (wireSource = { node: track, output: 0 })} />
          </div>
        {/each}
      </VStack>
    </div>
    {#each [...$project.graph.nodes] as node}
      <Node
        bind:context
        bind:node
        on:wireout={(e) => (wireSource = { node, output: e.detail })}
        on:connect={(e) => {
          if (wireSource) {
            const input = e.detail;

            wireSource.node.connect(node, input, wireSource.output);
            wireSource = null;

            // refresh the node
            node = node;
          }
        }} />
    {/each}
  </div>
</div>
