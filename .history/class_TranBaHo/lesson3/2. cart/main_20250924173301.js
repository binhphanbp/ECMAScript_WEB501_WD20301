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

const cartProductsEl = document.getElementById('cart-products');
const summaryRows = document.querySelector('#cart-summary');
const shippingFee = 30000;

const formatCurrency = (num) =>
  num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

function renderCart() {
  // Xóa cũ, render lại
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

    // Update số lượng
    div.querySelector('input').addEventListener('input', (e) => {
      const newQty = parseInt(e.target.value);
      if (newQty > 0) {
        cartItems[index].quantity = newQty;
        renderCart();
      }
    });

    // Xóa sản phẩm
    div.querySelector('.remove-btn').addEventListener('click', () => {
      cartItems.splice(index, 1);
      renderCart();
    });

    cartProductsEl.appendChild(div);
  });

  // Cập nhật tóm tắt đơn hàng
  const summaryEls = summaryRows.querySelectorAll(
    '.summary-row span:last-child'
  );
  summaryEls[0].textContent = formatCurrency(subtotal); // tạm tính
  summaryEls[1].textContent = formatCurrency(shippingFee); // phí ship
  summaryEls[2].textContent = formatCurrency(subtotal + shippingFee); // tổng cộng
}

// Gọi lần đầu
renderCart();
