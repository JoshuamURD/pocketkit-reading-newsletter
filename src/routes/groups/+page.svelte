<script>
  export let data;

  $: ({ groups } = data);

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
</script>

<svelte:head>
  <title>Groups</title>
</svelte:head>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Groups</h1>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each groups as group}
      <div class="bg-white shadow-md rounded-lg p-4">
        <h2 class="text-xl font-semibold mb-2">{getBookName(group)}</h2>
        <p class="text-gray-600 mb-2">
          {group.description || "No description"}
        </p>
        <p class="text-sm text-gray-500">Members: {getMemberCount(group)}</p>
        <p class="text-sm text-gray-500">Posts: {getPostCount(group)}</p>
      </div>
    {/each}
  </div>
</div>
