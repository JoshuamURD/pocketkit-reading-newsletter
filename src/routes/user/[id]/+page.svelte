<script>
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";

  export let data;
  $: ({ user, assignedBooks } = data);

  let name = user?.name ?? "";
  let email = user?.email ?? "";
  let currentPassword = "";
  let newPassword = "";
  let confirmPassword = "";
  let formMessage = "";
  let formError = false;
  let showPasswordFields = false;

  async function handleSuccess() {
    await invalidateAll();
    currentPassword = "";
    newPassword = "";
    confirmPassword = "";
    formMessage = "Profile updated successfully!";
    formError = false;
    setTimeout(() => {
      formMessage = "";
    }, 5000);
  }

  function handleError(error) {
    formMessage = error || "An error occurred while updating your profile.";
    formError = true;
    setTimeout(() => {
      formMessage = "";
      formError = false;
    }, 5000);
  }

  function togglePasswordFields() {
    showPasswordFields = !showPasswordFields;
  }
</script>

<div class="min-h-screen bg-base-200 py-8 px-4">
  <div class="max-w-4xl mx-auto">
    {#if user}
      <div class="text-center mb-8" in:fade>
        <h1 class="text-4xl font-bold text-primary">Welcome, {user.name}!</h1>
        <p class="text-base-content/70 mt-2">
          Manage your profile and view your assigned books.
        </p>
      </div>

      {#if formMessage}
        <div class="mb-8" in:fly={{ y: -20, duration: 300 }}>
          <div
            class={`alert ${formError ? "alert-error" : "alert-success"} shadow-lg`}
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d={formError
                    ? "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"}
                /></svg
              >
              <span>{formMessage}</span>
            </div>
          </div>
        </div>
      {/if}

      <div class="grid gap-8 md:grid-cols-2">
        <div
          class="card bg-base-100 shadow-xl"
          in:fly={{ x: -50, duration: 300, delay: 150 }}
        >
          <div class="card-body">
            <h2 class="card-title text-2xl mb-6">Profile Information</h2>
            <form
              method="POST"
              action="?/updateProfile"
              use:enhance={() => {
                return async ({ result }) => {
                  if (result.type === "success") {
                    await handleSuccess();
                  } else if (result.type === "failure") {
                    handleError(result.data?.error);
                  }
                };
              }}
              class="space-y-4"
            >
              <div class="form-control">
                <label for="name" class="label">
                  <span class="label-text">Name</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  bind:value={name}
                  required
                  class="input input-bordered w-full"
                />
              </div>

              <div class="form-control">
                <label for="email" class="label">
                  <span class="label-text">Email</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  bind:value={email}
                  required
                  class="input input-bordered w-full"
                />
              </div>

              <div class="divider">Password</div>

              <button
                type="button"
                class="btn btn-outline btn-sm"
                on:click={togglePasswordFields}
              >
                {showPasswordFields
                  ? "Hide Password Fields"
                  : "Change Password"}
              </button>

              {#if showPasswordFields}
                <div transition:fade>
                  <div class="form-control">
                    <label for="currentPassword" class="label">
                      <span class="label-text">Current Password</span>
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      bind:value={currentPassword}
                      required
                      class="input input-bordered w-full"
                    />
                  </div>

                  <div class="form-control">
                    <label for="newPassword" class="label">
                      <span class="label-text">New Password</span>
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      bind:value={newPassword}
                      minlength="8"
                      class="input input-bordered w-full"
                    />
                  </div>

                  <div class="form-control">
                    <label for="confirmPassword" class="label">
                      <span class="label-text">Confirm New Password</span>
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      bind:value={confirmPassword}
                      minlength="8"
                      class="input input-bordered w-full"
                    />
                  </div>
                </div>
              {/if}

              <div class="mt-6">
                <button type="submit" class="btn btn-primary w-full"
                  >Update Profile</button
                >
              </div>
            </form>
          </div>
        </div>

        <div
          class="card bg-base-100 shadow-xl"
          in:fly={{ x: 50, duration: 300, delay: 300 }}
        >
          <div class="card-body">
            <h2 class="card-title text-2xl mb-6">Your Assigned Books</h2>
            {#if assignedBooks.length > 0}
              <div class="overflow-x-auto">
                <table class="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Book Name</th>
                      <th>Start Page</th>
                      <th>End Page</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each assignedBooks as book}
                      <tr>
                        <td>{book.expand.books.book_name}</td>
                        <td>{book.start_page}</td>
                        <td>{book.end_page}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {:else}
              <p class="text-base-content/70">
                You don't have any assigned books at the moment.
              </p>
            {/if}
          </div>
        </div>
      </div>

      <div class="mt-8 text-center" in:fade={{ delay: 450 }}>
        <div class="form-control inline-flex">
          <label class="label cursor-pointer">
            <span class="label-text mr-2">Dark mode</span>
            <input
              type="checkbox"
              value="synthwave"
              class="toggle theme-controller"
            />
          </label>
        </div>
      </div>
    {:else}
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <p>Loading user data...</p>
        </div>
      </div>
    {/if}
  </div>
</div>
