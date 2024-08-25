<script>
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import { onMount } from "svelte";

  export let data;
  $: ({ user, assignedBooks } = data);

  let name = user?.name ?? "";
  let email = user?.email ?? "";
  let currentPassword = "";
  let newPassword = "";
  let confirmPassword = "";
  let formMessage = "";
  let formError = false;

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
</script>

<div
  class="container mx-auto p-4 dark:bg-gray-800 dark:text-white min-h-screen"
>
  {#if user}
    <h1 class="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>

    {#if formMessage}
      <div class={`alert ${formError ? "alert-error" : "alert-success"} mb-4`}>
        {formMessage}
      </div>
    {/if}

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
      <div>
        <label for="name" class="block mb-2">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          bind:value={name}
          required
          class="input input-bordered w-full max-w-xs dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label for="email" class="block mb-2">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          bind:value={email}
          required
          class="input input-bordered w-full max-w-xs dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label for="currentPassword" class="block mb-2">Current Password:</label
        >
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          bind:value={currentPassword}
          required
          class="input input-bordered w-full max-w-xs dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label for="newPassword" class="block mb-2"
          >New Password (optional):</label
        >
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          bind:value={newPassword}
          minlength="8"
          class="input input-bordered w-full max-w-xs dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label for="confirmPassword" class="block mb-2"
          >Confirm New Password:</label
        >
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          bind:value={confirmPassword}
          minlength="8"
          class="input input-bordered w-full max-w-xs dark:bg-gray-700 dark:text-white"
        />
      </div>

      <button
        type="submit"
        class="btn btn-primary dark:bg-blue-600 dark:hover:bg-blue-700"
        >Update Profile</button
      >
    </form>

    <div class="mt-8">
      <input
        type="checkbox"
        value="synthwave"
        class="toggle theme-controller"
      />
    </div>

    <h2 class="text-xl font-bold mt-8 mb-4">Your Assigned Books</h2>
    {#if assignedBooks.length > 0}
      <table class="table mt-4 mb-4 w-full dark:text-white">
        <thead>
          <tr>
            <th class="dark:bg-gray-700">Book Name</th>
            <th class="dark:bg-gray-700">Start Page</th>
            <th class="dark:bg-gray-700">End Page</th>
          </tr>
        </thead>
        <tbody>
          {#each assignedBooks as book}
            <tr class="dark:bg-gray-600">
              <td>{book.expand.books.book_name}</td>
              <td>{book.start_page}</td>
              <td>{book.end_page}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <p>You don't have any assigned books at the moment.</p>
    {/if}
  {:else}
    <p>Loading user data...</p>
  {/if}
</div>
