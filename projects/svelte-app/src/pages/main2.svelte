<script>
  import { fade } from 'svelte/transition';
  import { userStore } from '../stores/user.js';
</script>

<main in:fade={{ delay: 200 }}>
  <h1>main page 2 {$userStore.status}</h1>
</main>

<style>
</style>
