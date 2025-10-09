// const arr cho mảng địa chỉ giao hàng (DỮ LIỆU MẪU)
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

const LOCAL_STORAGE_KEY = 'ecomCart';
const DEFAULT_SHIPPING_FEE = 20000; // Phí vận chuyển mặc định 20.000₫

// --- DỮ LIỆU MẪU: Giả lập dữ liệu sản phẩm trong Giỏ hàng ---
function getInitialCart() {
  return [
    {
      id: 'SP1',
      name: 'Áo Thun Polo Classic',
      options: 'Màu: Đen, Size: L',
      price: 250000,
      quantity: 1,
      img: 'SP1',
    },
    {
      id: 'SP2',
      name: "Sách 'Kỹ Thuật Sống'",
      options: 'Tác giả: Adam Khoo',
      price: 120000,
      quantity: 2,
      img: 'SP2',
    },
    {
      id: 'SP3',
      name: 'Nước hoa X',
      options: 'Size: 50ml',
      price: 800000,
      quantity: 1,
      img: 'SP3',
    },
  ];
}

// --- Hàm chung: Local Storage (Giữ nguyên) ---
function getCart() {
  const cart = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!cart) {
    const initialCart = getInitialCart();
    saveCart(initialCart);
    return initialCart;
  }
  return JSON.parse(cart);
}

function saveCart(cart) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
}

// Lấy voucher đang active (mặc định SALE10)
function getActiveVoucher() {
  return (
    document.querySelector('.voucher-item.active')?.dataset.code || 'SALE10'
  );
}

// --- Logic Tính toán (Chung cho Cart và Checkout) ---
function calculateCartTotals(cart, currentVoucher = 'SALE10') {
  let subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  let discount = 0;
  let discountLabel = currentVoucher;
  let shippingFee = DEFAULT_SHIPPING_FEE;

  // Xử lý Voucher (Logic Nghiệp vụ)
  if (currentVoucher === 'SALE10') {
    discount = Math.min(subtotal * 0.1, 70000);
  } else if (currentVoucher === 'GIAM50K' && subtotal >= 300000) {
    discount = 50000;
  } else if (currentVoucher === 'FREESHIP') {
    shippingFee = 0; // Miễn phí vận chuyển
  } else if (currentVoucher === 'WELCOME') {
    discount = subtotal * 0.15;
  } else if (currentVoucher === 'HAPPYDAY' && subtotal >= 500000) {
    discount = 30000;
  } else if (currentVoucher === 'EXTRA10') {
    discount = 10000;
  } else {
    discountLabel = 'Không áp dụng';
  }

  const grandTotalBeforeShipping = subtotal - discount;
  const finalTotal = grandTotalBeforeShipping + shippingFee;

  return {
    subtotal,
    discount,
    finalTotal,
    shippingFee,
    discountLabel,
    itemCount: cart.reduce((acc, item) => acc + item.quantity, 0),
  };
}

// --- Cart Page Logic ---
function renderCart() {
  const cart = getCart();
  const listElement = document.getElementById('cart-items-list');
  if (!listElement) return;

  listElement.innerHTML = '';
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
                <div class="item-actions">
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
                    <span class="item-subtotal" id="subtotal-${item.id}">${(
      item.price * item.quantity
    ).toLocaleString('vi-VN')}₫</span>
                    <button class="delete-btn" onclick="removeItem('${
                      item.id
                    }')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
        `;
    listElement.insertAdjacentHTML('beforeend', html);
  });

  updateCartTotals();
}

function updateQuantity(itemId, delta) {
  let cart = getCart();
  const itemIndex = cart.findIndex((item) => item.id === itemId);

  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity < 1) {
      cart[itemIndex].quantity = 1;
    }
    saveCart(cart);

    const newQty = cart[itemIndex].quantity;
    const newSubtotal = cart[itemIndex].price * newQty;
    document.getElementById(`qty-${itemId}`).value = newQty;
    document.getElementById(`subtotal-${itemId}`).textContent =
      newSubtotal.toLocaleString('vi-VN') + '₫';

    updateCartTotals();
  }
}

function removeItem(itemId) {
  if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) return;
  let cart = getCart().filter((item) => item.id !== itemId);
  saveCart(cart);
  renderCart();
}

function updateCartTotals() {
  const voucher = getActiveVoucher();
  const cart = getCart();
  const totals = calculateCartTotals(cart, voucher);

  // Cập nhật giao diện Cart
  const subtotalEl = document.getElementById('subtotal');
  const grandTotalEl = document.getElementById('grand-total');
  const itemCountEl = document.getElementById('item-count');

  if (subtotalEl)
    subtotalEl.textContent = totals.subtotal.toLocaleString('vi-VN') + '₫';
  if (itemCountEl) itemCountEl.textContent = totals.itemCount;
  // Tổng thanh toán bao gồm phí ship và giảm giá
  if (grandTotalEl)
    grandTotalEl.textContent = totals.finalTotal.toLocaleString('vi-VN') + '₫';
}

// --- Checkout Page Logic ---

function renderAddressSelector() {
  const selector = document.getElementById('address-selector');
  if (!selector) return;

  selector.innerHTML = '';

  // Thêm tùy chọn địa chỉ mới
  const newAddrOption = new Option('Thêm địa chỉ mới...', 'new-address');
  selector.add(newAddrOption);

  // Thêm các địa chỉ đã lưu (DỮ LIỆU MẪU ĐÃ CÓ)
  SAVED_ADDRESSES.forEach((addr, index) => {
    const option = new Option(`${addr.name} - ${addr.address}`, index);
    selector.add(option);
  });

  // Mặc định chọn địa chỉ đầu tiên đã lưu
  if (SAVED_ADDRESSES.length > 0) {
    selector.value = 0;
  } else {
    selector.value = 'new-address';
  }
  loadSelectedAddress();
}

function loadSelectedAddress() {
  const index = document.getElementById('address-selector').value;

  const fullNameEl = document.getElementById('full-name');
  const phoneEl = document.getElementById('phone');
  const addressDetailEl = document.getElementById('address-detail');

  if (index === 'new-address') {
    fullNameEl.value = '';
    phoneEl.value = '';
    addressDetailEl.value = '';
    fullNameEl.focus();
    return;
  }

  const addr = SAVED_ADDRESSES[parseInt(index)];
  fullNameEl.value = addr.name;
  phoneEl.value = addr.phone;
  addressDetailEl.value = addr.address;
}

function renderCheckoutSummary() {
  // Giả định voucher đang áp dụng là SALE10 cho trang Checkout
  // (Trong ứng dụng thực tế, giá trị này sẽ được truyền từ trang Cart)
  const activeVoucherCode = 'SALE10';

  const cart = getCart();
  const totals = calculateCartTotals(cart, activeVoucherCode);

  // Render chi tiết sản phẩm
  const summaryItemsEl = document.getElementById('order-summary-items');
  if (summaryItemsEl) {
    summaryItemsEl.innerHTML = cart
      .map(
        (item) => `
            <div class="order-item-summary">
                <span>${item.name} (${item.options.replace(/, /g, ', ')}, x${
          item.quantity
        })</span>
                <span>${(item.price * item.quantity).toLocaleString(
                  'vi-VN'
                )}₫</span>
            </div>
        `
      )
      .join('');
  }

  // Cập nhật tổng kết
  document.getElementById('checkout-subtotal').textContent =
    totals.subtotal.toLocaleString('vi-VN') + '₫';
  document.getElementById('shipping-fee').textContent =
    totals.shippingFee.toLocaleString('vi-VN') + '₫';
  document.getElementById('checkout-discount').textContent =
    '-' + totals.discount.toLocaleString('vi-VN') + '₫';
  document.getElementById('discount-code-label').textContent =
    totals.discountLabel;
  document.getElementById('checkout-grand-total').textContent =
    totals.finalTotal.toLocaleString('vi-VN') + '₫';

  return totals;
}

// --- Logic Đặt hàng (Hiển thị Modal) ---
function placeOrder() {
  // 1. Lấy thông tin & Validation
  const fullName = document.getElementById('full-name').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address-detail').value;

  if (!fullName || !phone || !address) {
    alert('Vui lòng điền đầy đủ Tên, Điện thoại và Địa chỉ chi tiết.');
    return;
  }

  const paymentMethodEl = document.getElementById('payment-method');
  const paymentMethod =
    paymentMethodEl.options[paymentMethodEl.selectedIndex].text;
  const note = document.getElementById('note').value;

  // 2. Tính toán tổng kết
  const orderTotals = renderCheckoutSummary();

  // 3. Tạo thông tin đơn hàng cụ thể và hiển thị modal
  const orderDetails = {
    orderId: 'ORD-' + Date.now().toString().slice(-8),
    orderDate: new Date().toLocaleDateString('vi-VN'),
    shippingInfo: { fullName, phone, address, note },
    cartDetails: getCart(),
    paymentMethod: paymentMethod,
    ...orderTotals,
  };

  const modalContent = document.getElementById('order-details-display');
  modalContent.innerHTML = `
        <div class="order-summary-box">
            <p><strong>Mã đơn hàng:</strong> <span>${
              orderDetails.orderId
            }</span></p>
            <p><strong>Ngày đặt hàng:</strong> <span>${
              orderDetails.orderDate
            }</span></p>
        </div>
        
        <h3>🚚 Thông tin giao hàng</h3>
        <div class="info-group">
            <p><strong>Tên người nhận:</strong> ${
              orderDetails.shippingInfo.fullName
            }</p>
            <p><strong>Điện thoại:</strong> ${
              orderDetails.shippingInfo.phone
            }</p>
            <p><strong>Địa chỉ:</strong> ${
              orderDetails.shippingInfo.address
            }</p>
            <p><strong>Ghi chú:</strong> ${
              orderDetails.shippingInfo.note || 'Không có'
            }</p>
        </div>

        <h3>📦 Chi tiết đơn hàng</h3>
        ${orderDetails.cartDetails
          .map(
            (item) => `
            <div class="order-item-summary">
                <span>${item.name} (x${item.quantity})</span>
                <span>${(item.price * item.quantity).toLocaleString(
                  'vi-VN'
                )}₫</span>
            </div>
        `
          )
          .join('')}

        <h3>💰 Thanh toán</h3>
        <div class="info-group payment-summary">
            <p><strong>Tạm tính:</strong> <span>${orderDetails.subtotal.toLocaleString(
              'vi-VN'
            )}₫</span></p>
            <p><strong>Phí giao hàng:</strong> <span>+ ${orderDetails.shippingFee.toLocaleString(
              'vi-VN'
            )}₫</span></p>
            <p><strong>Giảm giá (${
              orderDetails.discountLabel
            }):</strong> <span>- ${orderDetails.discount.toLocaleString(
    'vi-VN'
  )}₫</span></p>
            <p><strong>Phương thức:</strong> <span>${paymentMethod}</span></p>
            <div class="final-total-line">
                <strong>Tổng giá trị đơn hàng:</strong> 
                <strong class="total-price">${orderDetails.finalTotal.toLocaleString(
                  'vi-VN'
                )}₫</strong>
            </div>
        </div>
    `;

  document.getElementById('order-success-modal').style.display = 'block';

  // 5. Xóa giỏ hàng và vô hiệu hóa nút
  saveCart([]);
  document.querySelector('.btn-primary').disabled = true;
}

function closeModal() {
  document.getElementById('order-success-modal').style.display = 'none';
}

// --- Khởi tạo khi trang tải ---
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('checkout-page')) {
    renderAddressSelector();
    renderCheckoutSummary();
  }
  // Logic renderCart đã được gọi trong listener ở trên (nếu không phải trang checkout)
});
