// src/components/Banners/Banners.js
import './Banners.css';

export function createBanners() {
  const container = document.createElement('div');
  container.className = 'banners-container';
  container.id = 'banner';

  container.innerHTML = `
    <!-- 1. Large Banner -->
    <section class="banner-large">
      <h4>Direct Publisher Specials</h4>
      <h2>Up to <span>70% Off</span> on All Academic & Fiction Books</h2>
      <button class="btn-banner-primary" id="btnExploreDeals">Explore Deals</button>
    </section>

    <!-- 2. Dual Banners -->
    <section class="banners-dual">
      <div class="dual-card card-bg-1">
        <h2>Publishing Deals</h2>
        <h4>Buy 1 Get 1 Free</h4>
        <p>Grab handpicked bestsellers on exclusive bundle discounts.</p>
        <button class="btn-banner-outline">View Collection</button>
      </div>
      <div class="dual-card card-bg-2">
        <h2>New Author Series</h2>
        <h4>Spring Season 2026</h4>
        <p>Fresh titles released direct from our store dashboard catalog.</p>
        <button class="btn-banner-outline">Discover Now</button>
      </div>
    </section>

    <!-- 3. Triple Strip Banners -->
    <section class="banners-triple">
      <div class="strip-card strip-bg-1">
        <h3>Season Sale 60%</h3>
        <span>Limited Period Inventory Clearance</span>
      </div>
      <div class="strip-card strip-bg-2">
        <h3>Flash Deal 50%</h3>
        <span>Top 100 Selected Paperbacks</span>
      </div>
      <div class="strip-card strip-bg-3">
        <h3>Free Hardcover Upgrade</h3>
        <span>On orders above $50</span>
      </div>
    </section>
  `;

  return container;
}