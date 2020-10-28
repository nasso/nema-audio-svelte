<script lang="ts">
  import project from "@app/stores/project";
  import Module from "./Module.svelte";

  export let xscroll: number;
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
    {#each $project.pipeline.modules as mod}
      <Module {mod} />
    {/each}
  </div>
</div>
