/**
 * ORCİK - Elazığ Gurme Lezzetler
 * Modern E-Ticaret & İnteraktif Deneyim Mantığı
 * Tema Yönetimi (Karanlık / Aydınlık), Sepet, Canlı Arama ve Bildirimler
 */

// Uygulama Durumu (State)
const state = {
  theme: localStorage.getItem('orcik_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  cart: JSON.parse(localStorage.getItem('orcik_cart') || '[]'),
  productSelections: {}, // productId -> selectedOptionIndex
  wishlist: JSON.parse(localStorage.getItem('orcik_wishlist') || '[]'),
  activeSlide: 0,
  activeCategory: 'all'
};

// DOM Yüklendiğinde Başlat
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSelections();
  renderProducts();
  renderPackages();
  renderCart();
  initHeroSlider();
  initSearch();
  initPurchaseToasts();
  setupEventListeners();
});

/* ==========================================================================
   1. TEMA YÖNETİMİ (Karanlık / Aydınlık)
   ========================================================================== */
function initTheme() {
  setTheme(state.theme);

  const toggleBtn = document.getElementById('themeToggleBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      showToast(newTheme === 'dark' ? 'Karanlık tema aktif' : 'Aydınlık tema aktif');
    });
  }

  // Sistem tercihi değişimini dinle
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('orcik_theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  document.body.classList.toggle('dark-theme', theme === 'dark');
  localStorage.setItem('orcik_theme', theme);

  const toggleBtn = document.getElementById('themeToggleBtn');
  if (toggleBtn) {
    toggleBtn.setAttribute('title', theme === 'dark' ? 'Aydınlık Temaya Geç' : 'Karanlık Temaya Geç');
  }
}

/* ==========================================================================
   2. ÜRÜN VE GRAMAJ SEÇİMLERİ
   ========================================================================== */
function initSelections() {
  PRODUCTS.forEach(p => {
    state.productSelections[p.id] = p.defaultOptionIndex || 0;
  });
}

function renderProducts(category = 'all') {
  const container = document.getElementById('productsGrid');
  const yiyecekContainer = document.getElementById('yiyeceklerGrid');
  const icecekContainer = document.getElementById('iceceklerGrid');

  if (yiyecekContainer && icecekContainer) {
    const yiyecekler = PRODUCTS.filter(p => p.category === 'yiyecek');
    const icecekler = PRODUCTS.filter(p => p.category === 'icecek');
    yiyecekContainer.innerHTML = yiyecekler.map(p => renderSingleProductCard(p)).join('');
    icecekContainer.innerHTML = icecekler.map(p => renderSingleProductCard(p)).join('');
    return;
  }

  if (!container) return;

  const filtered = category === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === category);

  container.innerHTML = filtered.map(p => renderSingleProductCard(p)).join('');
}

function renderSingleProductCard(p) {
  const selectedIndex = state.productSelections[p.id] || 0;
  const currentOption = p.options[selectedIndex] || p.options[0];
  const isWishlisted = state.wishlist.includes(p.id);

  return `
    <article class="product-card" data-id="${p.id}">
      <div class="product-image-wrap">
        <img src="${p.image}" alt="${p.name}" class="product-image" loading="lazy">
        
        <div class="product-badges">
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        </div>

        <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" 
                data-action="wishlist" 
                data-id="${p.id}" 
                aria-label="Favorilere Ekle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      <div class="product-body">
        <div class="product-info">
          <h3 class="product-name">${p.name}</h3>
          <div class="product-rating">
            <span class="star">★</span>
            <strong>${p.rating.toFixed(1)}</strong>
            <span>(${p.reviewsCount} Değerlendirme)</span>
          </div>
        </div>

        <div class="product-footer">
          <!-- Gramaj / Paket Seçenekleri -->
          <div class="weight-selector" role="radiogroup" aria-label="Gramaj seçimi">
            ${p.options.map((opt, idx) => `
              <button class="weight-pill ${idx === selectedIndex ? 'selected' : ''}" 
                      data-action="select-weight" 
                      data-id="${p.id}" 
                      data-index="${idx}">
                ${opt.weight}
              </button>
            `).join('')}
          </div>

          <!-- Fiyat ve Sepete Ekle Butonu -->
          <div class="price-action-row">
            <div class="price-box">
              <span class="current-price">₺ ${formatPrice(currentOption.price)}</span>
              ${currentOption.oldPrice ? `<span class="old-price">₺ ${formatPrice(currentOption.oldPrice)}</span>` : ''}
            </div>

            <button class="add-btn" 
                    data-action="add-to-cart" 
                    data-id="${p.id}" 
                    aria-label="${p.name} Sepete Ekle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderPackages() {
  const container = document.getElementById('packagesGrid');
  if (!container) return;

  container.innerHTML = PACKAGES.map(pkg => `
    <div class="package-card" style="background-image: url('${pkg.image}');">
      <h3 class="package-card-title">${pkg.title}</h3>
      <div class="package-card-footer">
        <div class="package-price-wrap">
          <span class="package-old-price">${pkg.oldPrice}</span>
          <span class="package-price">${pkg.price}</span>
        </div>
        <button class="package-cta" data-action="package-cta" data-title="${pkg.title}">
          <span>${pkg.btnText}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </div>
    </div>
  `).join('');
}

function formatPrice(val) {
  return Number(val).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ==========================================================================
   3. SEPET YÖNETİMİ & ÇEKMECE
   ========================================================================== */
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const optionIndex = state.productSelections[productId] || 0;
  const option = product.options[optionIndex] || product.options[0];
  const cartItemId = `${product.id}-${option.weight}`;

  const existing = state.cart.find(item => item.cartItemId === cartItemId);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      cartItemId,
      id: product.id,
      name: product.name,
      image: product.image,
      weight: option.weight,
      price: option.price,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
  openCart();
  showToast(`"${product.name}" sepete eklendi!`);

  // Sayaç animasyonu
  const badge = document.getElementById('cartCountBadge');
  if (badge) {
    badge.classList.remove('bump');
    void badge.offsetWidth;
    badge.classList.add('bump');
  }
}

function updateQuantity(cartItemId, delta) {
  const item = state.cart.find(i => i.cartItemId === cartItemId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter(i => i.cartItemId !== cartItemId);
  }

  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem('orcik_cart', JSON.stringify(state.cart));
}

function renderCart() {
  const list = document.getElementById('cartItemsList');
  const badge = document.getElementById('cartCountBadge');
  const subtotalEl = document.getElementById('cartSubtotal');
  const progressText = document.getElementById('shippingProgressText');
  const progressBar = document.getElementById('shippingBarFill');

  const totalCount = state.cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  if (badge) badge.textContent = totalCount;
  if (subtotalEl) subtotalEl.textContent = `₺ ${formatPrice(totalPrice)}`;

  // Ücretsiz kargo çubuğu hesabı (1.500 TL üzeri)
  const freeThreshold = 1500;
  if (progressBar && progressText) {
    if (totalPrice >= freeThreshold) {
      progressBar.style.width = '100%';
      progressText.innerHTML = '🎉 <strong>Tebrikler!</strong> Kargonuz ücretsiz.';
    } else {
      const remaining = freeThreshold - totalPrice;
      const percent = Math.min(100, Math.round((totalPrice / freeThreshold) * 100));
      progressBar.style.width = `${percent}%`;
      progressText.innerHTML = `Kargonun ücretsiz olması için <strong>₺ ${formatPrice(remaining)}</strong> daha ürün ekleyin!`;
    }
  }

  if (!list) return;

  if (state.cart.length === 0) {
    list.innerHTML = `
      <div class="cart-empty-state">
        <svg class="cart-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
        </svg>
        <p>Sepetinizde henüz lezzet bulunmuyor.</p>
        <button class="btn-story" onclick="closeCart()" style="margin-top: 10px;">Lezzetleri Keşfet</button>
      </div>
    `;
    return;
  }

  list.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <div>
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-weight">${item.weight}</div>
        </div>
        <div class="cart-item-bottom">
          <div class="quantity-control">
            <button class="qty-btn" data-action="qty-down" data-id="${item.cartItemId}">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" data-action="qty-up" data-id="${item.cartItemId}">+</button>
          </div>
          <div class="cart-item-price">₺ ${formatPrice(item.price * item.quantity)}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function openCart() {
  document.getElementById('cartDrawer')?.classList.add('active');
  document.getElementById('drawerOverlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer')?.classList.remove('active');
  document.getElementById('drawerOverlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==========================================================================
   4. HERO SLIDER
   ========================================================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  if (!slides.length) return;

  function goToSlide(index) {
    slides.forEach((s, idx) => {
      s.classList.toggle('active', idx === index);
    });
    dots.forEach((d, idx) => {
      d.classList.toggle('active', idx === index);
    });
    state.activeSlide = index;
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const target = Number(e.currentTarget.getAttribute('data-to-slide'));
      goToSlide(target);
    });
  });

  // Otomatik slayt değişimi (7 saniyede bir)
  setInterval(() => {
    const next = (state.activeSlide + 1) % slides.length;
    goToSlide(next);
  }, 7000);
}

/* ==========================================================================
   5. ARAMA MODALI
   ========================================================================== */
function initSearch() {
  const modal = document.getElementById('searchModal');
  const trigger = document.getElementById('searchTriggerBtn');
  const close = document.getElementById('searchCloseBtn');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResultsList');

  function openSearch() {
    modal?.classList.add('active');
    input?.focus();
    renderSearchResults('');
  }

  function closeSearch() {
    modal?.classList.remove('active');
    if (input) input.value = '';
  }

  trigger?.addEventListener('click', openSearch);
  close?.addEventListener('click', closeSearch);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeSearch();
  });

  input?.addEventListener('input', (e) => {
    renderSearchResults(e.target.value.trim().toLowerCase());
  });

  function renderSearchResults(query) {
    if (!results) return;

    const filtered = query
      ? PRODUCTS.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query))
      : PRODUCTS.slice(0, 4);

    if (filtered.length === 0) {
      results.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--color-text-muted);">"${query}" ile eşleşen Harput lezzeti bulunamadı.</div>`;
      return;
    }

    results.innerHTML = filtered.map(p => `
      <div class="search-item" data-action="view-search-product" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}" class="search-item-thumb">
        <div style="flex:1;">
          <div style="font-weight: 600; font-size: 14.5px;">${p.name}</div>
          <div style="font-size: 12.5px; color: var(--color-text-muted);">${p.categoryName}</div>
        </div>
        <div style="font-weight: 700; font-size: 14px; color: var(--brand-gold);">₺ ${formatPrice(p.options[0].price)}</div>
      </div>
    `).join('');
  }
}

/* ==========================================================================
   6. CANLI SİPARİŞ BİLDİRİMLERİ (Sosyal Kanıt)
   ========================================================================== */
function initPurchaseToasts() {
  const toast = document.getElementById('purchaseToast');
  const toastImg = document.getElementById('toastImg');
  const toastUser = document.getElementById('toastUser');
  const toastProduct = document.getElementById('toastProduct');
  const toastTime = document.getElementById('toastTime');
  const closeBtn = document.getElementById('toastCloseBtn');

  if (!toast) return;

  closeBtn?.addEventListener('click', () => {
    toast.classList.remove('active');
  });

  let index = 0;

  function cycle() {
    const item = RECENT_PURCHASES[index % RECENT_PURCHASES.length];
    const product = PRODUCTS.find(p => p.name.includes(item.product.split(' ')[0])) || PRODUCTS[0];

    if (toastImg) toastImg.src = product.image;
    if (toastUser) toastUser.textContent = `${item.name} · ${item.city}`;
    if (toastProduct) toastProduct.textContent = item.product;
    if (toastTime) toastTime.textContent = item.time;

    toast.classList.add('active');

    setTimeout(() => {
      toast.classList.remove('active');
    }, 6000);

    index++;
  }

  // 4 saniye sonra ilk bildirimi göster, ardından 22 saniyede bir yenile
  setTimeout(() => {
    cycle();
    setInterval(cycle, 22000);
  }, 4000);
}

/* ==========================================================================
   7. OLAY DİNLEYİCİLERİ (Event Listeners)
   ========================================================================== */
function setupEventListeners() {
  // Sepet aç / kapa
  document.getElementById('cartTriggerBtn')?.addEventListener('click', openCart);
  document.getElementById('drawerCloseBtn')?.addEventListener('click', closeCart);
  document.getElementById('drawerOverlay')?.addEventListener('click', closeCart);

  // Header sayfa içi kaydırma bağlantıları
  document.querySelectorAll('.nav-link[data-scroll]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const targetId = link.getAttribute('data-scroll');
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Genel tıklama delegasyonu
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.getAttribute('data-action');
    const id = btn.getAttribute('data-id');

    if (action === 'select-weight') {
      const idx = Number(btn.getAttribute('data-index'));
      state.productSelections[id] = idx;
      renderProducts(state.activeCategory);
    } else if (action === 'add-to-cart') {
      addToCart(id);
    } else if (action === 'qty-up') {
      updateQuantity(id, 1);
    } else if (action === 'qty-down') {
      updateQuantity(id, -1);
    } else if (action === 'wishlist') {
      toggleWishlist(id, btn);
    } else if (action === 'package-cta') {
      const title = btn.getAttribute('data-title');
      showToast(`"${title}" gurme sandığı sepetinize ekleniyor...`);
      addToCart('harput-tanisma-paketi');
    } else if (action === 'view-search-product') {
      document.getElementById('searchModal')?.classList.remove('active');
      addToCart(id);
    }
  });

  // Yapışkan başlık gölge sınıfı
  window.addEventListener('scroll', () => {
    const header = document.getElementById('siteHeader');
    if (header) {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  // E-Bülten formu
  document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('ORCİK lezzet bültenine başarıyla kaydoldunuz! Teşekkür ederiz.');
    e.target.reset();
  });

  // Siparişi tamamla butonu
  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (state.cart.length === 0) {
      showToast('Sepetiniz boş!');
      return;
    }
    showToast('Harput lezzetleri için güvenli ödeme ekranına yönlendiriliyorsunuz...');
  });

  // Mobil menü butonu
  document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    showToast('Kategori menüsü açılıyor...');
    const nav = document.querySelector('.header-nav');
    if (nav) {
      nav.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

function toggleWishlist(productId, btnElement) {
  const idx = state.wishlist.indexOf(productId);
  if (idx > -1) {
    state.wishlist.splice(idx, 1);
    showToast('Ürün favorilerden çıkarıldı.');
  } else {
    state.wishlist.push(productId);
    showToast('Ürün favorilerinize eklendi!');
  }
  localStorage.setItem('orcik_wishlist', JSON.stringify(state.wishlist));
  renderProducts(state.activeCategory);
}

function showToast(message) {
  const toast = document.getElementById('appToast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.remove('active');
  }, 2600);
}
