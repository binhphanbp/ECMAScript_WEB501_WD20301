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

// DOM elements
const cartProductsEl = document.getElementById('cart-products');
const summaryEl = document.getElementById('cart-summary');
const subtotalEl = summaryEl.querySelector(
  '.summary-row:nth-of-type(1) span:last-child'
);
const shippingEl = summaryEl.querySelector(
  '.summary-row:nth-of-type(2) span:last-child'
);
const totalEl = summaryEl.querySelector('.summary-row.total span:last-child');

const shippingFee = 30000;

// Định dạng tiền VND
const formatCurrency = (num) =>
  num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

// 🛒 Hàm xóa sản phẩm
function deleteProduct(index) {
  cartItems.splice(index, 1);
  renderCart();
}

// 🔄 Hàm thay đổi số lượng
function changeQuantity(index, type) {
  if (type === 'plus') {
    cartItems[index].quantity++;
  } else if (type === 'minus' && cartItems[index].quantity > 1) {
    cartItems[index].quantity--;
  }
  renderCart();
}

// 🎨 Hàm render giỏ hàng
function renderCart() {
  // Xóa items cũ (giữ lại h2)
  const oldItems = cartProductsEl.querySelectorAll('.cart-item');
  oldItems.forEach((el) => el.remove());

  let subtotal = 0;

  cartItems.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

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

    // Gắn sự kiện
    div
      .querySelector('.minus')
      .addEventListener('click', () => changeQuantity(index, 'minus'));
    div
      .querySelector('.plus')
      .addEventListener('click', () => changeQuantity(index, 'plus'));
    div
      .querySelector('.remove-btn')
      .addEventListener('click', () => deleteProduct(index));

    cartProductsEl.appendChild(div);
  });

  // Cập nhật tóm tắt đơn hàng
  subtotalEl.textContent = formatCurrency(subtotal);
  shippingEl.textContent = formatCurrency(cartItems.length ? shippingFee : 0);
  totalEl.textContent = formatCurrency(
    subtotal + (cartItems.length ? shippingFee : 0)
  );

  // Hiển thị thông báo giỏ hàng trống
  if (cartItems.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'Giỏ hàng trống!';
    emptyMsg.style.textAlign = 'center';
    emptyMsg.style.color = '#666';
    cartProductsEl.appendChild(emptyMsg);
  }
}

// Khởi tạo
renderCart();
