<script lang="ts">
  import type { Track } from "@app/stores/project";
  import project from "@app/stores/project";
  import Module from "./Module.svelte";
  import Port from "./Port.svelte";

  export let xscroll: number;

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
  }
</style>

<div class="graph-viewport">
  <div
    class="graph-content"
    style={`
      transform: translateX(${-xscroll}px);
    `}>
    {#each $project.tracks as track, index}
      <Port
        absolute
        x={8}
        y={index * 4 + accumulatedHeight[index] - track.height / 2} />
    {/each}
    {#each $project.pipeline.modules as mod}
      <Module {mod} />
    {/each}
  </div>
</div>
