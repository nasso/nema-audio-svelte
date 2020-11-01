<script lang="ts" context="module">
  import type { Writable } from "svelte/store";
  import type { GraphNode } from "@api/graph";

  export type OutputMap = Map<number, Writable<Point>>;
  export type NodeMap = WeakMap<GraphNode<any>, OutputMap>;

  export interface ViewportContext {
    nodeMap: NodeMap;
    viewportElem?: Element;
  }
</script>

<script lang="ts">
  import type { Point } from "@app/utils/geom";

  import { get } from "svelte/store";
  import { spring } from "svelte/motion";
  import project from "@app/stores/project";
  import VStack from "@components/layout/VStack.svelte";
  import Link from "./Link.svelte";
  import Node from "./Node.svelte";
  import OutputPort from "./OutputPort.svelte";
  import { rectCenter } from "@app/utils/geom";

  export let xscroll: number;

  let context: ViewportContext = {
    nodeMap: new WeakMap(),
    viewportElem: null,
  };

  let pointerPos: Point;
  let viewportRect: DOMRect;

  let wireConnected = false;
  let wireSource: { node: GraphNode<any>; output: number; pos: Point };
  let wireStartPos = { x: 0, y: 0 };
  let wireEndPos = spring(
    { x: 0, y: 0 },
    {
      stiffness: 0.25,
      damping: 1,
    }
  );

  // reactive block executes when a new wire is being dragged out
  $: if (wireSource) {
    // recompute the viewportRect
    viewportRect = context.viewportElem.getBoundingClientRect();

    // forcefully set the end position to the source pos
    wireEndPos.set(wireSource.pos, { hard: true });

    // keep the source pos
    wireStartPos = wireSource.pos;
  }

  // make the wire go back to its source pos when cancelled (cool animation)
  $: if (wireSource === null) {
    $wireEndPos = wireStartPos;
  }

  $: if (wireSource) {
    $wireEndPos = {
      x: pointerPos.x - viewportRect.left,
      y: pointerPos.y - viewportRect.top,
    };
  }

  function portCenter(elem: Element): Point {
    viewportRect = context.viewportElem.getBoundingClientRect();

    const pos = rectCenter(elem.getBoundingClientRect());

    if (viewportRect) {
      pos.x -= viewportRect.left;
      pos.y -= viewportRect.top;
    }

    return pos;
  }

  function handleWireOut(
    e: CustomEvent<{ portElem: Element }>,
    node: GraphNode<any>,
    output: number
  ) {
    wireSource = { node, output, pos: portCenter(e.detail.portElem) };
    wireConnected = false;
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

    .dragged-wire {
      position: absolute;
      color: var(--color-foreground-2);
      overflow: visible;
      pointer-events: none;

      opacity: 0;

      transition: opacity var(--anim-short);

      &.visible {
        opacity: 1;
      }
    }
  }
</style>

<div
  class="graph-viewport"
  bind:this={context.viewportElem}
  on:pointermove={(e) => (pointerPos = { x: e.clientX, y: e.clientY })}
  on:pointerup={() => (wireSource = null)}>
  <div
    class="graph-content"
    style={`
      transform: translateX(${-xscroll}px);
    `}>
    <div class="track-outputs">
      <VStack spacing={4}>
        {#each $project.tracks as track}
          <div class="track" style={`--track-height: ${track.height}px`}>
            <OutputPort
              bind:context
              output={{ node: track, output: 0 }}
              on:wireout={(e) => handleWireOut(e, track, 0)} />
          </div>
        {/each}
      </VStack>
    </div>
    {#each [...$project.graph.nodes] as node}
      <Node
        bind:context
        bind:node
        on:wiretake={(e) => {
          const input = e.detail;
          const output = node.inputs.get(input);
          const outputPos = context.nodeMap.get(node)?.get(input);

          if (output) {
            wireSource = { node: output.node, output: output.output, pos: get(outputPos) };
          }
        }}
        on:wireout={(e) => handleWireOut(e, node, e.detail.output)}
        on:connect={(e) => {
          if (wireSource) {
            const input = e.detail;

            wireSource.node.connect(node, input, wireSource.output);
            wireSource = null;
            wireConnected = true;

            // refresh the node
            node = node;
          }
        }} />
    {/each}

    {#if !wireConnected}
      <svg class="dragged-wire" class:visible={!!wireSource}>
        <Link source={wireStartPos} target={$wireEndPos} />
      </svg>
    {/if}
  </div>
</div>
