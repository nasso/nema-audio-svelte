<script lang="ts" context="module">
  const paths = {};
  const parser = new DOMParser();

  async function fetchPath(name: string): Promise<string> {
    const response = await fetch(`icons/${name}.svg`);
    const svgSource = await response.text();

    const svg = parser.parseFromString(svgSource, "image/svg+xml");
    const pathElement = svg.getElementsByTagName("path")[0];

    return pathElement.getAttribute("d");
  }

  function getIconPath(name: string) {
    if (!paths[name]) {
      paths[name] = fetchPath(name);
    }

    return paths[name];
  }
</script>

<script lang="ts">
  export let name: string;
  export let preload: string[] = [];
  export let color = "currentColor";
  export let size = "1em";

  preload.forEach(getIconPath);

  $: path = getIconPath(name);
</script>

<style lang="scss">
  path {
    transition: fill var(--anim-short);
  }
</style>

<svg width={size} height={size} viewBox="0 0 24 24">
  {#await path then path}
    <path d={path} fill={color} />
  {/await}
</svg>
