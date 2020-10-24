<script lang="ts">
  import Icon from "./Icon.svelte";

  export let pressed: undefined | string | boolean = undefined;
  export let icon: undefined | string = null;
</script>

<style lang="scss">
  @use '../scss/normalize';

  button {
    @include normalize.button;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background-color: var(--color-background-1);
    padding: 0px 8px;

    transition: background-color var(--anim-short);

    &:hover,
    &:focus {
      background-color: var(--color-background-2);
    }

    &:active {
      background-color: var(--color-background-0);
    }
  }
</style>

<button on:click aria-pressed={pressed && `${pressed}`}>
  {#if icon}
    <Icon size={16} name={icon} />
  {/if}
  <slot />
</button>
