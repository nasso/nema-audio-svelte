<script lang="ts">
  export let pressed: undefined | string | boolean = undefined;
</script>

<style lang="scss">
  @use '@app/scss/normalize';

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
      background-color: var(--color-background-1);
    }
  }
</style>

<button on:click aria-pressed={pressed && `${pressed}`}>
  <slot />
</button>
