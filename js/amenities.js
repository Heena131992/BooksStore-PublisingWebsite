/**
 * Amenities Page Controller
 * Handles modal popups and interactivity
 */
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const modalData = {
        "modal-shipping": {
            title: "Free Express Nationwide Delivery",
            desc: "Orders verified before 2:00 PM are dispatched on the same business day using express air carriers. You receive real-time SMS and email tracking links."
        },
        "modal-signed": {
            title: "Original Author Autographs",
            desc: "We coordinate directly with publishers and authors. Each signed edition comes with a serialized publisher holographic authenticity seal."
        },
        "modal-lounge": {
            title: "Cozy Partner Reading Lounges",
            desc: "Flash your digital order invoice or member profile at any registered partner bookstore cafe to enjoy 2 hours of quiet reading space and 10% off coffee."
        },
        "modal-packaging": {
            title: "Triple-Layer Safe Packaging",
            desc: "Every volume is wrapped in eco-friendly protective bubble lining, reinforced corner shields, and a waterproof courier pouch to ensure zero transit damage."
        },
        "modal-returns": {
            title: "14-Day Replacement Guarantee",
            desc: "If your book features misprinted text, missing pages, or bent spine covers upon delivery, request an instant one-click doorstep replacement."
        },
        "modal-support": {
            title: "24/7 Editorial Support Desk",
            desc: "Reach out via live chat or email at support@mindfulpages.com for help finding rare ISBN prints, university bulk discounts, or custom book bundles."
        }
    };

    const modalBackdrop = document.getElementById("amenityModalBackdrop");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDescription");
    const modalCloseBtn = document.getElementById("modalCloseBtn");

    // Open Modal
    document.querySelectorAll(".btn-perk-detail").forEach(btn => {
        btn.addEventListener("click", () => {
            const key = btn.getAttribute("data-modal");
            if (modalData[key]) {
                modalTitle.textContent = modalData[key].title;
                modalDesc.textContent = modalData[key].desc;
                modalBackdrop.classList.add("active");
                document.body.style.overflow = "hidden";
            }
        });
    });

    // Close Modal
    function closeModal() {
        modalBackdrop.classList.remove("active");
        document.body.style.overflow = "";
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
    if (modalBackdrop) {
        modalBackdrop.addEventListener("click", (e) => {
            if (e.target === modalBackdrop) closeModal();
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalBackdrop.classList.contains("active")) {
            closeModal();
        }
    });
});