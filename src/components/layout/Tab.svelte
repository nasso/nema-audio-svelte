<script lang="ts">
  import Icon from "@components/Icon.svelte";

  export let icon: string;
  export let selected: boolean = false;
</script>

<style lang="scss">
  @use '@app/scss/normalize';

  button {
    @include normalize.button;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    padding: 0px 8px;
    color: var(--color-foreground-2);

    transition: background-color var(--anim-short);

    &:hover,
    &:focus,
    &.selected {
      background-color: var(--color-background-2);
    }

    &:active {
      background-color: var(--color-background-1);
    }

    &.selected {
      color: var(--color-accent);
    }
  }
</style>

<button class:selected role="tab" tabindex={selected ? 0 : -1} on:click>
  <Icon name={icon} />
</button>
