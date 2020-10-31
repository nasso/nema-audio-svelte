<script lang="ts" context="module">
  import type { Writable } from "svelte/store";

  export type InputMap = Map<number, Writable<DOMRect>>;
  export type NodeMap = WeakMap<AudioGraphNode, InputMap>;

  export const CTX_VIEWPORT_NODE_MAP = "viewport-node-map";
</script>

<script lang="ts">
  import type { AudioGraphNode } from "@api/graph";
  import type { Track } from "@api/project";
  import project from "@app/stores/project";
  import VStack from "@components/layout/VStack.svelte";
  import { setContext } from "svelte";
  import Node from "./Node.svelte";
  import Port from "./Port.svelte";

  export let xscroll: number;

  setContext(CTX_VIEWPORT_NODE_MAP, new WeakMap() as NodeMap);

  function accumulateHeight(tracks: Track[]) {
    const arr = new Array();

    let acc = 0;

    for (const track of tracks) {
      acc += track.height;
      arr.push(acc);
    }

    return arr;
  }

  $: accumulatedHeight = accumulateHeight($project.tracks);
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

<div class="graph-viewport">
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
