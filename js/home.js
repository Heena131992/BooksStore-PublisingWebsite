/**
 * ==============================================================================
 * Project: Mindful Pages Publishers / Kovark Bookstore
 * Script: js/home.js
 * Description: Complete Home Page Controller handling Hero Carousel, Featured
 *              Grids, Top-Right Wishlist Heart Toggles, Add to Cart, Buy Now,
 *              Quick View routing, and LocalStorage Badge Synchronizations.
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ==========================================================================
       1. GLOBAL STORAGE KEYS & SHARED HELPERS
       ========================================================================== */
    const STORAGE_KEYS = {
        CART: "mp_cart",
        WISHLIST: "mp_wishlist"
    };

    /**
     * Safely parse localStorage array
     */
    function getStoredData(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch (err) {
            console.error(`Error parsing localStorage key: ${key}`, err);
            return [];
        }
    }

    /**
     * Safely stringify and save to localStorage
     */
    function setStoredData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (err) {
            console.error(`Error saving localStorage key: ${key}`, err);
        }
    }

    /**
     * Show Toast notification (Fallback if common.js toast isn't ready)
     */
    function notifyUser(message, iconClass = "fa-check-circle") {
        if (typeof window.triggerGlobalToast === "function") {
            window.triggerGlobalToast(message, iconClass);
            return;
        }

        let toast = document.getElementById("homeLocalToast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "homeLocalToast";
            toast.style.position = "fixed";
            toast.style.bottom = "25px";
            toast.style.right = "25px";
            toast.style.background = "#102a43";
            toast.style.color = "#ffffff";
            toast.style.padding = "12px 22px";
            toast.style.borderRadius = "8px";
            toast.style.fontSize = "15px";
            toast.style.fontWeight = "600";
            toast.style.zIndex = "10005";
            toast.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
            toast.style.transition = "all 0.3s ease";
            toast.style.opacity = "0";
            toast.style.transform = "translateY(20px)";
            document.body.appendChild(toast);
        }

        toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span style="margin-left:8px;">${message}</span>`;
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(20px)";
        }, 2600);
    }

    /* ==========================================================================
       2. NAVBAR BADGE COUNTERS REALTIME SYNC
       ========================================================================== */
    function syncNavbarBadges() {
        const cart = getStoredData(STORAGE_KEYS.CART);
        const wishlist = getStoredData(STORAGE_KEYS.WISHLIST);

        const totalCartQty = cart.reduce((accum, item) => accum + (item.quantity || 1), 0);

        // Update all Cart badges across headers
        document.querySelectorAll("#navCartCount, .cart-badge-count-cart").forEach(badge => {
            badge.textContent = totalCartQty;
        });

        // Update all Wishlist badges across headers
        document.querySelectorAll("#navWishlistCount, .cart-badge-count-wish").forEach(badge => {
            badge.textContent = wishlist.length;
        });

        // If drawer counters exist, sync them too
        const drawerWishTotal = document.getElementById("drawerWishlistTotal");
        const drawerCartTotal = document.getElementById("globalCartCountHeader");
        if (drawerWishTotal) drawerWishTotal.textContent = wishlist.length;
        if (drawerCartTotal) drawerCartTotal.textContent = totalCartQty;
    }

    /* ==========================================================================
       3. HOME CARDS WISHLIST HEARTS HIGHLIGHT ENGINE
       ========================================================================== */
    function syncHomeWishlistIcons() {
        const wishlist = getStoredData(STORAGE_KEYS.WISHLIST);
        const wishButtons = document.querySelectorAll(".btn-card-wishlist, .pro-img-box .btn-wishlist");

        wishButtons.forEach(btn => {
            const card = btn.closest(".pro-card, .pro");
            const bookId = btn.getAttribute("data-id") || 
                           card?.getAttribute("data-id") || 
                           card?.querySelector(".pro-sku")?.innerText.replace(/\D/g, "");
            
            const title = card?.querySelector(".pro-title, h5")?.innerText.trim();
            const icon = btn.querySelector("i");

            const isSaved = wishlist.some(item => 
                (bookId && String(item.id) === String(bookId)) || 
                (title && item.title === title)
            );

            if (isSaved) {
                btn.classList.add("active");
                if (icon) icon.className = "fa-solid fa-heart";
                btn.style.color = "#ef4444";
                btn.style.background = "#fee2e2";
                btn.style.borderColor = "#ef4444";
            } else {
                btn.classList.remove("active");
                if (icon) icon.className = "fa-regular fa-heart";
                btn.style.color = "";
                btn.style.background = "";
                btn.style.borderColor = "";
            }
        });
    }

    /* ==========================================================================
       4. CARD METADATA EXTRACTOR (Universal Fallback)
       ========================================================================== */
    function extractCardData(card) {
        if (!card) return null;

        // Title
        const titleEl = card.querySelector(".pro-title, h5");
        const title = titleEl ? titleEl.innerText.trim() : "Untitled Book";

        // ID or SKU
        const skuEl = card.querySelector(".pro-sku");
        let bookId = card.getAttribute("data-id");
        if (!bookId && skuEl) {
            bookId = skuEl.innerText.replace(/[^0-9]/g, "");
        }
        if (!bookId) {
            bookId = title.toLowerCase().replace(/[^a-z0-9]/g, "-");
        }

        // Price (Extracts pure currency format)
        const salePriceEl = card.querySelector(".sale-price, h4");
        let price = "$20.00";
        if (salePriceEl) {
            const priceMatch = salePriceEl.innerText.match(/\$\d+(\.\d{1,2})?/);
            price = priceMatch ? priceMatch[0] : salePriceEl.innerText.trim();
        }

        // Image
        const imgEl = card.querySelector(".pro-img-box img, img");
        const image = imgEl ? (imgEl.getAttribute("src") || imgEl.currentSrc) : "images/placeholder.jpg";

        return {
            id: String(bookId),
            title: title,
            price: price,
            image: image
        };
    }

    /* ==========================================================================
       5. CART DISPATCHER
       ========================================================================== */
    function addItemToCart(bookData, quantity = 1) {
        if (!bookData) return;

        let cart = getStoredData(STORAGE_KEYS.CART);
        const existingIdx = cart.findIndex(c => 
            String(c.id) === String(bookData.id) || c.title === bookData.title
        );

        if (existingIdx > -1) {
            cart[existingIdx].quantity = (cart[existingIdx].quantity || 1) + quantity;
        } else {
            cart.push({
                id: bookData.id,
                title: bookData.title,
                price: bookData.price,
                image: bookData.image,
                quantity: quantity
            });
        }

        setStoredData(STORAGE_KEYS.CART, cart);
        syncNavbarBadges();
        notifyUser(`Added "${bookData.title}" to Cart!`, "fa-bag-shopping");
    }

    /* ==========================================================================
       6. GLOBAL CLICK DELEGATION FOR ALL HOME ACTIONS
       ========================================================================== */
    document.addEventListener("click", (e) => {
        // -------------------------------------------------------------
        // A. TOP-RIGHT HEART WISHLIST BUTTON CLICK
        // -------------------------------------------------------------
        const wishBtn = e.target.closest(".btn-card-wishlist, .pro-img-box .btn-wishlist");
        if (wishBtn) {
            e.preventDefault();
            e.stopPropagation();

            const card = wishBtn.closest(".pro-card, .pro");
            const bookData = extractCardData(card);
            if (!bookData) return;

            let wishlist = getStoredData(STORAGE_KEYS.WISHLIST);
            const existIdx = wishlist.findIndex(w => 
                String(w.id) === String(bookData.id) || w.title === bookData.title
            );

            const icon = wishBtn.querySelector("i");

            if (existIdx > -1) {
                // Item exists: Remove from wishlist
                wishlist.splice(existIdx, 1);
                wishBtn.classList.remove("active");
                if (icon) icon.className = "fa-regular fa-heart";
                wishBtn.style.color = "";
                wishBtn.style.background = "";
                wishBtn.style.borderColor = "";
                notifyUser(`Removed "${bookData.title}" from Wishlist`, "fa-heart-crack");
            } else {
                // Item new: Add to wishlist
                wishlist.push(bookData);
                wishBtn.classList.add("active");
                if (icon) icon.className = "fa-solid fa-heart";
                wishBtn.style.color = "#fee2e2";
                wishBtn.style.background = "#ef4444";
                wishBtn.style.borderColor = "#ef4444";
                notifyUser(`Saved "${bookData.title}" to Wishlist!`, "fa-heart");
            }

            setStoredData(STORAGE_KEYS.WISHLIST, wishlist);
            syncNavbarBadges();
            return;
        }

        // -------------------------------------------------------------
        // B. ADD TO CART BUTTON CLICK
        // -------------------------------------------------------------
        const addBtn = e.target.closest(".btn-card-add-cart, .btn-add-cart");
        if (addBtn) {
            e.preventDefault();
            const card = addBtn.closest(".pro-card, .pro");
            const bookData = extractCardData(card);
            if (!bookData) return;

            addItemToCart(bookData, 1);

            // Button feedback animation
            const originalHTML = addBtn.innerHTML;
            addBtn.innerHTML = "✓ Added!";
            addBtn.style.backgroundColor = "#059669";
            addBtn.style.borderColor = "#059669";
            addBtn.style.color = "#ffffff";

            setTimeout(() => {
                addBtn.innerHTML = originalHTML;
                addBtn.style.backgroundColor = "";
                addBtn.style.borderColor = "";
                addBtn.style.color = "";
            }, 1100);
            return;
        }

        // -------------------------------------------------------------
        // C. BUY NOW BUTTON CLICK
        // -------------------------------------------------------------
        const buyBtn = e.target.closest(".btn-card-buy-now, .btn-buy-now");
        if (buyBtn) {
            e.preventDefault();
            const card = buyBtn.closest(".pro-card, .pro");
            const bookData = extractCardData(card);
            if (!bookData) return;

            // 1. Add item immediately to cart
            addItemToCart(bookData, 1);

            // 2. Open Cart Drawer if present in common.js
            const cartDrawer = document.getElementById("universalCartDrawer");
            const overlay = document.getElementById("globalOverlay");

            if (cartDrawer && overlay) {
                cartDrawer.classList.add("open");
                overlay.classList.add("active");
                document.body.style.overflow = "hidden";
            } else {
                // Fallback: If on another structure, redirect smoothly to gallery/checkout
                window.location.href = `gallery.html`;
            }
            return;
        }

        // -------------------------------------------------------------
        // D. QUICK VIEW BUTTON CLICK
        // -------------------------------------------------------------
        const qvBtn = e.target.closest(".quick-view-btn");
        if (qvBtn) {
            // Let native <a> navigation route to product-details.html?id=X
            const targetUrl = qvBtn.getAttribute("href");
            if (targetUrl && targetUrl !== "#") {
                return; // Let browser navigate
            } else {
                e.preventDefault();
                const card = qvBtn.closest(".pro-card, .pro");
                const bookData = extractCardData(card);
                if (bookData && bookData.id) {
                    window.location.href = `product-details.html?id=${bookData.id}`;
                }
            }
        }
    });

    /* ==========================================================================
       7. HERO SECTION 3D INTERACTION & BANNER SLIDER
       ========================================================================== */
    const heroCover = document.querySelector(".hero-book-cover, .hero-slider-wrap");
    if (heroCover) {
        heroCover.addEventListener("mousemove", (e) => {
            const rect = heroCover.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = -(y / 20).toFixed(2);
            const rotateY = (x / 20).toFixed(2);

            heroCover.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        heroCover.addEventListener("mouseleave", () => {
            heroCover.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
            heroCover.style.transition = "transform 0.4s ease";
        });

        heroCover.addEventListener("mouseenter", () => {
            heroCover.style.transition = "none";
        });
    }

    /* ==========================================================================
       8. VIEW MORE BOOKS EXPANSION / REDIRECTION
       ========================================================================== */
    const viewMoreBtn = document.querySelector(".btn-view-more");
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener("click", (e) => {
            const extraHiddenCards = document.querySelectorAll(".pro-card.extra-hidden, .pro.extra-hidden");
            
            // If hidden cards exist on page, reveal them; otherwise proceed to gallery.html
            if (extraHiddenCards.length > 0) {
                e.preventDefault();
                extraHiddenCards.forEach(card => {
                    card.style.display = "flex";
                    card.classList.remove("extra-hidden");
                });
                viewMoreBtn.style.display = "none";
            }
        });
    }

    /* ==========================================================================
       9. INITIAL BOOTSTRAP EXECUTION
       ========================================================================== */
    function initializeHomePage() {
        syncNavbarBadges();
        syncHomeWishlistIcons();
    }

    initializeHomePage();
});


/* ==========================================================================
   HOME PAGE UNIVERSAL SEARCH ENGINE
   ========================================================================== */
(function setupHomeSearch() {
    const searchInput = document.getElementById("homeSearchInput");
    const searchBtn = document.getElementById("homeSearchBtn");
    const resultsContainer = document.getElementById("homeSearchResults");

    if (!searchInput || !resultsContainer) return;

    // Books Dataset for Instant Home Search
    const searchCatalog = [
        {
            id: 1,
            title: "Attachment, Not Anxiety",
            author: "Saira Nazmeen-Grey",
            category: "Psychology",
            sku: "9789309332289",
            price: "$25.11",
            image: "images/9789371346603_EN.jpg"
        },
        {
            id: 2,
            title: "Secure Love Scripts",
            author: "Matteo Reinhardt",
            category: "Family",
            sku: "9789371346627",
            price: "$21.11",
            image: "images/9789371346627_DE.jpg"
        },
        {
            id: 3,
            title: "Closeness Without Chaos",
            author: "Kaia Solander",
            category: "Self-Help",
            sku: "9789371347037",
            price: "$20.53",
            image: "images/9789371347037_DE.jpg"
        },
        {
            id: 4,
            title: "Stop Testing People",
            author: "Kaia Solander",
            category: "Psychology",
            sku: "9789371347129",
            price: "$21.66",
            image: "images/9789371347129_FR.jpg"
        },
        {
            id: 5,
            title: "Psychology of Money",
            author: "Morgan Housel",
            category: "Business",
            sku: "9789375365861",
            price: "$65.00",
            image: "images/f2.jpg"
        }
    ];

    // Live Input Event
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        const cleanQuery = query.replace(/[-\s]/g, "");

        if (query.length === 0) {
            resultsContainer.innerHTML = "";
            resultsContainer.classList.remove("active");
            return;
        }

        // Search matches: Title, Author, Category, SKU
        const matched = searchCatalog.filter(book => {
            const titleMatch = book.title.toLowerCase().includes(query);
            const authorMatch = book.author.toLowerCase().includes(query);
            const catMatch = book.category.toLowerCase().includes(query);
            const skuMatch = book.sku.replace(/[-\s]/g, "").includes(cleanQuery);

            return titleMatch || authorMatch || catMatch || skuMatch;
        });

        // Render Results List
        resultsContainer.innerHTML = "";
        if (matched.length === 0) {
            resultsContainer.innerHTML = `<div class="search-no-results">No books found for "<strong>${e.target.value}</strong>"</div>`;
        } else {
            matched.forEach(book => {
                const itemLink = document.createElement("a");
                itemLink.href = `product-details.html?id=${book.id}`;
                itemLink.className = "search-item-row";
                itemLink.innerHTML = `
                    <div class="search-item-thumb">
                        <img src="${book.image}" alt="${book.title}" onerror="this.src='images/placeholder.jpg'" />
                    </div>
                    <div class="search-item-info">
                        <h4 class="search-item-title">${book.title}</h4>
                        <div class="search-item-meta">By ${book.author} • Category: <span>${book.category}</span></div>
                        <div class="search-item-price">${book.price}</div>
                    </div>
                `;
                resultsContainer.appendChild(itemLink);
            });
        }

        resultsContainer.classList.add("active");
    });

    // Enter Key -> Gallery Search Redirect
    function submitSearch() {
        const val = searchInput.value.trim();
        if (val) {
            window.location.href = `gallery.html?search=${encodeURIComponent(val)}`;
        }
    }

    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            submitSearch();
        }
    });

    if (searchBtn) {
        searchBtn.addEventListener("click", submitSearch);
    }

    // Close Dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".home-search-wrapper")) {
            resultsContainer.classList.remove("active");
        }
    });
})();


// ================= HOME SEARCH BUTTON CLICK HANDLER =================
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("homeSearchInput");
    const searchBtn = document.getElementById("homeSearchBtn");

    function executeHomeSearch() {
        if (!searchInput) return;
        const query = searchInput.value.trim();

        if (query !== "") {
            // Gallery page par search term ke sath redirect karein
            window.location.href = `gallery.html?search=${encodeURIComponent(query)}`;
        } else {
            // Agar khali click kiya toh seedha gallery page kholein
            window.location.href = `gallery.html`;
        }
    }

    // 1. Search Icon / Button Click hone par
    if (searchBtn) {
        searchBtn.addEventListener("click", (e) => {
            e.preventDefault();
            executeHomeSearch();
        });
    }

    // 2. Keyboard par Enter press karne par
    if (searchInput) {
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                executeHomeSearch();
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

  function openMenu() {
    hamburgerBtn?.classList.add('active');
    mobileDrawer?.classList.add('active');
    drawerOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden'; // Screen scroll freeze karein
  }

  function closeMenu() {
    hamburgerBtn?.classList.remove('active');
    mobileDrawer?.classList.remove('active');
    drawerOverlay?.classList.remove('active');
    document.body.style.overflow = ''; // Scroll restore karein
  }

  // Hamburger click toggle
  hamburgerBtn?.addEventListener('click', () => {
    const isOpen = mobileDrawer?.classList.contains('active');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close button click
  drawerCloseBtn?.addEventListener('click', closeMenu);

  // Background overlay click
  drawerOverlay?.addEventListener('click', closeMenu);

  // Kisi bhi nav link par click hone par drawer automatically close ho
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
});