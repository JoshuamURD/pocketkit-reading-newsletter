<!-- src/routes/login/+page.svelte -->
<script>
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";

  let email = "";
  let password = "";
  let errorMsg = "";

  function handleSubmit() {
    return async ({ result }) => {
      if (result.type === "success") {
        if (result.data.success) {
          goto("/");
        } else {
          errorMsg = result.data.error || "Login failed. Please try again.";
        }
      } else {
        errorMsg = "An unexpected error occurred. Please try again.";
      }
    };
  }
</script>

<form method="POST" use:enhance={handleSubmit}>
  <input
    type="email"
    name="email"
    bind:value={email}
    placeholder="Email"
    required
  />
  <input
    type="password"
    name="password"
    bind:value={password}
    placeholder="Password"
    required
  />
  <button type="submit">Login</button>
</form>

{#if errorMsg}
  <p style="color: red;">{errorMsg}</p>
{/if}
