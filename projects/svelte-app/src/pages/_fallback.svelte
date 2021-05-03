<script>
  import { userStore } from '../stores/user.js';
  import { redirect } from '@roxi/routify';

  if ($userStore.status === 'logedIn') {
    $redirect('/main');
  } else $redirect('/login');
</script>
