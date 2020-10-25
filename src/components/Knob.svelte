<script lang="ts">
  import uiState from "../stores/ui";

  export let color: string = "var(--color-accent)";
  export let size: number = 20;
  export let type: "absolute" | "relative" = "absolute";
  export let value: number = 0;
  export let min: number = { absolute: 0, relative: -1 }[type];
  export let max: number = { absolute: 1, relative: 1 }[type];
  export let step: undefined | number = undefined;
  export let clamp: boolean = true;

  $: normalized = (value - min) / (max - min);
  $: valueArcStart = (type === "absolute" ? 90 : 225) * (Math.PI / 180);
  $: valueArcEnd = (90 + normalized * 270) * (Math.PI / 180);
  $: valueArcLarge = valueArcEnd - valueArcStart > Math.PI;
  $: neutral = value === 0;

  $: if (clamp) {
    value = Math.min(max, Math.max(min, value));
  }

  function handlePointerDown(e: PointerEvent) {
    const usedPointerLock = $uiState.usePointerLock;

    this.onpointermove = (e: PointerEvent) => {
      value -= (e.movementY / 100) * (max - min) * 0.5;
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

    svg {
      overflow: visible;
    }
  }
</style>

<label class="knob">
  <input
    type="number"
    min={clamp && min}
    max={clamp && max}
    {step}
    bind:value
    hidden />
  <svg width={size} height={size} on:pointerdown={handlePointerDown}>
    <!-- Background -->
    <circle opacity="0.1" cx="50%" cy="50%" r={size / 2} fill={color} />

    <!-- Stroked stuff -->
    <g stroke={color} stroke-width="2" stroke-linecap="round" fill="none">
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
          A ${size / 2 - 1} ${size / 2 - 1} 0 ${valueArcLarge ? 1 : 0} 1
            ${Math.cos(valueArcEnd) * (1 - size / 2)}
            ${Math.sin(valueArcEnd) * (1 - size / 2)}
        `} />
    </g>
  </svg>
</label>
