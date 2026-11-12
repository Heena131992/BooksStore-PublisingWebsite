// common.js ya index.html ke pehle script tag me:
window.API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "${window.API_BASE_URL}/books"
    : "https://bookbackend-6gn2.onrender.com";

    fetch(`${window.API_BASE_URL}/api/books`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(bookDatagi),
})

// 1. Navbar Scroll Transition
const floatingNav = document.querySelector('.floating-navbar');
window.addEventListener('scroll', () => {
    if (floatingNav) {
        if (window.scrollY > 30) {
            floatingNav.classList.add('scrolled');
        } else {
            floatingNav.classList.remove('scrolled');
        }
    }
});

// 2. Search Modal Logic
const searchModal = document.getElementById('searchModal');
const openSearchBtn = document.getElementById('openSearchModal');
const closeSearchBtn = document.getElementById('closeSearchModal');
const searchInput = document.getElementById('searchInput');

function openSearch() {
    if (searchModal) {
        searchModal.classList.add('active');
        setTimeout(() => searchInput && searchInput.focus(), 150);
    }
}

function closeSearch() {
    if (searchModal) {
        searchModal.classList.remove('active');
    }
}

if (openSearchBtn) openSearchBtn.addEventListener('click', openSearch);
if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearch);

// Keyboard Shortcuts: Ctrl + K (Search), Esc (Close)
window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
    }
    if (e.key === 'Escape') {
        closeSearch();
        closeLogin();
    }
});

// Quick Search Tags Selection
document.querySelectorAll('.tag-item').forEach(tag => {
    tag.addEventListener('click', () => {
        if (searchInput) {
            searchInput.value = tag.innerText;
            searchInput.focus();
        }
    });
});

// 3. Login Modal Logic
const loginModal = document.getElementById('loginModal');
const openLoginBtn = document.getElementById('openLoginModal');
const closeLoginBtn = document.getElementById('closeLoginModal');

function openLogin() {
    if (loginModal) {
        loginModal.classList.add('active');
    }
}

function closeLogin() {
    if (loginModal) {
        loginModal.classList.remove('active');
    }
}

if (openLoginBtn) openLoginBtn.addEventListener('click', openLogin);
if (closeLoginBtn) closeLoginBtn.addEventListener('click', closeLogin);

// Modal Backdrop Click pe Close hona
window.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearch();
    if (e.target === loginModal) closeLogin();
});

// 4. Cart Counter Sync
let cartCount = 0;
const cartBadge = document.getElementById('navCartCount');

document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        cartCount++;
        if (cartBadge) {
            cartBadge.innerText = cartCount;
            // Pop bounce animation
            cartBadge.style.transform = 'scale(1.4)';
            setTimeout(() => {
                cartBadge.style.transform = 'scale(1)';
            }, 200);
        }
    });
});


// ================= NEWSLETTER SUBMISSION LOGIC =================
const newsForm = document.getElementById('newsletterForm');
const newsEmail = document.getElementById('newsEmail');
const newsBtn = document.getElementById('newsSubmitBtn');

if (newsForm && newsEmail) {
    newsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailVal = newsEmail.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailVal || !emailRegex.test(emailVal)) {
            showToast('Please enter a valid email address.');
            newsEmail.focus();
            return;
        }

        // Button Loading State
        if (newsBtn) {
            newsBtn.disabled = true;
            newsBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Subscribing...`;
        }

        // Simulating Server Request
        setTimeout(() => {
            showToast(`Thank you! Subscribed successfully with ${emailVal}`);
            newsForm.reset();

            if (newsBtn) {
                newsBtn.disabled = false;
                newsBtn.innerHTML = `<span class="btn-text">Subscribe</span> <i class="fa-solid fa-arrow-right btn-icon"></i>`;
            }
        }, 900);
    });
}

/**
 * Global E-Commerce State Engine (Wishlist, Cart, Login Sync)
 * Automatically runs on index.html, about.html, gallery.html, product-details.html
 */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject Universal Drawers & Modal into DOM
    function injectGlobalModals() {
        if (!document.getElementById("globalOverlay")) {
            const overlay = document.createElement("div");
            overlay.className = "global-drawer-overlay";
            overlay.id = "globalOverlay";
            document.body.appendChild(overlay);
        }

        // Wishlist Drawer
        if (!document.getElementById("universalWishlistDrawer")) {
            const wishDrawer = document.createElement("aside");
            wishDrawer.className = "global-slide-drawer";
            wishDrawer.id = "universalWishlistDrawer";
            wishDrawer.innerHTML = `
                <div class="drawer-header">
                    <h3>My Wishlist (<span id="globalWishlistCountHeader">0</span>)</h3>
                    <button type="button" class="drawer-close-btn" id="closeGlobalWishlistBtn">&times;</button>
                </div>
                <div class="drawer-items-container" id="globalWishlistContent"></div>
            `;
            document.body.appendChild(wishDrawer);
        }

        // Cart Drawer
        if (!document.getElementById("universalCartDrawer")) {
            const cartDrawer = document.createElement("aside");
            cartDrawer.className = "global-slide-drawer";
            cartDrawer.id = "universalCartDrawer";
            cartDrawer.innerHTML = `
                <div class="drawer-header">
                    <h3>My Cart (<span id="globalCartCountHeader">0</span>)</h3>
                    <button type="button" class="drawer-close-btn" id="closeGlobalCartBtn">&times;</button>
                </div>
                <div class="drawer-items-container" id="globalCartContent"></div>
                <div class="drawer-footer-checkout">
                    <div class="drawer-subtotal">
                        <span>Subtotal:</span>
                        <span id="globalCartSubtotal">$0.00</span>
                    </div>
                    <button type="button" class="btn-checkout-now" onclick="alert('Proceeding to Checkout!')">Checkout</button>
                </div>
            `;
            document.body.appendChild(cartDrawer);
        }

        // Login Modal
        if (!document.getElementById("universalLoginModal")) {
            const loginModal = document.createElement("div");
            loginModal.className = "global-modal-dialog";
            loginModal.id = "universalLoginModal";
            loginModal.innerHTML = `
                <div class="login-modal-header">
                    <h3 id="authModalTitle">Sign In</h3>
                    <button type="button" class="drawer-close-btn" id="closeGlobalLoginBtn">&times;</button>
                </div>
                <form id="globalAuthForm">
                    <div class="login-form-group">
                        <label>Email Address</label>
                        <input type="email" id="authEmail" placeholder="you@example.com" required />
                    </div>
                    <div class="login-form-group">
                        <label>Password</label>
                        <input type="password" id="authPassword" placeholder="••••••••" required />
                    </div>
                    <button type="submit" class="btn-submit-auth" id="btnAuthSubmit">Login to Kovark</button>
                    <p style="font-size:13px; color:#64748b; margin-top:14px; text-align:center;">
                        Demo: Enter any credentials to login.
                    </p>
                </form>
            `;
            document.body.appendChild(loginModal);
        }

        // Toast
        if (!document.getElementById("globalToast")) {
            const toast = document.createElement("div");
            toast.className = "global-toast-notification";
            toast.id = "globalToast";
            document.body.appendChild(toast);
        }
    }

    injectGlobalModals();

    // 2. Storage Helpers
    const getCart = () => JSON.parse(localStorage.getItem("mp_cart")) || [];
    const setCart = (data) => {
        localStorage.setItem("mp_cart", JSON.stringify(data));
        syncBadgesAndDrawers();
    };

    const getWishlist = () => JSON.parse(localStorage.getItem("mp_wishlist")) || [];
    const setWishlist = (data) => {
        localStorage.setItem("mp_wishlist", JSON.stringify(data));
        syncBadgesAndDrawers();
    };

    // Toast Trigger
    window.triggerGlobalToast = function(msg, icon = "fa-check-circle") {
        const toast = document.getElementById("globalToast");
        if (!toast) return;
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${msg}</span>`;
        toast.classList.add("active");
        setTimeout(() => toast.classList.remove("active"), 2800);
    };

    // 3. UI Synchronization Across All Pages
    function syncBadgesAndDrawers() {
        const cart = getCart();
        const wishlist = getWishlist();
        const user = JSON.parse(localStorage.getItem("mp_user"));

        const totalCartQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

        // Navbar Badges
        document.querySelectorAll("#navCartCount").forEach(el => el.textContent = totalCartQty);
        document.querySelectorAll("#navWishlistCount").forEach(el => el.textContent = wishlist.length);

        const wishCountHeader = document.getElementById("globalWishlistCountHeader");
        const cartCountHeader = document.getElementById("globalCartCountHeader");
        if (wishCountHeader) wishCountHeader.textContent = wishlist.length;
        if (cartCountHeader) cartCountHeader.textContent = totalCartQty;

        // Login / User state in Navbar
        document.querySelectorAll(".btn-login").forEach(btn => {
            if (user && user.email) {
                btn.textContent = user.name || "My Account";
                btn.title = "Click to Logout";
            } else {
                btn.textContent = "Login";
                btn.title = "Click to Login";
            }
        });

        // Calculate Cart Subtotal
        let subtotal = 0;
        cart.forEach(item => {
            const p = parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
            subtotal += p * (item.quantity || 1);
        });
        const subEl = document.getElementById("globalCartSubtotal");
        if (subEl) subEl.textContent = `$${subtotal.toFixed(2)}`;

        renderWishlistUI(wishlist);
        renderCartUI(cart);
    }

    // 4. Render Wishlist Items inside Drawer
    function renderWishlistUI(wishlist) {
    // Dono drawer IDs support karein (universal aur product-details specific)
    const container = document.getElementById("globalWishlistContent") || document.getElementById("wishlistItemsList");
    if (!container) return;
    container.innerHTML = "";

    if (!wishlist || wishlist.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding: 40px 15px; color:#94a3b8;">
                <i class="fa-regular fa-heart" style="font-size: 34px; margin-bottom: 10px; display:block;"></i>
                <p style="font-size: 16px; font-weight:600;">Your wishlist is empty.</p>
            </div>
        `;
        return;
    }

    wishlist.forEach((item, index) => {
        const title = item.title || item.name || "Untitled Book";
        const price = item.price || item.salePrice || "$20.00";
        const image = item.image || item.img || "images/placeholder.jpg";

        const row = document.createElement("div");
        row.className = "drawer-item-row";
        row.innerHTML = `
            <div class="drawer-item-thumb" style="width:70px; height:98px; flex-shrink:0; border-radius:4px; overflow:hidden;">
                <img src="${image}" alt="${title}" style="width:100%; height:100%; object-fit:cover;" />
            </div>
            <div class="drawer-item-details" style="flex:1; display:flex; flex-direction:column; padding-left:12px;">
                <h4 style="font-size:15px; font-weight:700; color:#102a43; margin:0 0 4px 0; line-height:1.3;">${title}</h4>
                <div style="font-size:15px; font-weight:700; color:#102a43; margin-bottom:8px;">${price}</div>
                <button type="button" class="drawer-action-btn" onclick="globalMoveWishToCart(${index})">Move to Cart</button>
            </div>
            <button type="button" class="drawer-del-btn" onclick="globalRemoveWish(${index})" style="background:none; border:none; color:#94a3b8; cursor:pointer; font-size:16px;">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        `;
        container.appendChild(row);
    });
}

    // 5. Render Cart Items inside Drawer
    function renderCartUI(cart) {
        const container = document.getElementById("globalCartContent");
        if (!container) return;
        container.innerHTML = "";

        if (cart.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:#94a3b8; margin-top:50px; font-size:15px;">Your cart is empty.</p>`;
            return;
        }

        cart.forEach((item, index) => {
            const row = document.createElement("div");
            row.className = "drawer-item-row";
            row.innerHTML = `
                <div class="drawer-item-thumb">
                    <img src="${item.image || 'images/placeholder.jpg'}" alt="${item.title}" />
                </div>
                <div class="drawer-item-details">
                    <h4 class="drawer-item-title">${item.title}</h4>
                    <div class="drawer-item-price">${item.price} × ${item.quantity || 1}</div>
                    <div style="display:flex; gap:8px;">
                        <button type="button" class="drawer-action-btn" style="padding:3px 10px;" onclick="globalAdjustQty(${index}, 1)">+</button>
                        <button type="button" class="drawer-action-btn" style="padding:3px 10px; background:#64748b;" onclick="globalAdjustQty(${index}, -1)">-</button>
                    </div>
                </div>
                <button type="button" class="drawer-del-btn" onclick="globalRemoveCart(${index})">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            `;
            container.appendChild(row);
        });
    }

    // Global Window Functions for Actions
    window.globalRemoveWish = function(index) {
        let wishlist = getWishlist();
        wishlist.splice(index, 1);
        setWishlist(wishlist);
        triggerGlobalToast("Removed from Wishlist", "fa-heart-crack");
    };

    window.globalMoveWishToCart = function(index) {
        let wishlist = getWishlist();
        let cart = getCart();
        const item = wishlist.splice(index, 1)[0];

        if (item) {
            const exist = cart.find(c => c.id === item.id);
            if (exist) {
                exist.quantity = (exist.quantity || 1) + 1;
            } else {
                cart.push({ ...item, quantity: 1 });
            }
            setWishlist(wishlist);
            setCart(cart);
            triggerGlobalToast(`"${item.title}" moved to Cart!`, "fa-bag-shopping");
        }
    };

    window.globalRemoveCart = function(index) {
        let cart = getCart();
        cart.splice(index, 1);
        setCart(cart);
        triggerGlobalToast("Item removed from Cart", "fa-trash-can");
    };

    window.globalAdjustQty = function(index, delta) {
        let cart = getCart();
        if (!cart[index]) return;
        cart[index].quantity = (cart[index].quantity || 1) + delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        setCart(cart);
    };

    // 6. Drawers Open & Close Engine
    const overlay = document.getElementById("globalOverlay");
    const wishDrawer = document.getElementById("universalWishlistDrawer");
    const cartDrawer = document.getElementById("universalCartDrawer");
    const loginModal = document.getElementById("universalLoginModal");

    function closeAllDrawers() {
        if (wishDrawer) wishDrawer.classList.remove("open");
        if (cartDrawer) cartDrawer.classList.remove("open");
        if (loginModal) loginModal.classList.remove("show");
        if (overlay) overlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    if (overlay) overlay.addEventListener("click", closeAllDrawers);
    document.getElementById("closeGlobalWishlistBtn")?.addEventListener("click", closeAllDrawers);
    document.getElementById("closeGlobalCartBtn")?.addEventListener("click", closeAllDrawers);
    document.getElementById("closeGlobalLoginBtn")?.addEventListener("click", closeAllDrawers);

    // Open Wishlist Trigger
    document.querySelectorAll(".nav-wishlist-icon, #openWishlistBtn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            closeAllDrawers();
            wishDrawer.classList.add("open");
            overlay.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    // Open Cart Trigger
    document.querySelectorAll(".nav-cart-btn, #openCartBtn, [href*='cart']").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            closeAllDrawers();
            cartDrawer.classList.add("open");
            overlay.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    // Open Login Modal Trigger / Logout
    document.querySelectorAll(".btn-login").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem("mp_user"));
            if (user) {
                // Logout confirmation
                if (confirm(`Logged in as ${user.email}. Do you want to logout?`)) {
                    localStorage.removeItem("mp_user");
                    syncBadgesAndDrawers();
                    triggerGlobalToast("Successfully logged out!", "fa-right-from-bracket");
                }
            } else {
                closeAllDrawers();
                loginModal.classList.add("show");
                overlay.classList.add("active");
            }
        });
    });

    // Login Form Submit Handler
    const authForm = document.getElementById("globalAuthForm");
    if (authForm) {
        authForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("authEmail").value.trim();
            const name = email.split("@")[0];
            localStorage.setItem("mp_user", JSON.stringify({ email, name }));
            closeAllDrawers();
            syncBadgesAndDrawers();
            triggerGlobalToast(`Welcome, ${name}!`, "fa-user-check");
        });
    }

    // Escape Key listener
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeAllDrawers();
    });

    // Initial Sync on Page Load
    syncBadgesAndDrawers();
});