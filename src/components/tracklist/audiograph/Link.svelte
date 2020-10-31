<script lang="ts">
  export let x: number;
  export let y: number;
  export let source: DOMRect;
  export let target: DOMRect;
  export let linkWidth: number = 2;
  export let stiffness:
    | number
    | ((offset: { x: number; y: number }) => number) = ({ x }) =>
    1 + 1 / (-1 - Math.abs(x) / 300);

  $: delta = {
    x: target.x + target.width / 2 - (source.x + source.width / 2),
    y: target.y + target.height / 2 - (source.y + source.height / 2),
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
  stroke-linecap="round"
  d={`
    M ${x},${y}
    c ${delta.x * invStiffness},${0}
      ${delta.x * stiffnessValue},${delta.y}
      ${delta.x},${delta.y}
  `} />
<circle cx={x} cy={y} r="4" fill="currentColor" />
<circle cx={x + delta.x} cy={y + delta.y} r="4" fill="currentColor" />
