// src/components/Features/Features.js
import './Features.css';

const featuresData = [
  { id: 1, title: 'Free Shipping', icon: 'fa-solid fa-truck-fast', theme: 'theme-red' },
  { id: 2, title: 'Order Online', icon: 'fa-solid fa-cart-shopping', theme: 'theme-green' },
  { id: 3, title: 'Save Money', icon: 'fa-solid fa-piggy-bank', theme: 'theme-blue' },
  { id: 4, title: 'Promotions', icon: 'fa-solid fa-tags', theme: 'theme-purple' },
  { id: 5, title: 'Happy Sell', icon: 'fa-solid fa-handshake', theme: 'theme-orange' },
  { id: 6, title: '24/7 Support', icon: 'fa-solid fa-headset', theme: 'theme-teal' }
];

export function createFeatures() {
  const container = document.createElement('section');
  container.className = 'features-container';
  container.id = 'feature';

  const grid = document.createElement('div');
  grid.className = 'features-grid';

  grid.innerHTML = featuresData.map((item) => `
    <div class="feature-box ${item.theme}" tabindex="0">
      <div class="feature-icon-wrapper">
        <i class="${item.icon}"></i>
      </div>
      <span class="feature-badge-title">${item.title}</span>
    </div>
  `).join('');

  container.appendChild(grid);
  return container;
}