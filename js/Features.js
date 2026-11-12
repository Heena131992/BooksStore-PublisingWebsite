// src/components/FeaturedProducts/FeaturedProducts.js
import './FeaturedProducts.css';

// Local testing ke liye localhost, deploy ke baad apna live backend URL dalein
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? '${window.API_BASE_URL}/books' 
  : 'https://bookbackend-6gn2.onrender.com'; // Apna deployed backend URL yahan dalein

export function createFeaturedProducts() {
  const container = document.createElement('section');
  container.className = 'featured-products-container';
  container.id = 'featured-products';

  // Section Header
  const header = document.createElement('div');
  header.className = 'section-header text-center';
  header.innerHTML = `
    <span class="badge">👑 Handpicked Selection</span>
    <h2>Featured Products</h2>
    <p>Summer Vacation New Modern Design & Bestselling Titles</p>
  `;
  container.appendChild(header);

  // Products Grid Wrapper
  const grid = document.createElement('div');
  grid.className = 'products-grid';
  grid.innerHTML = `<p class="loading-text">Loading books from server...</p>`;
  container.appendChild(grid);

  // Backend se data mangwana
  fetch(`${API_BASE_URL}/api/books/featured`) // Apne backend ka sahi route check karein
    .then((res) => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then((books) => {
      if (!books || books.length === 0) {
        grid.innerHTML = `<p class="empty-text">Filhal koi featured book available nahi hai.</p>`;
        return;
      }

      // Backend se aayi kitabon ko render karna
      grid.innerHTML = books.map((book) => `
        <div class="product-card" key="${book._id || book.id}">
          <div class="product-img-wrapper">
            <img src="${book.imageUrl || book.image || '/placeholder.png'}" alt="${book.title}" />
          </div>
          <div class="product-info">
            <span class="book-category">${book.category || 'General'}</span>
            <h4 class="book-title">${book.title}</h4>
            <div class="book-rating">
              ⭐ ${book.rating || '4.5'}
            </div>
            <div class="book-price-row">
              <span class="book-price">₹${book.price}</span>
              <button class="add-to-cart-btn" data-id="${book._id || book.id}">
                <i class="fa-solid fa-cart-shopping"></i>
              </button>
            </div>
          </div>
        </div>
      `).join('');
    })
    .catch((err) => {
      console.error('Fetch error:', err);
      grid.innerHTML = `
        <div class="error-box">
          <p>Books load nahi ho payi.</p>
          <small>Backend server (Port 5000) check karein.</small>
        </div>
      `;
    });

  return container;
}