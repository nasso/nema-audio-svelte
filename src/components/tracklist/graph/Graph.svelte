<script lang="ts" context="module">
  import type { Writable } from "svelte/store";
  import type { Effect, GraphNode } from "@api/graph";

  export type OutputMap = Map<number, Writable<Point>>;
  export type NodeMap = WeakMap<GraphNode<Effect>, OutputMap>;

  export interface ViewportContext {
    xscroll: number;
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
  import commands from "@components/actions/commands";

  export function scrollBy(xdelta: number) {
    xscroll = Math.max(0, xscroll + xdelta);
  }

  let xscroll = 0;

  let context: ViewportContext = {
    xscroll,
    nodeMap: new WeakMap(),
    viewportElem: null,
  };

  let pointerPos: Point;
  let viewportRect: DOMRect;

  let wireVisible = false;
  let wireSource: { node: GraphNode<Effect>; output: number; pos: Point };
  let wireStartPos = { x: 0, y: 0 };
  let wireEndPos = spring(
    { x: 0, y: 0 },
    {
      stiffness: 0.25,
      damping: 1,
    }
  );

  $: context.xscroll = xscroll;

  // reactive block executes when a new wire is being dragged out
  $: if (wireSource) {
    // recompute the viewportRect
    viewportRect = context.viewportElem.getBoundingClientRect();

    // keep the source pos
    wireStartPos = wireSource.pos;
  }

  // make the wire go back to its source pos when cancelled (cool animation)
  // then hide it
  $: if (wireSource === null) {
    wireEndPos.set(wireStartPos).then(() => {
      wireVisible = false;
    });
  }

  $: if (wireSource) {
    $wireEndPos = toViewportSpace(pointerPos);
  }

  function toViewportSpace(p: Point): Point {
    viewportRect = context.viewportElem.getBoundingClientRect();

    return {
      x: p.x - viewportRect.left,
      y: p.y - viewportRect.top,
    };
  }

  function portCenter(elem: Element): Point {
    return toViewportSpace(rectCenter(elem.getBoundingClientRect()));
  }

  function handleWireOut(pos: Point, node: GraphNode<Effect>, output: number) {
    wireSource = { node, output, pos };
    wireVisible = true;

    // forcefully set the end position to the source pos
    wireEndPos.set(wireSource.pos, { hard: true });
  }

  let selectedNodes = new Set<GraphNode<any>>();

  function deselectAllNodes() {
    selectedNodes.clear();
    selectedNodes = selectedNodes;
  }

  function deleteSelectedNodes() {
    selectedNodes.forEach((node) => {
      project.update((p) => {
        p.graph.deleteNode(node);
        return p;
      });
    });
    selectedNodes.clear();
  }

  function handleNodeClick(e: PointerEvent, node: GraphNode<any>) {
    if (e.button === 0) {
      if (!e.shiftKey) {
        deselectAllNodes();
      }

      selectedNodes = selectedNodes.add(node);
    }
  }
</script>

<svelte:window
  on:pointerdown|capture={(e) => {
    if (e.button === 0 && !e.shiftKey && !e.ctrlKey) {
      deselectAllNodes();
    }
  }}
/>

<div
  class="graph-viewport"
  use:commands={(e) => {
    switch (e.detail) {
      case "graph.node.delete":
        deleteSelectedNodes();
        break;
    }
  }}
  bind:this={context.viewportElem}
  on:pointermove={(e) => (pointerPos = { x: e.clientX, y: e.clientY })}
  on:pointerup={() => (wireSource = null)}
>
  <div class="graph-content" style={`transform: translateX(${-xscroll}px);`}>
    <div class="track-outputs">
      <VStack spacing={4}>
        {#each $project.tracks as track}
          <div class="track" style={`--track-height: ${track.height}px`}>
            <OutputPort
              bind:context
              output={{ node: track, output: 0 }}
              on:wireout={(e) =>
                handleWireOut(portCenter(e.detail.portElem), track, 0)}
            />
          </div>
        {/each}
      </VStack>
    </div>
    {#each [...$project.graph.nodes] as node}
      <Node
        bind:context
        bind:node
        selected={selectedNodes.has(node)}
        on:pointerdown={(e) => handleNodeClick(e, node)}
        on:wiretake={(e) => {
          const input = e.detail;
          const output = node.inputs.get(input);
          const outputPos = context.nodeMap
            .get(output.node)
            ?.get(output.output);

          node = node.disconnectInput(input);

          if (output) {
            handleWireOut(
              toViewportSpace(get(outputPos)),
              output.node,
              output.output
            );
            wireEndPos.set(toViewportSpace(pointerPos), { hard: true });
          }
        }}
        on:wireout={(e) =>
          handleWireOut(portCenter(e.detail.portElem), node, e.detail.output)}
        on:connect={(e) => {
          if (wireSource) {
            const input = e.detail;

            wireSource.node.connect(node, input, wireSource.output);
            wireSource = null;
            wireVisible = false;

            // refresh the node
            node = node;
          }
        }}
      />
    {/each}
  </div>

  {#if wireVisible}
    <svg class="dragged-wire" class:visible={!!wireSource}>
      <Link source={wireStartPos} target={$wireEndPos} />
    </svg>
  {/if}
</div>

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
