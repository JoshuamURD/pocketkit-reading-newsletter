<!-- src/routes/books/+page.svelte -->
<script>
  import { getContext } from "svelte";
  export let data;
  const user = getContext("user");
  console.log("data: " + data.books);
  const { books } = data;
</script>

{#if user}
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Books</h1>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {#each books as book}
        <div class="card bg-base-100 shadow-xl">
          {#if book.cover_url}
            <figure>
              <img
                src={book.cover_url}
                alt={book.book_name}
                class="w-full h-48 object-contain"
              />
            </figure>
          {/if}
          <div class="card-body">
            <h2 class="card-title">{book.book_name}</h2>
            <p class="text-sm text-base-content/70">{book.author}</p>
            <div class="card-actions justify-end mt-4">
              <button class="btn btn-primary btn-sm">Read More</button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}
