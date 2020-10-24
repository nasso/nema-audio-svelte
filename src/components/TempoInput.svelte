<script lang="ts">
  import { tick } from "svelte";
  import Icon from "./Icon.svelte";

  export let value: number;
  export let min: number = 0.01;
  export let max: number = 999.99;
  export let usePointerLock: boolean = false;

  let readonly = true;

  $: fieldValue = value.toFixed(2);
  $: value = Math.min(max, Math.max(min, value));

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      this.blur();
    }
  }

  async function handleDblClick() {
    readonly = false;

    await tick();
    this.focus();
    this.select();
  }

  async function handleBlur() {
    if (["number", "string"].includes(typeof fieldValue)) {
      const num = Number(fieldValue);

      // only update the value if it's valid
      if (Number.isFinite(num)) {
        value = num;
      }
    } else {
      // TODO: find a better way to update fieldValue ??
      value = value + 1;
      value = value - 1;
    }

    readonly = true;
  }

  function handleWheel(e: WheelEvent) {
    const side = Math.sign(e.deltaY);
    const factor = e.shiftKey ? 2 : 1;

    value -= side * factor;
  }

  function handlePointerDown(e: PointerEvent) {
    const usedPointerLock = usePointerLock;
    const startValue = value;
    let deltaY = 0;

    this.onpointermove = (e: PointerEvent) => {
      deltaY += e.movementY;

      value = startValue - Math.round(deltaY / 4);
    };

    this.onpointerup = (e: PointerEvent) => {
      this.onpointermove = null;
      this.onpointerup = null;

      if (usedPointerLock) {
        document.exitPointerLock();
      } else {
        this.releasePointerCapture(e.pointerId);
      }
    };

    if (usedPointerLock) {
      this.requestPointerLock();
    } else {
      this.setPointerCapture(e.pointerId);
    }
  }
</script>

<style lang="scss">
  @use '../scss/normalize';

  .tempo-root {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    padding: 2px 2px;
    border-radius: 8px;
    background: var(--color-background-1);
    cursor: ns-resize;
    color: var(--color-foreground-2);

    input {
      @include normalize.input;

      width: 43px;
      cursor: inherit;
      text-align: center;
      user-select: none;
      border-radius: 6px;
      font-size: 12px;
      color: var(--color-foreground-0);

      &:not([readonly]) {
        background: var(--color-background-2);
        cursor: text;
      }
    }
  }
</style>

<div
  class="tempo-root"
  on:wheel={handleWheel}
  on:pointerdown={handlePointerDown}>
  <input
    {min}
    {max}
    type="number"
    bind:value={fieldValue}
    {readonly}
    on:blur={handleBlur}
    on:dblclick={handleDblClick}
    on:keydown={handleKeyDown} />
  <Icon size={16} name="arrow/unfold_more" />
</div>
