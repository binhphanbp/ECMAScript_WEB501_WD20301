// ==========================================================
// 1. DATA CỐ ĐỊNH (SẢN PHẨM & ĐỊA CHỈ & HẰNG SỐ)
// (Giữ nguyên phần này)
// ==========================================================

const LOCAL_STORAGE_KEY_CART = 'ecomCart';
const LOCAL_STORAGE_KEY_LAST_ORDER = 'ecomLastOrder';
const DEFAULT_SHIPPING_FEE = 20000;
// ... (PRODUCTS_DATA, VOUCHER_DATA, SAVED_ADDRESSES, getInitialCart giữ nguyên) ...

// DỮ LIỆU MẪU SẢN PHẨM (cho products.html)
const PRODUCTS_DATA = [
  {
    id: 'PROD1',
    name: 'Áo Polo Basic',
    price: 350000,
    img: 'PO1',
    options: 'Màu Đen, Size L',
    desc: 'Chất liệu cotton thoáng mát, kiểu dáng cổ điển.',
  },
  {
    id: 'PROD2',
    name: "Sách 'Sức Mạnh Ngầm'",
    price: 150000,
    img: 'SC2',
    options: 'Tác giả: Tonyman',
    desc: 'Cuốn sách bán chạy nhất về tâm lý học hành vi.',
  },
  {
    id: 'PROD3',
    name: 'Nước Hoa Thể Thao 50ml',
    price: 890000,
    img: 'NF3',
    options: 'Size 50ml',
    desc: 'Hương thơm tươi mát, phù hợp cho người năng động.',
  },
  {
    id: 'PROD4',
    name: 'Bàn phím cơ X90',
    price: 1800000,
    img: 'BP4',
    options: 'Màu Trắng, Switch Brown',
    desc: 'Thiết kế Fullsize, đèn LED RGB, gõ êm tay.',
  },
  {
    id: 'PROD5',
    name: 'Loa Bluetooth Mini',
    price: 599000,
    img: 'LO5',
    options: 'Màu Xanh Navy',
    desc: 'Âm thanh sống động, chống nước IPX7.',
  },
];

// DỮ LIỆU MẪU VOUCHER (cho cart.html)
const VOUCHER_DATA = [
  { code: 'SALE10', desc: 'Giảm 10% (Tối đa 70.000₫)', minTotal: 0 },
  { code: 'GIAM50K', desc: 'Giảm 50.000₫', minTotal: 300000 },
  { code: 'FREESHIP', desc: 'Miễn phí vận chuyển', minTotal: 0 },
  { code: 'WELCOME', desc: 'Giảm 15% cho khách hàng mới', minTotal: 100000 },
  { code: 'HAPPYDAY', desc: 'Giảm 30.000₫', minTotal: 500000 },
];

// DỮ LIỆU MẪU ĐỊA CHỈ (cho checkout.html)
const SAVED_ADDRESSES = [
  {
    name: 'Nguyễn Văn B',
    phone: '0901234567',
    address: '123 Đường A, Phường X, Quận B, TP.HCM',
  },
  {
    name: 'Trần Thị C',
    phone: '0911223344',
    address: '12 Ký Con, Phường Nguyễn Thái Bình, Quận 1, TP.HCM',
  },
];

function getInitialCart() {
  return [
    {
      id: 'PROD1',
      name: PRODUCTS_DATA[0].name,
      options: PRODUCTS_DATA[0].options,
      price: PRODUCTS_DATA[0].price,
      quantity: 1,
      img: PRODUCTS_DATA[0].img,
    },
    {
      id: 'PROD2',
      name: PRODUCTS_DATA[1].name,
      options: PRODUCTS_DATA[1].options,
      price: PRODUCTS_DATA[1].price,
      quantity: 2,
      img: PRODUCTS_DATA[1].img,
    },
  ];
}

// ==========================================================
// 2. CHỨC NĂNG CHUNG (STORAGE & TÍNH TOÁN)
// (Giữ nguyên phần này)
// ==========================================================

// ... (getCart, saveCart, updateGlobalCartCount, formatCurrency giữ nguyên) ...

// Cần lấy voucher đã chọn từ trang cart.html
function getSelectedVoucherCodeFromCart() {
  // Lấy mã voucher đã lưu trong sessionStorage khi chuyển từ Cart sang Checkout
  return sessionStorage.getItem('activeVoucher') || 'SALE10';
}

function calculateCartTotals(cart, currentVoucher) {
  let subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  let discount = 0;
  let discountLabel = 'Không áp dụng';
  let shippingFee = DEFAULT_SHIPPING_FEE;

  // Xử lý Voucher
  if (currentVoucher === 'SALE10') {
    discount = Math.min(subtotal * 0.1, 70000);
    discountLabel = 'SALE10 (10%)';
  } else if (currentVoucher === 'GIAM50K' && subtotal >= 300000) {
    discount = 50000;
    discountLabel = 'GIAM50K';
  } else if (currentVoucher === 'FREESHIP') {
    shippingFee = 0;
    discountLabel = 'FREESHIP';
  } else if (currentVoucher === 'WELCOME') {
    discount = Math.min(subtotal * 0.15, 100000);
    discountLabel = 'WELCOME (15%)';
  } else if (currentVoucher === 'HAPPYDAY' && subtotal >= 500000) {
    discount = 30000;
    discountLabel = 'HAPPYDAY';
  } else {
    shippingFee = DEFAULT_SHIPPING_FEE;
  }

  const finalTotal = subtotal - discount + shippingFee;

  return {
    subtotal,
    discount,
    finalTotal,
    shippingFee,
    discountLabel,
    itemCount: cart.reduce((acc, item) => acc + item.quantity, 0),
  };
}

// ==========================================================
// 3. LOGIC TRANG SẢN PHẨM (PRODUCTS.HTML)
// (Giữ nguyên phần này)
// ==========================================================

// ... (renderProducts, addToCart giữ nguyên) ...

// ==========================================================
// 4. LOGIC TRANG GIỎ HÀNG (CART.HTML)
// ==========================================================

function renderCart() {
  const cart = getCart();
  const listElement = document.getElementById('cart-items-list');
  const voucherListEl = document.querySelector('.voucher-list');
  if (!listElement || !voucherListEl) return;

  // --- Render VOUCHER ---
  const activeVoucher = getSelectedVoucherCodeFromCart();

  voucherListEl.innerHTML = VOUCHER_DATA.map(
    (v) => `
        <div class="voucher-item ${
          v.code === activeVoucher ? 'active' : ''
        }" data-code="${v.code}" onclick="selectVoucher(this)">
            <div>
                <strong>${v.code}</strong><br>
                <span>${v.desc}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-color); display: ${
              v.code === activeVoucher ? 'block' : 'none'
            };"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
    `
  ).join('');

  // --- Render SẢN PHẨM ---
  listElement.innerHTML = '';
  const goToCheckoutBtn = document.getElementById('go-to-checkout-btn');

  if (cart.length === 0) {
    listElement.innerHTML = `<p style="text-align: center; color: #7f8c8d; padding: 30px;">Giỏ hàng của bạn hiện đang trống.</p>`;
    if (goToCheckoutBtn) goToCheckoutBtn.style.pointerEvents = 'none';
    if (goToCheckoutBtn) goToCheckoutBtn.style.opacity = '0.5';
  } else {
    if (goToCheckoutBtn) goToCheckoutBtn.style.pointerEvents = 'auto';
    if (goToCheckoutBtn) goToCheckoutBtn.style.opacity = '1';

    cart.forEach((item) => {
      const html = `
                <div class="cart-item" data-id="${item.id}">
                    <div class="item-info">
                        <div class="item-img-placeholder">${item.img}</div>
                        <div class="item-details">
                            <strong>${item.name}</strong>
                            <p>${item.options}</p>
                        </div>
                    </div>
                    <div class="quantity-control">
                        <button onclick="updateQuantity('${
                          item.id
                        }', -1)">-</button>
                        <input type="number" value="${
                          item.quantity
                        }" min="1" readonly id="qty-${item.id}">
                        <button onclick="updateQuantity('${
                          item.id
                        }', 1)">+</button>
                    </div>
                    <span class="item-subtotal" id="subtotal-${
                      item.id
                    }">${formatCurrency(item.price * item.quantity)}</span>
                    <button class="delete-btn" onclick="removeItem('${
                      item.id
                    }')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            `;
      listElement.insertAdjacentHTML('beforeend', html);
    });
  }

  updateCartTotals();
}

function selectVoucher(element) {
  const allVouchers = document.querySelectorAll('.voucher-item');
  allVouchers.forEach((el) => {
    el.classList.remove('active');
    el.querySelector('svg').style.display = 'none';
  });

  element.classList.add('active');
  element.querySelector('svg').style.display = 'block';

  // Lưu voucher đã chọn vào sessionStorage để dùng ở trang checkout
  sessionStorage.setItem('activeVoucher', element.dataset.code);

  updateCartTotals();
}

function updateCartTotals() {
  const voucher = getActiveVoucher();
  const cart = getCart();
  const totals = calculateCartTotals(cart, voucher);

  // Cập nhật giao diện Cart
  const subtotalEl = document.getElementById('subtotal');
  const grandTotalEl = document.getElementById('grand-total');
  const itemCountEl = document.getElementById('item-count');

  if (subtotalEl) subtotalEl.textContent = formatCurrency(totals.subtotal);
  if (itemCountEl) itemCountEl.textContent = totals.itemCount;
  // Tổng thanh toán (đã bao gồm phí ship và giảm giá)
  if (grandTotalEl)
    grandTotalEl.textContent = formatCurrency(totals.finalTotal);
}

// ==========================================================
// 5. LOGIC TRANG THANH TOÁN (CHECKOUT.HTML)
// ==========================================================

// ... (renderAddressSelector, loadSelectedAddress giữ nguyên) ...

function renderCheckoutSummary() {
  // Lấy voucher đã chọn từ trang cart (hoặc mặc định là SALE10)
  const activeVoucherCode = getSelectedVoucherCodeFromCart();

  const cart = getCart();
  const totals = calculateCartTotals(cart, activeVoucherCode);

  // Render chi tiết sản phẩm
  const summaryItemsEl = document.getElementById('order-summary-items');
  if (summaryItemsEl) {
    summaryItemsEl.innerHTML = cart
      .map(
        (item) => `
            <div class="order-item-summary">
                <span>${item.name} (x${item.quantity})</span>
                <span>${formatCurrency(item.price * item.quantity)}</span>
            </div>
        `
      )
      .join('');
  }

  // Cập nhật tổng kết
  document.getElementById('checkout-subtotal').textContent = formatCurrency(
    totals.subtotal
  );
  document.getElementById('shipping-fee').textContent = formatCurrency(
    totals.shippingFee
  );
  document.getElementById('checkout-discount').textContent =
    '-' + formatCurrency(totals.discount);
  document.getElementById('discount-code-label').textContent =
    totals.discountLabel;
  document.getElementById('checkout-grand-total').textContent = formatCurrency(
    totals.finalTotal
  );

  return totals;
}

function placeOrder() {
  const fullName = document.getElementById('full-name').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address-detail').value;
  const cart = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_CART) || '[]');

  if (!fullName || !phone || !address) {
    alert('Vui lòng điền đầy đủ Tên, Điện thoại và Địa chỉ chi tiết.');
    return;
  }
  if (cart.length === 0) {
    alert('Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi đặt hàng.');
    window.location.href = 'products.html';
    return;
  }

  const paymentMethodEl = document.getElementById('payment-method');
  const paymentMethod =
    paymentMethodEl.options[paymentMethodEl.selectedIndex].text;
  const note = document.getElementById('note').value;
  const activeVoucherCode = getSelectedVoucherCodeFromCart();

  const orderTotals = calculateCartTotals(cart, activeVoucherCode);

  // Tạo thông tin đơn hàng
  const orderDetails = {
    orderId: 'ORD-' + Date.now().toString().slice(-8),
    orderDate: new Date().toLocaleDateString('vi-VN'),
    shippingInfo: { fullName, phone, address, note },
    cartDetails: cart,
    paymentMethod: paymentMethod,
    voucherUsed: activeVoucherCode,
    ...orderTotals,
  };

  // 1. Lưu thông tin đơn hàng vào Local Storage
  localStorage.setItem(
    LOCAL_STORAGE_KEY_LAST_ORDER,
    JSON.stringify(orderDetails)
  );

  // 2. Xóa giỏ hàng
  saveCart([]);
  sessionStorage.removeItem('activeVoucher'); // Xóa voucher đã chọn

  // 3. Chuyển hướng tới trang chi tiết đơn hàng
  window.location.href = 'view-order.html';
}

// ==========================================================
// 6. LOGIC TRANG CHI TIẾT ĐƠN HÀNG (VIEW-ORDER.HTML)
// ==========================================================

function renderOrderDetails() {
  const order = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_LAST_ORDER));
  const displayEl = document.getElementById('order-details-display');

  if (!displayEl) return;

  if (!order) {
    displayEl.innerHTML = `<p style="text-align: center; color: var(--red-sale); font-weight: bold;">Không tìm thấy thông tin đơn hàng gần nhất.</p>`;
    return;
  }

  displayEl.innerHTML = `
        <div class="order-summary-box">
            <p><strong>Mã đơn hàng:</strong> <span class="order-id-label">${
              order.orderId
            }</span></p>
            <p><strong>Ngày đặt hàng:</strong> <span>${
              order.orderDate
            }</span></p>
        </div>
        
        <h3>🚚 Thông tin giao hàng</h3>
        <div class="info-group">
            <p><strong>Tên người nhận:</strong> ${
              order.shippingInfo.fullName
            }</p>
            <p><strong>Điện thoại:</strong> ${order.shippingInfo.phone}</p>
            <p><strong>Địa chỉ:</strong> ${order.shippingInfo.address}</p>
            <p><strong>Ghi chú:</strong> ${
              order.shippingInfo.note || 'Không có'
            }</p>
        </div>

        <h3>📦 Chi tiết sản phẩm</h3>
        ${order.cartDetails
          .map(
            (item) => `
            <div class="order-item-summary">
                <span>${item.name} (x${item.quantity})</span>
                <span>${formatCurrency(item.price * item.quantity)}</span>
            </div>
        `
          )
          .join('')}

        <h3>💰 Thanh toán</h3>
        <div class="info-group payment-summary">
            <p><strong>Tạm tính:</strong> <span>${formatCurrency(
              order.subtotal
            )}</span></p>
            <p><strong>Phí giao hàng:</strong> <span>+ ${formatCurrency(
              order.shippingFee
            )}</span></p>
            <p><strong>Giảm giá (${
              order.discountLabel
            }):</strong> <span>- ${formatCurrency(order.discount)}</span></p>
            <p><strong>Phương thức:</strong> <span>${
              order.paymentMethod
            }</span></p>
            <div class="final-total-line">
                <strong>Tổng giá trị đơn hàng:</strong> 
                <strong class="total-price">${formatCurrency(
                  order.finalTotal
                )}</strong>
            </div>
        </div>
    `;
}

// ==========================================================
// 7. KHỞI TẠO (LOAD DỮ LIỆU)
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.includes('products.html')) {
    renderProducts();
  } else if (path.includes('checkout.html')) {
    getCart();
    renderAddressSelector();
    renderCheckoutSummary();
  } else if (path.includes('cart.html')) {
    getCart();
    renderCart();
  } else if (path.includes('view-order.html')) {
    renderOrderDetails();
  }
  updateGlobalCartCount();
});
