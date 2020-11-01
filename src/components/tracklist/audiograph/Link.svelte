<script lang="ts">
  export let source: { x: number; y: number };
  export let target: { x: number; y: number };
  export let linkWidth: number = 2;
  export let stiffness:
    | number
    | ((offset: { x: number; y: number }) => number) = ({ x }) =>
    1 + 1 / (-1 - Math.abs(x) / 300);

  $: delta = {
    x: target.x - source.x,
    y: target.y - source.y,
  };
  $: stiffnessValue = Math.max(
    0,
    Math.min(
      1,
      typeof stiffness === "number" ? stiffness : stiffness({ ...delta })
    )
  );
  $: invStiffness = 1.0 - stiffnessValue;
</script>

<path
  style="transition: opacity var(--anim-short)"
  fill="none"
  stroke="currentColor"
  stroke-width={linkWidth}
  d={`
    M ${source.x},${source.y}
    c ${delta.x * invStiffness},${0}
      ${delta.x * stiffnessValue},${delta.y}
      ${delta.x},${delta.y}
  `} />
<circle cx={source.x} cy={source.y} r="4" fill="currentColor" />
<circle
  cx={source.x + delta.x}
  cy={source.y + delta.y}
  r="4"
  fill="currentColor" />
