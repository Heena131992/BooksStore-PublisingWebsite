// Global API Base URL (Duplicate error se bachne ke liye window object ka use karein)
window.API_BASE_URL = "https://bookbackend-6gn2.onrender.com/api";
const response = await fetch(`${window.API_BASE_URL}/books`);
// home.js ya Products.js me:
async function loadBooksFromLiveServer() {
    const container = document.getElementById('books-container'); // Apne HTML div ki exact ID dalein
    if (!container) return;

    try {
        // Dynamic spinner loader dikhayein
        container.innerHTML = `<p class="loading">Loading books from server...</p>`;

        const response = await fetch(`${window.API_BASE_URL}/api/books`);
        
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const resData = await response.json();
        
        // Render backend se aane wala data array format check karein
        const books = Array.isArray(resData) ? resData : (resData.data || []);

        if (books.length === 0) {
            container.innerHTML = `<p>No books available right now.</p>`;
            return;
        }

        // HTML container ko dynamic cards se populate karein
        displayBooks(books);

    } catch (error) {
        console.error("Live Server Data Error:", error);
        container.innerHTML = `
            <div class="error-box">
                <p>Products load nahi ho aaye.</p>
                <small>Backend server spins up in 30-50s on free tiers (Render).</small>
            </div>`;
    }
}

fetch('https://bookbackend-1-czz1.onrender.com/api/books')
  .then(response => response.json())
  .then(data => {
    console.log("Live backend data:", data);
    // Yahan aapka display/cards render karne ka logic aayega
  })
  .catch(error => console.error("Error fetching books:", error));


    /* ==========================================================================
       1. API CONFIGURATION & GLOBAL STORAGE KEYS
       ========================================================================== */
    // Local testing ke liye ${window.API_BASE_URL}/books, live deployment ke liye apna backend URL dalein
    const API_BASE_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "${window.API_BASE_URL}/books"
    : "https://bookbackend-6gn2.onrender.com"; // <-- Yahan apna asli live backend URL rakhein

    const STORAGE_KEYS = {
        CART: "mp_cart",
        WISHLIST: "mp_wishlist"
    };


    // Global in-memory list for dynamic live search
    window.homeLiveBooks = [];

    /**
     * Safely parse localStorage array
     */
fetch(`${API_URL}/api/books`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(bookData),
})



// ================= SCROLL REVEAL ANIMATION CONTROLLER =================
function initScrollReveal() {
  const cards = document.querySelectorAll('.scroll-reveal');
  if (!cards.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px', // Screen me aane se 50px pehle trigger hoga
    threshold: 0.12                  // 12% card dikhte hi animate shuru
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Staggered delay taaki cards ek ke baad ek smoothly slide hon
        const delay = (index % 4) * 90;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);
        
        // Ek baar animate hone ke baad unobserve
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  cards.forEach(card => revealObserver.observe(card));
}

// ================= CART & BUY NOW HANDLERS =================
function initProductActionButtons() {
  document.querySelectorAll('.btn-add-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const bookTitle = button.getAttribute('data-title') || 'Book';
      
      // Update local storage cart
      const cart = JSON.parse(localStorage.getItem('mp_cart') || '[]');
      cart.push(bookTitle);
      localStorage.setItem('mp_cart', JSON.stringify(cart));

      // Update badge
      const cartBadge = document.getElementById('cartCount');
      if (cartBadge) {
        cartBadge.innerText = cart.length;
      }

      // Visual button feedback
      const originalText = button.innerHTML;
      button.innerHTML = '<i class="fa-solid fa-check"></i> Added';
      button.style.background = '#22c55e';
      button.style.color = '#ffffff';

      setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
        button.style.color = '';
      }, 1500);
    });
  });

  document.querySelectorAll('.btn-buy-now').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.href = 'checkout.html';
    });
  });
}

// Live Render Backend ka URL
const API_URL = "https://bookbackend-1-czz1.onrender.com/api/books";

// Page load hote hi data fetch karein
document.addEventListener("DOMContentLoaded", () => {
  fetchBooks();
});

async function fetchBooks() {
  const booksContainer = document.querySelector("#books-container") || document.querySelector(".products-grid"); // Apne container ki id ya class check kar lein

  if (!booksContainer) {
    console.error("Books container element HTML me nahi mila!");
    return;
  }

  // Loading indicator
  booksContainer.innerHTML = "<p style='text-align:center;'>Loading books...</p>";

  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    // Data check karein (Backend data 'result.data' me bhej raha hai)
    if (result.success && result.data.length > 0) {
      booksContainer.innerHTML = ""; // Loader hatayein

      result.data.forEach((book) => {
        // Book card ka HTML design
        const bookCard = `
          <div class="book-card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 10px; background: #fff;">
            <img 
              src="${book.image || book.cover}" 
              alt="${book.title}" 
              style="width: 100%; height: 220px; object-fit: cover; border-radius: 6px;"
              onerror="this.src='https://via.placeholder.com/150x220?text=No+Cover'"
            />
            <h3 style="margin: 10px 0 5px; font-size: 1.1rem;">${book.title}</h3>
            <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 8px;">By ${book.author}</p>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
              <div>
                <span style="font-weight: bold; font-size: 1.1rem; color: #0f172a;">₹${book.salePrice || book.price}</span>
                ${book.originalPrice ? `<span style="text-decoration: line-through; color: #94a3b8; font-size: 0.85rem; margin-left: 6px;">₹${book.originalPrice}</span>` : ''}
              </div>
              ${book.discount ? `<span style="background: #fee2e2; color: #ef4444; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">${book.discount}</span>` : ''}
            </div>

            <button style="width: 100%; margin-top: 12px; padding: 8px; background: #2563eb; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
              Buy Now
            </button>
          </div>
        `;

        booksContainer.innerHTML += bookCard;
      });
    } else {
      booksContainer.innerHTML = "<p>Koi book uplabdh nahi hai.</p>";
    }
  } catch (error) {
    console.error("Error fetching books:", error);
    booksContainer.innerHTML = "<p style='color:red;'>Books load karne me dikkat aayi. Kripya page refresh karein.</p>";
  }
}

// Execution on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initProductActionButtons();
});

document.addEventListener('DOMContentLoaded', () => {
  // 1. Zoom Lightbox container dynamic creation
  const lightbox = document.createElement('div');
  lightbox.className = 'book-zoom-lightbox';
  lightbox.innerHTML = `
    <button class="book-zoom-close" aria-label="Close Preview">&times;</button>
    <img src="" alt="Zoomed Book Cover" />
  `;
  document.body.appendChild(lightbox);

  const zoomImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.book-zoom-close');

  // 2. Har book image par click event listener
  const bookImages = document.querySelectorAll('.pro-img-box img');

  bookImages.forEach((img) => {
    img.addEventListener('click', (e) => {
      e.stopPropagation(); // Quick view link ko trigger hone se rokna
      zoomImg.src = img.src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Background scroll lock
    });
  });

  // 3. Close actions (Click on overlay ya close button)
  function closeZoom() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeZoom);
  lightbox.addEventListener('click', (e) => {
    if (e.target !== zoomImg) closeZoom();
  });

  // ESC key dabane par close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeZoom();
    }
  });
});







// 1. Featured Products Fetch Function
// Products.js ke andar loadFeaturedProducts function:
async function loadFeaturedProducts() {
  const container = document.getElementById('featuredProContainer');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE_URL}/books/featured`);
    const result = await res.json();

    if (!result.success || !result.data || result.data.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #a39bb8;">No books available right now.</div>`;
      return;
    }

    // YAHAN STRICT 8 BOOKS LIMIT LAGAYEIN:
    const top8Books = result.data.slice(0, 8);

    container.innerHTML = top8Books.map(book => `
      <div class="pro-card" data-id="${book.id}" data-category="${book.category || 'general'}">
        <div class="pro-img-box">
          <span class="pro-badge promo-badge">${book.discount || '-20%'}</span>

          <button type="button" class="btn-card-wishlist" aria-label="Add to Wishlist" data-id="${book.id}">
            <i class="fa-regular fa-heart"></i>
          </button>

          <img src="${book.image || book.cover}" alt="${book.title}" onerror="this.src='https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500';">

          <a href="product-details.html?id=${book.id}" class="quick-view-btn" data-id="${book.id}">Quick View</a>
        </div>

        <div class="pro-details">
          <div class="star">
            ${'<i class="fas fa-star"></i>'.repeat(book.rating || 5)}
          </div>
          <h5 class="pro-title" title="${book.title}">${book.title}</h5>
          <div class="pro-sku">SKU: ${book.sku}</div>
          <div class="pro-price" style="margin: 8px 0; font-weight: 700; color: #0f172a;">
            ₹${book.salePrice || book.price}
          </div>

          <div class="card-action-btns">
            <button type="button" class="btn-card-add-cart" data-id="${book.id}">
              Add to Cart
            </button>
            <button type="button" class="btn-card-buy-now" data-id="${book.id}">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    `).join('');

    bindCardEvents();

  } catch (error) {
    console.error('Error fetching featured products:', error);
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #f43f5e;">Failed to load books. Please check backend server.</div>`;
  }
}

// 4. Card Action Events (Wishlist, Zoom & Cart)
function bindCardEvents() {
  // Wishlist Toggle
  document.querySelectorAll('.btn-card-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const icon = btn.querySelector('i');
      icon.classList.toggle('fa-solid');
      icon.classList.toggle('fa-regular');
      btn.classList.toggle('active');
    });
  });

  // Add to Cart Action
  document.querySelectorAll('.btn-card-add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const bookId = btn.dataset.id;
      handleAddToCart(bookId);
    });
  });

  // Buy Now Action
  document.querySelectorAll('.btn-card-buy-now').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const bookId = btn.dataset.id;
      handleBuyNow(bookId);
    });
  });
}

function handleAddToCart(id) {
  console.log(`Book ${id} added to cart`);
  const cartBadge = document.getElementById('navCartCount');
  if (cartBadge) {
    cartBadge.textContent = parseInt(cartBadge.textContent || '0') + 1;
  }
}

function handleBuyNow(id) {
  window.location.href = `checkout.html?buy_now=${id}`;
}

// DOM load hote hi fetch chalayein
document.addEventListener('DOMContentLoaded', () => {
  loadFeaturedProducts();
});