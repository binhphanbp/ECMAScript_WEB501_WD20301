document.addEventListener('DOMContentLoaded', () => {
  const productsData = {
    new: [
      {
        name: 'Áo thun nam',
        price: '250,000đ',
        image: 'https://picsum.photos/300/200?random=1',
        sale: '-20%',
      },
      {
        name: 'Quần jeans nữ',
        price: '450,000đ',
        image: 'https://picsum.photos/300/200?random=2',
        sale: '-15%',
      },
      {
        name: 'Giày sneaker',
        price: '750,000đ',
        image: 'https://picsum.photos/300/200?random=3',
        sale: '-25%',
      },
      {
        name: 'Túi xách thời trang',
        price: '350,000đ',
        image: 'https://picsum.photos/300/200?random=4',
        sale: '-30%',
      },
    ],
    bestseller: [
      {
        name: 'Áo sơ mi trắng',
        price: '320,000đ',
        image: 'https://picsum.photos/300/200?random=5',
        sale: '-10%',
      },
      {
        name: 'Đồng hồ nam',
        price: '1,250,000đ',
        image: 'https://picsum.photos/300/200?random=6',
        sale: '-15%',
      },
      {
        name: 'Giày cao gót',
        price: '680,000đ',
        image: 'https://picsum.photos/300/200?random=7',
        sale: '-20%',
      },
      {
        name: 'Mũ lưỡi trai',
        price: '150,000đ',
        image: 'https://picsum.photos/300/200?random=8',
        sale: '-5%',
      },
    ],
    featured: [
      {
        name: 'Laptop gaming',
        price: '18,500,000đ',
        image: 'https://picsum.photos/300/200?random=9',
        sale: '-12%',
      },
      {
        name: 'Điện thoại iPhone',
        price: '25,000,000đ',
        image: 'https://picsum.photos/300/200?random=10',
        sale: '-8%',
      },
      {
        name: 'Tai nghe Bluetooth',
        price: '1,200,000đ',
        image: 'https://picsum.photos/300/200?random=11',
        sale: '-18%',
      },
      {
        name: 'Máy ảnh Canon',
        price: '15,000,000đ',
        image: 'https://picsum.photos/300/200?random=12',
        sale: '-20%',
      },
    ],
  };

  const tabs = document.querySelectorAll('.tab');
  const productList = document.getElementById('product-list');
  let tabIndex = 0;
  const tabKeys = ['new', 'bestseller', 'featured'];

  const renderProducts = (tab = 'new') => {
    productList.innerHTML = productsData[tab]
      .map(
        (p) => `
          <div class="product-card">
            <span class="badge">${p.sale}</span>
            <img src="${p.image}" alt="${p.name}">
            <div class="product-info">
              <h4>${p.name}</h4>
              <p>${p.price}</p>
              <a href="#" class="buy-btn">Mua ngay</a>
            </div>
          </div>
        `
      )
      .join('');
  };

  const setActiveTab = (tab = 'new') => {
    tabs.forEach((t) => t.classList.remove('active'));
    document.querySelector(`.tab[data-tab="${tab}"]`).classList.add('active');
    renderProducts(tab);
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabIndex = tabKeys.indexOf(tab.dataset.tab);
      setActiveTab(tab.dataset.tab);
    });
  });

  // Auto đổi tab sau 3s
  setInterval(() => {
    tabIndex = (tabIndex + 1) % tabKeys.length;
    setActiveTab(tabKeys[tabIndex]);
  }, 3000);

  // Countdown
  const startCountdown = (duration = 3600) => {
    let timer = duration;
    const countdownEl = document.getElementById('countdown');

    setInterval(() => {
      const hours = String(Math.floor(timer / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((timer % 3600) / 60)).padStart(2, '0');
      const seconds = String(timer % 60).padStart(2, '0');

      countdownEl.textContent = `${hours}:${minutes}:${seconds}`;

      if (--timer < 0) timer = duration; // reset khi hết
    }, 1000);
  };

  // Gọi mặc định
  setActiveTab(); // mặc định 'new'
  startCountdown(); // mặc định 3600 giây
});
