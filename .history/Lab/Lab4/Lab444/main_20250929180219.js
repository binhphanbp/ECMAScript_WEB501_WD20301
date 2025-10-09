// main.js
// Mảng địa chỉ giao hàng
const addresses = [
  {
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    address: '123 Đường ABC, Quận 1, TP.HCM',
  },
  {
    name: 'Trần Thị B',
    phone: '0987654321',
    address: '456 Đường DEF, Quận 2, TP.HCM',
  },
  {
    name: 'Lê Văn C',
    phone: '0112233445',
    address: '789 Đường GHI, Quận 3, TP.HCM',
  },
];

// Hàm format tiền
function formatCurrency(amount) {
  return amount.toLocaleString('vi-VN') + ' VND';
}

// Hàm lấy giỏ hàng từ localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Hàm lưu giỏ hàng vào localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Hàm tính tổng tạm tính
function calculateSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

// Hàm cập nhật giỏ hàng trên cart.html
function updateCartDisplay() {
  const cartItemsDiv = document.getElementById('cart-items');
  const subtotalSpan = document.getElementById('subtotal');
  const totalSpan = document.getElementById('total');
  if (!cartItemsDiv) return;

  const cart = getCart();
  cartItemsDiv.innerHTML = '';
  cart.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cart-item');
    itemDiv.innerHTML = `
            <span>${item.name}</span>
            <span>${formatCurrency(item.price)}</span>
            <input type="number" value="${
              item.qty
            }" min="1" data-index="${index}">
            <span>${formatCurrency(item.price * item.qty)}</span>
            <button data-index="${index}">Xóa</button>
        `;
    cartItemsDiv.appendChild(itemDiv);
  });

  const subtotal = calculateSubtotal(cart);
  subtotalSpan.textContent = formatCurrency(subtotal);
  totalSpan.textContent = formatCurrency(subtotal); // Giả sử chưa có voucher

  // Event listeners
  cartItemsDiv.querySelectorAll('input').forEach((input) => {
    input.addEventListener('change', (e) => {
      const index = e.target.dataset.index;
      cart[index].qty = parseInt(e.target.value);
      saveCart(cart);
      updateCartDisplay();
    });
  });

  cartItemsDiv.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      saveCart(cart);
      updateCartDisplay();
    });
  });
}

// Hàm cập nhật tóm tắt đơn hàng trên checkout.html
function updateOrderSummary() {
  const orderSummaryDiv = document.getElementById('order-summary');
  const checkoutTotalSpan = document.getElementById('checkout-total');
  if (!orderSummaryDiv) return;

  const cart = getCart();
  orderSummaryDiv.innerHTML = '';
  cart.forEach((item) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('summary-item');
    itemDiv.innerHTML = `
            <span>${item.name} x ${item.qty}</span>
            <span>${formatCurrency(item.price * item.qty)}</span>
        `;
    orderSummaryDiv.appendChild(itemDiv);
  });

  const subtotal = calculateSubtotal(cart);
  const shipping = 50000; // Phí cố định
  const total = subtotal + shipping;
  checkoutTotalSpan.textContent = formatCurrency(total);
}

// Hàm populate select địa chỉ
function populateAddresses() {
  const select = document.getElementById('address-select');
  if (!select) return;

  addresses.forEach((addr) => {
    const option = document.createElement('option');
    option.value = JSON.stringify(addr);
    option.textContent = `${addr.name} - ${addr.address}`;
    select.appendChild(option);
  });

  select.addEventListener('change', (e) => {
    if (e.target.value) {
      const addr = JSON.parse(e.target.value);
      document.getElementById('name').value = addr.name;
      document.getElementById('phone').value = addr.phone;
      document.getElementById('address').value = addr.address;
    }
  });
}

// Hàm xử lý đặt hàng
function handlePlaceOrder() {
  const button = document.getElementById('place-order');
  if (!button) return;

  button.addEventListener('click', () => {
    const form = document.getElementById('shipping-form');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const cart = getCart();
    if (cart.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const note = document.getElementById('note').value;
    const payment = document.querySelector(
      'input[name="payment"]:checked'
    ).value;
    const orderId = 'DH' + Date.now();
    const orderDate = new Date().toLocaleString('vi-VN');
    const subtotal = calculateSubtotal(cart);
    const shipping = 50000;
    const total = subtotal + shipping;

    const confirmationDiv = document.getElementById('confirmation-details');
    confirmationDiv.innerHTML = `
            <p><strong>Mã Đơn Hàng:</strong> ${orderId}</p>
            <p><strong>Ngày Đặt Hàng:</strong> ${orderDate}</p>
            <p><strong>Thông Tin Giao Hàng:</strong> ${name}, ${phone}, ${address}</p>
            <p><strong>Ghi Chú:</strong> ${note}</p>
            <h3>Chi Tiết Đơn Hàng:</h3>
            ${cart
              .map(
                (item) =>
                  `<p>${item.name} x ${item.qty}: ${formatCurrency(
                    item.price * item.qty
                  )}</p>`
              )
              .join('')}
            <p><strong>Phí Giao Hàng:</strong> ${formatCurrency(shipping)}</p>
            <p><strong>Phương Thức Thanh Toán:</strong> ${payment}</p>
            <p><strong>Tổng Giá Trị Đơn Hàng:</strong> ${formatCurrency(
              total
            )}</p>
        `;

    document.getElementById('order-confirmation').classList.remove('hidden');
    document.querySelector('main').classList.add('hidden');

    // Xóa giỏ hàng sau khi đặt
    localStorage.removeItem('cart');
  });
}

// Hàm áp dụng voucher (giả sử, không thực tế)
function handleApplyVoucher() {
  const button = document.getElementById('apply-voucher');
  if (!button) return;

  button.addEventListener('click', () => {
    const code = document.getElementById('voucher-code').value;
    // Logic voucher giả: nếu code là 'DISCOUNT10', giảm 10%
    const cart = getCart();
    let discount = 0;
    if (code === 'DISCOUNT10') {
      discount = calculateSubtotal(cart) * 0.1;
    }
    const total = calculateSubtotal(cart) - discount;
    document.getElementById('total').textContent = formatCurrency(total);
    alert('Voucher áp dụng thành công!');
  });
}

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
  // Dữ liệu giỏ hàng mẫu nếu rỗng
  if (getCart().length === 0) {
    const sampleCart = [
      { id: 1, name: 'Sản Phẩm 1', price: 100000, qty: 2 },
      { id: 2, name: 'Sản Phẩm 2', price: 150000, qty: 1 },
    ];
    saveCart(sampleCart);
  }

  updateCartDisplay();
  updateOrderSummary();
  populateAddresses();
  handlePlaceOrder();
  handleApplyVoucher();
});
