<script>
  import { enhance } from "$app/forms";

  export let data;
  export let form;
  $: ({ group, user } = data);

  function getBookName(group) {
    if (group.expand && group.expand.Book && group.expand.Book.book_name) {
      return group.expand.Book.book_name;
    }
    return group.Book?.book_name || "Unnamed Group";
  }

  function getMemberCount(group) {
    if (group.expand && group.expand.Users) {
      return group.expand.Users.length;
    }
    return group.Users?.length || 0;
  }

  function getPostCount(group) {
    if (group.expand && group.expand.Posts) {
      return group.expand.Posts.length;
    }
    return group.Posts?.length || 0;
  }

  function getSortedPosts(group) {
    let posts = [];
    if (group.expand && group.expand.Posts) {
      posts = group.expand.Posts;
    } else if (group.Posts) {
      posts = group.Posts;
    }
    return posts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }

  function hasUserLiked(post, userId) {
    return post.likedBy && post.likedBy.includes(userId);
  }

  $: sortedPosts = getSortedPosts(group);

  // Debug log
  $: console.log("Sorted posts:", sortedPosts);
</script>

<svelte:head>
  <title>{getBookName(group)}</title>
</svelte:head>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">{getBookName(group)}</h1>
  <p class="text-gray-600 mb-2">{group.description || "No description"}</p>
  <p class="text-sm text-gray-500">Members: {getMemberCount(group)}</p>
  <p class="text-sm text-gray-500">Posts: {getPostCount(group)}</p>

  {#if form?.message}
    <p class="text-red-500 mb-4">{form.message}</p>
  {/if}

  <h2 class="text-xl font-bold mt-6 mb-3">Posts</h2>
  {#if sortedPosts.length > 0}
    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 p-2">Post</th>
          <th class="border border-gray-300 p-2">Likes</th>
          <th class="border border-gray-300 p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {#each sortedPosts as post (post.id)}
          <tr>
            <td class="border border-gray-300 p-2"
              >{post.post || "No content"}</td
            >
            <td class="border border-gray-300 p-2 text-center"
              >{post.likes || 0}</td
            >
            <td class="border border-gray-300 p-2 text-center">
              {#if !hasUserLiked(post, user.id)}
                <form method="POST" action="?/likePost" use:enhance>
                  <input type="hidden" name="postId" value={post.id} />
                  <button
                    type="submit"
                    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Like
                  </button>
                </form>
              {:else}
                <span class="text-gray-500">Liked</span>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <p>No posts in this group yet.</p>
  {/if}
</div>
