const API_BASE_URL = 'hhttps://bookbackend-6gn2.onrender.com/api';

// 1. Dashboard Table mein sabhi books load karna
async function loadAdminBooks() {
  const tableBody = document.getElementById('adminBooksTableBody');
  if (!tableBody) return;

  try {
    const res = await fetch(`${API_BASE_URL}/books`);
    const result = await res.json();

    if (!result.success || !result.data) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center;">Koi books nahi mili.</td></tr>`;
      return;
    }

    // Table rows render karein
    tableBody.innerHTML = result.data.map((book, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>
          <img src="${book.image}" alt="${book.title}" style="width: 42px; height: 55px; object-fit: cover; border-radius: 6px;">
        </td>
        <td>
          <strong>${book.title}</strong><br>
          <small style="color: #64748b;">SKU: ${book.sku}</small>
        </td>
        <td>₹${book.salePrice} <span style="text-decoration: line-through; color: #94a3b8; font-size: 0.85em;">₹${book.originalPrice}</span></td>
        <td><span class="badge" style="background: #10b981; color: #fff; padding: 4px 8px; border-radius: 4px;">In Stock</span></td>
        <td>
          <button class="btn-delete-book" onclick="deleteBook('${book.id}')" style="background: #ef4444; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer;">
            Delete
          </button>
        </td>
      </tr>
    `).join('');

    // Dashboard Total Books counter update karein
    const totalCountElem = document.getElementById('totalBooksCount');
    if (totalCountElem) {
      totalCountElem.textContent = result.data.length;
    }

  } catch (error) {
    console.error('Error loading admin books:', error);
  }
}

// 2. Add New Book Form Handle karna (POST API)
const addBookForm = document.getElementById('addBookForm');
if (addBookForm) {
  addBookForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newBookData = {
      title: document.getElementById('bookTitle').value.trim(),
      author: document.getElementById('bookAuthor').value.trim(),
      sku: document.getElementById('bookSku').value.trim() || String(Date.now()).slice(-7),
      originalPrice: Number(document.getElementById('bookOriginalPrice').value) || 0,
      salePrice: Number(document.getElementById('bookSalePrice').value) || 0,
      discount: document.getElementById('bookDiscount').value.trim() || '-20%',
      image: document.getElementById('bookImage').value.trim() || 'images/f1.jpg',
      category: document.getElementById('bookCategory')?.value || 'general',
      isFeatured: true
    };

    try {
      const res = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBookData)
      });

      const result = await res.json();

      if (result.success) {
        alert('Kitaab safaltapoorvak add ho gayi!');
        addBookForm.reset();
        
        // Agar modal hai toh use band karein aur table reload karein
        const modal = document.getElementById('addBookModal');
        if (modal) modal.style.display = 'none';

        loadAdminBooks();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      console.error('Failed to add book:', err);
      alert('Backend server se connect nahi ho paya.');
    }
  });
}

// 3. Delete Book Action (DELETE API)
async function deleteBook(id) {
  if (!confirm('Kya aap sach me yeh book delete karna chahte hain?')) return;

  try {
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE'
    });
    const result = await res.json();

    if (result.success) {
      loadAdminBooks();
    } else {
      alert('Delete karne me dikkat aayi.');
    }
  } catch (err) {
    console.error('Delete error:', err);
  }
}

// Page load hone par table populate karein
document.addEventListener('DOMContentLoaded', () => {
  loadAdminBooks();
});