<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { invalidateAll } from "$app/navigation";

  let user;
  let isDropdownOpen = false;

  $: user = $page.data.user;

  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }

  function closeDropdown() {
    isDropdownOpen = false;
  }

  async function handleLogout() {
    try {
      const response = await fetch("/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        await invalidateAll();
        closeDropdown();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }
</script>

<div class="navbar bg-base-100 sticky top-0 z-50">
  <div class="navbar-start">
    <div class="dropdown">
      <button on:click={toggleDropdown} class="btn btn-ghost btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
      </button>
      {#if isDropdownOpen}
        <ul
          class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          {#if user}
            <li>
              <button on:click={handleLogout}>Logout</button>
            </li>
            <li><a href="/add-book" on:click={closeDropdown}>Add book</a></li>
          {:else}
            <li><a href="/register" on:click={closeDropdown}>Register</a></li>
            <li><a href="/login" on:click={closeDropdown}>Login</a></li>
          {/if}
        </ul>
      {/if}
    </div>
  </div>
  <div class="navbar-center">
    <a href="/" class="btn btn-ghost text-xl">Combined Learning List</a>
  </div>
  <div class="navbar-end">
    <span class="text-sm">
      {#if user}
        <a
          href="/user/{user.id}"
          class="btn btn-circle btn-ghost flex items-center justify-center"
        >
          <div
            class="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6 text-base-content"
            >
              <path
                fill-rule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </a>
      {:else}
        Not logged in
      {/if}
    </span>
  </div>
</div>
