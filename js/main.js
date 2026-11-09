// js/main.js
import { initCommonUI } from './common.js';
import { featuredBooks, newArrivals } from './data.js';
import { renderHero } from './Hero.js';
import { renderFeatures } from './Features.js';
import { renderProducts } from './Products.js';
import { renderBanners } from './Banners.js';
import { renderFooter } from './Footer.js';

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  const appRoot = document.getElementById('app-root');

  // Initialize Header Navigation Mobile Drawer
  initCommonUI();

  // Mount Components sequentially
  appRoot.appendChild(renderHero());
  appRoot.appendChild(renderFeatures());
  appRoot.appendChild(renderProducts(featuredBooks, 'Featured Products', 'Summer vacation new Modern Design & Bestsellers'));
  appRoot.appendChild(renderBanners());
  appRoot.appendChild(renderProducts(newArrivals, 'New Arrivals', 'History, Fiction & All kinds of books available on our platform'));
  appRoot.appendChild(renderFooter());
});