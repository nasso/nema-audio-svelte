<script lang="ts">
  import { ui } from "@app/stores/settings";

  export let id: undefined | string = undefined;
  export let color: string = "var(--color-accent)";
  export let disabledColor: string = "var(--color-foreground-1)";
  export let size: number = 20;
  export let type: "absolute" | "relative" = "absolute";
  export let value: number = 0;
  export let disabled: boolean = false;
  export let min: number = { absolute: 0, relative: -1 }[type];
  export let max: number = { absolute: 1, relative: 1 }[type];
  export let step: undefined | number = undefined;
  export let clamp: boolean = true;

  $: normalized = (value - min) / (max - min);
  $: valueArcStart = (type === "absolute" ? 90 : 225) * (Math.PI / 180);
  $: valueArcEnd = (90 + normalized * 270) * (Math.PI / 180);
  $: valueArcLarge = valueArcEnd - valueArcStart > Math.PI;
  $: valueArcSide = valueArcEnd > valueArcStart;
  $: neutral = value === 0;

  $: if (clamp) {
    value = Math.min(max, Math.max(min, value));
  }

  function handlePointerDown(e: PointerEvent) {
    if (e.button !== 0) {
      return;
    }

    const usedPointerLock = $ui.usePointerLock;

    this.onpointermove = (e: PointerEvent) => {
      value -= (e.movementY / 50) * (max - min) * 0.5;
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
  .knob {
    line-height: 0;
  }
</style>

<label
  class="knob"
  style={`
    color: ${disabled ? disabledColor : color};
  `}>
  <input
    type="number"
    hidden
    bind:value
    {id}
    {step}
    {disabled}
    min={clamp && min}
    max={clamp && max} />
  <svg width={size} height={size} on:pointerdown={handlePointerDown}>
    <!-- Background -->
    <circle opacity="0.1" cx="50%" cy="50%" r={size / 2} fill="currentColor" />

    <!-- Stroked stuff -->
    <g
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      fill="none">
      <!-- Little line that shows the value -->
      <g
        transform={`translate(${size / 2} ${size / 2}) rotate(${normalized * 270 - 135})`}>
        <line
          opacity={neutral ? 0.25 : 1}
          style="transition: opacity var(--anim-short)"
          x1="0"
          y1={4 - size / 2}
          x2="0"
          y2={6 - size / 2} />
      </g>

      <!-- Track -->
      <path
        opacity="0.25"
        transform={`translate(${size / 2} ${size / 2}) rotate(-135)`}
        d={`
          M 0,${1 - size / 2}
          A ${size / 2 - 1} ${size / 2 - 1} 0 1 1 ${1 - size / 2},0
        `} />

      <!-- Value track -->
      <path
        transform={`translate(${size / 2} ${size / 2}) rotate(-135)`}
        opacity={Math.abs(valueArcStart - valueArcEnd) < 0.001 ? 0.0 : 1.0}
        style="transition: opacity var(--anim-short)"
        d={`
          M ${Math.cos(valueArcStart) * (1 - size / 2)}
            ${Math.sin(valueArcStart) * (1 - size / 2)}
          A ${size / 2 - 1} ${size / 2 - 1} 0
            ${valueArcLarge ? 1 : 0} ${valueArcSide ? 1 : 0}
            ${Math.cos(valueArcEnd) * (1 - size / 2)}
            ${Math.sin(valueArcEnd) * (1 - size / 2)}
        `} />
    </g>
  </svg>
</label>
