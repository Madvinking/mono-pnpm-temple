<script>
  import { signUp } from '../stores/user.js';
  import { TextField, Row, Col, Button } from 'svelte-materialify';
  import { goto } from '@roxi/routify';
  let password = '';
  let email = '';
  let name = '';
  let company = '';
  let phone = '';

  function handleKeydown(e) {
    if (e.keyCode === 13) signUp({ email, name, password, company, phone });
  }
</script>

<svelte:window on:keydown={handleKeydown} />
<Row>
  <Col />
  <Col>
    <h1 class="text-center pb-16">Sign Up</h1>
    <TextField bind:value={email} placeholder="enter email" filled clearable>Email</TextField>
    <br />
    <TextField filled type="password" bind:value={password} clearable>password</TextField>
    <br />
    <TextField filled bind:value={name} clearable>name</TextField>
    <br />
    <TextField filled bind:value={company} clearable>company</TextField>
    <br />
    <TextField filled bind:value={phone} clearable>phone</TextField>
    <br />

    <Button rounded block class="primary-color" on:click={() => signUp({ email, name, password, company, phone })}>SignUp</Button>

    <Button rounded block class="mt-4" on:click={() => $goto('/login')}>Go to login</Button>
  </Col>
  <Col />
</Row>

<style>
</style>
