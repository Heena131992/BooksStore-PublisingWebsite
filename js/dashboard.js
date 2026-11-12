const API_BASE_URL = '${window.API_BASE_URL}/books';

// 1. Dashboard par saari books load karna
async function loadInventory() {
  const tbody = document.getElementById('inventoryTableBody');
  if (!tbody) return;

  try {
    const res = await fetch(`${API_BASE_URL}/books`);
    const data = await res.json();

    if (!data.success || !data.data || data.data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 20px;">No books available in inventory.</td></tr>`;
      updateStats([]);
      return;
    }

    const books = data.data;

    // Table rows build karein
    tbody.innerHTML = books.map(book => `
      <tr>
        <td>
          <img src="${book.image}" alt="${book.title}" style="width: 36px; height: 50px; object-fit: cover; border-radius: 4px;" onerror="this.src='https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=200';">
        </td>
        <td>
          <strong>${book.title}</strong><br>
          <span style="color: #64748b; font-size: 0.8rem;">${book.author}</span>
        </td>
        <td><code>${book.sku}</code></td>
        <td>
          <strong>₹${book.salePrice}</strong> 
          <span style="color: #94a3b8; text-decoration: line-through; font-size: 0.8rem;">₹${book.originalPrice}</span>
        </td>
        <td><span style="background: #e0e7ff; color: #4338ca; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; text-transform: uppercase;">${book.category}</span></td>
        <td>
          <button class="btn-delete" onclick="handleDeleteBook('${book.id}')">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </td>
      </tr>
    `).join('');

    updateStats(books);

  } catch (error) {
    console.error('Error fetching inventory:', error);
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #ef4444;">Failed to connect with backend server.</td></tr>`;
  }
}

// 2. Metrics update karna
function updateStats(books) {
  const totalElem = document.getElementById('statTotalBooks');
  const featuredElem = document.getElementById('statFeaturedBooks');
  const avgElem = document.getElementById('statAvgPrice');

  if (totalElem) totalElem.textContent = books.length;
  if (featuredElem) featuredElem.textContent = books.filter(b => b.isFeatured).length;

  if (avgElem && books.length > 0) {
    const avg = books.reduce((acc, b) => acc + (Number(b.salePrice) || 0), 0) / books.length;
    avgElem.textContent = `₹${Math.round(avg)}`;
  } else if (avgElem) {
    avgElem.textContent = '₹0';
  }
}

// 3. Add Book Submit Handler
const form = document.getElementById('dashAddBookForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSubmitBook');
    btn.disabled = true;
    btn.textContent = 'Adding...';

    const newBook = {
      title: document.getElementById('f_title').value.trim(),
      author: document.getElementById('f_author').value.trim(),
      sku: document.getElementById('f_sku').value.trim() || String(Date.now()).slice(-7),
      originalPrice: Number(document.getElementById('f_originalPrice').value) || 0,
      salePrice: Number(document.getElementById('f_salePrice').value) || 0,
      discount: document.getElementById('f_discount').value.trim() || '-20%',
      category: document.getElementById('f_category').value,
      image: document.getElementById('f_image').value.trim() || 'images/f1.jpg',
      isFeatured: true
    };

    try {
      const res = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      });
      const result = await res.json();

      if (result.success) {
        form.reset();
        document.getElementById('f_discount').value = '-20%';
        document.getElementById('f_image').value = 'images/f1.jpg';
        loadInventory();
      } else {
        alert('Failed: ' + result.message);
      }
    } catch (err) {
      console.error('Error adding book:', err);
      alert('Could not connect to server.');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Add to Catalog';
    }
  });
}

// 4. Delete Book Handler
async function handleDeleteBook(id) {
  if (!confirm('Are you sure you want to delete this book?')) return;

  try {
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE'
    });
    const result = await res.json();

    if (result.success) {
      loadInventory();
    } else {
      alert('Delete failed');
    }
  } catch (err) {
    console.error('Error deleting book:', err);
  }
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
  loadInventory();
});