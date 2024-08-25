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

<div class="h-screen flex justify-center items-center">
  <div class="card w-full max-w-md bg-base-100 shadow-md p-4">
    {#if errorMsg}
      <p class="text-error">{errorMsg}</p>
    {/if}

    <h1 class="text-3xl mb-4">Login</h1>

    <form method="POST" use:enhance={handleSubmit}>
      <div class="form-control">
        <label for="email" class="label">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          class="input input-bordered w-full"
          bind:value={email}
          placeholder="Email"
          required
        />
      </div>
      <div class="form-control">
        <label for="password" class="label">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          class="input input-bordered w-full"
          bind:value={password}
          placeholder="Password"
          required
        />
      </div>
      <button class="btn btn-primary mt-4" type="submit">Login</button>
    </form>

    <a href="/register" class="btn btn-link btn-block"
      >Don't have an account? Register</a
    >
  </div>
</div>
