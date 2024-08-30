<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { invalidateAll } from "$app/navigation";
  import { fade, slide, fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  let user;
  let isDropdownOpen = false;
  let isDropdownContentVisible = false;

  $: user = $page.data.user;

  function toggleDropdown() {
    if (isDropdownOpen) {
      isDropdownContentVisible = false;
      setTimeout(() => {
        isDropdownOpen = false;
      }, 200); // Match this with the fade-out duration
    } else {
      isDropdownOpen = true;
      setTimeout(() => {
        isDropdownContentVisible = true;
      }, 150); // Slightly less than the slide-down duration
    }
  }

  function closeDropdown() {
    isDropdownContentVisible = false;
    setTimeout(() => {
      isDropdownOpen = false;
    }, 200); // Match this with the fade-out duration
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

<div
  class="navbar bg-base-100 sticky top-0 z-50 shadow-md"
  in:fade={{ duration: 300, delay: 150 }}
>
  <div class="navbar-start">
    <div class="dropdown">
      <button
        on:click={toggleDropdown}
        class="btn btn-ghost btn-circle transition-transform duration-200 hover:scale-110"
      >
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
        <div
          class="dropdown-container mt-3 z-[1] shadow bg-base-100 rounded-box w-52 overflow-hidden"
          transition:slide={{ duration: 200, easing: quintOut }}
        >
          {#if isDropdownContentVisible}
            <ul class="menu menu-sm p-2" transition:fade={{ duration: 200 }}>
              {#if user}
                <li>
                  <button
                    on:click={handleLogout}
                    class="transition-colors duration-200 hover:bg-base-200"
                    >Logout</button
                  >
                </li>
                <li>
                  <a
                    href="/add-book"
                    on:click={closeDropdown}
                    class="transition-colors duration-200 hover:bg-base-200"
                    >Add book</a
                  >
                </li>
                <li>
                  <a
                    href="/groups"
                    on:click={closeDropdown}
                    class="transition-colors duration-200 hover:bg-base-200"
                    >Groups</a
                  >
                </li>
              {:else}
                <li>
                  <a
                    href="/register"
                    on:click={closeDropdown}
                    class="transition-colors duration-200 hover:bg-base-200"
                    >Register</a
                  >
                </li>
                <li>
                  <a
                    href="/login"
                    on:click={closeDropdown}
                    class="transition-colors duration-200 hover:bg-base-200"
                    >Login</a
                  >
                </li>
              {/if}
            </ul>
          {/if}
        </div>
      {/if}
    </div>
  </div>
  <div class="navbar-center">
    <a
      href="/"
      class="btn btn-ghost text-xl transition-all duration-300 hover:scale-105 hover:text-primary"
      >Combined Learning List</a
    >
  </div>
  <div class="navbar-end">
    <span class="text-sm">
      {#if user}
        <a
          href="/user/{user.id}"
          class="btn btn-circle btn-ghost flex items-center justify-center transition-transform duration-200 hover:scale-110"
          in:fly={{ y: -20, duration: 300, delay: 300, easing: quintOut }}
        >
          <div
            class="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center overflow-hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6 text-base-content transition-transform duration-300 hover:scale-125"
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
        <span in:fade={{ duration: 300, delay: 300 }}>Not logged in</span>
      {/if}
    </span>
  </div>
</div>

<style>
  .dropdown {
    position: relative;
  }

  .dropdown-container {
    position: absolute;
    top: 100%;
    left: 0;
  }
</style>
