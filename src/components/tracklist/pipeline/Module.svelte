<script lang="ts">
  import type { PipelineModule } from "@app/stores/project";
  import drag from "@app/utils/drag";
  import Checkbox from "@components/control/Checkbox.svelte";
  import Knob from "@components/control/Knob.svelte";
  import Icon from "@components/Icon.svelte";
  import FlexSpace from "@components/layout/FlexSpace.svelte";
  import HStack from "@components/layout/HStack.svelte";
  import VStack from "@components/layout/VStack.svelte";
  import Port from "./Port.svelte";

  export let mod: PipelineModule;

  let subs = [];

  function notifySubs({ x, y }) {
    subs.forEach((run) => run({ x, y }));
  }

  $: notifySubs({ x: mod.x, y: mod.y });

  const offset = {
    subscribe(run) {
      subs = [...subs, run];

      return () => {
        subs = subs.filter((sub) => sub !== run);
      };
    },

    set({ x, y }) {
      mod.x = x;
      mod.y = y;
    },
  };
</script>

<style lang="scss">
  .module {
    display: grid;
    position: absolute;
    height: 64px;
    background: var(--color-background-2);
    border-radius: 8px;

    h2 {
      font-size: 12px;
    }

    .parameters {
      flex-grow: 1;

      display: grid;

      .parameter {
        label {
          font-size: 10px;
          color: var(--color-foreground-2);
        }
      }
    }
  }
</style>

<section
  class="module"
  style={`
    transform: translate(${mod.x || 0}px, ${mod.y || 0}px);
  `}>
  <VStack>
    <header use:drag={{ button: 0, offset }}>
      <HStack hpad={4} vpad={2} spacing={8} align="center">
        <HStack hpad={4} vpad={2} spacing={8} align="center">
          <Checkbox bind:checked={mod.enabled} size={8} />
          <h2>{mod.title}</h2>
        </HStack>
        <FlexSpace />
        <Icon name="arrow/chevron_down" color="var(--color-foreground-2)" />
      </HStack>
    </header>
    <div class="parameters">
      <HStack hpad={8} spacing={8} align="end">
        {#each mod.parameters as param}
          <div class="parameter">
            <VStack align="center">
              <VStack align="center" spacing={2} vpad={4}>
                <Knob id={`${mod.id}-${param}`} />
                <label for={`${mod.id}-${param}`}>{param}</label>
              </VStack>
              <!-- <Port /> -->
            </VStack>
          </div>
        {/each}
      </HStack>
    </div>
  </VStack>
</section>
