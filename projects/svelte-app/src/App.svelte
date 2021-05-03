<script>
  import './services/overrideFetch.js';
  import { MaterialApp } from 'svelte-materialify';
  import { Router } from '@roxi/routify';
  import { validateLoggedIn } from './stores/user.js';
  import { routes } from '../.routify/routes';
  import LoadingSpinner from './components/loadingSpinner.svelte';
  let theme = 'dark';

  function toggleTheme() {
    if (theme === 'light') theme = 'dark';
    else theme = 'light';
  }
</script>

<MaterialApp {theme}>
  {#await validateLoggedIn()}
    <LoadingSpinner />
  {:then}
    <Router {routes} />
  {/await}
</MaterialApp>
