// const arr cho mảng địa chỉ giao hàng (theo yêu cầu)
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

// --- Giả lập dữ liệu sản phẩm trong Giỏ hàng ---
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
  ];
}

// --- Hàm chung: Local Storage ---
function getCart() {
  const cart = localStorage.getItem(LOCAL_STORAGE_KEY);
  // Nếu chưa có, load dữ liệu giả lập ban đầu (Chỉ chạy lần đầu)
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

// --- Logic Tính toán (Chung cho Cart và Checkout) ---
function calculateCartTotals(cart, currentVoucher = 'SALE10') {
  let subtotal = 0;
  let itemCount = 0;
  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
    itemCount += item.quantity;
  });

  // Xử lý Voucher (Giả định)
  let discount = 0;
  if (currentVoucher === 'SALE10') {
    // Giảm 10%, tối đa 70.000₫
    discount = Math.min(subtotal * 0.1, 70000);
  } else if (currentVoucher === 'GIAM50K' && subtotal >= 300000) {
    // Giảm 50.000₫ cho đơn trên 300.000₫
    discount = 50000;
  }

  const grandTotal = subtotal - discount;

  return { subtotal, discount, grandTotal, itemCount };
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
                    <span class="item-price">${item.price.toLocaleString(
                      'vi-VN'
                    )}₫</span>
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
    // Cập nhật giao diện mà không cần render lại toàn bộ (tối ưu)
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
  renderCart(); // Render lại toàn bộ để cập nhật danh sách
}

function updateCartTotals(voucher = 'SALE10') {
  const cart = getCart();
  const totals = calculateCartTotals(cart, voucher);
  const shippingFee = 20000; // Phí vận chuyển giả định
  const finalTotal = totals.grandTotal + shippingFee;

  const subtotalEl = document.getElementById('subtotal');
  const discountEl = document.getElementById('discount');
  const grandTotalEl = document.getElementById('grand-total');
  const itemCountEl = document.getElementById('item-count');
  const shippingFeeCartEl = document.getElementById('shipping-fee-cart');

  if (subtotalEl)
    subtotalEl.textContent = totals.subtotal.toLocaleString('vi-VN') + '₫';
  // if (discountEl) discountEl.textContent = '-' + totals.discount.toLocaleString('vi-VN') + '₫';
  if (grandTotalEl)
    grandTotalEl.textContent = finalTotal.toLocaleString('vi-VN') + '₫';
  if (itemCountEl) itemCountEl.textContent = totals.itemCount;
  if (shippingFeeCartEl)
    shippingFeeCartEl.textContent = shippingFee.toLocaleString('vi-VN') + '₫';
}

// --- Checkout Page Logic ---

function renderCheckoutSummary(shippingFee = 30000, voucher = 'SALE10') {
  const cart = getCart();
  const totals = calculateCartTotals(cart, voucher);

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
  const finalTotal = totals.grandTotal + shippingFee;

  const subtotalEl = document.getElementById('checkout-subtotal');
  const discountEl = document.getElementById('checkout-discount');
  const feeEl = document.getElementById('shipping-fee');
  const totalEl = document.getElementById('checkout-grand-total');

  if (subtotalEl)
    subtotalEl.textContent = totals.subtotal.toLocaleString('vi-VN') + '₫';
  if (discountEl)
    discountEl.textContent =
      '-' + totals.discount.toLocaleString('vi-VN') + '₫';
  if (feeEl) feeEl.textContent = shippingFee.toLocaleString('vi-VN') + '₫';
  if (totalEl) totalEl.textContent = finalTotal.toLocaleString('vi-VN') + '₫';

  return { ...totals, shippingFee, finalTotal };
}

// Hàm xử lý chọn tùy chọn vận chuyển
document.addEventListener('change', (e) => {
  if (e.target.name === 'shipping-type') {
    const fee = parseInt(e.target.dataset.fee);
    const labelText = e.target
      .closest('label')
      .textContent.split(':')[0]
      .trim();
    document.getElementById('shipping-label').textContent = labelText;
    renderCheckoutSummary(fee);
  }
});

// Hàm mô phỏng "Thay đổi địa chỉ" bằng cách load địa chỉ khác từ const arr
function toggleAddressForm(e) {
  e.preventDefault();
  // Giả lập logic: nếu bấm lần 1 thì load địa chỉ 2, lần 2 load địa chỉ 1...
  const currentName = document.getElementById('full-name').value;
  const nextAddress =
    SAVED_ADDRESSES.find((addr) => addr.name !== currentName) ||
    SAVED_ADDRESSES[0];

  document.getElementById('full-name').value = nextAddress.name;
  document.getElementById('phone').value = nextAddress.phone;
  document.querySelector('.current-address-display').textContent =
    nextAddress.address;

  alert(
    `Đã thay đổi địa chỉ thành: ${nextAddress.name} - ${nextAddress.address}`
  );
}

// --- Logic Đặt hàng (Hiển thị Modal) ---
function placeOrder() {
  // 1. Lấy thông tin & Validation
  const fullName = document.getElementById('full-name').value;
  const phone = document.getElementById('phone').value;
  const address = document
    .querySelector('.current-address-display')
    .textContent.trim();
  const note = document.getElementById('note').value;

  if (!fullName || !phone || !address) {
    alert('Vui lòng điền đầy đủ Tên, Điện thoại và Địa chỉ.');
    return;
  }

  const paymentMethodEl = document.getElementById('payment-method');
  const paymentMethod =
    paymentMethodEl.options[paymentMethodEl.selectedIndex].text;
  const shippingRadio = document.querySelector(
    'input[name="shipping-type"]:checked'
  );
  const shippingFee = parseInt(shippingRadio.dataset.fee);

  // 2. Tính toán tổng kết
  const orderTotals = renderCheckoutSummary(shippingFee);

  // 3. Tạo thông tin đơn hàng cụ thể
  const orderDetails = {
    orderId: 'ORD-' + Date.now().toString().slice(-8),
    orderDate: new Date().toLocaleDateString('vi-VN'),
    shippingInfo: { fullName, phone, address, note },
    cartDetails: getCart(),
    paymentMethod: paymentMethod,
    ...orderTotals,
  };

  // 4. Hiển thị modal (sử dụng HTML rendering chi tiết như đã mô tả)
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
                <span>${item.name} (${item.options.replace(/, /g, ', ')}, x${
              item.quantity
            })</span>
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
            <p><strong>Giảm giá:</strong> <span>- ${orderDetails.discount.toLocaleString(
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

  // 5. Xóa giỏ hàng sau khi đặt thành công (Nghiệp vụ quan trọng)
  saveCart([]);
}

function closeModal() {
  document.getElementById('order-success-modal').style.display = 'none';
}

// --- Khởi tạo khi trang tải ---
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('checkout-page')) {
    renderCheckoutSummary(30000); // Mặc định phí ship 30.000₫
  } else {
    renderCart();
  }
});
