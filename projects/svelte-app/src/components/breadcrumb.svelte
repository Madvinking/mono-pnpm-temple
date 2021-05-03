<script>
  import { Breadcrumbs } from 'svelte-materialify';
  import { page, beforeUrlChange } from '@roxi/routify';

  let items = [];

  function handleUrlChange(path) {
    const [, ...list] = path.split('/');
    if (list.length > 1) items = list.map(route => ({ text: route, href: `/${route}` }));
    else items = [];
  }

  $beforeUrlChange((event, store) => {
    handleUrlChange(store.path);
    return true;
  });
  handleUrlChange($page.path);
</script>

<Breadcrumbs class="ml-16" {items} />
