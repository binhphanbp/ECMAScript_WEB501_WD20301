// cart.js
// Key in localStorage
const CART_KEY = 'demo_cart_v1';
const VOUCHER_KEY = 'demo_voucher_v1';

// UTIL
const fmt = (n) => {
  return new Intl.NumberFormat('vi-VN').format(Math.max(0, Math.round(n)));
};

// sample products (for demo, used when cart empty to let you see UI quickly)
const SAMPLE_PRODUCTS = [
  {
    id: 'p1',
    name: 'Áo thun Basic',
    price: 150000,
    qty: 1,
    img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=fd7c1a5d2a07a6f9b5a424b3a3a3a4d7',
  },
  {
    id: 'p2',
    name: 'Giày thể thao',
    price: 650000,
    qty: 1,
    img: 'https://images.unsplash.com/photo-1528701800487-2761a3691d3d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=1c2f8f8f8d4c4a5a7f3b7b7b7c0d0f0a',
  },
  {
    id: 'p3',
    name: 'Túi vải eco',
    price: 120000,
    qty: 2,
    img: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=8a3e4d6a9a3b2b1d7c9a0a0b0c0d0e0f',
  },
];

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    return JSON.parse(raw) || [];
  } catch (e) {
    console.error(e);
    return [];
  }
}
function writeCart(arr) {
  localStorage.setItem(CART_KEY, JSON.stringify(arr));
}

function readVoucher() {
  return localStorage.getItem(VOUCHER_KEY) || null;
}
function writeVoucher(code) {
  if (code) localStorage.setItem(VOUCHER_KEY, code);
  else localStorage.removeItem(VOUCHER_KEY);
}

// init demo: if no cart, seed sample so UI visible (you can remove this behavior in production)
if (!localStorage.getItem(CART_KEY)) {
  writeCart(SAMPLE_PRODUCTS);
}

// RENDER
const cartList = document.getElementById('cartList');
const emptyState = document.getElementById('emptyState');
const subtotalEl = document.getElementById('subtotal');
const subtotalText = document.getElementById('subtotalText');
const totalEl = document.getElementById('total');
const discountEl = document.getElementById('discount');
const voucherInput = document.getElementById('voucherCode');
const voucherMsg = document.getElementById('voucherMsg');

function calcTotals(items) {
  let subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  let voucher = readVoucher();
  let discount = 0;
  // simple voucher logic:
  if (voucher === 'DISCOUNT10') {
    discount = Math.round(subtotal * 0.1);
  } else if (voucher === 'SAVE50') {
    discount = 50000;
  } else {
    discount = 0;
  }
  let total = subtotal - discount;
  if (total < 0) total = 0;
  return { subtotal, discount, total };
}

function renderCart() {
  const items = readCart();
  cartList.innerHTML = '';
  if (!items || items.length === 0) {
    emptyState.style.display = 'block';
    subtotalEl.textContent = '₫0';
    subtotalText.textContent = '0 sản phẩm';
    totalEl.textContent = '₫0';
    discountEl.textContent = '₫0';
    return;
  }
  emptyState.style.display = 'none';
  items.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}" />
      <div class="meta">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <div class="title">${item.name}</div>
            <div class="desc">Giá: ₫${fmt(item.price)}</div>
          </div>
          <div style="text-align:right">
            <div style="font-weight:700">₫${fmt(item.price * item.qty)}</div>
            <button class="remove-btn" data-id="${item.id}">Xóa</button>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
          <div class="qty-control">
            <button class="dec" data-id="${item.id}">−</button>
            <input type="text" value="${item.qty}" data-id="${
      item.id
    }" readonly />
            <button class="inc" data-id="${item.id}">+</button>
          </div>
          <div style="color:var(--muted);font-size:13px">SKU: ${item.id}</div>
        </div>
      </div>
    `;
    cartList.appendChild(div);
  });

  // attach handlers
  cartList.querySelectorAll('.inc').forEach((btn) => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      updateQty(id, +1);
    };
  });
  cartList.querySelectorAll('.dec').forEach((btn) => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      updateQty(id, -1);
    };
  });
  cartList.querySelectorAll('.remove-btn').forEach((btn) => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      removeItem(id);
    };
  });

  // totals
  const totals = calcTotals(items);
  subtotalEl.textContent = '₫' + fmt(totals.subtotal);
  subtotalText.textContent = `${items.length} sản phẩm · Tạm tính: ₫${fmt(
    totals.subtotal
  )}`;
  discountEl.textContent = '₫' + fmt(totals.discount);
  totalEl.textContent = '₫' + fmt(totals.total);

  // populate voucher input if present
  const v = readVoucher();
  voucherInput.value = v || '';
  voucherMsg.textContent = v ? `Voucher "${v}" đang áp dụng` : '';
}

function updateQty(id, delta) {
  const items = readCart();
  const idx = items.findIndex((x) => x.id === id);
  if (idx === -1) return;
  items[idx].qty = Math.max(0, items[idx].qty + delta);
  if (items[idx].qty === 0) items.splice(idx, 1);
  writeCart(items);
  renderCart();
}

function removeItem(id) {
  const items = readCart().filter((x) => x.id !== id);
  writeCart(items);
  renderCart();
}

// voucher handling
document.getElementById('applyVoucher').addEventListener('click', () => {
  const code = (voucherInput.value || '').trim().toUpperCase();
  if (!code) {
    voucherMsg.textContent = 'Nhập mã voucher.';
    writeVoucher(null);
    renderCart();
    return;
  }
  // demo voucher validation
  const valid = ['DISCOUNT10', 'SAVE50'];
  if (valid.includes(code)) {
    writeVoucher(code);
    voucherMsg.textContent = `Áp dụng mã ${code} thành công.`;
  } else {
    writeVoucher(null);
    voucherMsg.textContent = 'Mã không hợp lệ.';
  }
  renderCart();
});

// go to checkout
document.getElementById('goToCheckout').addEventListener('click', () => {
  // ensure cart not empty
  const items = readCart();
  if (!items || items.length === 0) {
    alert('Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.');
    return;
  }
  // navigate to checkout (for demo open checkout.html)
  location.href = 'checkout.html';
});

// initial render
renderCart();
