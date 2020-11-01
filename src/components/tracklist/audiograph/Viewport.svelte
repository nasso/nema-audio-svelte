<script lang="ts" context="module">
  import type { Writable } from "svelte/store";
  import type { GraphNode } from "@api/graph";

  export type OutputMap = Map<number, Writable<Point>>;
  export type NodeMap = WeakMap<GraphNode, OutputMap>;

  export interface ViewportContext {
    nodeMap: NodeMap;
    viewportElem?: Element;
  }
</script>

<script lang="ts">
  import type { Point } from "@app/utils/geom";
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

  let wireSource: { node: GraphNode; output: number; elem: Element };
  let wireSourcePos = { x: 0, y: 0 };
  let wireEndPos = spring(
    { x: 0, y: 0 },
    {
      stiffness: 0.25,
      damping: 1,
    }
  );

  // recompute the viewportRect only when we started dragging out a new wire
  $: if (wireSource) {
    viewportRect = context.viewportElem.getBoundingClientRect();
  }

  // set the wireSourcePos
  $: if (wireSource?.elem) {
    wireSourcePos = rectCenter(wireSource.elem.getBoundingClientRect());
    wireSourcePos.x -= viewportRect.left;
    wireSourcePos.y -= viewportRect.top;

    wireEndPos.set(wireSourcePos, { hard: true });
  }

  // make the wire go back to its source pos when cancelled (cool animation)
  $: if (wireSource === null) {
    $wireEndPos = wireSourcePos;
  }

  $: if (wireSource) {
    $wireEndPos = {
      x: pointerPos.x - viewportRect.left,
      y: pointerPos.y - viewportRect.top,
    };
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
              on:wireout={(e) => (wireSource = { node: track, output: 0, elem: e.detail.portElem })} />
          </div>
        {/each}
      </VStack>
    </div>
    {#each [...$project.graph.nodes] as node}
      <Node
        bind:context
        bind:node
        on:wireout={(e) => (wireSource = { node, output: e.detail.output, elem: e.detail.portElem })}
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

    <svg class="dragged-wire" class:visible={!!wireSource}>
      <Link source={wireSourcePos} target={$wireEndPos} />
    </svg>
  </div>
</div>
