<script>
  import Navbar from '../components/navbar.svelte';
  import Sidebar from '../components/sidebar.svelte';
  import Breadcrumb from '../components/breadcrumb.svelte';
  import { userStore } from '../stores/user.js';
  import AlertBar from '../components/alertBar.svelte';
  let sidebarOpen = false;
</script>

{#if $userStore.status === 'logedIn'}
  <Sidebar bind:sidebarOpen />
  <Navbar bind:sidebarOpen />
  <Breadcrumb />
{/if}
<slot />
<AlertBar />
