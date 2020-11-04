<script lang="ts">
  import Tab from "@components/layout/Tab.svelte";

  interface TabDescriptor {
    icon: string;
    name: unknown;
  }

  export let tabs: Array<TabDescriptor>;
  export let selected: unknown;
</script>

<style lang="scss">
  .tabbed-control {
    display: flex;
    flex-direction: row;
    background-color: var(--color-background-1);
    border-radius: 8px;
  }
</style>

<div class="tabbed-control" role="tablist">
  {#each tabs as tab}
    <Tab
      icon={tab.icon}
      selected={selected === tab.name}
      on:click={() => (selected = tab.name)} />
  {/each}
</div>
