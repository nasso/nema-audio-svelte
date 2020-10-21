<script lang="ts">
  import Button from '../components/Button.svelte';
  import Icon from '../components/Icon.svelte';

  export let icon: string;
</script>

<Button>
  <Icon size={16} name={icon} />
</Button>
