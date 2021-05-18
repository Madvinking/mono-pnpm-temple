<script>
  import { Alert } from 'svelte-materialify';
  import { fly } from 'svelte/transition';
  import { alertStore } from '../stores/alerts.js';
</script>

<span class="alert">
  <Alert
    class={$alertStore.type}
    dense
    transition={fly}
    transitionOpts={{ duration: 1000 }}
    bind:visible={$alertStore.enable}
    border="bottom"
  >
    {$alertStore.message}
  </Alert>
</span>

<style>
  .alert {
    text-align: center;
    position: fixed;
    width: 60%;
    bottom: 3%;
    left: 20%;
  }
</style>
