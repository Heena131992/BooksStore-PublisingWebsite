/**
 * ==============================================================================
 * Project: Mindful Pages Publishers / Kovark Bookstore
 * Script: js/home.js
 * Description: Complete Home Page Controller handling Hero Carousel, Featured
 *              Grids (Live Backend API), Wishlist Hearts, Add to Cart, Buy Now,
 *              Quick View routing, Search, and Drawer Synchronizations.
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ==========================================================================
       1. API CONFIGURATION & GLOBAL STORAGE KEYS
       ========================================================================== */
    // Local testing ke liye localhost:5000, live deployment ke liye apna backend URL dalein
    const API_BASE_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
        ? "http://localhost:5000"
        : "https://mindfullpagesbackendapi.onrender.com"; // <-- Deploy hone ke baad apna live backend URL yahan rakhein

    const STORAGE_KEYS = {
        CART: "mp_cart",
        WISHLIST: "mp_wishlist"
    };

    // Global in-memory list for dynamic live search
    window.homeLiveBooks = [];

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
     * Show Toast notification
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
        const cart = getStoredData(STORAGE_KEYS.CART) || [];
        const wishlist = getStoredData(STORAGE_KEYS.WISHLIST) || [];

        const totalCartQty = cart.reduce((accum, item) => accum + (parseInt(item.quantity, 10) || 1), 0);

        // Update all Cart badges
        document.querySelectorAll("#navCartCount, .cart-badge-count, .cart-badge-count-cart").forEach(badge => {
            badge.textContent = totalCartQty;
        });

        // Update all Wishlist badges
        document.querySelectorAll("#navWishlistCount, .cart-badge-count-wish").forEach(badge => {
            badge.textContent = wishlist.length;
        });

        // Sync drawer counters & header titles
        const drawerWishTotal = document.getElementById("drawerWishlistTotal");
        const drawerCartTotal = document.getElementById("globalCartCountHeader");
        const drawerHeading = document.querySelector(".cart-drawer-header h3, .cart-title, aside h3");

        if (drawerWishTotal) drawerWishTotal.textContent = wishlist.length;
        if (drawerCartTotal) drawerCartTotal.textContent = totalCartQty;
        if (drawerHeading) drawerHeading.textContent = `My Cart (${totalCartQty})`;
    }

    /* ==========================================================================
       3. HOME CARDS WISHLIST HEARTS HIGHLIGHT ENGINE
       ========================================================================== */
    function syncHomeWishlistIcons() {
        const wishlist = getStoredData(STORAGE_KEYS.WISHLIST) || [];
        const wishButtons = document.querySelectorAll(".btn-card-wishlist, .pro-img-box .btn-wishlist, .btn-wishlist");

        wishButtons.forEach(btn => {
            const card = btn.closest(".pro-card, .pro");
            const bookData = extractCardData(card);
            if (!bookData) return;

            const icon = btn.querySelector("i");
            const isSaved = wishlist.some(item => String(item.id) === String(bookData.id));

            if (isSaved) {
                btn.classList.add("active");
                if (icon) {
                    icon.className = "fa-solid fa-heart";
                    icon.style.color = "#ef4444";
                }
                btn.style.color = "#ef4444";
                btn.style.background = "#fee2e2";
                btn.style.borderColor = "#ef4444";
            } else {
                btn.classList.remove("active");
                if (icon) {
                    icon.className = "fa-regular fa-heart";
                    icon.style.color = "";
                }
                btn.style.color = "";
                btn.style.background = "";
                btn.style.borderColor = "";
            }
        });
    }

    /* ==========================================================================
       4. CARD METADATA EXTRACTOR (Accurate Detection for Dynamic & Static Cards)
       ========================================================================== */
    function extractCardData(card) {
        if (!card) return null;

        // 1. Title
        const titleEl = card.querySelector(".book-title a, .book-title, .pro-title, h3, h5, h4");
        const title = titleEl ? titleEl.innerText.trim() : "Mindful Book";

        // 2. ID Detection
        let bookId = card.getAttribute("data-id") || card.dataset.id;
        
        if (!bookId) {
            const idLink = card.querySelector("a[href*='id=']");
            if (idLink) {
                const match = idLink.getAttribute("href").match(/[?&]id=([^&#]+)/);
                if (match) bookId = match[1];
            }
        }

        if (!bookId) {
            const skuEl = card.querySelector(".pro-sku");
            if (skuEl) bookId = skuEl.innerText.replace(/[^0-9]/g, "");
        }

        if (!bookId) {
            bookId = title.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
        }

        // 3. Price
        const salePriceEl = card.querySelector(".sale-price, .pro-price, .price, h4");
        let priceNum = 20.00;
        let priceText = "$20.00";
        if (salePriceEl) {
            const match = salePriceEl.innerText.match(/\d+(\.\d{1,2})?/);
            if (match) {
                priceNum = parseFloat(match[0]);
                priceText = `$${priceNum.toFixed(2)}`;
            }
        }

        // 4. Image
        const imgEl = card.querySelector(".pro-img-box img, img");
        const image = imgEl ? (imgEl.getAttribute("src") || imgEl.currentSrc) : "images/placeholder.jpg";

        return {
            id: String(bookId),
            title: title,
            price: priceNum,
            priceDisplay: priceText,
            image: image
        };
    }

    /* ==========================================================================
       5. LIVE CART DRAWER RENDER ENGINE
       ========================================================================== */
    function renderCartDrawer() {
        const cart = getStoredData(STORAGE_KEYS.CART) || [];
        const cartContainer = document.querySelector("#cartItemsList, .cart-drawer-items, .cart-items-body, .cart-body, aside .cart-content");
        const subtotalEl = document.querySelector("#cartSubtotal, .cart-subtotal-val, .cart-total-price, .cart-drawer-footer span:last-child");

        if (!cartContainer) return;

        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <div style="text-align: center; padding: 45px 15px; color: #94a3b8;">
                    <i class="fa-solid fa-basket-shopping" style="font-size: 2.4rem; margin-bottom: 12px; opacity: 0.35;"></i>
                    <p style="margin: 0; font-size: 0.95rem;">Your cart is empty.</p>
                </div>
            `;
            if (subtotalEl) subtotalEl.textContent = "$0.00";
            return;
        }

        let subtotal = 0;
        cartContainer.innerHTML = cart.map((item, idx) => {
            const itemPrice = parseFloat(item.price) || 0;
            const itemQty = parseInt(item.quantity, 10) || 1;
            const itemTotal = itemPrice * itemQty;
            subtotal += itemTotal;

            return `
                <div class="cart-drawer-item" style="display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); align-items: center;">
                    <img src="${item.image}" alt="${item.title}" style="width: 52px; height: 72px; object-fit: cover; border-radius: 4px; flex-shrink: 0;" onerror="this.src='images/placeholder.jpg'" />
                    <div style="flex: 1; min-width: 0;">
                        <h4 style="margin: 0 0 4px 0; font-size: 0.9rem; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</h4>
                        <span style="color: #a855f7; font-weight: 700; font-size: 0.9rem;">$${itemPrice.toFixed(2)}</span>
                        
                        <div style="display: flex; align-items: center; gap: 8px; margin-top: 6px;">
                            <button type="button" class="cart-qty-btn" data-action="decrease" data-index="${idx}" style="width: 22px; height: 22px; background: rgba(255,255,255,0.12); border: none; color: #fff; border-radius: 4px; cursor: pointer; line-height: 1;">-</button>
                            <span style="color: #fff; font-size: 0.9rem; min-width: 16px; text-align: center;">${itemQty}</span>
                            <button type="button" class="cart-qty-btn" data-action="increase" data-index="${idx}" style="width: 22px; height: 22px; background: rgba(255,255,255,0.12); border: none; color: #fff; border-radius: 4px; cursor: pointer; line-height: 1;">+</button>
                        </div>
                    </div>
                    <button type="button" class="cart-remove-btn" data-index="${idx}" style="background: transparent; border: none; color: #ef4444; cursor: pointer; padding: 6px; font-size: 1rem;" title="Remove">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
        }).join('');

        if (subtotalEl) {
            subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        }
    }

    /* ==========================================================================
       6. CART DISPATCHER
       ========================================================================== */
    function addItemToCart(bookData, quantity = 1) {
        if (!bookData) return;

        let cart = getStoredData(STORAGE_KEYS.CART) || [];
        const existingIdx = cart.findIndex(c => String(c.id) === String(bookData.id));

        if (existingIdx > -1) {
            cart[existingIdx].quantity = (parseInt(cart[existingIdx].quantity, 10) || 1) + quantity;
        } else {
            cart.push({
                id: String(bookData.id),
                title: bookData.title,
                price: bookData.price,
                image: bookData.image,
                quantity: quantity
            });
        }

        setStoredData(STORAGE_KEYS.CART, cart);
        syncNavbarBadges();
        renderCartDrawer();
        if (typeof notifyUser === "function") {
            notifyUser(`Added "${bookData.title}" to Cart!`, "fa-bag-shopping");
        }
    }

    /* ==========================================================================
       7. DYNAMIC LIVE PRODUCTS FETCH & RENDER (Dashboard to Home Page)
       ========================================================================== */
    async function loadFeaturedProductsFromBackend() {
        // Featured products grid container find karein
        const container = document.querySelector("#featuredProductsContainer, .pro-container, .featured-books-grid, #featured-products .pro-container, .products-grid");
        if (!container) return;

        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px 10px; color: #94a3b8;">
                <i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 12px; color: #a855f7;"></i>
                <p style="margin: 0; font-size: 1rem;">Dashboard se products load ho rahe hain...</p>
            </div>
        `;

        try {
            // Backend endpoint check: Pehle /api/books, fail hone par /api/products check karega
            let res = await fetch(`${API_BASE_URL}/api/books`).catch(() => null);
            if (!res || !res.ok) {
                res = await fetch(`${API_BASE_URL}/api/products`).catch(() => null);
            }

            if (!res || !res.ok) {
                throw new Error("Backend server response not OK");
            }

            let data = await res.json();
            const books = Array.isArray(data) ? data : (data.books || data.products || data.data || []);

            if (books.length === 0) {
                container.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #94a3b8;">
                        <p style="margin: 0; font-size: 1rem;">Dashboard me abhi koi product available nahi hai.</p>
                    </div>
                `;
                return;
            }

            // Global search list update karein live data se
            window.homeLiveBooks = books;

            // Cards render karein
            container.innerHTML = books.map((book) => {
                const bookId = book._id || book.id;
                const bookTitle = book.title || book.name || "Untitled Book";
                const bookPrice = parseFloat(book.price) || 20.00;
                const bookAuthor = book.author || "Mindful Pages";
                const bookCategory = book.category || "Novel";
                const bookImg = book.imageUrl || book.image || "images/placeholder.jpg";
                const bookRating = book.rating || 5;

                // Rating stars generator
                const starsHTML = Array.from({ length: 5 }, (_, i) => 
                    `<i class="fa-solid fa-star${i < Math.floor(bookRating) ? '' : '-half-stroke'}" style="color: #f59e0b; font-size: 0.8rem;"></i>`
                ).join('');

                return `
                    <div class="pro-card pro" data-id="${bookId}">
                        <div class="pro-img-box" style="position: relative;">
                            <a href="product-details.html?id=${bookId}">
                                <img src="${bookImg}" alt="${bookTitle}" onerror="this.src='images/placeholder.jpg'" />
                            </a>
                            <button class="btn-card-wishlist btn-wishlist" type="button" title="Add to Wishlist" style="position: absolute; top: 12px; right: 12px; z-index: 5;">
                                <i class="fa-regular fa-heart"></i>
                            </button>
                        </div>
                        <div class="des" style="padding-top: 10px;">
                            <span class="pro-category" style="font-size: 0.8rem; color: #a855f7; text-transform: uppercase; font-weight: 600;">${bookCategory}</span>
                            <h5 class="pro-title book-title" style="margin: 6px 0;">
                                <a href="product-details.html?id=${bookId}" style="color: inherit; text-decoration: none;">${bookTitle}</a>
                            </h5>
                            <div class="pro-author" style="font-size: 0.85rem; color: #64748b; margin-bottom: 6px;">By ${bookAuthor}</div>
                            <div class="star" style="margin-bottom: 8px;">
                                ${starsHTML}
                            </div>
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px;">
                                <h4 class="pro-price sale-price" style="margin: 0; color: #10b981; font-weight: 700;">$${bookPrice.toFixed(2)}</h4>
                                <div style="display: flex; gap: 6px;">
                                    <button class="btn-card-add-cart btn-add-cart" type="button" title="Add to Cart" style="padding: 6px 10px; border-radius: 4px; cursor: pointer;">
                                        <i class="fa-solid fa-cart-shopping"></i>
                                    </button>
                                    <button class="btn-card-buy-now btn-buy-now" type="button" style="padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; font-weight: 600;">
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // Cards aane ke baad Wishlist icons ka status update karein
            syncHomeWishlistIcons();

        } catch (err) {
            console.error("Error loading products from dashboard:", err);
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #ef4444; background: rgba(239, 68, 68, 0.05); border-radius: 8px;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <p style="margin: 0; font-weight: 600;">Products load nahi ho paye.</p>
                    <small style="color: #94a3b8;">Backend server check karein ya Port 5000 ensure karein.</small>
                </div>
            `;
        }
    }

    /* ==========================================================================
       8. GLOBAL CLICK DELEGATION (Cards, Wishlist, Cart Drawer, Buy Now)
       ========================================================================== */
    document.addEventListener("click", (e) => {
        // A. WISHLIST HEART TOGGLE
        const wishBtn = e.target.closest(".btn-card-wishlist, .pro-img-box .btn-wishlist, .btn-wishlist");
        if (wishBtn) {
            e.preventDefault();
            e.stopPropagation();

            const card = wishBtn.closest(".pro-card, .pro");
            const bookData = extractCardData(card);
            if (!bookData) return;

            let wishlist = getStoredData(STORAGE_KEYS.WISHLIST) || [];
            const existIdx = wishlist.findIndex(w => String(w.id) === String(bookData.id));

            if (existIdx > -1) {
                wishlist.splice(existIdx, 1);
                notifyUser(`Removed "${bookData.title}" from Wishlist`, "fa-heart-crack");
            } else {
                wishlist.push(bookData);
                notifyUser(`Saved "${bookData.title}" to Wishlist!`, "fa-heart");
            }

            setStoredData(STORAGE_KEYS.WISHLIST, wishlist);
            syncNavbarBadges();
            syncHomeWishlistIcons();
            return;
        }

        // B. ADD TO CART BUTTON CLICK
        const addBtn = e.target.closest(".btn-card-add-cart, .btn-add-cart");
        if (addBtn) {
            e.preventDefault();
            const card = addBtn.closest(".pro-card, .pro");
            const bookData = extractCardData(card);
            if (!bookData) return;

            addItemToCart(bookData, 1);

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
            }, 1000);
            return;
        }

        // C. BUY NOW BUTTON CLICK
        const buyBtn = e.target.closest(".btn-card-buy-now, .btn-buy-now");
        if (buyBtn) {
            e.preventDefault();
            const card = buyBtn.closest(".pro-card, .pro");
            const bookData = extractCardData(card);
            if (!bookData) return;

            addItemToCart(bookData, 1);

            const cartDrawer = document.getElementById("universalCartDrawer") || document.getElementById("cartDrawer");
            const overlay = document.getElementById("globalOverlay") || document.getElementById("drawerOverlay");

            if (cartDrawer) {
                cartDrawer.classList.add("open", "active");
                if (overlay) overlay.classList.add("active");
                document.body.style.overflow = "hidden";
                renderCartDrawer();
            } else {
                window.location.href = `cart.html`;
            }
            return;
        }

        // D. CART DRAWER QUANTITY (+ / -) & REMOVE BUTTONS
        const qtyBtn = e.target.closest(".cart-qty-btn");
        if (qtyBtn) {
            const idx = parseInt(qtyBtn.getAttribute("data-index"), 10);
            const action = qtyBtn.getAttribute("data-action");
            let cart = getStoredData(STORAGE_KEYS.CART) || [];

            if (cart[idx]) {
                if (action === "increase") {
                    cart[idx].quantity = (parseInt(cart[idx].quantity, 10) || 1) + 1;
                } else if (action === "decrease") {
                    cart[idx].quantity = (parseInt(cart[idx].quantity, 10) || 1) - 1;
                    if (cart[idx].quantity <= 0) cart.splice(idx, 1);
                }
                setStoredData(STORAGE_KEYS.CART, cart);
                syncNavbarBadges();
                renderCartDrawer();
            }
            return;
        }

        const removeBtn = e.target.closest(".cart-remove-btn");
        if (removeBtn) {
            const idx = parseInt(removeBtn.getAttribute("data-index"), 10);
            let cart = getStoredData(STORAGE_KEYS.CART) || [];
            if (cart[idx]) {
                cart.splice(idx, 1);
                setStoredData(STORAGE_KEYS.CART, cart);
                syncNavbarBadges();
                renderCartDrawer();
            }
            return;
        }

        // E. OPEN CART DRAWER (Navbar Icon)
        const openCart = e.target.closest("#openCartBtn");
        if (openCart) {
            renderCartDrawer();
        }
    });

    /* ==========================================================================
       9. HERO SECTION 3D TILT EFFECT
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
       10. VIEW MORE BOOKS TOGGLE
       ========================================================================== */
    const viewMoreBtn = document.querySelector(".btn-view-more, .view-more-btn");
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener("click", (e) => {
            const extraHiddenCards = document.querySelectorAll(".pro-card.extra-hidden, .pro.extra-hidden");
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
       11. INITIAL BOOTSTRAP
       ========================================================================== */
    syncNavbarBadges();
    syncHomeWishlistIcons();
    renderCartDrawer();
    loadFeaturedProductsFromBackend(); // Live data load call
});

/* ==========================================================================
   12. HOME PAGE UNIVERSAL SEARCH ENGINE (Live Data Sync)
   ========================================================================== */
(function setupHomeSearch() {
    const searchInput = document.getElementById("homeSearchInput");
    const searchBtn = document.getElementById("homeSearchBtn");
    const resultsContainer = document.getElementById("homeSearchResults");

    if (!searchInput || !resultsContainer) return;

    // Fallback static books
    const fallbackCatalog = [
        { id: 1, title: "Attachment, Not Anxiety", author: "Saira Nazmeen-Grey", category: "Psychology", sku: "9789309332289", price: "$25.11", image: "images/9789371346603_EN.jpg" },
        { id: 2, title: "Secure Love Scripts", author: "Matteo Reinhardt", category: "Family", sku: "9789371346627", price: "$21.11", image: "images/9789371346627_DE.jpg" },
        { id: 3, title: "Closeness Without Chaos", author: "Kaia Solander", category: "Self-Help", sku: "9789371347037", price: "$20.53", image: "images/9789371347037_DE.jpg" },
        { id: 4, title: "Stop Testing People", author: "Kaia Solander", category: "Psychology", sku: "9789371347129", price: "$21.66", image: "images/9789371347129_FR.jpg" },
        { id: 5, title: "Psychology of Money", author: "Morgan Housel", category: "Business", sku: "9789375365861", price: "$65.00", image: "images/f2.jpg" }
    ];

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        const cleanQuery = query.replace(/[-\s]/g, "");

        if (query.length === 0) {
            resultsContainer.innerHTML = "";
            resultsContainer.classList.remove("active");
            return;
        }

        // Agar live books load ho chuki hain toh unka use karein, warna fallback
        const sourceCatalog = (window.homeLiveBooks && window.homeLiveBooks.length > 0)
            ? window.homeLiveBooks.map(b => ({
                id: b._id || b.id,
                title: b.title || b.name,
                author: b.author || "Mindful Pages",
                category: b.category || "General",
                sku: b.sku || String(b._id || b.id),
                price: `$${(parseFloat(b.price) || 0).toFixed(2)}`,
                image: b.imageUrl || b.image || "images/placeholder.jpg"
            }))
            : fallbackCatalog;

        const matched = sourceCatalog.filter(book => {
            const titleMatch = (book.title || "").toLowerCase().includes(query);
            const authorMatch = (book.author || "").toLowerCase().includes(query);
            const catMatch = (book.category || "").toLowerCase().includes(query);
            const skuMatch = (book.sku || "").replace(/[-\s]/g, "").includes(cleanQuery);
            return titleMatch || authorMatch || catMatch || skuMatch;
        });

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
                        <div class="search-item-meta">By ${book.author} | Category: <span>${book.category}</span></div>
                        <div class="search-item-price">${book.price}</div>
                    </div>
                `;
                resultsContainer.appendChild(itemLink);
            });
        }
        resultsContainer.classList.add("active");
    });

    function submitSearch() {
        const val = searchInput.value.trim();
        if (val) {
            window.location.href = `gallery.html?search=${encodeURIComponent(val)}`;
        } else {
            window.location.href = `gallery.html`;
        }
    }

    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            submitSearch();
        }
    });

    if (searchBtn) {
        searchBtn.addEventListener("click", (e) => {
            e.preventDefault();
            submitSearch();
        });
    }

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".home-search-wrapper")) {
            resultsContainer.classList.remove("active");
        }
    });
})();

/* ==========================================================================
   13. MOBILE DRAWER NAVIGATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const mobileDrawer = document.getElementById("mobileDrawer");
    const drawerOverlay = document.getElementById("drawerOverlay");
    const drawerCloseBtn = document.getElementById("drawerCloseBtn");
    const mobileNavLinks = document.querySelectorAll(".mobile-nav-links a");

    function openMenu() {
        hamburgerBtn?.classList.add("active");
        mobileDrawer?.classList.add("active");
        drawerOverlay?.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeMenu() {
        hamburgerBtn?.classList.remove("active");
        mobileDrawer?.classList.remove("active");
        drawerOverlay?.classList.remove("active");
        document.body.style.overflow = "";
    }

    hamburgerBtn?.addEventListener("click", () => {
        const isOpen = mobileDrawer?.classList.contains("active");
        if (isOpen) closeMenu();
        else openMenu();
    });

    drawerCloseBtn?.addEventListener("click", closeMenu);
    drawerOverlay?.addEventListener("click", closeMenu);

    mobileNavLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });
});