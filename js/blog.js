/**
 * Mindful Pages - Blog Controller
 * Handles live category filter, instant keyword search, and article popup modal.
 */
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // 1. Articles Database (Direct from Screenshot)
    const blogArticles = [
        {
            id: 1,
            category: "tech",
            categoryName: "AI & Tech",
            title: "How Smarter Workflows Turn Ordinary Businesses Into Scalable Giants",
            desc: "Discover how everyday operations can leverage modern automation pipelines to eliminate repetitive overhead and unlock 10x team efficiency.",
            author: "Mindful Editorial",
            date: "Nov 2, 2026",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700",
            content: "Modern workflows require integrating intelligent processing into routine data intake. By standardizing repeatable tasks, organizations reduce turnaround delays, allowing team members to direct creative focus toward high-value growth initiatives and client partnerships."
        },
        {
            id: 2,
            category: "business",
            categoryName: "Business",
            title: "Build a Scalable Business: Growing Step-by-Step for Profit",
            desc: "A pragmatic blueprint on compounding small operational margins, stabilizing cash runway, and avoiding aggressive early dilution.",
            author: "Kovark Business Hub",
            date: "Oct 28, 2026",
            readTime: "7 min read",
            image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=700",
            content: "True business resilience stems from unit-level sustainability. Rather than chasing inflated top-line figures, disciplined founders prioritize customer retention, organic referrals, and positive unit economics to scale sustainably."
        },
        {
            id: 3,
            category: "growth",
            categoryName: "Growth",
            title: "Mastering Growth After Paralysis: Without Relinquishing Control",
            desc: "Strategies for stepping out of decision deadlock, overcoming psychological barriers, and structuring reliable momentum.",
            author: "Kaia Solander",
            date: "Oct 22, 2026",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700",
            content: "Action precedes motivation. When overanalysis halts operational progress, decomposing large goals into micro-checkpoints restores psychological agency and builds steady forward momentum."
        },
        {
            id: 4,
            category: "design",
            categoryName: "Design",
            title: "Discovering the Hidden Patterns That Shape Nature and Human Creativity",
            desc: "An exploration into geometry, subconscious visual balance, and how classic aesthetics impact modern reader immersion.",
            author: "Design Studio",
            date: "Oct 15, 2026",
            readTime: "4 min read",
            image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700",
            content: "From the golden ratio in classic manuscript layouts to contemporary digital interfaces, structural harmony guides reader comprehension. Balancing negative space with focal weight elevates content retention."
        },
        {
            id: 5,
            category: "history",
            categoryName: "History",
            title: "Ancient Wisdom Meets Modern Ambition: Why Old Wisdom Truly Survives",
            desc: "Examining timeless philosophical manuscripts and why historical resilience techniques remain invaluable for modern professionals.",
            author: "Archival Team",
            date: "Oct 10, 2026",
            readTime: "8 min read",
            image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=700",
            content: "Historical crises mirror our contemporary struggles with attention, ambition, and community. Classical philosophies offer grounded frameworks for separating actionable responsibilities from external noise."
        },
        {
            id: 6,
            category: "wellness",
            categoryName: "Mindfulness",
            title: "The Art of Mindful Listening: Deepening Connections Through True Presence",
            desc: "Practical communication practices for quieting internal mental chatter and fully hearing the subtext of conversations.",
            author: "Saira Nazmeen",
            date: "Oct 5, 2026",
            readTime: "5 min read",
            image: "", // Text-only style
            content: "Active listening requires pausing the impulse to immediately formulate a reply. Giving conversational space fosters safety and uncovers the core emotional needs behind every statement."
        },
        {
            id: 7,
            category: "wellness",
            categoryName: "Mindfulness",
            title: "Finding Inner Peace in a Chaotic World: A Mindfulness Guide",
            desc: "Actionable breathing routines and cognitive grounding anchors to reset autonomic nervous system responses under stress.",
            author: "Mindful Health",
            date: "Sep 28, 2026",
            readTime: "6 min read",
            image: "",
            content: "Micro-mindfulness intervals of sixty seconds spread throughout working hours significantly stabilize cortisol levels, restoring cognitive clarity without demanding hours of meditation."
        },
        {
            id: 8,
            category: "growth",
            categoryName: "Growth",
            title: "Breathe Your Way to Balance: The Life-Changing Power of Breathwork",
            desc: "Scientific fundamentals of regulated oxygenation, diaphragmatic pacing, and emotional equilibrium.",
            author: "Matteo Reinhardt",
            date: "Sep 20, 2026",
            readTime: "4 min read",
            image: "",
            content: "Controlled breathwork directly signals parasympathetic activation in the brain stem. Pacing your exhalations longer than your inhalations rapidly calms high-pressure physiological reactions."
        }
    ];

    // 2. DOM Elements
    const feedContainer = document.getElementById("blogFeedContainer");
    const categoryBtns = document.querySelectorAll(".blog-cat-btn");
    const categoryHeading = document.getElementById("activeCategoryHeading");
    const postCounter = document.getElementById("postCountBadge");
    const searchInput = document.getElementById("blogSearchInput");
    const searchBtn = document.getElementById("blogSearchBtn");
    const noResults = document.getElementById("blogNoResults");

    // Modal Elements
    const modal = document.getElementById("blogModalBackdrop");
    const modalClose = document.getElementById("blogModalClose");
    const modalTag = document.getElementById("modalPostTag");
    const modalTitle = document.getElementById("modalPostTitle");
    const modalMeta = document.getElementById("modalPostMeta");
    const modalImgWrap = document.getElementById("modalImgWrap");
    const modalImg = document.getElementById("modalPostImg");
    const modalContent = document.getElementById("modalPostContent");

    let currentFilter = "all";
    let searchQuery = "";

    // 3. Render Posts Function
    function renderBlogFeed() {
        feedContainer.innerHTML = "";

        const filtered = blogArticles.filter(post => {
            const matchesCategory = (currentFilter === "all") || (post.category === currentFilter);
            const matchesSearch = post.title.toLowerCase().includes(searchQuery) ||
                                  post.desc.toLowerCase().includes(searchQuery) ||
                                  post.categoryName.toLowerCase().includes(searchQuery);

            return matchesCategory && matchesSearch;
        });

        // Counter text update
        postCounter.textContent = `Showing ${filtered.length} of ${blogArticles.length} posts`;

        if (filtered.length === 0) {
            noResults.style.display = "block";
            return;
        }

        noResults.style.display = "none";

        filtered.forEach(post => {
            const card = document.createElement("article");
            const hasImg = Boolean(post.image);
            card.className = `blog-card ${hasImg ? "" : "text-only"}`;
            card.setAttribute("data-id", post.id);

            let thumbHTML = "";
            if (hasImg) {
                thumbHTML = `
                    <div class="blog-thumb-wrap">
                        <img src="${post.image}" alt="${post.title}" loading="lazy" />
                    </div>
                `;
            }

            card.innerHTML = `
                ${thumbHTML}
                <div class="blog-info-wrap">
                    <div class="blog-card-meta">
                        <span class="tag">${post.categoryName}</span>
                        <span>•</span>
                        <span>${post.date}</span>
                    </div>
                    <h3 class="blog-card-title">${post.title}</h3>
                    <p class="blog-card-desc">${post.desc}</p>
                    <div class="blog-card-footer">
                        <span>By ${post.author} • ${post.readTime}</span>
                        <span class="blog-read-more-link">Read Article <i class="fa-solid fa-arrow-right"></i></span>
                    </div>
                </div>
            `;

            // Card Click Handler (Opens Reading Modal)
            card.addEventListener("click", () => {
                openArticleModal(post);
            });

            feedContainer.appendChild(card);
        });
    }

    // 4. Modal Handler
    function openArticleModal(post) {
        modalTag.textContent = post.categoryName;
        modalTitle.textContent = post.title;
        modalMeta.textContent = `By ${post.author} • Published on ${post.date} • ${post.readTime}`;
        modalContent.textContent = post.content;

        if (post.image) {
            modalImg.src = post.image;
            modalImgWrap.style.display = "block";
        } else {
            modalImgWrap.style.display = "none";
        }

        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }

    if (modalClose) modalClose.addEventListener("click", closeModal);
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });
    }
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
    });

    // 5. Category Tabs Filter Click
    categoryBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            categoryBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            currentFilter = btn.getAttribute("data-category");
            categoryHeading.textContent = btn.textContent;
            renderBlogFeed();
        });
    });

    // 6. Search Handler
    function triggerSearch() {
        searchQuery = searchInput.value.toLowerCase().trim();
        renderBlogFeed();
    }

    if (searchInput) {
        searchInput.addEventListener("input", triggerSearch);
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                triggerSearch();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", triggerSearch);
    }

    // Initial Load
    renderBlogFeed();
});