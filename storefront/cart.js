/* ── CART STATE ────────────────────────────────────────────────────── */
const FREE_SHIPPING_THRESHOLD = 75;

let cart = JSON.parse(localStorage.getItem('lux_cart') || '[]');

const productColors = {
  1: '#e8196e',
  2: '#2563eb',
  3: '#7c3aed',
  4: '#d97706',
  5: '#c9a84c',
};

const productEmojis = {
  1: '🩷',
  2: '💙',
  3: '💜',
  4: '🧡',
  5: '✨',
};

/* ── PERSIST ──────────────────────────────────────────────────────── */
function saveCart() {
  localStorage.setItem('lux_cart', JSON.stringify(cart));
}

/* ── TOAST ────────────────────────────────────────────────────────── */
let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
}

/* ── CART OPEN / CLOSE ────────────────────────────────────────────── */
function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── ADD TO CART ──────────────────────────────────────────────────── */
function addToCart(id, name, price) {
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price: parseFloat(price), qty: 1 });
  }
  saveCart();
  renderCart();
  showToast(`${name} added to cart`);
  openCart();
}

/* ── UPDATE QTY ───────────────────────────────────────────────────── */
function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  saveCart();
  renderCart();
}

/* ── REMOVE ITEM ──────────────────────────────────────────────────── */
function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

/* ── SUBTOTAL ─────────────────────────────────────────────────────── */
function getSubtotal() {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function getTotalQty() {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}

/* ── RENDER CART ──────────────────────────────────────────────────── */
function renderCart() {
  const itemsEl   = document.getElementById('cartItems');
  const emptyEl   = document.getElementById('cartEmpty');
  const footerEl  = document.getElementById('cartFooter');
  const countEl   = document.getElementById('cartCount');
  const drawerCnt = document.getElementById('drawerCount');
  const subtotalEl = document.getElementById('cartSubtotal');
  const noteEl    = document.getElementById('freeShippingNote');
  const badgeEl   = document.getElementById('cartCount');

  const totalQty = getTotalQty();
  const subtotal = getSubtotal();

  // Badge
  badgeEl.textContent = totalQty;
  if (totalQty > 0) {
    badgeEl.classList.add('visible');
  } else {
    badgeEl.classList.remove('visible');
  }

  drawerCnt.textContent = totalQty;
  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

  // Free shipping note
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    noteEl.textContent = '🎉 You qualify for FREE shipping!';
  } else {
    const remaining = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2);
    noteEl.textContent = `Add $${remaining} more for FREE shipping`;
  }

  if (cart.length === 0) {
    emptyEl.style.display = 'flex';
    footerEl.style.display = 'none';
    // Clear any rendered items
    Array.from(itemsEl.querySelectorAll('.cart-item')).forEach(el => el.remove());
    return;
  }

  emptyEl.style.display = 'none';
  footerEl.style.display = 'flex';

  // Rebuild item list
  Array.from(itemsEl.querySelectorAll('.cart-item')).forEach(el => el.remove());

  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.dataset.id = item.id;
    div.innerHTML = `
      <div class="cart-item-thumb" style="background:${productColors[item.id] || '#333'}20; color:${productColors[item.id] || '#fff'}">
        ${productEmojis[item.id] || '📦'}
      </div>
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)" aria-label="Decrease">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)" aria-label="Increase">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeItem(${item.id})" aria-label="Remove">✕</button>
    `;
    itemsEl.insertBefore(div, footerEl);
    itemsEl.appendChild(div);
  });
}

/* ── CHECKOUT ─────────────────────────────────────────────────────── */
function handleCheckout() {
  if (cart.length === 0) return;
  showToast('Redirecting to checkout…');
  setTimeout(() => {
    alert(`Order summary:\n\n${cart.map(i => `${i.name} x${i.qty} – $${(i.price * i.qty).toFixed(2)}`).join('\n')}\n\nTotal: $${getSubtotal().toFixed(2)}\n\n(Connect your payment processor to complete checkout)`);
  }, 400);
}

/* ── NEWSLETTER ───────────────────────────────────────────────────── */
function handleNewsletter(e) {
  e.preventDefault();
  const input = e.target.querySelector('input');
  showToast(`Thanks for subscribing, ${input.value}!`);
  input.value = '';
}

/* ── CAROUSEL ─────────────────────────────────────────────────────── */
function initCarousel() {
  const grid  = document.getElementById('productsGrid');
  const prev  = document.getElementById('prevBtn');
  const next  = document.getElementById('nextBtn');
  if (!grid || !prev || !next) return;

  const scrollAmount = () => {
    const card = grid.querySelector('.product-card');
    return card ? card.offsetWidth + 24 : 300;
  };

  next.addEventListener('click', () => grid.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
  prev.addEventListener('click', () => grid.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
}

/* ── STICKY HEADER ────────────────────────────────────────────────── */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

/* ── MOBILE MENU ──────────────────────────────────────────────────── */
function initMobileMenu() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mobileNav');
  btn.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}

/* ── INIT ─────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Cart controls
  document.getElementById('cartToggle').addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);

  const shopLink = document.getElementById('cartShopLink');
  if (shopLink) shopLink.addEventListener('click', closeCart);

  // "SHOP NOW" buttons on product cards
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart(
        parseInt(btn.dataset.id),
        btn.dataset.name,
        btn.dataset.price
      );
    });
  });

  // Close cart on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCart();
  });

  initCarousel();
  initStickyHeader();
  initMobileMenu();
  renderCart(); // restore persisted cart
});
