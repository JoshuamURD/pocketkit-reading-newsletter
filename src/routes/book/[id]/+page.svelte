<script>
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import { goto } from "$app/navigation";
  import { fade, fly, slide } from "svelte/transition";
  import { quartOut } from "svelte/easing";

  export let data;

  $: ({ book, userBooks, currentUserBook } = data);

  let startPage = "";
  let endPage = "";
  let showDeleteConfirmation = false;
  let deleteError = null;

  async function handleSuccess() {
    await invalidateAll();
  }

  function confirmDelete() {
    showDeleteConfirmation = true;
  }

  function cancelDelete() {
    showDeleteConfirmation = false;
    deleteError = null;
  }

  async function handleDeleteResult(result) {
    if (result.type === "success" && result.data.success) {
      showDeleteConfirmation = false;
      await goto("/");
    } else if (!result.data.success) {
      deleteError = result.data.error || "An unexpected error occurred";
    } else {
      showDeleteConfirmation = false;
    }
  }
</script>

<div
  class="bg-gray-100 min-h-screen py-8"
  in:fade={{ duration: 300, delay: 300 }}
>
  <div class="container mx-auto px-4 max-w-5xl">
    <div
      class="bg-white rounded-lg shadow-lg overflow-hidden mb-8"
      in:fly={{ y: 50, duration: 500, delay: 300 }}
    >
      <div class="md:flex">
        <div
          class="md:flex-shrink-0 p-6 flex items-center justify-center bg-gray-50"
        >
          <img
            src={book.cover_url}
            alt="{book.book_name} cover"
            class="w-48 h-auto rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div class="p-8">
          <div
            class="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1"
            in:slide={{ duration: 300, delay: 600 }}
          >
            Book Details
          </div>
          <h1
            class="text-3xl font-bold text-gray-900 mb-2"
            in:slide={{ duration: 300, delay: 700 }}
          >
            {book.book_name}
          </h1>
          <p
            class="text-gray-600 mb-4"
            in:slide={{ duration: 300, delay: 800 }}
          >
            <span class="font-semibold">Author:</span>
            {book.author}
          </p>
          <div class="mb-4" in:slide={{ duration: 300, delay: 900 }}>
            <span class="font-semibold text-gray-700">Tags:</span>
            {#if book.tags && book.tags.length > 0}
              {#each book.tags as tag, i}
                <span
                  class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 transform transition-all duration-300 hover:scale-110 hover:bg-indigo-100"
                  in:fly={{ y: 20, duration: 300, delay: 1000 + i * 100 }}
                  >{tag}</span
                >
              {/each}
            {:else}
              <span class="text-gray-500">No tags</span>
            {/if}
          </div>
          <div
            class="bg-blue-50 rounded-lg p-4 mb-4"
            in:slide={{ duration: 300, delay: 1200 }}
          >
            <div class="text-sm font-medium text-blue-800">Users assigned</div>
            <div class="text-3xl font-bold text-blue-900 animate-count">
              {userBooks.length}
            </div>
          </div>
          <div class="mt-4" in:slide={{ duration: 300, delay: 1300 }}>
            <button
              class="btn btn-error btn-outline transform transition-transform duration-300 hover:scale-105"
              on:click={confirmDelete}>Delete Book</button
            >
          </div>
        </div>
      </div>
    </div>

    <div
      class="bg-white rounded-lg shadow-lg p-6 mb-8"
      in:fly={{ y: 50, duration: 500, delay: 600 }}
    >
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Book Assignment</h2>
      <div class="flex flex-col md:flex-row md:space-x-4">
        {#if currentUserBook}
          <form
            method="POST"
            action="?/unassign"
            use:enhance={() => {
              return async ({ result }) => {
                if (result.type === "success") {
                  await handleSuccess();
                }
              };
            }}
            class="mb-4 md:mb-0 flex-1"
            in:slide={{ duration: 300, delay: 900 }}
          >
            <input type="hidden" name="userBookId" value={currentUserBook.id} />
            <button
              class="btn btn-warning w-full transform transition-transform duration-300 hover:scale-105"
              >Unassign Book</button
            >
          </form>

          <form
            method="POST"
            action="?/sendEmail"
            use:enhance={() => {
              return async ({ result }) => {
                if (result.type === "success") {
                  await handleSuccess();
                }
              };
            }}
            class="flex-1"
            in:slide={{ duration: 300, delay: 1000 }}
          >
            <input type="hidden" name="userBookId" value={currentUserBook.id} />
            <button
              class="btn btn-primary w-full transform transition-transform duration-300 hover:scale-105"
              >Send Email</button
            >
          </form>
        {:else}
          <form
            method="POST"
            action="?/assign"
            use:enhance={() => {
              return async ({ result }) => {
                if (result.type === "success") {
                  await handleSuccess();
                }
              };
            }}
            class="w-full"
            in:slide={{ duration: 300, delay: 900 }}
          >
            <input type="hidden" name="bookId" value={book.id} />
            <div class="flex flex-col md:flex-row md:space-x-4 mb-4">
              <div class="form-control w-full md:w-1/2 mb-4 md:mb-0">
                <label for="startPage" class="label">
                  <span class="label-text font-medium">Start Page</span>
                </label>
                <input
                  type="number"
                  id="startPage"
                  name="startPage"
                  bind:value={startPage}
                  required
                  class="input input-bordered w-full transition-all duration-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div class="form-control w-full md:w-1/2">
                <label for="endPage" class="label">
                  <span class="label-text font-medium">End Page</span>
                </label>
                <input
                  type="number"
                  id="endPage"
                  name="endPage"
                  bind:value={endPage}
                  required
                  class="input input-bordered w-full transition-all duration-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <button
              class="btn btn-primary w-full transform transition-transform duration-300 hover:scale-105"
              >Assign Book</button
            >
          </form>
        {/if}
      </div>
    </div>

    <div
      class="bg-white rounded-lg shadow-lg overflow-hidden"
      in:fly={{ y: 50, duration: 500, delay: 900 }}
    >
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Assigned Users</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th
                class="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-6"
                >User</th
              >
              <th
                class="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-6"
                >Start Page</th
              >
              <th
                class="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-6"
                >End Page</th
              >
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#each userBooks as userBook, i}
              <tr
                class="hover:bg-gray-50 transition-colors duration-150"
                in:fly={{ y: 20, duration: 300, delay: 1200 + i * 100 }}
              >
                <td class="py-4 px-6 text-sm font-medium text-gray-900"
                  >{userBook.expand.users.name}</td
                >
                <td class="py-4 px-6 text-sm text-gray-500"
                  >{userBook.start_page}</td
                >
                <td class="py-4 px-6 text-sm text-gray-500"
                  >{userBook.end_page}</td
                >
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

{#if showDeleteConfirmation}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    transition:fade={{ duration: 300 }}
  >
    <div
      class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full"
      in:fly={{ y: -50, duration: 300, easing: quartOut }}
    >
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Confirm Deletion</h2>
      <p class="text-gray-600 mb-6">
        Are you sure you want to delete this book? This action cannot be undone.
      </p>
      {#if deleteError}
        <div
          class="bg-red-50 border-l-4 border-red-400 p-4 mb-6"
          in:slide={{ duration: 300 }}
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">
                {deleteError}
              </p>
            </div>
          </div>
        </div>
      {/if}
      <div class="flex justify-end space-x-4">
        <button
          class="btn btn-ghost transform transition-transform duration-300 hover:scale-105"
          on:click={cancelDelete}>Cancel</button
        >
        <form
          method="POST"
          action="?/deleteBook"
          use:enhance={() => {
            return async ({ result }) => {
              await handleDeleteResult(result);
            };
          }}
        >
          <button
            class="btn btn-error transform transition-transform duration-300 hover:scale-105"
            >Delete</button
          >
        </form>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes countUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-count {
    animation: countUp 0.5s ease-out forwards;
  }
</style>
