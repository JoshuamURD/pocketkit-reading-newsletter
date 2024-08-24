<div class="flex flex-col max-h-screen justify-center items-center gap-10 mt-4">
  <h1>Please add a book</h1>

  <form
    class="flex flex-col items-center gap-3"
    method="POST"
    action="?/create"
    enctype="multipart/form-data"
  >
    <input
      class="input input-bordered w-full max-w-xs"
      type="text"
      placeholder="Enter book title"
      name="bookName"
    />
    <input
      class="input input-bordered w-full max-w-xs"
      type="text"
      placeholder="Enter author name"
      name="author"
    />
    <input
      class="file-input w-full max-w-xs"
      type="file"
      name="pdf_file"
      accept=".pdf"
    />
    <button class="btn" type="submit">Upload</button>
  </form>
</div>
