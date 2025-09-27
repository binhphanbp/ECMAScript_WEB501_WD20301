// ---------------- Data ----------------
const cartItems = [
  {
    image:
      'https://images.unsplash.com/photo-1606813907291-77d7ae2f70d5?auto=format&fit=crop&w=400&q=80',
    name: 'Sữa rửa mặt dịu nhẹ',
    price: 150000,
    quantity: 2,
  },
  {
    image:
      'https://images.unsplash.com/photo-1612810806495-308c734bdf9f?auto=format&fit=crop&w=400&q=80',
    name: 'Kem chống nắng SPF50+',
    price: 280000,
    quantity: 1,
  },
  {
    image:
      'https://images.unsplash.com/photo-1612815154728-9f7f4f6b9f5f?auto=format&fit=crop&w=400&q=80',
    name: 'Son dưỡng môi tự nhiên',
    price: 120000,
    quantity: 3,
  },
];

const voucherList = [
  {
    code: 'VOUCHER30',
    percent: 30,
    maxDiscount: 100000,
    active: true,
    note: 'Giảm 30% tối đa 100k',
  },
  {
    code: 'VOUCHER20',
    percent: 20,
    maxDiscount: 50000,
    active: true,
    note: 'Giảm 20% tối đa 50k',
  },
];

const shippingFee = 30000;
let appliedVoucher = null;

// ---------------- DOM Elements ----------------
const cartProductsElement = document.getElementById('cart-products');
const subtotalAmountElement = document.getElementById('subtotal-amount');
const discountAmountElement = document.getElementById('discount-amount');
const shippingAmountElement = document.getElementById('shipping-amount');
const totalAmountElement = document.getElementById('total-amount');
const voucherInputElement = document.getElementById('voucher-input');
const applyVoucherBtn = document.getElementById('apply-voucher-btn');
const toggleVoucherListBtn = document.getElementById('toggle-voucher-list-btn');
const voucherDropdown = document.getElementById('voucher-dropdown');

// ---------------- Helpers ----------------
const formatCurrency = (num) =>
  num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

function isVoucherApplicableToCart(subtotal, voucher) {
  return voucher.active && subtotal > 0;
}

function calculateDiscount(subtotal, voucher) {
  if (!voucher) return 0;
  const discount = (subtotal * voucher.percent) / 100;
  return Math.min(discount, voucher.maxDiscount);
}

// ---------------- Core ----------------
function renderCart() {
  const oldItems = cartProductsElement.querySelectorAll(
    '.cart-item, .empty-state'
  );
  oldItems.forEach((el) => el.remove());

  if (cartItems.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'Giỏ hàng của bạn đang trống.';
    cartProductsElement.appendChild(empty);
  } else {
    cartItems.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;

      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
            <img src="${item.image}" alt="${item.name}" />
            <div class="item-info">
              <div class="item-name">${item.name}</div>
              <div class="item-price">${formatCurrency(item.price)}</div>
            </div>
            <div class="item-qty">
              <button class="qty-btn minus">−</button>
              <div class="qty-value">${item.quantity}</div>
              <button class="qty-btn plus">+</button>
            </div>
            <div class="item-total">${formatCurrency(itemTotal)}</div>
            <button class="remove-btn" title="Xóa sản phẩm">&times;</button>
          `;

      // Events
      div
        .querySelector('.minus')
        .addEventListener('click', () => changeQuantity(index, -1));
      div
        .querySelector('.plus')
        .addEventListener('click', () => changeQuantity(index, 1));
      div
        .querySelector('.remove-btn')
        .addEventListener('click', () => deleteProduct(index));

      if (item.quantity === 1) {
        div.querySelector('.minus').disabled = true;
      }

      cartProductsElement.appendChild(div);
    });
  }

  updateSummary();
}

function updateSummary() {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = calculateDiscount(subtotal, appliedVoucher);
  const shipping = cartItems.length ? shippingFee : 0;
  const total = subtotal - discount + shipping;

  subtotalAmountElement.textContent = formatCurrency(subtotal);
  discountAmountElement.textContent = formatCurrency(discount);
  shippingAmountElement.textContent = formatCurrency(shipping);
  totalAmountElement.textContent = formatCurrency(total);
}

function deleteProduct(index) {
  cartItems.splice(index, 1);
  renderCart();
}

function changeQuantity(index, delta) {
  cartItems[index].quantity += delta;
  if (cartItems[index].quantity < 1) cartItems[index].quantity = 1;
  renderCart();
}

function applyVoucher() {
  const code = voucherInputElement.value.trim().toUpperCase();
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const foundVoucher = voucherList.find(
    (v) => v.code === code && isVoucherApplicableToCart(subtotal, v)
  );

  if (foundVoucher) {
    appliedVoucher = foundVoucher;
  } else {
    appliedVoucher = null;
    alert('Mã voucher không hợp lệ hoặc không áp dụng được.');
  }

  updateSummary();
}

function renderVoucherDropdown() {
  voucherDropdown.innerHTML = '';
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  voucherList.forEach((voucher) => {
    const isApplicable = isVoucherApplicableToCart(subtotal, voucher);
    const option = document.createElement('div');
    option.className = 'voucher-option' + (isApplicable ? '' : ' disabled');
    option.textContent = `${voucher.code} — ${voucher.note}`;
    if (isApplicable) {
      option.addEventListener('click', () => {
        voucherInputElement.value = voucher.code;
        applyVoucher();
        voucherDropdown.style.display = 'none';
      });
    }
    voucherDropdown.appendChild(option);
  });

  if (voucherList.length === 0) {
    const none = document.createElement('div');
    none.className = 'voucher-option disabled';
    none.textContent = 'Không có voucher khả dụng';
    voucherDropdown.appendChild(none);
  }
}

// ---------------- Events ----------------
applyVoucherBtn.addEventListener('click', applyVoucher);
toggleVoucherListBtn.addEventListener('click', () => {
  if (
    voucherDropdown.style.display === 'none' ||
    voucherDropdown.style.display === ''
  ) {
    renderVoucherDropdown();
    voucherDropdown.style.display = 'block';
  } else {
    voucherDropdown.style.display = 'none';
  }
});

document.addEventListener('click', (e) => {
  if (
    !voucherDropdown.contains(e.target) &&
    !toggleVoucherListBtn.contains(e.target)
  ) {
    voucherDropdown.style.display = 'none';
  }
});

renderCart();
