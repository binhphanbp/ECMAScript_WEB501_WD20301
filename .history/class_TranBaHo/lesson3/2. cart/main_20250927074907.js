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

const cartProductsElement = document.getElementById('cart-products');
const summaryElement = document.getElementById('cart-summary');
const subtotalElement = summaryElement.querySelector(
  '.summary-row:nth-of-type(1) span:last-child'
);
const shippingElement = summaryElement.querySelector(
  '.summary-row:nth-of-type(2) span:last-child'
);
const totalElement = summaryElement.querySelector(
  '.summary-row.total span:last-child'
);

const shippingFee = 30000;

function formatCurrency(num) {
  return num.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
}

function deleteProduct(index) {
  cartItems.splice(index, 1);
  renderCart();
}

function changeQuantity(index, type) {
  if (type === 'plus') {
    cartItems[index].quantity++;
  } else if (type === 'minus' && cartItems[index].quantity > 1) {
    cartItems[index].quantity--;
  }
  renderCart();
}

function renderCart() {
  // Xóa các item cũ (giữ lại tiêu đề h2)
  const oldItems = cartProductsElement.querySelectorAll('.cart-item');
  oldItems.forEach((el) => el.remove());

  // Xóa empty message cũ nếu có
  const oldEmptyMessage = cartProductsElement.querySelector('.empty-message');
  if (oldEmptyMessage) oldEmptyMessage.remove();

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
    const minusBtn = div.querySelector('.minus');
    if (item.quantity <= 1) minusBtn.disabled = true;
    minusBtn.addEventListener('click', () => changeQuantity(index, 'minus'));

    const plusBtn = div.querySelector('.plus');
    plusBtn.addEventListener('click', () => changeQuantity(index, 'plus'));

    const removeBtn = div.querySelector('.remove-btn');
    removeBtn.addEventListener('click', () => deleteProduct(index));

    cartProductsElement.appendChild(div);
  });

  // Nếu giỏ hàng trống -> hiển thị empty state
  if (cartItems.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'empty-message';
    emptyMessage.textContent = '🛒 Giỏ hàng trống!';
    emptyMessage.style.textAlign = 'center';
    emptyMessage.style.color = '#666';
    emptyMessage.style.padding = '20px 0';
    cartProductsElement.appendChild(emptyMessage);
  }

  // Cập nhật tóm tắt đơn hàng
  subtotalElement.textContent = formatCurrency(subtotal);
  shippingElement.textContent = formatCurrency(
    cartItems.length ? shippingFee : 0
  );
  totalElement.textContent = formatCurrency(
    subtotal + (cartItems.length ? shippingFee : 0)
  );
}

renderCart();
