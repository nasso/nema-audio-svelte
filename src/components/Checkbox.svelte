<script lang="ts">
  export let checked: boolean = false;
  export let size: number = 12;
  export let color: string = "var(--color-accent)";
</script>

<style lang="scss">
  .checkbox {
    line-height: 0;

    svg {
      overflow: visible;
    }
  }
</style>

<label class="checkbox" on:contextmenu>
  <input type="checkbox" hidden bind:checked />
  <svg width={size} height={size}>
    <circle
      cx="50%"
      cy="50%"
      r={size / 2 - 0.5}
      stroke={color}
      stroke-width="1px"
      fill="none" />

    <g transform={`translate(${size / 2} ${size / 2})`}>
      <circle
        cx="0%"
        cy="0%"
        fill={color}
        r={checked ? size / 4 : 0}
        opacity={checked ? 1 : 0}
        style="transition: r var(--anim-short), opacity var(--anim-short);" />
    </g>
  </svg>
</label>
