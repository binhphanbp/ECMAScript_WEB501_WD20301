// const arr cho mảng địa chỉ giao hàng
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

// --- Logic Tính toán (Chung cho Cart và Checkout) ---
function calculateCartTotals(cart, currentVoucher = 'SALE10') {
  let subtotal = 0;
  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  let discount = 0;
  if (currentVoucher === 'SALE10') {
    discount = Math.min(subtotal * 0.1, 70000);
  } else if (currentVoucher === 'GIAM50K' && subtotal >= 300000) {
    discount = 50000;
  }
  // Thêm logic giảm giá khác nếu cần...

  const grandTotalBeforeShipping = subtotal - discount;
  // Phí vận chuyển được tính ở bước cuối cùng
  const finalTotal = grandTotalBeforeShipping + DEFAULT_SHIPPING_FEE;

  return {
    subtotal,
    discount,
    finalTotal,
    grandTotalBeforeShipping,
    itemCount: cart.reduce((acc, item) => acc + item.quantity, 0),
  };
}

// --- Cart Page Logic ---
// ... (Hàm renderCart, updateQuantity, removeItem giữ nguyên) ...

function updateCartTotals(voucher = 'SALE10') {
  const cart = getCart();
  const totals = calculateCartTotals(cart, voucher);

  // Cập nhật giao diện Cart
  const subtotalEl = document.getElementById('subtotal');
  const grandTotalEl = document.getElementById('grand-total');
  const shippingFeeCartEl = document.getElementById('shipping-fee-cart');

  if (subtotalEl)
    subtotalEl.textContent = totals.subtotal.toLocaleString('vi-VN') + '₫';
  if (shippingFeeCartEl)
    shippingFeeCartEl.textContent =
      DEFAULT_SHIPPING_FEE.toLocaleString('vi-VN') + '₫';

  // Tổng đơn hàng = (Tạm tính - Giảm giá) + Phí ship
  if (grandTotalEl)
    grandTotalEl.textContent = totals.finalTotal.toLocaleString('vi-VN') + '₫';
}
// Thêm event listener cho Voucher
document.querySelectorAll('.voucher-item').forEach((item) => {
  item.addEventListener('click', function () {
    document
      .querySelectorAll('.voucher-item')
      .forEach((i) => i.classList.remove('active'));
    this.classList.add('active');
    updateCartTotals(this.dataset.code);
  });
});

// --- Checkout Page Logic (Chỉnh sửa lớn) ---

function renderAddressSelector() {
  const selector = document.getElementById('address-selector');
  if (!selector) return;

  selector.innerHTML = ''; // Clear options

  // Thêm tùy chọn "Thêm địa chỉ mới" lên đầu
  const newAddrOption = new Option('Thêm địa chỉ mới...', 'new-address');
  selector.add(newAddrOption);

  // Thêm các địa chỉ đã lưu
  SAVED_ADDRESSES.forEach((addr, index) => {
    const option = new Option(`${addr.name} - ${addr.address}`, index);
    selector.add(option);
  });

  // Mặc định chọn địa chỉ đầu tiên đã lưu
  selector.value = 0;
  loadSelectedAddress();
}

function loadSelectedAddress() {
  const index = document.getElementById('address-selector').value;
  const inputFields = document.getElementById('address-input-fields');

  // Nếu chọn "Thêm địa chỉ mới"
  if (index === 'new-address') {
    inputFields.style.display = 'block';
    document.getElementById('full-name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('address-detail').value = '';
    return;
  }

  // Nếu chọn địa chỉ đã lưu
  inputFields.style.display = 'block'; // Luôn hiển thị để chỉnh sửa
  const addr = SAVED_ADDRESSES[parseInt(index)];
  document.getElementById('full-name').value = addr.name;
  document.getElementById('phone').value = addr.phone;
  document.getElementById('address-detail').value = addr.address;
}

function renderCheckoutSummary(voucher = 'SALE10') {
  const cart = getCart();
  const totals = calculateCartTotals(cart, voucher);

  // Lấy mã giảm giá đang áp dụng (hoặc mặc định)
  const discountCode =
    document.querySelector('.voucher-item.active')?.dataset.code || 'SALE10';

  // Render chi tiết sản phẩm
  // ... (logic render order-summary-items giữ nguyên) ...

  // Cập nhật tổng kết
  document.getElementById('checkout-subtotal').textContent =
    totals.subtotal.toLocaleString('vi-VN') + '₫';
  document.getElementById('shipping-fee').textContent =
    DEFAULT_SHIPPING_FEE.toLocaleString('vi-VN') + '₫';
  document.getElementById('checkout-discount').textContent =
    '-' + totals.discount.toLocaleString('vi-VN') + '₫';
  document.getElementById('discount-code-label').textContent = discountCode;

  document.getElementById('checkout-grand-total').textContent =
    totals.finalTotal.toLocaleString('vi-VN') + '₫';

  return { ...totals, shippingFee: DEFAULT_SHIPPING_FEE };
}

// --- Logic Đặt hàng (Hiển thị Modal) ---
function placeOrder() {
  // 1. Lấy thông tin & Validation
  const fullName = document.getElementById('full-name').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address-detail').value;
  const note = document.getElementById('note').value;

  if (!fullName || !phone || !address) {
    alert('Vui lòng điền đầy đủ Tên, Điện thoại và Địa chỉ chi tiết.');
    return;
  }

  const paymentMethodEl = document.getElementById('payment-method');
  const paymentMethod =
    paymentMethodEl.options[paymentMethodEl.selectedIndex].text;

  // 2. Tính toán tổng kết (Giả sử áp dụng mã SALE10)
  const orderTotals = renderCheckoutSummary('SALE10');

  // 3. Tạo thông tin đơn hàng cụ thể
  // ... (Giữ nguyên cấu trúc orderDetails) ...
  // Note: orderTotals đã bao gồm finalTotal.

  // 4. Hiển thị modal (Cập nhật totalAmount và shippingFee)
  // ... (logic hiển thị modal giữ nguyên, sử dụng DEFAULT_SHIPPING_FEE) ...

  document.getElementById('order-success-modal').style.display = 'block';
  saveCart([]);
  document.querySelector('.btn-primary').disabled = true;
}

// --- Khởi tạo khi trang tải ---
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('checkout-page')) {
    renderAddressSelector();
    renderCheckoutSummary('SALE10'); // Mặc định áp dụng SALE10
  } else {
    renderCart();
  }
});
