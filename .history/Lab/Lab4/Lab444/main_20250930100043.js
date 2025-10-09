// ==========================================================
// 1. DATA CỐ ĐỊNH (SẢN PHẨM & ĐỊA CHỈ & HẰNG SỐ)
// ==========================================================

const LOCAL_STORAGE_KEY = 'ecomCart';
const DEFAULT_SHIPPING_FEE = 20000;

// DỮ LIỆU MẪU SẢN PHẨM (cho products.html)
const PRODUCTS_DATA = [
  {
    id: 'PROD1',
    name: 'Áo Polo Basic',
    price: 350000,
    img: 'PO1',
    options: 'Màu Đen, Size L',
  },
  {
    id: 'PROD2',
    name: "Sách 'Sức Mạnh Ngầm'",
    price: 150000,
    img: 'SC2',
    options: 'Tác giả: Tonyman',
  },
  {
    id: 'PROD3',
    name: 'Nước Hoa Thể Thao 50ml',
    price: 890000,
    img: 'NF3',
    options: 'Size 50ml',
  },
  {
    id: 'PROD4',
    name: 'Bàn phím cơ X90',
    price: 1800000,
    img: 'BP4',
    options: 'Màu Trắng, Switch Brown',
  },
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

// Giỏ hàng MẪU BAN ĐẦU
function getInitialCart() {
  return [
    {
      id: 'PROD1',
      name: 'Áo Polo Basic',
      options: 'Màu Đen, Size L',
      price: 350000,
      quantity: 1,
      img: 'PO1',
    },
    {
      id: 'PROD2',
      name: "Sách 'Sức Mạnh Ngầm'",
      options: 'Tác giả: Tonyman',
      price: 150000,
      quantity: 2,
      img: 'SC2',
    },
  ];
}

// ==========================================================
// 2. CHỨC NĂNG CHUNG (STORAGE & TÍNH TOÁN)
// ==========================================================

// Lấy Giỏ hàng từ Local Storage. Nếu trống, khởi tạo giỏ hàng mẫu
function getCart() {
  let cart = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!cart) {
    const initialCart = getInitialCart();
    saveCart(initialCart);
    return initialCart;
  }
  cart = JSON.parse(cart);

  // Nếu Local Storage có key nhưng mảng rỗng (sau khi đặt hàng), trả về giỏ hàng mẫu để hiển thị
  if (cart.length === 0 && window.location.pathname.includes('cart.html')) {
    const initialCart = getInitialCart();
    saveCart(initialCart);
    return initialCart;
  }

  return cart;
}

function saveCart(cart) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
  // Cập nhật số lượng giỏ hàng trên mọi trang
  updateGlobalCartCount();
}

function getActiveVoucher() {
  return (
    document.querySelector('.voucher-item.active')?.dataset.code || 'SALE10'
  );
}

function updateGlobalCartCount() {
  const cart = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  const countElements = document.querySelectorAll('#global-cart-count');
  countElements.forEach((el) => (el.textContent = count));
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
    discountLabel = 'SALE10';
  } else if (currentVoucher === 'GIAM50K' && subtotal >= 300000) {
    discount = 50000;
    discountLabel = 'GIAM50K';
  } else if (currentVoucher === 'FREESHIP') {
    shippingFee = 0; // Miễn phí vận chuyển
    discountLabel = 'FREESHIP';
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

// Hàm format tiền
function formatCurrency(amount) {
  return amount.toLocaleString('vi-VN') + '₫';
}

// ==========================================================
// 3. LOGIC TRANG SẢN PHẨM (PRODUCTS.HTML)
// ==========================================================

function renderProducts() {
  const gridEl = document.getElementById('products-grid');
  if (!gridEl) return;

  gridEl.innerHTML = PRODUCTS_DATA.map(
    (item) => `
        <div class="product-card">
            <div class="product-image">${item.img} (Hình ảnh)</div>
            <div class="product-title">${item.name}</div>
            <p style="font-size: 0.9rem; margin-bottom: 5px;">${
              item.options.split(',')[0]
            }</p>
            <div class="product-price">${formatCurrency(item.price)}</div>
            <button class="btn btn-primary" onclick="addToCart('${item.id}', '${
      item.name
    }', ${item.price}, '${item.options}', '${item.img}')">
                Thêm vào Giỏ
            </button>
        </div>
    `
  ).join('');

  updateGlobalCartCount();
}

function addToCart(id, name, price, options, img) {
  let cart = getCart();
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, name, price, options, img, quantity: 1 });
  }

  saveCart(cart);
  alert(`Đã thêm 1 x ${name} vào giỏ hàng!`);
}

// ==========================================================
// 4. LOGIC TRANG GIỎ HÀNG (CART.HTML)
// ==========================================================

function renderCart() {
  const cart = getCart();
  const listElement = document.getElementById('cart-items-list');
  if (!listElement) return;

  listElement.innerHTML = '';

  if (cart.length === 0) {
    listElement.innerHTML = `<p style="text-align: center; color: #7f8c8d; padding: 30px;">Giỏ hàng của bạn hiện đang trống.</p>`;
    document.getElementById('go-to-checkout-btn').style.pointerEvents = 'none';
    document.getElementById('go-to-checkout-btn').style.opacity = '0.5';
  } else {
    document.getElementById('go-to-checkout-btn').style.pointerEvents = 'auto';
    document.getElementById('go-to-checkout-btn').style.opacity = '1';

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
                        <span class="item-subtotal" id="subtotal-${
                          item.id
                        }">${formatCurrency(item.price * item.quantity)}</span>
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
  }

  updateCartTotals();
}

function updateQuantity(itemId, delta) {
  let cart = getCart();
  const itemIndex = cart.findIndex((item) => item.id === itemId);

  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity < 1) {
      // Xóa sản phẩm nếu số lượng về 0
      removeItem(itemId);
      return;
    }
    saveCart(cart);

    const newQty = cart[itemIndex].quantity;
    const newSubtotal = cart[itemIndex].price * newQty;
    document.getElementById(`qty-${itemId}`).value = newQty;
    document.getElementById(`subtotal-${itemId}`).textContent =
      formatCurrency(newSubtotal);

    updateCartTotals();
  }
}

function removeItem(itemId) {
  if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) return;
  let cart = getCart().filter((item) => item.id !== itemId);
  saveCart(cart);
  renderCart();
}

function selectVoucher(element) {
  document
    .querySelectorAll('.voucher-item')
    .forEach((el) => el.classList.remove('active'));
  element.classList.add('active');
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
  // Tổng thanh toán (đã bao gồm phí ship)
  if (grandTotalEl)
    grandTotalEl.textContent = formatCurrency(totals.finalTotal);
}

// ==========================================================
// 5. LOGIC TRANG THANH TOÁN (CHECKOUT.HTML)
// ==========================================================

function renderAddressSelector() {
  const selector = document.getElementById('address-selector');
  if (!selector) return;

  selector.innerHTML = '';

  // 1. Thêm tùy chọn địa chỉ mới
  const newAddrOption = new Option('Thêm địa chỉ mới...', 'new-address');
  selector.add(newAddrOption);

  // 2. Thêm các địa chỉ đã lưu (DỮ LIỆU MẪU)
  SAVED_ADDRESSES.forEach((addr, index) => {
    const option = new Option(
      `${addr.name} - ${addr.address.split(',')[0]}...`,
      index
    );
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
  // Giả sử lấy voucher active từ trang Giỏ hàng (dữ liệu mẫu: SALE10)
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
  // 1. Validation
  const fullName = document.getElementById('full-name').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address-detail').value;

  if (!fullName || !phone || !address) {
    alert('Vui lòng điền đầy đủ Tên, Điện thoại và Địa chỉ chi tiết.');
    return;
  }

  const cart = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  if (cart.length === 0) {
    alert('Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi đặt hàng.');
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
    cartDetails: cart,
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
                <span>${formatCurrency(item.price * item.quantity)}</span>
            </div>
        `
          )
          .join('')}

        <h3>💰 Thanh toán</h3>
        <div class="info-group payment-summary">
            <p><strong>Tạm tính:</strong> <span>${formatCurrency(
              orderDetails.subtotal
            )}</span></p>
            <p><strong>Phí giao hàng:</strong> <span>+ ${formatCurrency(
              orderDetails.shippingFee
            )}</span></p>
            <p><strong>Giảm giá (${
              orderDetails.discountLabel
            }):</strong> <span>- ${formatCurrency(
    orderDetails.discount
  )}</span></p>
            <p><strong>Phương thức:</strong> <span>${paymentMethod}</span></p>
            <div class="final-total-line">
                <strong>Tổng giá trị đơn hàng:</strong> 
                <strong class="total-price">${formatCurrency(
                  orderDetails.finalTotal
                )}</strong>
            </div>
        </div>
    `;

  document.getElementById('order-success-modal').style.display = 'block';

  // 4. Xóa giỏ hàng và vô hiệu hóa nút
  saveCart([]); // Xóa giỏ hàng
  document.querySelector('.btn-primary').disabled = true;
}

function closeModal() {
  document.getElementById('order-success-modal').style.display = 'none';
  // Sau khi đóng modal, chuyển hướng về trang sản phẩm
  window.location.href = 'products.html';
}

// ==========================================================
// 6. KHỞI TẠO (LOAD DỮ LIỆU)
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  // Sử dụng window.location.pathname để xác định trang
  const path = window.location.pathname;

  if (path.includes('products.html')) {
    renderProducts();
  } else if (path.includes('checkout.html')) {
    // Đảm bảo có dữ liệu giỏ hàng để tính tổng
    getCart();
    renderAddressSelector();
    renderCheckoutSummary();
  } else if (path.includes('cart.html')) {
    // Đảm bảo có dữ liệu giỏ hàng để hiển thị
    getCart();
    renderCart();
  }
  // Cập nhật số lượng giỏ hàng trên mọi trang
  updateGlobalCartCount();
});
