// src/components/Footer/Footer.js
import './Footer.css';

export function createFooter() {
  const footerElement = document.createElement('footer');
  footerElement.id = 'footer';

  footerElement.innerHTML = `
    <!-- Newsletter Strip -->
    <section class="newsletter-wrapper">
      <div class="newsletter-text">
        <h3>Sign up for newsletters</h3>
        <p>Get E-mail updates about our latest catalog releases & <span>special author discounts.</span></p>
      </div>
      <form class="newsletter-form" id="newsletterForm">
        <input type="email" placeholder="Your email address" required class="newsletter-input" id="newsletterEmail" />
        <button type="submit" class="newsletter-btn">Subscribe</button>
      </form>
    </section>

    <!-- Main Footer Directory -->
    <div class="site-footer">
      <div class="footer-columns">
        <div class="footer-col">
          <h4>BookStore Direct</h4>
          <p><strong>Address:</strong> 526 Wellington Road, Street 32, San Francisco</p>
          <p><strong>Phone:</strong> +01 22222 365 / (+91) 01 2345 6789</p>
          <p><strong>Working Hours:</strong> 10:00 - 18:00, Mon - Sat</p>
        </div>

        <div class="footer-col">
          <h4>Explore</h4>
          <a href="#">About Us</a>
          <a href="#">Delivery Information</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
          <a href="#">Custom Publishing</a>
        </div>

        <div class="footer-col">
          <h4>My Account</h4>
          <a href="#">Sign In / Register</a>
          <a href="cart.html">View My Cart</a>
          <a href="#">Track Order Status</a>
          <a href="#">Help & Support Desk</a>
        </div>

        <div class="footer-col">
          <h4>Install Store App</h4>
          <p>Available on App Store & Google Play</p>
          <div class="app-badges">
            <a href="#" class="app-badge-btn">
              <i class="fa-brands fa-google-play"></i> Play Store
            </a>
            <a href="#" class="app-badge-btn">
              <i class="fa-brands fa-apple"></i> App Store
            </a>
          </div>
          <h4>Follow Our Authors</h4>
          <div class="social-icons-group">
            <a href="#" class="social-link" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#" class="social-link" aria-label="Twitter"><i class="fa-brands fa-twitter"></i></a>
            <a href="#" class="social-link" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="#" class="social-link" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 BookStore & BookPublishing Manager. All rights reserved.</p>
      </div>
    </div>
  `;

  // Newsletter submit handler
  const form = footerElement.querySelector('#newsletterForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = footerElement.querySelector('#newsletterEmail').value;
    alert(`Thank you! ${email} has been subscribed to book updates.`);
    form.reset();
  });

  return footerElement;
}