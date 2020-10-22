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
  import { fade } from 'svelte/transition';

  export let name: string;
  export let color = "currentColor";
  export let size = 24;

  $: path = getIconPath(name);
</script>

<svg width="{size}" height="{size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  {#await path then path}
    <path in:fade d={path} fill={color} />
  {/await}
</svg>
