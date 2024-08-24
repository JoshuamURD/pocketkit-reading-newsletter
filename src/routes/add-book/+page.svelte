<h1>Please add a book</h1>

<form method="POST" action="?/create" enctype="multipart/form-data">
  <input type="text" placeholder="author" name="author" />
  <input type="text" placeholder="book" name="bookName" />
  <input type="file" name="pdf_file" accept=".pdf" />
  <button type="submit">Upload</button>
</form>
