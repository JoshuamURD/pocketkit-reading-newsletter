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

<div class="flex justify-center my-10">
  <div class="card w-full max-w-md bg-base-100 shadow-md p-4 ml-2 mr-2">
    {#if error}
      <p class="text-error">{error}</p>
    {/if}

    <h1 class="text-3xl mb-4">Register</h1>

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
      <div class="form-control">
        <label for="name" class="label">Name:</label>

        <input
          type="text"
          id="name"
          name="name"
          class="input input-bordered w-full"
          bind:value={name}
          required
        />
      </div>

      <div class="form-control">
        <label for="email" class="label">Email:</label>

        <input
          type="email"
          id="email"
          name="email"
          class="input input-bordered w-full"
          bind:value={email}
          required
        />
      </div>

      <div class="form-control">
        <label for="password" class="label">Password:</label>

        <input
          type="password"
          id="password"
          class="input input-bordered w-full"
          name="password"
          bind:value={password}
          required
        />
      </div>

      <div class="form-control">
        <label for="passwordConfirm" class="label">Confirm Password:</label>

        <input
          type="password"
          id="passwordConfirm"
          class="input input-bordered w-full"
          bind:value={passwordConfirm}
          required
        />
      </div>

      <button class="btn btn-primary mt-4" type="submit">Register</button>

      {#if form?.message}
        <p class="text-error">{form.message}</p>
      {/if}
    </form>

    <a href="/login" class="btn btn-link btn-block"
      >Already have an account? Login</a
    >
  </div>
</div>
