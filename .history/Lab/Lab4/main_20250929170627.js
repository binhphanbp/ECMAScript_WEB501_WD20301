// ---------------- Data ----------------
const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [
  {
    image: './img/facial-wash.avif',
    name: 'Sữa rửa mặt dịu nhẹ',
    price: 60000,
    quantity: 2,
  },
  {
    image: './img/suncream.jpg',
    name: 'Kem chống nắng SPF50+',
    price: 85000,
    quantity: 1,
  },
  {
    image: './img/lip-protect.webp',
    name: 'Son dưỡng môi tự nhiên',
    price: 30000,
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

const shippingFee = 20000;
let appliedVoucher = null;

// ---------------- Helpers ----------------
const formatCurrency = (num) =>
  num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const isVoucherApplicableToCart = (subtotal, voucher) =>
  voucher.active && subtotal > 0;

const calculateDiscount = (subtotal, voucher) => {
  if (!voucher) return 0;
  const discount = (subtotal * voucher.percent) / 100;
  return Math.min(discount, voucher.maxDiscount);
};

// ---------------- CART PAGE ----------------
const initCartPage = () => {
  const cartProductsElement = document.getElementById('cart-products');
  const subtotalAmountElement = document.getElementById('subtotal-amount');
  const discountAmountElement = document.getElementById('discount-amount');
  const shippingAmountElement = document.getElementById('shipping-amount');
  const totalAmountElement = document.getElementById('total-amount');
  const voucherInputElement = document.getElementById('voucher-input');
  const applyVoucherBtn = document.getElementById('apply-voucher-btn');
  const toggleVoucherListBtn = document.getElementById(
    'toggle-voucher-list-btn'
  );
  const voucherDropdown = document.getElementById('voucher-dropdown');
  const checkoutBtn = document.getElementById('checkout-btn');

  const renderCart = () => {
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
  };

  const updateSummary = () => {
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
  };

  const deleteProduct = (index) => {
    cartItems.splice(index, 1);
    renderCart();
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  };

  const changeQuantity = (index, delta) => {
    cartItems[index].quantity += delta;
    if (cartItems[index].quantity < 1) cartItems[index].quantity = 1;
    renderCart();
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  };

  const applyVoucher = () => {
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
  };

  const renderVoucherDropdown = () => {
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
  };

  // Events
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

  checkoutBtn.addEventListener('click', () => {
    const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const discount = calculateDiscount(subtotal, appliedVoucher);
    const shipping = cartItems.length ? shippingFee : 0;
    const total = subtotal - discount + shipping;

    const checkoutData = {
      cartItems,
      subtotal,
      discount,
      shipping,
      total,
      appliedVoucher,
    };

    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    window.location.href = 'checkout.html';
  });

  renderCart();
};

// ---------------- CHECKOUT PAGE ----------------
const initCheckoutPage = () => {
  const checkoutData = JSON.parse(localStorage.getItem('checkoutData')) || {};

  const orderItemsEl = document.getElementById('order-items');
  const subtotalEl = document.getElementById('summary-subtotal');
  const discountEl = document.getElementById('summary-discount');
  const shippingEl = document.getElementById('summary-shipping');
  const totalEl = document.getElementById('summary-total');
  const placeOrderBtn = document.getElementById('place-order-btn');

  const renderCheckout = () => {
    orderItemsEl.innerHTML = '';
    if (checkoutData.cartItems && checkoutData.cartItems.length) {
      checkoutData.cartItems.forEach((item) => {
        const div = document.createElement('div');
        div.textContent = `${item.name} x${item.quantity}`;
        orderItemsEl.appendChild(div);
      });
    }

    subtotalEl.textContent = formatCurrency(checkoutData.subtotal || 0);
    discountEl.textContent = formatCurrency(checkoutData.discount || 0);
    shippingEl.textContent = formatCurrency(checkoutData.shipping || 0);
    totalEl.textContent = formatCurrency(checkoutData.total || 0);
  };

  placeOrderBtn.addEventListener('click', () => {
    const fullname = document.getElementById('fullname').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const paymentMethod = document.getElementById('payment-method').value;

    if (!fullname || !phone || !address) {
      alert('Vui lòng nhập đầy đủ thông tin giao hàng.');
      return;
    }

    alert(
      `Đặt hàng thành công!\nKhách: ${fullname}\nSĐT: ${phone}\nTổng tiền: ${formatCurrency(
        checkoutData.total
      )}`
    );

    localStorage.removeItem('checkoutData');
    localStorage.removeItem('cartItems');
    window.location.href = 'cart.html';
  });

  renderCheckout();
};

// ---------------- INIT ----------------
if (document.getElementById('cart-products')) {
  initCartPage();
}

if (document.getElementById('order-items')) {
  initCheckoutPage();
}
