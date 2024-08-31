<script>
  import { getContext } from "svelte";
  import { fly, fade } from "svelte/transition";

  export let data;
  const user = getContext("user");
  const { books } = data;

  function truncate(text, length) {
    return text.length > length ? text.slice(0, length) + "..." : text;
  }

  function getInitials(name) {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function combinedTransition(node, { y, duration, delay }) {
    return {
      duration,
      delay,
      css: (t) => `
        transform: translateY(${(1 - t) * y}px);
        opacity: ${t}
      `,
    };
  }
</script>

<div class="min-h-screen bg-base-200 py-8">
  {#if user}
    <div
      class="container mx-auto px-4"
      transition:fade={{ duration: 300, delay: 150 }}
    >
      <h1 class="text-4xl font-bold mb-8 text-center text-primary">
        The Library
      </h1>
      {#if books.length > 0}
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          transition:fade={{ duration: 300, delay: 300 }}
        >
          {#each books as book, index}
            <div
              class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300"
              transition:combinedTransition={{
                y: 50,
                duration: 500,
                delay: 300 + index * 100,
              }}
            >
              <div class="relative pb-[140%]">
                {#if book.cover_url}
                  <img
                    src={book.cover_url}
                    alt={book.book_name}
                    class="absolute top-0 left-0 w-full h-full object-cover rounded-t-xl"
                  />
                {:else}
                  <div
                    class="absolute top-0 left-0 w-full h-full bg-primary/10 flex items-center justify-center rounded-t-xl"
                  >
                    <span class="text-4xl font-bold text-primary/50"
                      >{getInitials(book.book_name)}</span
                    >
                  </div>
                {/if}
              </div>
              <div class="p-3">
                <h2
                  class="font-semibold text-sm leading-tight mb-1"
                  title={book.book_name}
                >
                  {truncate(book.book_name, 30)}
                </h2>
                <p
                  class="text-xs text-base-content/70 mb-2"
                  title={book.author}
                >
                  {truncate(book.author, 25)}
                </p>
                <a href="/book/{book.id}" class="btn btn-primary btn-xs w-full"
                  >Details</a
                >
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div
          class="text-center mt-16 bg-base-100 p-8 rounded-xl shadow-lg"
          transition:fade={{ duration: 300, delay: 300 }}
        >
          <p class="text-xl text-base-content/70 mb-4">
            Your library is waiting for its first book.
          </p>
          <a href="/add-book" class="btn btn-primary">Add a Book</a>
        </div>
      {/if}
    </div>
  {/if}
</div>
