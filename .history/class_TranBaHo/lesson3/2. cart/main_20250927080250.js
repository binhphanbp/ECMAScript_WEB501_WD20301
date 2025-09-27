/********************************************************************
 * Dữ liệu mẫu
 ********************************************************************/
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

// Voucher list (demo). In production: validate these on server.
const voucherList = [
  {
    code: 'VOUCHER30',
    percent: 30,
    maxDiscount: 100000,
    minSubtotal: 0,
    active: true,
    note: 'Giảm 30% tối đa 100k',
  },
  {
    code: 'SAVE10',
    percent: 10,
    maxDiscount: 50000,
    minSubtotal: 100000,
    active: true,
    note: 'Giảm 10% tối đa 50k (tối thiểu 100k)',
  },
  {
    code: 'WELCOME50',
    percent: 50,
    maxDiscount: 70000,
    minSubtotal: 0,
    active: false,
    note: 'Ví dụ voucher hết hạn (inactive)',
  },
];

/********************************************************************
 * DOM references (tên rõ ràng)
 ********************************************************************/
const cartProductsContainer = document.getElementById('cart-products');
const cartSummaryContainer = document.getElementById('cart-summary');

const subtotalAmountElement = document.getElementById('subtotal-amount');
const discountAmountElement = document.getElementById('discount-amount');
const shippingAmountElement = document.getElementById('shipping-amount');
const totalAmountElement = document.getElementById('total-amount');

const voucherInputElement = document.getElementById('voucher-input');
const applyVoucherButton = document.getElementById('apply-voucher-btn');
const voucherMessageElement = document.getElementById('voucher-message');
const appliedVoucherContainer = document.getElementById(
  'applied-voucher-container'
);
const appliedVoucherTextElement = document.getElementById(
  'applied-voucher-text'
);
const clearVoucherButton = document.getElementById('clear-voucher-btn');

/********************************************************************
 * App state
 ********************************************************************/
const shippingFee = 30000;
let appliedVoucher = null; // will hold voucher object when applied

/********************************************************************
 * Helpers
 ********************************************************************/
function formatCurrency(number) {
  return number.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
}

function findVoucherByCode(code) {
  if (!code) return null;
  const normalizedCode = code.trim().toUpperCase();
  return voucherList.find((v) => v.code === normalizedCode) || null;
}

function computeDiscountForVoucher(subtotal, voucher) {
  // return integer discount (VND)
  if (!voucher) return 0;
  const discountRaw = Math.floor(subtotal * (voucher.percent / 100));
  return Math.min(discountRaw, voucher.maxDiscount);
}

/********************************************************************
 * Hàm chính theo yêu cầu: deleteProduct, changeQuantity, renderCart
 ********************************************************************/
function deleteProduct(index) {
  if (index < 0 || index >= cartItems.length) return;
  cartItems.splice(index, 1);
  // Nếu giỏ hàng rỗng thì clear voucher
  if (cartItems.length === 0) clearAppliedVoucher();
  renderCart();
}

function changeQuantity(index, type) {
  if (index < 0 || index >= cartItems.length) return;
  if (type === 'plus') {
    cartItems[index].quantity++;
  } else if (type === 'minus') {
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity--;
    }
  }
  renderCart();
}

function renderCart() {
  // Xóa các item cũ (giữ lại tiêu đề)
  const oldItems = cartProductsContainer.querySelectorAll(
    '.cart-item, .empty-message'
  );
  oldItems.forEach((node) => node.remove());

  let subtotal = 0;

  // Render mỗi sản phẩm
  cartItems.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const itemNode = document.createElement('div');
    itemNode.className = 'cart-item';
    itemNode.innerHTML = `
          <img src="${item.image}" alt="${item.name}" />
          <div class="item-info">
            <div class="item-name">${item.name}</div>
            <div class="item-price">${formatCurrency(item.price)}</div>
          </div>
          <div class="item-qty">
            <button class="qty-btn minus" aria-label="Giảm">−</button>
            <div class="qty-value">${item.quantity}</div>
            <button class="qty-btn plus" aria-label="Tăng">+</button>
          </div>
          <div class="item-total">${formatCurrency(itemTotal)}</div>
          <button class="remove-btn" aria-label="Xóa">×</button>
        `;

    // Buttons
    const minusButton = itemNode.querySelector('.minus');
    const plusButton = itemNode.querySelector('.plus');
    const removeButton = itemNode.querySelector('.remove-btn');

    // Disable minus when quantity == 1
    minusButton.disabled = item.quantity <= 1;

    minusButton.addEventListener('click', () => changeQuantity(index, 'minus'));
    plusButton.addEventListener('click', () => changeQuantity(index, 'plus'));
    removeButton.addEventListener('click', () => deleteProduct(index));

    cartProductsContainer.appendChild(itemNode);
  });

  // If empty show message
  if (cartItems.length === 0) {
    const emptyMessageNode = document.createElement('p');
    emptyMessageNode.className = 'empty-message';
    emptyMessageNode.textContent =
      '🛒 Giỏ hàng trống! Tiếp tục mua sắm để thêm sản phẩm.';
    cartProductsContainer.appendChild(emptyMessageNode);
  }

  // Recompute discount if voucher is applied and valid
  let discountAmount = 0;
  if (appliedVoucher) {
    // check minSubtotal condition
    if (subtotal >= (appliedVoucher.minSubtotal || 0)) {
      discountAmount = computeDiscountForVoucher(subtotal, appliedVoucher);
    } else {
      // nếu subtotal < min requirement, voucher không áp dụng -> show message
      voucherMessageElement.textContent = `Mã ${
        appliedVoucher.code
      } yêu cầu đơn hàng tối thiểu ${formatCurrency(
        appliedVoucher.minSubtotal
      )}.`;
      voucherMessageElement.className = 'message error';
      discountAmount = 0;
    }
  } else {
    voucherMessageElement.textContent = '';
    voucherMessageElement.className = 'message';
  }

  // Update summary display
  subtotalAmountElement.textContent = formatCurrency(subtotal);
  shippingAmountElement.textContent = formatCurrency(
    cartItems.length ? shippingFee : 0
  );
  discountAmountElement.textContent = `-${formatCurrency(discountAmount)}`;
  const totalAmount =
    subtotal - discountAmount + (cartItems.length ? shippingFee : 0);
  totalAmountElement.textContent = formatCurrency(Math.max(0, totalAmount));

  // If subtotal changed and now voucher no longer valid (inactive or removed), clean up applied voucher UI
  if (appliedVoucher && !isVoucherApplicableToCart(subtotal, appliedVoucher)) {
    // keep voucher applied but notify (we already set message). If you want to auto-clear, call clearAppliedVoucher();
  }

  // Hide applied voucher block if no applied voucher
  if (!appliedVoucher) {
    appliedVoucherContainer.style.display = 'none';
  } else {
    appliedVoucherContainer.style.display = 'block';
    appliedVoucherTextElement.textContent = `${appliedVoucher.code} — ${
      appliedVoucher.note ||
      appliedVoucher.percent +
        '% (max ' +
        formatCurrency(appliedVoucher.maxDiscount) +
        ')'
    }`;
  }
}

/********************************************************************
 * Voucher functions
 ********************************************************************/
function isVoucherApplicableToCart(subtotal, voucher) {
  if (!voucher || !voucher.active) return false;
  if (subtotal < (voucher.minSubtotal || 0)) return false;
  // expiry check (optional)
  if (voucher.expires) {
    const now = new Date();
    const expireDate = new Date(voucher.expires + 'T23:59:59');
    if (expireDate < now) return false;
  }
  return true;
}

function applyVoucher() {
  const code = voucherInputElement.value.trim().toUpperCase();
  if (!code) {
    voucherMessageElement.textContent = 'Vui lòng nhập mã voucher.';
    voucherMessageElement.className = 'message error';
    return;
  }

  const voucher = findVoucherByCode(code);
  if (!voucher) {
    voucherMessageElement.textContent = 'Mã voucher không tồn tại.';
    voucherMessageElement.className = 'message error';
    return;
  }

  if (!voucher.active) {
    voucherMessageElement.textContent = 'Mã voucher không còn hiệu lực.';
    voucherMessageElement.className = 'message error';
    return;
  }

  // check expiry if exists
  if (voucher.expires) {
    const now = new Date();
    const expireDate = new Date(voucher.expires + 'T23:59:59');
    if (expireDate < now) {
      voucherMessageElement.textContent = 'Mã voucher đã hết hạn.';
      voucherMessageElement.className = 'message error';
      return;
    }
  }

  // subtotal check
  const subtotalNow = cartItems.reduce(
    (sum, it) => sum + it.price * it.quantity,
    0
  );
  if (subtotalNow < (voucher.minSubtotal || 0)) {
    voucherMessageElement.textContent = `Mã voucher yêu cầu đơn hàng tối thiểu ${formatCurrency(
      voucher.minSubtotal
    )}.`;
    voucherMessageElement.className = 'message error';
    return;
  }

  // OK áp dụng
  appliedVoucher = voucher;
  voucherMessageElement.textContent = `Áp dụng mã ${
    voucher.code
  } thành công — ${voucher.note || voucher.percent + '%'}`;
  voucherMessageElement.className = 'message success';
  voucherInputElement.value = '';
  renderCart();
}

function clearAppliedVoucher() {
  appliedVoucher = null;
  voucherMessageElement.textContent = '';
  appliedVoucherContainer.style.display = 'none';
  renderCart();
}

/********************************************************************
 * Events
 ********************************************************************/
applyVoucherButton.addEventListener('click', applyVoucher);
voucherInputElement.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    applyVoucher();
  }
});
clearVoucherButton.addEventListener('click', clearAppliedVoucher);

/********************************************************************
 * Init
 ********************************************************************/
renderCart();

/********************************************************************
 * Security note (important)
 * - Mã voucher chỉ được coi là "gợi ý" trên frontend. Luôn validate
 *   và tính lại (server-side) trước khi đặt hàng để tránh lỗ hổng
 *   (client can be manipulated).
 ********************************************************************/
