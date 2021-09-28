<script lang="ts">
  import Button from "@components/control/Button.svelte";
  import Icon from "@components/Icon.svelte";

  export let icon: string;
  export let selected: boolean = false;

  $: iconColor = selected ? "var(--color-accent)" : "var(--color-foreground-2)";

  function handleClick() {
    selected = !selected;
  }
</script>

<Button on:click={handleClick} pressed={selected ? "true" : "false"}>
  <Icon name={icon} color={iconColor} />
</Button>
