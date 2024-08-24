<script>
  import { pb, currentUser } from "$lib/pocketbase.js";
</script>

<h1 class="title">Combined Learning List</h1>

{#if $currentUser}
  <p>Thanks for logging in</p>
{:else}
  <p>Please sign up to begin</p>
{/if}
