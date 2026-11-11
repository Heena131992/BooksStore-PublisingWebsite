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


/**
 * Mindful Pages - Complete Product Details & Related Carousel Engine
 */

 /* ==========================================================================
       1. API CONFIGURATION & GLOBAL STORAGE KEYS
       ========================================================================== */
    // Local testing ke liye localhost:5000, live deployment ke liye apna backend URL dalein
    const API_BASE_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000"
    : "https://bookbackend-6gn2.onrender.com"; // <-- Yahan apna asli live backend URL rakhein rakhein

    const STORAGE_KEYS = {
        CART: "mp_cart",
        WISHLIST: "mp_wishlist"
    };

    // Global in-memory list for dynamic live search
    window.homeLiveBooks = [];

    fetch(`${API_URL}/api/books`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(bookData),
})

    /**
     
// Fallback catalog in case backend server is unreachable
const LOCAL_BOOK_CATALOG = [
  {
    id: 1,
    title: 'Compounding Advantage',
    author: 'Ronan Ashvale',
    price: 19.99,
    salePrice: 19.99,
    originalPrice: 24.99,
    sku: '9789309332289',
    category: 'Business & Economics',
    format: 'Paperback (Physical)',
    pages: 312,
    publisher: 'Mindful Pages Press',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    synopsis: 'A transformative guide on compounding consistent habits, emotional clarity, and strategic leverage over time.',
    authorBio: 'Ronan Ashvale is an author and behavioral strategist specializing in cognitive models and deliberate growth.',
    contents: 'Chapter 1: The Exponential Curve\nChapter 2: Small Steps, Massive Shifts\nChapter 3: Avoiding Cognitive Friction\nChapter 4: The 10-Year Horizon'
  },
  {
    id: 2,
    title: 'The Silent Solitude',
    author: 'Elena Vance',
    price: 18.99,
    salePrice: 18.99,
    originalPrice: 24.00,
    sku: '9783753658601',
    category: 'Fiction',
    format: 'Hardcover',
    pages: 288,
    publisher: 'Lumina Literary Publishing',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    synopsis: 'An evocative look into emotional peace, personal boundaries, and intentional calm amidst digital chaos.',
    authorBio: 'Elena Vance is an acclaimed novelist celebrated for delicate character studies and atmospheric storytelling.',
    contents: 'Chapter 1: Whispers in the Wind\nChapter 2: The Empty Room\nChapter 3: An Unspoken Bond\nChapter 4: Rebirth in Stillness'
  },
  {
    id: 3,
    title: 'The Value Chain Advantage',
    author: 'Hugo Mardone',
    price: 9.99,
    salePrice: 9.99,
    originalPrice: 12.49,
    sku: '9789309332291',
    category: 'Business & Economics',
    format: 'E-Book / Digital',
    pages: 194,
    publisher: 'Mindful Pages Press',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    synopsis: 'Demystifying operational efficiency, resource allocation, and personal output systems.',
    authorBio: 'Hugo Mardone has spent over two decades directing growth strategies and publishing on operational systems.',
    contents: 'Chapter 1: Mapping the Value Chain\nChapter 2: Eliminating Waste\nChapter 3: Modern Delivery Channels\nChapter 4: Scaling Without Margin Loss'
  },
  {
    id: 4,
    title: 'The Niche Advantage',
    author: 'Arvind Solenne',
    price: 22.08,
    salePrice: 22.08,
    originalPrice: 27.60,
    sku: '9789309332292',
    category: 'Mindfulness',
    format: 'Paperback (Physical)',
    pages: 350,
    publisher: 'Mindful Pages Press',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    synopsis: 'A masterclass on discovering personal leverage, avoiding rivalry traps, and thriving in deep niches.',
    authorBio: 'Arvind Solenne is a sought-after educator on focus, creative autonomy, and sustainable habits.',
    contents: 'Chapter 1: The Curse of Broadness\nChapter 2: Carving Your Category\nChapter 3: Defensibility in Practice\nChapter 4: The Focused Future'
  },
  {
    id: 5,
    title: 'The Rivalry Trap',
    author: 'Tarun Basrai',
    price: 19.99,
    salePrice: 19.99,
    originalPrice: 24.99,
    sku: '9789309332293',
    category: 'Psychology',
    format: 'Hardcover',
    pages: 260,
    publisher: 'Apex Books',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
    synopsis: 'An insightful investigation into envy, comparative competition, and the path to authentic individual benchmarks.',
    authorBio: 'Tarun Basrai is a Delhi-based organizational psychologist and advisor to creative founders.',
    contents: 'Chapter 1: The Mimetic Urge\nChapter 2: False Benchmarks\nChapter 3: Independent Evaluation\nChapter 4: The Internal Metric'
  },
  {
    id: 6,
    title: 'Mastery of Thoughts',
    author: 'Marcus Sterling',
    price: 24.50,
    salePrice: 24.50,
    originalPrice: 29.99,
    sku: '9783753658779',
    category: 'Self Help',
    format: 'Hardcover',
    pages: 340,
    publisher: 'Beacon Press',
    image: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400',
    synopsis: 'Actionable techniques for mental decluttering, emotional poise, and cognitive presence.',
    authorBio: 'Marcus Sterling writes extensively on practical philosophy, stoicism, and emotional sovereignty.',
    contents: 'Chapter 1: The Noise of the Mind\nChapter 2: Cultivating Focus\nChapter 3: Cognitive Detachment\nChapter 4: Living Mindfully'
  },
  {
    id: 7,
    title: 'Secure Love Scripts',
    author: 'Kaia Solander',
    price: 22.08,
    salePrice: 22.08,
    originalPrice: 27.60,
    sku: '9789309332295',
    category: 'Family & Relationships',
    format: 'Paperback (Physical)',
    pages: 272,
    publisher: 'Mindful Pages Press',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    synopsis: 'Conversational scripts that turn hints into clear requests and establish healthy boundaries without panic.',
    authorBio: 'Kaia Solander is a relational counselor helping couples foster attachment security.',
    contents: 'Chapter 1: Relational Triggers\nChapter 2: Verbal Clarity Over Hints\nChapter 3: Boundary Architecture\nChapter 4: Repairing Ruptures'
  }
];

// Read ?id= from current page URL
function getActiveUrlId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Main Page Execution
document.addEventListener('DOMContentLoaded', async () => {
  const currentId = getActiveUrlId() || '1';
  let allBooksList = [];
  let currentBook = null;

  // 1. Fetch live books from Dashboard / Node server
  try {
    const res = await fetch(`${API_BASE_URL}/books`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        allBooksList = data;
      } else if (data.success && Array.isArray(data.data)) {
        allBooksList = data.data;
      } else if (Array.isArray(data.data)) {
        allBooksList = data.data;
      } else if (Array.isArray(data.books)) {
        allBooksList = data.books;
      }
    }
  } catch (err) {
    console.warn('API error, using local catalogue:', err);
  }

  // Fallback merge
  if (!allBooksList || allBooksList.length === 0) {
    allBooksList = LOCAL_BOOK_CATALOG;
  }

  // Find targeted book
  currentBook = allBooksList.find((b) => String(b.id) === String(currentId));
  if (!currentBook) {
    currentBook = LOCAL_BOOK_CATALOG.find((b) => String(b.id) === String(currentId));
  }
  if (!currentBook) {
    currentBook = allBooksList[0] || LOCAL_BOOK_CATALOG[0];
  }

  // 2. Render Page Views
  populateMainProductData(currentBook);
  setupPrevNextPagination(allBooksList, currentBook.id);
  setupInteractiveAccordions(currentBook);
  setupQuantityControls();
  
  // 3. Render and Wire Up Related Books Carousel
  renderAndActivateRelatedCarousel(allBooksList, currentBook.id);
  sanitizeStaticHeadings();
});

// =========================================================================
// 1. MAIN BOOK DETAILS & SINGLE CLEAN PRICE
// =========================================================================
function populateMainProductData(book) {
  const title = book.title || 'The Niche Advantage';
  const author = book.author || 'Mindful Author';
  const coverUrl = book.image || book.cover || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500';
  const salePrice = Number(book.salePrice || book.price || 22.08).toFixed(2);
  const origPrice = Number(book.originalPrice || (salePrice * 1.25)).toFixed(2);
  const sku = book.sku || book.isbn || ('978' + book.id);

  // Tab Title
  document.title = `${title} | Mindful Pages`;

  // Breadcrumb Update
  const breadcrumb = document.getElementById('breadcrumbTitle') ||
    document.querySelector('.breadcrumb-trail .current-crumb, .breadcrumb span:last-child');
  if (breadcrumb) {
    breadcrumb.textContent = title;
  } else {
    document.querySelectorAll('span, a, p, strong').forEach((el) => {
      if (el.textContent.includes('Attachment, Not Anxiety')) {
        el.textContent = title;
      }
    });
  }

  // Book Title Heading
  const titleHeading = document.getElementById('bookTitle') ||
    document.querySelector('.product-meta-column h1, .product-details h1, main h1');
  if (titleHeading) {
    titleHeading.textContent = title;
  }

  // SKU Number
  const skuEl = document.getElementById('bookSku') || document.querySelector('.book-sku-line');
  if (skuEl) {
    skuEl.textContent = `SKU: ${sku}`;
  }

  // Main Cover Image
  const coverImg = document.getElementById('mainBookCover') ||
    document.querySelector('.cover-card-box img, .product-cover-column img, .product-gallery img, main img');
  if (coverImg) {
    coverImg.src = coverUrl;
    coverImg.alt = title;
    coverImg.onerror = () => {
      coverImg.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500';
    };
  }

  // Single Clean Price (Eliminates Duplicate Text)
  const priceContainer = document.getElementById('productPriceContainer') ||
    document.querySelector('.single-price-box, .product-price, .price-box');
  if (priceContainer) {
    priceContainer.innerHTML = `
      <span class="current-sale-price" style="color: #6366f1; font-size: 1.6rem; font-weight: 700;">₹${salePrice}</span>
      <span class="original-strike-price" style="text-decoration: line-through; color: #94a3b8; font-size: 1.05rem; margin-left: 10px;">₹${origPrice}</span>
    `;
  }
}

// =========================================================================
// 2. PREV / NEXT TOP PAGINATION
// =========================================================================
function setupPrevNextPagination(booksList, activeId) {
  const prevBtn = document.getElementById('prevBookLink');
  const nextBtn = document.getElementById('nextBookLink');
  if (!prevBtn || !nextBtn || !Array.isArray(booksList) || booksList.length <= 1) return;

  const idx = booksList.findIndex((b) => String(b.id) === String(activeId));

  if (idx > 0) {
    prevBtn.href = `product-details.html?id=${booksList[idx - 1].id}`;
    prevBtn.style.opacity = '1';
    prevBtn.style.pointerEvents = 'auto';
  } else {
    prevBtn.style.opacity = '0.35';
    prevBtn.style.pointerEvents = 'none';
  }

  if (idx >= 0 && idx < booksList.length - 1) {
    nextBtn.href = `product-details.html?id=${booksList[idx + 1].id}`;
    nextBtn.style.opacity = '1';
    nextBtn.style.pointerEvents = 'auto';
  } else {
    nextBtn.style.opacity = '0.35';
    nextBtn.style.pointerEvents = 'none';
  }
}

// =========================================================================
// 3. INTERACTIVE ACCORDIONS
// =========================================================================
function setupInteractiveAccordions(book) {
  const authorBio = document.getElementById('authorBioText');
  if (authorBio) {
    authorBio.textContent =
      book.authorBio ||
      book.aboutAuthor ||
      `${book.author || 'The author'} is a celebrated writer dedicated to practical clarity, mindfulness, and creative frameworks.`;
  }

  const specsList = document.getElementById('specsList');
  if (specsList) {
    specsList.innerHTML = `
      <li style="margin-bottom: 6px;"><strong>ISBN-13:</strong> ${book.isbn || book.sku || '9789309332289'}</li>
      <li style="margin-bottom: 6px;"><strong>Format:</strong> ${book.format || 'Paperback (Physical)'}</li>
      <li style="margin-bottom: 6px;"><strong>Pages:</strong> ${book.pages || 320}</li>
      <li style="margin-bottom: 6px;"><strong>Publisher:</strong> ${book.publisher || 'Mindful Pages Press'}</li>
      <li style="margin-bottom: 6px;"><strong>Category:</strong> ${book.category || 'Mindfulness & Philosophy'}</li>
    `;
  }

  const chaptersList = document.getElementById('chaptersList');
  if (chaptersList) {
    const rawChapters =
      book.contents ||
      book.tableOfContents ||
      'Chapter 1: The Foundations of Security\nChapter 2: Non-Anxious Communication\nChapter 3: Boundaries That Connect\nChapter 4: The Path Forward';

    const lines = rawChapters.split('\n').filter((l) => l.trim().length > 0);
    chaptersList.innerHTML = lines.map((l) => `<p style="margin-bottom: 6px; color: #cbd5e1;">• ${l}</p>`).join('');
  }

  const items = [
    { btn: 'accAuthorBtn', content: 'accAuthorContent' },
    { btn: 'accDetailsBtn', content: 'accDetailsContent' },
    { btn: 'accContentsBtn', content: 'accContentsContent' }
  ];

  items.forEach(({ btn, content }) => {
    const button = document.getElementById(btn);
    const panel = document.getElementById(content);
    if (!button || !panel) return;

    button.onclick = (e) => {
      e.preventDefault();
      const open = panel.style.display === 'block';
      panel.style.display = open ? 'none' : 'block';
      const icon = button.querySelector('.acc-icon');
      if (icon) icon.textContent = open ? '+' : '−';
    };
  });
}

// =========================================================================
// 4. QUANTITY STEPPER
// =========================================================================
function setupQuantityControls() {
  const qtyInput = document.getElementById('orderQty');
  const minus = document.getElementById('qtyMinus');
  const plus = document.getElementById('qtyPlus');
  const cartBtn = document.getElementById('addToCartBtn');

  if (!qtyInput || !minus || !plus) return;

  minus.onclick = () => {
    let v = parseInt(qtyInput.value, 10) || 1;
    if (v > 1) qtyInput.value = v - 1;
  };

  plus.onclick = () => {
    let v = parseInt(qtyInput.value, 10) || 1;
    qtyInput.value = v + 1;
  };

  if (cartBtn) {
    cartBtn.onclick = () => alert(`Added ${qtyInput.value} item(s) to cart!`);
  }
}

// =========================================================================
// 5. RELATED BOOKS CAROUSEL & NAVIGATION BUTTONS (Guaranteed Fix)
// =========================================================================
function renderAndActivateRelatedCarousel(allBooks, currentBookId) {
  const track = document.getElementById('relatedTrack') || document.querySelector('.related-books-track');
  const prevBtn = document.getElementById('relPrevBtn');
  const nextBtn = document.getElementById('relNextBtn');

  if (!track) {
    console.error('#relatedTrack element nahi mila!');
    return;
  }

  // 1. Strict Inline Styling on Track so CSS issues never break layout
  track.style.display = 'flex';
  track.style.flexDirection = 'row';
  track.style.flexWrap = 'nowrap';
  track.style.overflowX = 'auto';
  track.style.overflowY = 'hidden';
  track.style.scrollBehavior = 'smooth';
  track.style.gap = '20px';
  track.style.padding = '15px 4px 20px 4px';
  track.style.width = '100%';
  track.style.boxSizing = 'border-box';

  // 2. Filter out current book
  let related = allBooks.filter((b) => String(b.id) !== String(currentBookId));
  if (related.length === 0) {
    related = LOCAL_BOOK_CATALOG.filter((b) => String(b.id) !== String(currentBookId));
  }

  // 3. Render Cards with STRICT Fixed Sizes (Prevents massive 100% images)
  track.innerHTML = related.map((book) => {
    const sale = Number(book.salePrice || book.price || 19.99).toFixed(2);
    const orig = Number(book.originalPrice || (sale * 1.25)).toFixed(2);
    const cover = book.image || book.cover || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400';

    return `
      <div class="rel-book-card" data-id="${book.id}" style="flex: 0 0 200px; width: 200px; min-width: 200px; max-width: 200px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; box-sizing: border-box;">
        <div style="width: 200px; height: 250px; min-height: 250px; max-height: 250px; overflow: hidden; background: #070114; position: relative;">
          <a href="product-details.html?id=${book.id}" style="display: block; width: 100%; height: 100%;">
            <img 
              src="${cover}" 
              alt="${book.title}" 
              style="width: 100%; height: 100%; object-fit: cover; display: block;"
              onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400';"
            />
          </a>
        </div>
        <div style="padding: 12px; display: flex; flex-direction: column; gap: 4px; background: rgba(15, 6, 28, 0.95); flex: 1;">
          <h4 style="margin: 0; font-size: 0.92rem; font-weight: 600; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            <a href="product-details.html?id=${book.id}" style="color: #ffffff; text-decoration: none;">${book.title}</a>
          </h4>
          <span style="font-size: 0.8rem; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">By ${book.author}</span>
          <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
            <span style="color: #6366f1; font-weight: 700; font-size: 0.95rem;">₹${sale}</span>
            <span style="color: #64748b; text-decoration: line-through; font-size: 0.82rem;">₹${orig}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // 4. PREV / NEXT CLICK ENGINE (Direct ScrollLeft Assignment for 100% Reliability)
  if (prevBtn && nextBtn) {
    const scrollAmount = 240;

    prevBtn.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    };

    nextBtn.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };
  }
}

// =========================================================================
// 6. SANITIZE HEADINGS
// =========================================================================
function sanitizeStaticHeadings() {
  const relHead = document.getElementById('relatedSectionHeading') ||
    document.querySelector('.related-title, .related-books-section h2');
  if (relHead) {
    relHead.textContent = 'Related Books';
  }

  const vipHead = document.getElementById('vipClubHeading') ||
    document.querySelector('.vip-club-title, .newsletter-section h2');
  if (vipHead) {
    vipHead.textContent = 'Sign Up For Newsletters';
  }
} */