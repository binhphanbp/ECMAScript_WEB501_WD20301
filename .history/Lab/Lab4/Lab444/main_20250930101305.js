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
