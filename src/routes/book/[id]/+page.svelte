<script>
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";

  export let data;

  $: ({ book, userBooks, currentUserBook } = data);

  let startPage = "";
  let endPage = "";

  async function handleSuccess() {
    await invalidateAll();
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">{book.book_name}</h1>

  <div class="flex mb-6">
    <img
      src={book.cover_url}
      alt="{book.book_name} cover"
      class="w-48 h-auto mr-6"
    />
    <div>
      <p class="mb-2"><strong>Author:</strong> {book.author}</p>
      <p class="mb-2">
        <strong>Tags:</strong>
        {book.tags ? book.tags.join(", ") : "No tags"}
      </p>
    </div>
  </div>

  {#if currentUserBook}
    <div class="flex space-x-4 mb-4">
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
    </div>
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
