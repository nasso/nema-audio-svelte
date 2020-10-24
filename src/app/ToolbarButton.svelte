<script lang="ts">
  import Button from "../components/Button.svelte";
  import Icon from "../components/Icon.svelte";

  export let icon: string;
</script>

<Button on:click>
  <Icon size={16} name={icon} />
</Button>
