<!-- src/routes/login/+page.svelte -->
<script>
  import { pb } from "$lib/pocketbase";
  import { goto } from "$app/navigation";

  let email = "";
  let password = "";
  let errorMsg = "";

  async function login() {
    try {
      await pb.collection("users").authWithPassword(email, password);
      goto("/");
    } catch (err) {
      console.error("Login failed", err);
      errorMsg = "Your login failed! " + err;
    }
  }
</script>

<form on:submit|preventDefault={login}>
  <input type="email" bind:value={email} placeholder="Email" required />
  <input
    type="password"
    bind:value={password}
    placeholder="Password"
    required
  />
  <button type="submit">Login</button>
</form>
{#if errorMsg}
  <p style="color: red;">{errorMsg}</p>
{/if}
