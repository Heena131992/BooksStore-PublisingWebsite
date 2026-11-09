// js/home.js

(function initSliderModule() {
  function startSlider() {
    const wrapper = document.getElementById('heroSliderWrapper');
    const track = document.getElementById('heroSliderTrack');
    const dotsContainer = document.getElementById('heroSliderDots');

    if (!wrapper || !track) {
      console.warn("Slider elements not found. Retrying in 100ms...");
      setTimeout(startSlider, 100);
      return;
    }

    const slides = track.querySelectorAll('.hero-slide-item');
    if (slides.length <= 1) return;

    let currentIndex = 0;
    let autoInterval = null;

    // Build Dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          changeSlide(idx);
          resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
      });
    }

    function changeSlide(nextIndex) {
      slides[currentIndex].classList.remove('active');
      currentIndex = (nextIndex + slides.length) % slides.length;
      slides[currentIndex].classList.add('active');

      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentIndex);
        });
      }
    }

    function nextSlide() {
      changeSlide(currentIndex + 1);
    }

    function prevSlide() {
      changeSlide(currentIndex - 1);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoInterval = setInterval(nextSlide, 2600); // Har 2.6 second me automatic slide
    }

    function stopAutoPlay() {
      if (autoInterval) {
        clearInterval(autoInterval);
        autoInterval = null;
      }
    }

    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    // Expose Globally for HTML onclick fallback
    window.heroSliderNext = function() {
      nextSlide();
      resetAutoPlay();
    };

    window.heroSliderPrev = function() {
      prevSlide();
      resetAutoPlay();
    };

    // Attach Click Handlers
    const nextBtn = document.getElementById('heroNextBtn');
    const prevBtn = document.getElementById('heroPrevBtn');

    if (nextBtn) {
      nextBtn.onclick = function(e) {
        e.preventDefault();
        window.heroSliderNext();
      };
    }

    if (prevBtn) {
      prevBtn.onclick = function(e) {
        e.preventDefault();
        window.heroSliderPrev();
      };
    }

    // Hover Pause
    wrapper.onmouseenter = stopAutoPlay;
    wrapper.onmouseleave = startAutoPlay;

    // Start auto slide
    startAutoPlay();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startSlider);
  } else {
    startSlider();
  }
})();


let currentIndex = 0;
const slides = document.querySelectorAll('.hero-slide-item');
const track = document.querySelector('.hero-slider-track');
const totalSlides = slides.length;

function nextSlide() {
  currentIndex = (currentIndex + 1) % totalSlides;
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Har 3 second me automatic slide hoga
let timer = setInterval(nextSlide, 3000);

// Hover karne par pause aur hatane par resume
const wrapper = document.querySelector('.hero-slider-wrapper');
wrapper.addEventListener('mouseenter', () => clearInterval(timer));
wrapper.addEventListener('mouseleave', () => timer = setInterval(nextSlide, 3000));

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll('.hero-slide-item');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const dotsContainer = document.getElementById('heroSliderDots');
  const wrapper = document.getElementById('heroSliderWrapper');

  if (!slides || slides.length === 0) return;

  let currentIndex = 0;
  let autoSlideTimer = null;
  const slideDuration = 3500; // Har 3.5 seconds me auto change hoga

  // 1. Dots ko dynamically create karein
  // 1. Jitni slides HTML me hain, sirf utne hi Dots dynamically banayein
    if (dotsContainer) {
        dotsContainer.innerHTML = ""; // Purane dots clear karein
        slides.forEach((_, idx) => {
            const dot = document.createElement("span");
            dot.className = `slider-dot ${idx === 0 ? "active" : ""}`;
            dot.addEventListener("click", () => {
                goToSlide(idx);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        });
    }

  const dots = document.querySelectorAll('.slider-dots-container .slider-dot');

 // 2. Slide change function
    function goToSlide(index) {
        slides.forEach(slide => slide.classList.remove("active"));
        dots.forEach(dot => dot.classList.remove("active"));

        currentIndex = (index + slides.length) % slides.length;

        slides[currentIndex].classList.add("active");
        if (dots[currentIndex]) {
            dots[currentIndex].classList.add("active");
        }
    }

    // 3. Arrow Click Handlers
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            goToSlide(currentIndex + 1);
            resetAutoPlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            goToSlide(currentIndex - 1);
            resetAutoPlay();
        });
    }

    // 4. Smooth Auto Play
    function startAutoPlay() {
        if (slides.length > 1) {
            autoPlayTimer = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 3500);
        }
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }

    // Initial Start
    goToSlide(0);
    startAutoPlay();



});



// Banner buttons click handler
document.addEventListener("click", (e) => {
    const bannerBtn = e.target.closest(".banner-btn");
    if (!bannerBtn) return;

    e.preventDefault();
    const btnText = bannerBtn.innerText.toLowerCase();

    // 1. Agar "Learn More" (Buy 1 Get 1 Free) par click hua
    if (btnText.includes("learn more")) {
        window.location.href = "gallery.html?filter=sale";
    }
    // 2. Agar "Collection" (Upcoming Season) par click hua
    else if (btnText.includes("collection")) {
        window.location.href = "gallery.html?filter=upcoming";
    }
});