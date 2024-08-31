<script>
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";

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

<div
  class="min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 py-12 px-4"
>
  <div class="max-w-4xl mx-auto">
    {#if user}
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-primary mb-4 relative inline-block">
          Welcome, {user.name}!
          <span
            class="absolute -bottom-2 left-0 w-full h-1 bg-primary transform scale-x-0 transition-transform duration-300 ease-out hover:scale-x-100"
          ></span>
        </h1>
        <p class="text-base-content/70 mt-2 text-lg italic">
          Your literary journey awaits...
        </p>
      </div>

      {#if formMessage}
        <div class="mb-8 transform -translate-y-4 transition-all duration-300">
          <div
            class={`alert ${formError ? "alert-error" : "alert-success"} shadow-lg border border-base-content/10`}
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
          class="card bg-base-100 shadow-xl border border-base-content/10 backdrop-blur-sm"
        >
          <div class="card-body">
            <h2 class="card-title text-2xl mb-6 text-primary">
              Profile Information
            </h2>
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
                  class="input input-bordered w-full transition-all duration-300 focus:ring-2 focus:ring-primary"
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
                  class="input input-bordered w-full transition-all duration-300 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div class="divider before:bg-primary/30 after:bg-primary/30">
                Password
              </div>

              <button
                type="button"
                class="btn btn-outline btn-sm hover:bg-primary hover:text-primary-content transition-all duration-300"
                on:click={togglePasswordFields}
              >
                {showPasswordFields
                  ? "Hide Password Fields"
                  : "Change Password"}
              </button>

              {#if showPasswordFields}
                <div class="space-y-4 transform transition-all duration-300">
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
                      class="input input-bordered w-full transition-all duration-300 focus:ring-2 focus:ring-primary"
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
                      class="input input-bordered w-full transition-all duration-300 focus:ring-2 focus:ring-primary"
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
                      class="input input-bordered w-full transition-all duration-300 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              {/if}

              <div class="mt-6">
                <button
                  type="submit"
                  class="btn btn-primary w-full hover:shadow-lg transition-all duration-300"
                  >Update Profile</button
                >
              </div>
            </form>
          </div>
        </div>

        <div
          class="card bg-base-100 shadow-xl border border-base-content/10 backdrop-blur-sm"
        >
          <div class="card-body">
            <h2 class="card-title text-2xl mb-6 text-secondary">
              Your Assigned Books
            </h2>
            {#if assignedBooks.length > 0}
              <div class="overflow-x-auto">
                <table class="table w-full">
                  <thead>
                    <tr class="bg-base-200">
                      <th class="bg-secondary/10 text-secondary">Book Name</th>
                      <th class="bg-secondary/10 text-secondary">Start Page</th>
                      <th class="bg-secondary/10 text-secondary">End Page</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each assignedBooks as book, i}
                      <tr
                        class="hover:bg-base-200 transition-colors duration-200"
                      >
                        <td class="font-medium"
                          >{book.expand.books.book_name}</td
                        >
                        <td>{book.start_page}</td>
                        <td>{book.end_page}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {:else}
              <p class="text-base-content/70 italic text-center py-8">
                Your reading list is a blank canvas, ready for new adventures...
              </p>
            {/if}
          </div>
        </div>
      </div>

      <div class="mt-12 text-center">
        <div
          class="form-control inline-flex justify-center items-center space-x-4"
        >
          <span class="label-text text-lg">Embrace the night</span>
          <input
            type="checkbox"
            value="synthwave"
            class="toggle toggle-lg toggle-primary"
          />
          <span class="label-text text-lg">or bask in the light</span>
        </div>
      </div>
    {:else}
      <div
        class="card bg-base-100 shadow-xl border border-base-content/10 backdrop-blur-sm"
      >
        <div class="card-body">
          <p class="text-center text-lg italic">
            Unveiling your literary world...
          </p>
        </div>
      </div>
    {/if}
  </div>
</div>
