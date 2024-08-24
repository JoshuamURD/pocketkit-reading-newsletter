<script>
  import Nav from "$lib/Nav.svelte";
  import "../app.css";
  import { writable } from "svelte/store";
  import { setContext } from "svelte";

  export let data;

  const user = writable(data.user);
  setContext("user", user);

  $: user.set(data.user);
</script>

<Nav />
<main>
  <slot />
</main>
