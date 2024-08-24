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

{#if error}
  <p class="error">{error}</p>
{/if}

<div class="flex flex-col max-h-screen items-center gap-10 mt-4">
  <h1 class="text-3xl">Register</h1>
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
      <input
        type="text"
        id="name"
        name="name"
        class="input input-bordered w-full max-w-xs"
        bind:value={name}
        required
      />
    </div>
    <div>
      <label for="email">Email:</label>
      <input
        type="email"
        id="email"
        name="email"
        class="input input-bordered w-full max-w-xs"
        bind:value={email}
        required
      />
    </div>
    <div>
      <label for="password">Password:</label>
      <input
        type="password"
        id="password"
        class="input input-bordered w-full max-w-xs"
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
        class="input input-bordered w-full max-w-xs"
        bind:value={passwordConfirm}
        required
      />
    </div>
    <button class="btn mt-3" type="submit">Register</button>
    {#if form?.message}
      <p class="error">{form.message}</p>
    {/if}
  </form>

  <a href="/login" class="btn btn-wide"> Already have an account? Login </a>
</div>
