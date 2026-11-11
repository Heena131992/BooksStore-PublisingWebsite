
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
    // Local testing ke liye localhost:5000, live deployment ke liye apna backend URL dalein
// Local testing ke liye localhost, live ke liye apna sahi Render URL with /api
const API_BASE_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000/api"
    : "https://bookbackend-6gn2.onrender.com/api";
    const STORAGE_KEYS = {
        CART: "mp_cart",
        WISHLIST: "mp_wishlist"
    };

    // Global in-memory list for dynamic live search
    window.homeLiveBooks = [];

    /**
     * Safely parse localStorage array
     */



async function loadAllGalleryBooks() {
  // Aapke exact HTML ID se target kiya gaya hai
  const container = document.getElementById('bookGrid');
  if (!container) return;

  // Loading state placeholder
  container.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; color: #a39bb8; padding: 50px 0; font-size: 1.1rem;">
      <i class="fa-solid fa-spinner fa-spin"></i> Catalogue load ho raha hai...
    </div>
  `;

  try {
    // Backend se ALL books fetch hongi (No 8-book limit)
    const res = await fetch(`${API_BASE_URL}/books`);
    const result = await res.json();

    if (!result.success || !result.data || result.data.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; color: #a39bb8; padding: 40px 0;">
          Abhi koi book available nahi hai.
        </div>
      `;
      return;
    }

    // Saari books render karein (Dashboard se add ki hui books bhi yahan aayengi)
    container.innerHTML = result.data.map(book => {
      const bookImg = book.image || book.cover || 'images/f1.jpg';
      const bookPrice = book.salePrice || book.price || 0;
      const originalPrice = book.originalPrice || (bookPrice * 1.25).toFixed(2);

      return `
        <div class="pro-card" data-id="${book.id}" data-category="${book.category || 'general'}">
          <div class="pro-img-box">
            <span class="pro-badge promo-badge">${book.discount || '-20%'}</span>

            <button type="button" class="btn-card-wishlist" aria-label="Add to Wishlist" data-id="${book.id}">
              <i class="fa-regular fa-heart"></i>
            </button>

            <img 
              src="${bookImg}" 
              alt="${book.title}" 
              onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300';"
            >

            <a href="product-details.html?id=${book.id}" class="quick-view-btn" data-id="${book.id}">
              Quick View
            </a>
          </div>

          <div class="pro-details">
            <div class="star">
              ${'<i class="fas fa-star"></i>'.repeat(book.rating || 5)}
            </div>
            <h5 class="pro-title" title="${book.title}">${book.title}</h5>
            <div class="pro-author" style="font-size: 0.85rem; color: #64748b; margin-bottom: 4px;">
              By ${book.author || 'Author'}
            </div>
            <div class="pro-sku">SKU: ${book.sku}</div>

            <div class="price-row" style="margin: 8px 0; font-weight: 700; color: #0f172a; font-size: 1.05rem;">
              ₹${bookPrice} 
              <span style="font-size: 0.85rem; color: #94a3b8; text-decoration: line-through; margin-left: 6px;">
                ₹${originalPrice}
              </span>
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
      `;
    }).join('');

    // Events re-bind karein (Wishlist & Cart)
    bindGalleryEvents();

  } catch (error) {
    console.error('Gallery books fetch error:', error);
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; color: #f43f5e; padding: 40px 0;">
        Catalogue load nahi ho paya. Backend server (Port 5000) check karein.
      </div>
    `;
  }
}

function bindGalleryEvents() {
  // Wishlist toggle
  document.querySelectorAll('.btn-card-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const icon = btn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-solid');
        icon.classList.toggle('fa-regular');
      }
      btn.classList.toggle('active');
    });
  });

  // Add to Cart
  document.querySelectorAll('.btn-card-add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const bookId = btn.dataset.id;
      const cartBadge = document.getElementById('navCartCount');
      if (cartBadge) {
        cartBadge.textContent = parseInt(cartBadge.textContent || '0') + 1;
      }
      console.log(`Book ${bookId} added to cart from Gallery`);
    });
  });

  // Buy Now
  document.querySelectorAll('.btn-card-buy-now').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const bookId = btn.dataset.id;
      window.location.href = `checkout.html?buy_now=${bookId}`;
    });
  });
}

// Page load hone par execute karein
document.addEventListener('DOMContentLoaded', () => {
  loadAllGalleryBooks();
});

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("gallerySearchInput");
    const bookCards = document.querySelectorAll(".gallery-book-card");
    const catItems = document.querySelectorAll(".cat-item");

    // 1. Live Search Filter
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();

            bookCards.forEach(card => {
                const title = card.querySelector(".book-name").innerText.toLowerCase();
                if (title.includes(query)) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }

    // 2. Category Tab Filter
    catItems.forEach(item => {
        item.addEventListener("click", () => {
            // Active class switch
            catItems.forEach(c => c.classList.remove("active"));
            item.classList.add("active");

            const selectedCat = item.getAttribute("data-category");

            bookCards.forEach(card => {
                const bookCat = card.getAttribute("data-category");
                if (selectedCat === "all" || selectedCat === bookCat) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    // 3. Category Accordion Collapse (Optional toggle)
    const categoryHeading = document.querySelector(".filter-heading[data-toggle='catList']");
    const catList = document.getElementById("catList");

    if (categoryHeading && catList) {
        categoryHeading.addEventListener("click", () => {
            const icon = categoryHeading.querySelector(".toggle-icon");
            if (catList.style.display === "none") {
                catList.style.display = "flex";
                icon.classList.remove("fa-plus");
                icon.classList.add("fa-minus");
            } else {
                catList.style.display = "none";
                icon.classList.remove("fa-minus");
                icon.classList.add("fa-plus");
            }
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("gallerySearchInput");
    const paginationContainer = document.getElementById("galleryPagination");
    const catItems = document.querySelectorAll(".cat-item");
    const priceRange = document.getElementById("priceRange");
    const priceValDisplay = document.getElementById("priceValDisplay");
    const formatCheckboxes = document.querySelectorAll('input[name="format"]');

    // Sabhi book cards fetch karein
    const allBookCards = Array.from(document.querySelectorAll(".gallery-book-card"));

    if (!allBookCards.length) return;

    let currentPage = 1;
    let activeCategory = "all";
    let maxPrice = 60;
    let currentFilteredCards = [...allBookCards];

    // Accordions (Category, Price, Formats)
    function setupAccordion(headerId, bodyId) {
        const header = document.getElementById(headerId);
        const body = document.getElementById(bodyId);
        if (!header || !body) return;

        header.addEventListener("click", () => {
            const icon = header.querySelector(".toggle-icon");
            const isHidden = window.getComputedStyle(body).display === "none";
            if (isHidden) {
                body.style.display = "flex";
                if (icon) icon.textContent = "—";
            } else {
                body.style.display = "none";
                if (icon) icon.textContent = "+";
            }
        });
    }

    setupAccordion("catHeading", "catList");
    setupAccordion("priceHeading", "priceBody");
    setupAccordion("formatHeading", "formatBody");

    // Dynamic Pages Calculation (Page 1 = 8, Page 2+ = 10 each)
    function calculateTotalPages(total) {
        if (total <= 0) return 1;
        if (total <= 8) return 1;
        return 1 + Math.ceil((total - 8) / 10);
    }

    // Render Slice by Current Page
    function renderCurrentPage(page) {
        const totalPages = calculateTotalPages(currentFilteredCards.length);

        if (page > totalPages) page = totalPages;
        if (page < 1) page = 1;
        currentPage = page;

        let startIndex = 0;
        let endIndex = 8;

        if (currentPage === 1) {
            startIndex = 0;
            endIndex = 8;
        } else {
            startIndex = 8 + (currentPage - 2) * 10;
            endIndex = startIndex + 10;
        }

        // Sabhi raw cards hide karein
        allBookCards.forEach(card => (card.style.display = "none"));

        // Current page range ke filtered cards dikhayein
        const visibleSlice = currentFilteredCards.slice(startIndex, endIndex);
        visibleSlice.forEach(card => (card.style.display = "flex"));

        // Pagination controls render karein
        buildPaginationUI(totalPages);
    }

    // Build Pagination HTML Controls
    function buildPaginationUI(totalPages) {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = "";

        if (totalPages <= 1) return;

        // Previous (<)
        const prevBtn = document.createElement("button");
        prevBtn.type = "button";
        prevBtn.className = "page-arrow";
        prevBtn.innerHTML = "&lt;";
        prevBtn.disabled = (currentPage === 1);
        prevBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                renderCurrentPage(currentPage - 1);
                scrollToTop();
            }
        });
        paginationContainer.appendChild(prevBtn);

        function addPageBtn(num) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = `page-num ${num === currentPage ? "active" : ""}`;
            btn.textContent = num;
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                renderCurrentPage(num);
                scrollToTop();
            });
            paginationContainer.appendChild(btn);
        }

        function addDots() {
            const span = document.createElement("span");
            span.className = "page-dots";
            span.textContent = "...";
            paginationContainer.appendChild(span);
        }

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) addPageBtn(i);
        } else {
            addPageBtn(1);
            if (currentPage > 3) addDots();

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) addPageBtn(i);

            if (currentPage < totalPages - 2) addDots();
            addPageBtn(totalPages);
        }

        // Next (>)
        const nextBtn = document.createElement("button");
        nextBtn.type = "button";
        nextBtn.className = "page-arrow";
        nextBtn.innerHTML = "&gt;";
        nextBtn.disabled = (currentPage === totalPages);
        nextBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
                renderCurrentPage(currentPage + 1);
                scrollToTop();
            }
        });
        paginationContainer.appendChild(nextBtn);
    }

    function scrollToTop() {
        const topBar = document.querySelector(".bookstore-top-bar");
        if (topBar) topBar.scrollIntoView({ behavior: "smooth" });
    }

    // ================= UNIVERSAL SEARCH & FILTER LOGIC =================
    function applyUniversalFilter() {
        const rawQuery = searchInput ? searchInput.value.toLowerCase().trim() : "";
        // ISBN ya SKU me dash (-) ko ignore karne ke liye clean query
        const cleanQuery = rawQuery.replace(/[-\s]/g, "");

        const checkedFormats = Array.from(formatCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value.toLowerCase());

        currentFilteredCards = allBookCards.filter(card => {
            // 1. Data Fields Extraction
            const title = (card.querySelector(".book-name")?.innerText || "").toLowerCase();
            const author = (card.getAttribute("data-author") || "").toLowerCase();
            const rawIsbn = (card.getAttribute("data-isbn") || "").toLowerCase();
            const cleanIsbn = rawIsbn.replace(/[-\s]/g, "");
            const rawSku = (card.getAttribute("data-sku") || "").toLowerCase();
            const cleanSku = rawSku.replace(/[-\s]/g, "");
            const category = (card.getAttribute("data-category") || "all").toLowerCase();
            const cardFormat = (card.getAttribute("data-format") || "paperback").toLowerCase();

            // Price Number
            const priceText = card.querySelector(".sale-price")?.innerText || "0";
            const price = parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0;

            // 2. Search match across: Title, Author, Category, ISBN, SKU
            const matchesSearch = rawQuery === "" || 
                title.includes(rawQuery) || 
                author.includes(rawQuery) || 
                category.includes(rawQuery) ||
                cleanIsbn.includes(cleanQuery) || 
                cleanSku.includes(cleanQuery);

            // 3. Sidebar Filters match
            const matchesCategory = (activeCategory === "all" || category === activeCategory);
            const matchesPrice = (price <= maxPrice);
            const matchesFormat = (checkedFormats.length === 0 || checkedFormats.includes(cardFormat));

            return matchesSearch && matchesCategory && matchesPrice && matchesFormat;
        });

        // Search ya filter run hote hi hamesha Page 1 par jump karein
        renderCurrentPage(1);
    }

    // Search input live trigger (Type karte hi real-time search)
    if (searchInput) {
        searchInput.addEventListener("input", applyUniversalFilter);
    }

    // Category click listener
    catItems.forEach(item => {
        item.addEventListener("click", () => {
            catItems.forEach(c => c.classList.remove("active"));
            item.classList.add("active");
            activeCategory = (item.getAttribute("data-category") || "all").toLowerCase();
            applyUniversalFilter();
        });
    });

    // Price slider listener
    if (priceRange) {
        priceRange.addEventListener("input", (e) => {
            maxPrice = parseFloat(e.target.value);
            if (priceValDisplay) priceValDisplay.textContent = `$${maxPrice}`;
            applyUniversalFilter();
        });
    }

    // Formats checkboxes listener
    formatCheckboxes.forEach(cb => {
        cb.addEventListener("change", applyUniversalFilter);
    });
document.addEventListener("DOMContentLoaded", () => {
    
    // ... aapka baaki saara gallery.js ka code ...

    // ================= YAHAN LAGA DIJIYE (Aakhri mein) =================
    // 1. Check karein ki kya user Home page se search karke aaya hai
    const galleryParams = new URLSearchParams(window.location.search);
    const paramCategory = galleryParams.get("category");
    const paramSearch = galleryParams.get("search");

    // Agar Home page se search word aaya hai toh Gallery search box me set karein
    if (paramSearch && searchInput) {
        searchInput.value = paramSearch;
    }

    // Agar Home page se koi category aayi hai toh sidebar me wo category select karein
    if (paramCategory) {
        activeCategory = paramCategory.toLowerCase();
        document.querySelectorAll(".cat-item").forEach(item => {
            if ((item.getAttribute("data-category") || "").toLowerCase() === activeCategory) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });
    }

    // 2. Ab filter run karke filtered books display karein
    applyUniversalFilter();
});
    // First load
    applyUniversalFilter();
});





// ================= GALLERY ADD TO CART ENGINE =================
document.addEventListener("click", (e) => {
    // Check if clicked element is "Add to Cart" button inside any book card
    const addBtn = e.target.closest(".btn-card-add-cart");
    if (!addBtn) return;

    e.preventDefault();

    // 1. Find the parent card
    const card = addBtn.closest(".gallery-book-card");
    if (!card) return;

    // 2. Extract Book Details
    const bookId = card.getAttribute("data-id") || card.getAttribute("data-sku") || Date.now().toString();
    const title = card.querySelector(".book-name") ? card.querySelector(".book-name").innerText.trim() : "Untitled Book";
    const priceText = card.querySelector(".sale-price") ? card.querySelector(".sale-price").innerText.trim() : "$20.00";
    const imgEl = card.querySelector(".book-cover-frame img");
    const image = imgEl ? imgEl.getAttribute("src") : "images/placeholder.jpg";

    // 3. Update localStorage (mp_cart)
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem("mp_cart")) || [];
    } catch (err) {
        cart = [];
    }

    const existingIndex = cart.findIndex(item => String(item.id) === String(bookId) || item.title === title);

    if (existingIndex > -1) {
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
        cart.push({
            id: bookId,
            title: title,
            price: priceText,
            image: image,
            quantity: 1
        });
    }

    localStorage.setItem("mp_cart", JSON.stringify(cart));

    // 4. Update Navbar Badge Counters instantly on screen
    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    document.querySelectorAll("#navCartCount").forEach(badge => {
        badge.textContent = totalQty;
    });

    // 5. Button Feedback Effect
    const originalText = addBtn.innerText;
    addBtn.innerText = "✓ Added!";
    addBtn.style.backgroundColor = "#059669"; // Green confirmation
    addBtn.style.borderColor = "#059669";

    setTimeout(() => {
        addBtn.innerText = originalText;
        addBtn.style.backgroundColor = "";
        addBtn.style.borderColor = "";
    }, 1200);

    // 6. Global Toast (if common.js is active)
    if (window.triggerGlobalToast) {
        window.triggerGlobalToast(`Added "${title}" to your cart!`, "fa-bag-shopping");
    }
});

// Sync cart counter on initial page load in gallery.js
(() => {
    try {
        const cart = JSON.parse(localStorage.getItem("mp_cart")) || [];
        const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        document.querySelectorAll("#navCartCount").forEach(badge => {
            badge.textContent = totalQty;
        });
    } catch (e) {}
})();









// URL se banner filters read karein (?filter=sale ya ?filter=upcoming)
const urlFilter = new URLSearchParams(window.location.search).get("filter");

if (urlFilter) {
    const pageTitle = document.querySelector(".gallery-header h2, .section-title");
    
    switch (urlFilter) {
        case "bogo":
        case "sale":
            // Sale / Discount books filter
            if (pageTitle) pageTitle.textContent = "Special Deals & Seasonal Sale";
            // Agar aapke paas price filter slider ya checkbox hai:
            const priceSlider = document.getElementById("priceRange");
            if (priceSlider) priceSlider.value = 30; // budget filter
            break;

        case "upcoming":
        case "authors":
            if (pageTitle) pageTitle.textContent = "New Arrivals & Season Highlights";
            break;

        case "workbooks":
            if (pageTitle) pageTitle.textContent = "Prints, Workbooks & Guides";
            const hardbackCheck = document.querySelector("input[value='hardback']");
            if (hardbackCheck) hardbackCheck.checked = true;
            break;
    }

    if (typeof applyUniversalFilter === "function") {
        applyUniversalFilter();
    }
}


document.addEventListener('DOMContentLoaded', () => {
  // DOM References
  const catHeading = document.getElementById('catHeading');
  const catList = document.getElementById('catList');
  const priceHeading = document.getElementById('priceHeading');
  const priceBody = document.getElementById('priceBody');
  const formatHeading = document.getElementById('formatHeading');
  const formatBody = document.getElementById('formatBody');

  const priceSlider = document.getElementById('priceRange');
  const priceValDisplay = document.getElementById('priceValDisplay');
  const catItems = document.querySelectorAll('.cat-item');
  const formatCheckboxes = document.querySelectorAll('input[name="format"]');

  // =========================================================
  // 1. ACCORDION TOGGLE LISTENERS
  // =========================================================

  // Category Toggle (+ / —)
  if (catHeading && catList) {
    catHeading.addEventListener('click', () => {
      const isCollapsed = catList.classList.toggle('collapsed');
      const icon = catHeading.querySelector('.toggle-icon');
      if (icon) icon.textContent = isCollapsed ? '+' : '—';
    });
  }

  // Price Toggle (+ / —)
  if (priceHeading && priceBody) {
    priceHeading.addEventListener('click', () => {
      const isCollapsed = priceBody.classList.toggle('collapsed');
      const icon = priceHeading.querySelector('.toggle-icon');
      if (icon) icon.textContent = isCollapsed ? '+' : '—';
    });
  }

  // Formats Toggle (+ / —)
  if (formatHeading && formatBody) {
    formatHeading.addEventListener('click', () => {
      const isCollapsed = formatBody.classList.toggle('collapsed');
      const icon = formatHeading.querySelector('.toggle-icon');
      if (icon) icon.textContent = isCollapsed ? '+' : '—';
    });
  }

  // =========================================================
  // 2. LIVE FILTERING ENGINE
  // =========================================================
  let selectedCategory = 'all';

  // Category Selection Click
  catItems.forEach((item) => {
    item.addEventListener('click', () => {
      catItems.forEach((el) => el.classList.remove('active'));
      item.classList.add('active');
      selectedCategory = item.getAttribute('data-category') || 'all';
      applyFilters();
    });
  });

  // Price Range Slider
  if (priceSlider) {
    priceSlider.addEventListener('input', (e) => {
      if (priceValDisplay) {
        priceValDisplay.textContent = `$${e.target.value}`;
      }
      applyFilters();
    });
  }

  // Formats Checkbox Change
  formatCheckboxes.forEach((cb) => {
    cb.addEventListener('change', applyFilters);
  });

  // Master Filter Function
  function applyFilters() {
    const maxPrice = priceSlider ? parseFloat(priceSlider.value) : 1000;
    const selectedFormats = Array.from(formatCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value.toLowerCase());

    const bookCards = document.querySelectorAll('.book-grid .pro-card, #bookGrid .pro-card, .pro-card');

    bookCards.forEach((card) => {
      // 1. Category Matching
      const cardCat = (
        card.getAttribute('data-category') ||
        card.querySelector('.pro-category, .category')?.textContent ||
        ''
      ).toLowerCase();

      let matchesCat = (selectedCategory === 'all');
      if (!matchesCat) {
        matchesCat = cardCat.includes(selectedCategory.toLowerCase());
      }

      // 2. Format Matching
      const cardFmt = (
        card.getAttribute('data-format') ||
        card.querySelector('.format-badge')?.textContent ||
        'paperback'
      ).toLowerCase();

      const matchesFmt =
        selectedFormats.length === 0 ||
        selectedFormats.some((fmt) => cardFmt.includes(fmt));

      // 3. Price Matching
      const priceText = card.querySelector('.sale-price, .price, h4')?.textContent || '0';
      const numericPrice = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
      const matchesPrice = numericPrice <= maxPrice;

      // Toggle Card Display
      if (matchesCat && matchesFmt && matchesPrice) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }
});