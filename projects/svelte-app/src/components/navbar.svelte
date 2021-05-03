<script>
  import { AppBar, Checkbox, Divider } from 'svelte-materialify';
  import Hamburger from './hamburger.svelte';
  export let sidebarOpen = false;
  let collapsed = false;
</script>

<AppBar class="primary-color" {collapsed} dense>
  <div slot="icon">
    <Hamburger bind:sidebarOpen />
  </div>
  <span slot="title">Title</span>

  <div style="flex-grow:1" />
  <Checkbox bind:checked={collapsed} />
</AppBar>

<style>
</style>
