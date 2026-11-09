/**
 * Mindful Pages Publishers - Author Publishing Hub
 */
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const planBtns = document.querySelectorAll(".btn-choose-plan");
    const planInput = document.getElementById("selectedPlanInput");
    const submissionForm = document.getElementById("authorSubmissionForm");

    // 1. Selecting a Package auto-updates form and smooth scrolls down
    planBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const planName = btn.getAttribute("data-plan");
            if (planInput) {
                planInput.value = planName;
            }

            // Smooth scroll to form
            const formSection = document.getElementById("submitManuscript");
            if (formSection) {
                formSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // 2. Submission Form Handling
    if (submissionForm) {
        submissionForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const authorName = document.getElementById("authorName").value.trim();
            const bookTitle = document.getElementById("bookTitle").value.trim();
            const selectedPlan = planInput.value;

            // Submit feedback
            const submitBtn = document.getElementById("submitProposalBtn");
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting Proposal...`;

            setTimeout(() => {
                alert(`Thank you, ${authorName}!\nYour manuscript proposal for "${bookTitle}" under the "${selectedPlan}" plan has been submitted successfully.\n\nOur editorial team will contact you within 3 business days.`);
                submissionForm.reset();
                planInput.value = "Author Pro Imprint";
                submitBtn.disabled = false;
                submitBtn.innerHTML = `Submit Proposal for Review <i class="fa-solid fa-paper-plane"></i>`;
            }, 1200);
        });
    }
});