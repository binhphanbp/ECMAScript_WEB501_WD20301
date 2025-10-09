// checkout.js
// Uses same CART_KEY and VOUCHER_KEY as cart.js
const CART_KEY = 'demo_cart_v1';
const VOUCHER_KEY = 'demo_voucher_v1';

// ARR addresses (const arr theo yêu cầu)
const arr = [
  {
    id: 'a1',
    label: 'Nhà riêng - Quận 1, TP.HCM',
    value: '12 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM',
  },
  {
    id: 'a2',
    label: 'Văn phòng - Quận 3, TP.HCM',
    value: '45 Nguyễn Đình Chiểu, Phường Võ Thị Sáu, Quận 3, TP.HCM',
  },
  {
    id: 'a3',
    label: 'Nhà ngoại - Bình Thạnh',
    value: '78 Ngô Tất Tố, Phường 22, Bình Thạnh, TP.HCM',
  },
];

// util
const fmt = (n) =>
  new Intl.NumberFormat('vi-VN').format(Math.max(0, Math.round(n)));

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch (e) {
    return [];
  }
}
function readVoucher() {
  return localStorage.getItem(VOUCHER_KEY) || null;
}

const addressSelect = document.getElementById('addressSelect');
const shipName = document.getElementById('shipName');
const shipPhone = document.getElementById('shipPhone');
const shipAddress = document.getElementById('shipAddress');
const shipNote = document.getElementById('shipNote');
const summaryItems = document.getElementById('summaryItems');
const shippingFeeEl = document.getElementById('shippingFee');
const subtotalC = document.getElementById('subtotalC');
const discountC = document.getElementById('discountC');
const grandTotal = document.getElementById('grandTotal');
const orderDetails = document.getElementById('orderDetails');
const placeOrderBtn = document.getElementById('placeOrder');

function populateAddresses() {
  addressSelect.innerHTML = '';
  arr.forEach((a) => {
    const opt = document.createElement('option');
    opt.value = a.id;
    opt.textContent = a.label;
    opt.dataset.addr = a.value;
    addressSelect.appendChild(opt);
  });
  // when selection changes, update fields
  addressSelect.addEventListener('change', () => {
    const opt = addressSelect.selectedOptions[0];
    if (opt) {
      shipAddress.value = opt.dataset.addr || '';
    }
    computeTotalsAndRender();
  });
}

function renderSummary() {
  const items = readCart();
  summaryItems.innerHTML = '';
  if (!items || items.length === 0) {
    summaryItems.innerHTML = `<div style="color:var(--muted)">Giỏ hàng trống. <a href="cart.html">Quay lại giỏ hàng</a></div>`;
    subtotalC.textContent = '₫0';
    discountC.textContent = '₫0';
    grandTotal.textContent = '₫0';
    shippingFeeEl.textContent = '₫0';
    placeOrderBtn.disabled = true;
    return;
  }
  placeOrderBtn.disabled = false;

  items.forEach((it) => {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.alignItems = 'center';
    div.style.gap = '8px';
    div.innerHTML = `<div style="display:flex;gap:10px;align-items:center">
      <img src="${
        it.img
      }" style="width:56px;height:56px;object-fit:cover;border-radius:8px" alt="${
      it.name
    }">
      <div>
        <div style="font-weight:600">${it.name}</div>
        <div style="font-size:13px;color:var(--muted)">₫${fmt(it.price)} × ${
      it.qty
    }</div>
      </div>
    </div>
    <div style="font-weight:700">₫${fmt(it.price * it.qty)}</div>`;
    summaryItems.appendChild(div);
  });

  computeTotalsAndRender();
}

// shipping fee strategy (simple demo)
function computeShippingFee() {
  // if the selected address contains 'Quận 1' or 'Quận 3', free for orders > 300k, else 30k
  const items = readCart();
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const selected = addressSelect.selectedOptions[0];
  const addr = selected ? (selected.dataset.addr || '').toLowerCase() : '';
  let fee = 30000;
  if (
    addr.includes('quận 1') ||
    addr.includes('quận 3') ||
    addr.includes('quận 10')
  ) {
    if (subtotal >= 300000) fee = 0;
    else fee = 15000;
  } else {
    if (subtotal >= 500000) fee = 0;
    else fee = 30000;
  }
  return fee;
}

function computeTotalsAndRender() {
  const items = readCart();
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const voucher = readVoucher();
  let discount = 0;
  if (voucher === 'DISCOUNT10') discount = Math.round(subtotal * 0.1);
  else if (voucher === 'SAVE50') discount = 50000;
  const shipping = computeShippingFee();
  const total = Math.max(0, subtotal - discount + shipping);

  subtotalC.textContent = '₫' + fmt(subtotal);
  discountC.textContent = '₫' + fmt(discount);
  shippingFeeEl.textContent = '₫' + fmt(shipping);
  grandTotal.textContent = '₫' + fmt(total);
}

// place order - show detail panel
placeOrderBtn.addEventListener('click', () => {
  const items = readCart();
  if (!items || items.length === 0) {
    alert('Giỏ hàng trống.');
    return;
  }
  // validate shipping info
  if (!shipName.value.trim()) {
    alert('Vui lòng nhập tên người nhận.');
    shipName.focus();
    return;
  }
  if (!shipPhone.value.trim()) {
    alert('Vui lòng nhập điện thoại.');
    shipPhone.focus();
    return;
  }
  if (!shipAddress.value.trim()) {
    alert('Vui lòng nhập địa chỉ giao hàng.');
    shipAddress.focus();
    return;
  }

  const payment = document.querySelector('input[name="payment"]:checked').value;
  const orderId = 'DH' + Date.now().toString().slice(-8);
  const date = new Date().toLocaleString('vi-VN');

  // totals
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const voucher = readVoucher();
  let discount = 0;
  if (voucher === 'DISCOUNT10') discount = Math.round(subtotal * 0.1);
  else if (voucher === 'SAVE50') discount = 50000;
  const shipping = computeShippingFee();
  const total = Math.max(0, subtotal - discount + shipping);

  // show order details
  orderDetails.style.display = 'block';
  orderDetails.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div>
        <div class="badge">Mã: ${orderId}</div>
        <div style="color:var(--muted);margin-top:6px">Ngày: ${date}</div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:700;font-size:18px">Tổng: ₫${fmt(total)}</div>
        <div style="color:var(--muted);font-size:13px">Phương thức: ${
          payment === 'cod' ? 'COD' : 'Thẻ/Online'
        }</div>
      </div>
    </div>

    <hr style="border:none;border-top:1px dashed #e6eef6;margin:10px 0">

    <div style="margin-top:8px">
      <strong>Thông tin giao hàng</strong>
      <div style="margin-top:8px">
        <div><strong>${escapeHtml(shipName.value)}</strong> — ${escapeHtml(
    shipPhone.value
  )}</div>
        <div style="color:var(--muted);margin-top:6px">${escapeHtml(
          shipAddress.value
        )}</div>
        ${
          shipNote.value
            ? `<div style="margin-top:6px;color:var(--muted)"><em>Ghi chú:</em> ${escapeHtml(
                shipNote.value
              )}</div>`
            : ''
        }
      </div>
    </div>

    <div style="margin-top:12px">
      <strong>Chi tiết đơn hàng</strong>
      <div style="margin-top:8px;display:flex;flex-direction:column;gap:8px">
        ${items
          .map(
            (it) => `
          <div style="display:flex;justify-content:space-between">
            <div style="color:var(--muted)">${escapeHtml(it.name)} × ${
              it.qty
            }</div>
            <div style="font-weight:700">₫${fmt(it.price * it.qty)}</div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>

    <div style="margin-top:12px">
      <div style="display:flex;justify-content:space-between"><div>Phí giao hàng</div><div>₫${fmt(
        shipping
      )}</div></div>
      <div style="display:flex;justify-content:space-between"><div>Giảm (voucher)</div><div>- ₫${fmt(
        discount
      )}</div></div>
      <div style="display:flex;justify-content:space-between;font-weight:700;margin-top:8px"><div>Tổng giá trị</div><div>₫${fmt(
        total
      )}</div></div>
    </div>

    <div style="margin-top:12px;color:var(--success);font-weight:700">
      ✔️ Đơn hàng đã được tạo (demo). Bạn có thể lưu mã đơn để tra cứu: <span style="font-family:monospace">${orderId}</span>
    </div>
  `;

  // For demo: clear cart after order (comment this out to keep cart)
  // localStorage.removeItem(CART_KEY);
  // localStorage.removeItem(VOUCHER_KEY);

  // optionally scroll to order details
  orderDetails.scrollIntoView({ behavior: 'smooth' });
});

// utility escape
function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[
        c
      ])
  );
}

// initial setup
populateAddresses();
renderSummary();
renderSummary(); // called twice to ensure totals correct

// prefill shipping form with first address
if (arr[0]) {
  addressSelect.selectedIndex = 0;
  shipAddress.value = arr[0].value;
}
