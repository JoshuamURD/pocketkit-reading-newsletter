<script>
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import { goto } from "$app/navigation";

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
      await goto("/"); // or wherever you want to redirect after successful deletion
    } else if (!result.data.success) {
      deleteError = result.data.error || "An unexpected error occurred";
    } else {
      showDeleteConfirmation = false;
    }
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">{book.book_name}</h1>

  <div class="flex mb-6">
    <img
      src={book.cover_url}
      alt="{book.book_name} cover"
      class="w-48 h-auto mr-6 border border-current shadow"
    />
    <div class="flex-1">
      <p class="mb-2"><strong>Author:</strong> {book.author}</p>
      <p class="mb-2">
        <strong>Tags:</strong>
        {book.tags ? book.tags.join(", ") : "No tags"}
      </p>
    </div>
    <div class="card shadow max-h-36">
      <div class="stat">
        <div class="stat-title">Users assigned</div>
        <div class="stat-value">{userBooks.length}</div>
        <button class="btn btn-error" on:click={confirmDelete}
          >Delete Book</button
        >
      </div>
    </div>
  </div>

  <div class="flex space-x-4 mb-4">
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
      >
        <input type="hidden" name="userBookId" value={currentUserBook.id} />
        <button class="btn btn-warning">Unassign Book</button>
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
      >
        <input type="hidden" name="userBookId" value={currentUserBook.id} />
        <button class="btn btn-primary">Send Email</button>
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
      >
        <input type="hidden" name="bookId" value={book.id} />
        <div class="mb-4">
          <label for="startPage" class="block mb-2">Start Page:</label>
          <input
            type="number"
            id="startPage"
            name="startPage"
            bind:value={startPage}
            required
            class="input input-bordered w-full max-w-xs"
          />
        </div>
        <div class="mb-4">
          <label for="endPage" class="block mb-2">End Page:</label>
          <input
            type="number"
            id="endPage"
            name="endPage"
            bind:value={endPage}
            required
            class="input input-bordered w-full max-w-xs"
          />
        </div>
        <button class="btn btn-primary">Assign Book</button>
      </form>
    {/if}
  </div>

  {#if showDeleteConfirmation}
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded-lg">
        <h2 class="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p>
          Are you sure you want to delete this book? This action cannot be
          undone.
        </p>
        {#if deleteError}
          <p class="text-red-500 mt-2">{deleteError}</p>
        {/if}
        <div class="flex justify-end space-x-4 mt-4">
          <button class="btn btn-ghost" on:click={cancelDelete}>Cancel</button>
          <form
            method="POST"
            action="?/deleteBook"
            use:enhance={() => {
              return async ({ result }) => {
                await handleDeleteResult(result);
              };
            }}
          >
            <button class="btn btn-error">Delete</button>
          </form>
        </div>
      </div>
    </div>
  {/if}

  <h2 class="text-xl font-bold mt-8 mb-4">Assigned Users</h2>
  <table class="table w-full">
    <thead>
      <tr>
        <th>User</th>
        <th>Start Page</th>
        <th>End Page</th>
      </tr>
    </thead>
    <tbody>
      {#each userBooks as userBook}
        <tr>
          <td>{userBook.expand.users.name}</td>
          <td>{userBook.start_page}</td>
          <td>{userBook.end_page}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
