<script lang="ts" context="module">
  export type Align = "start" | "center" | "end" | "stretch";
  export type Direction = "horizontal" | "vertical";

  export function grow(node: HTMLElement, amount: number = 1) {
    node.style.flexGrow = `${amount}`;
  }

  export function basis(node: HTMLElement, basis: string) {
    node.style.flexBasis = basis;
  }
</script>

<script lang="ts">
  export let dir: Direction = "horizontal";
  export let align: Align = "stretch";
  export let spacing: number = 0;
  export let hpad: number = 0;
  export let vpad: number = 0;
  export let inline: boolean = false;
  export let reverse: boolean = false;
</script>

<div
  class="stack"
  class:inline
  class:reverse
  class:horizontal={dir === "horizontal"}
  class:vertical={dir === "vertical"}
  style={`
    padding: ${vpad}px ${hpad}px;
    gap: ${spacing}px;
    align-items: ${
      {
        start: "flex-start",
        center: "center",
        end: "flex-end",
        stretch: "stretch",
      }[align]
    };
  `}
>
  <slot />
</div>

<style lang="scss">
  .stack {
    display: flex;

    &.inline {
      display: inline-flex;
    }

    &.horizontal {
      flex-direction: row;

      &.reverse {
        flex-direction: row-reverse;
      }
    }

    &.vertical {
      flex-direction: column;

      &.reverse {
        flex-direction: column-reverse;
      }
    }
  }
</style>
