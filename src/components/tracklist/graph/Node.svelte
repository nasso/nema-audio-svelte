<script lang="ts">
  import type { Effect, GraphNode } from "@api/graph";
  import type { Point } from "@app/utils/geom";
  import type { ViewportContext } from "./Graph.svelte";

  import { createEventDispatcher } from "svelte";
  import drag from "@components/actions/drag";
  import Checkbox from "@components/control/Checkbox.svelte";
  import Knob from "@components/control/Knob.svelte";
  import Icon from "@components/Icon.svelte";
  import FlexSpace from "@components/layout/FlexSpace.svelte";
  import HStack from "@components/layout/HStack.svelte";
  import VStack from "@components/layout/VStack.svelte";
  import { writable } from "svelte/store";
  import InputPort from "./InputPort.svelte";
  import OutputPort from "./OutputPort.svelte";

  export let context: ViewportContext;
  export let node: GraphNode<Effect>;
  export let selected = false;

  const dispatch = createEventDispatcher();

  let dragOffset = writable({ x: node.x, y: node.y });

  // no circular dependency here because `writable` is lazy
  function updateDragOffset(pos: Point) {
    $dragOffset.x = pos.x;
    $dragOffset.y = pos.y;
  }

  function updateNodePos(pos: Point) {
    node.x = pos.x;
    node.y = pos.y;
  }

  $: updateDragOffset(node);
  $: updateNodePos($dragOffset);
</script>

<section
  class="module"
  class:disabled={!node.enabled}
  class:selected
  on:pointerdown
  style={`transform: translate(${node.x}px, ${node.y}px);`}
>
  <div class="inputs">
    <VStack spacing={8}>
      {#each { length: node.mod.inputs } as _, input}
        <InputPort
          bind:context
          link={node.inputs.get(input)}
          on:wiretake={() => dispatch("wiretake", input)}
          on:connect={() => dispatch("connect", input)}
        />
      {/each}
    </VStack>
  </div>

  <div class="outputs">
    <VStack spacing={8}>
      {#each { length: node.mod.outputs } as _, output}
        <OutputPort
          bind:context
          output={{ node, output }}
          on:wireout={(e) =>
            dispatch("wireout", {
              output,
              portElem: e.detail.portElem,
            })}
        />
      {/each}
    </VStack>
  </div>

  <VStack>
    <header
      use:drag={{ button: 0, offset: dragOffset, stopPropagation: false }}
    >
      <HStack hpad={4} vpad={2} spacing={8} align="center">
        <HStack hpad={4} vpad={2} spacing={8} align="center">
          <Checkbox bind:checked={node.enabled} size={8} />
          <h2>{node.mod.name}</h2>
        </HStack>
        <FlexSpace />
        <Icon name="arrow/chevron_down" color="var(--color-foreground-2)" />
      </HStack>
    </header>
    <div class="parameters">
      <HStack hpad={8} spacing={16} align="end">
        {#each node.mod.parameters as param}
          <div class="parameter">
            <VStack align="center" spacing={2} vpad={4}>
              <Knob
                id={`${node.id}-${param.name}`}
                bind:value={param.value}
                type={param.type}
                min={param.min}
                max={param.max}
                disabled={!node.enabled}
              />
              <label for={`${node.id}-${param.name}`}>{param.name}</label>
            </VStack>
          </div>
        {/each}
      </HStack>
    </div>
  </VStack>
</section>

<style lang="scss">
  .module {
    display: grid;
    position: absolute;
    height: 64px;
    background: var(--color-background-1);
    border-radius: var(--corner-radius);

    transition: background-color var(--anim-short);

    h2 {
      font-size: 12px;
      transition: opacity var(--anim-short);
    }

    .inputs,
    .outputs {
      display: flex;
      align-items: center;
      position: absolute;
      top: 0;
      bottom: 0;
    }

    .inputs {
      right: 100%;
    }

    .outputs {
      left: 100%;
    }

    .parameters {
      display: grid;
      justify-items: center;

      .parameter {
        label {
          font-size: 10px;
          color: var(--color-foreground-1);
        }
      }
    }

    &.disabled {
      h2 {
        opacity: 0.5;
      }
    }

    &::before {
      pointer-events: none;

      content: "";

      display: inline-block;
      border-radius: var(--corner-radius);

      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      opacity: 0.2;

      transition: opacity var(--anim-short), border var(--anim-short);
    }

    &.selected {
      background: var(--color-background-2);

      &::before {
        border: 1px solid var(--color-foreground-2);
        opacity: 0.5;
      }
    }
  }
</style>
