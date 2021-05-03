<script>
  import { logIn } from '../stores/user.js';
  import { TextField, Row, Col, Button } from 'svelte-materialify';
  import { goto, prefetch } from '@roxi/routify';

  let email = '';
  let password = '';
  prefetch('/main');

  function handleKeydown(e) {
    if (e.keyCode === 13) logIn({ email, password });
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<Row>
  <Col />
  <Col>
    <h1 class="text-center pb-16">Log In</h1>
    <TextField bind:value={email} placeholder="enter email" filled clearable>Email</TextField>
    <br />
    <TextField filled type="password" bind:value={password} clearable>password</TextField>
    <br />
    <Button rounded block class="primary-color" on:click={() => logIn({ email, password })}>LogIn</Button>

    <Button rounded block class="mt-4" on:click={() => $goto('/signup')}>Signup now</Button>
  </Col>
  <Col />
</Row>

<style>
</style>
