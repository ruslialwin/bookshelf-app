document.addEventListener("DOMContentLoaded", () => {
    const bookForm = document.getElementById("bookForm");
    const bookFormTitle = document.getElementById("bookFormTitle");
    const bookFormAuthor = document.getElementById("bookFormAuthor");
    const bookFormYear = document.getElementById("bookFormYear");
    const bookFormIsComplete = document.getElementById("bookFormIsComplete");
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");
    const searchBookForm = document.getElementById("searchBook");
    const searchBookTitle = document.getElementById("searchBookTitle");
  
    // Fungsi untuk menyimpan data buku ke localStorage
    const saveBooksToLocalStorage = (books) => {
      localStorage.setItem("books", JSON.stringify(books));
    };
  
    // Fungsi untuk mendapatkan data buku dari localStorage
    const getBooksFromLocalStorage = () => {
      const storedBooks = localStorage.getItem("books");
      return storedBooks ? JSON.parse(storedBooks) : [];
    };
  
    // Mengambil data buku dari localStorage saat halaman dimuat
    let books = getBooksFromLocalStorage();
  
    // Fungsi untuk merender daftar buku ke rak
    const renderBooks = (filteredBooks) => {
      // Menghapus konten yang ada sebelumnya
      incompleteBookList.innerHTML = "";
      completeBookList.innerHTML = "";
  
      filteredBooks.forEach((book) => {
        const bookElement = document.createElement("div");
        bookElement.setAttribute("data-bookid", book.id);
        bookElement.setAttribute("data-testid", "bookItem");
  
        bookElement.innerHTML = `
          <h3 data-testid="bookItemTitle">${book.title}</h3>
          <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
          <p data-testid="bookItemYear">Tahun: ${book.year}</p>
          <div>
            <button data-testid="bookItemIsCompleteButton" class="isCompleteButton">
              ${book.isComplete ? "Belum Selesai dibaca" : "Selesai dibaca"}
            </button>
            <button data-testid="bookItemDeleteButton" class="deleteButton">Hapus Buku</button>
          </div>
        `;
  
        const isCompleteButton = bookElement.querySelector(".isCompleteButton");
        const deleteButton = bookElement.querySelector(".deleteButton");
  
        // Event untuk mengubah status selesai dibaca
        isCompleteButton.addEventListener("click", () => {
          book.isComplete = !book.isComplete;
          saveBooksToLocalStorage(books); // Simpan perubahan ke localStorage
          renderBooks(books); // Re-render daftar buku
        });
  
        // Event untuk menghapus buku
        deleteButton.addEventListener("click", () => {
          books = books.filter((b) => b.id !== book.id);
          saveBooksToLocalStorage(books); // Simpan perubahan ke localStorage
          renderBooks(books); // Re-render daftar buku
        });
  
        // Menambahkan buku ke rak yang sesuai
        if (book.isComplete) {
          completeBookList.appendChild(bookElement);
        } else {
          incompleteBookList.appendChild(bookElement);
        }
      });
    };
  
    // Event untuk menangani pengiriman form (menambah buku)
    bookForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const newBook = {
        id: new Date().getTime(), // ID unik menggunakan timestamp
        title: bookFormTitle.value,
        author: bookFormAuthor.value,
        year: parseInt(bookFormYear.value),
        isComplete: bookFormIsComplete.checked,
      };
  
      books.push(newBook);
      saveBooksToLocalStorage(books); // Simpan buku baru ke localStorage
      renderBooks(books); // Re-render daftar buku
  
      // Clear form after submission
      bookForm.reset();
    });
  
    // Event untuk menangani pencarian buku
    searchBookForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const searchTerm = searchBookTitle.value.toLowerCase();
  
      // Filter buku yang judulnya mengandung kata pencarian
      const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm)
      );
  
      renderBooks(filteredBooks); // Re-render daftar buku berdasarkan hasil pencarian
    });
  
    // Render daftar buku yang sudah ada dari localStorage saat pertama kali halaman dimuat
    renderBooks(books);
});