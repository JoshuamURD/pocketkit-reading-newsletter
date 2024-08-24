<!-- src/routes/register/+page.svelte -->
<script>
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";

  let email = "";
  let password = "";
  let passwordConfirm = "";
  let name = "";
  let error = "";

  /** @type {import('./$types').ActionData} */
  export let form;

  function validateForm() {
    if (password !== passwordConfirm) {
      error = "Passwords do not match";
      return false;
    }
    error = "";
    return true;
  }
</script>

<h1>Register</h1>

{#if error}
  <p class="error">{error}</p>
{/if}
<div class="flex flex-col min-h-screen justify-center gap-9">
  <form
    method="POST"
    use:enhance={() => {
      return async ({ result }) => {
        if (result.type === "success") {
          goto("/login");
        } else if (result.type === "error") {
          error = result.error.message;
        }
      };
    }}
    on:submit|preventDefault={validateForm}
  >
    <div>
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" bind:value={name} required />
    </div>
    <div>
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" bind:value={email} required />
    </div>
    <div>
      <label for="password">Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        bind:value={password}
        required
      />
    </div>
    <div>
      <label for="passwordConfirm">Confirm Password:</label>
      <input
        type="password"
        id="passwordConfirm"
        bind:value={passwordConfirm}
        required
      />
    </div>
    <button type="submit">Register</button>
    {#if form?.message}
      <p class="error">{form.message}</p>
    {/if}
  </form>

  <p>Already have an account? <a href="/login">Login</a></p>
</div>
