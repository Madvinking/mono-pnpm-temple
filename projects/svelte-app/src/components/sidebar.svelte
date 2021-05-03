<script>
  import { NavigationDrawer, List, ListItem, Overlay, Divider, Avatar } from 'svelte-materialify';
  import { goto } from '@roxi/routify';
  import { userStore, logOut } from '../stores/user.js';
  export let sidebarOpen = false;

  function changePage(comp) {
    sidebarOpen = false;
    $goto(comp);
  }
</script>

<NavigationDrawer absolute active={sidebarOpen}>
  <br />
  <br />
  <List>
    <ListItem>
      <span slot="prepend" class="ml-n2">
        <Avatar size={40}><img src="//picsum.photos/200" alt="profile" /></Avatar>
      </span>
      {$userStore.name}
    </ListItem>
    <Divider />
    <ListItem on:click={() => changePage('/main')}>Main</ListItem>
    <ListItem on:click={() => changePage('/main2')}>Main2</ListItem>
    <ListItem on:click={() => logOut()}>Logout</ListItem>
  </List>
</NavigationDrawer>
<Overlay active={sidebarOpen} absolute on:click={() => (sidebarOpen = !sidebarOpen)} index={1} />

<style>
</style>
