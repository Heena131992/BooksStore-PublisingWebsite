fetch('https://bookbackend-1-czz1.onrender.com/api/books')
  .then(response => response.json())
  .then(data => {
    console.log("Live backend data:", data);
    // Yahan aapka display/cards render karne ka logic aayega
  })
  .catch(error => console.error("Error fetching books:", error));

  
const API_BASE_URL = 'http://localhost:5000/api';



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