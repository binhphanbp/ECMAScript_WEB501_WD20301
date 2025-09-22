const products = [
  {
    id: 1,
    name: 'Iphone 14',
    price: 20000000,
    image: 'img/iphone.jpg',
    category: 'điện thoại',
    hot: true,
  },
  {
    id: 2,
    name: 'Samsung S23',
    price: 18000000,
    image: 'img/samsung.jpg',
    category: 'điện thoại',
    hot: false,
  },
  {
    id: 3,
    name: 'Xiaomi 13',
    price: 15000000,
    image: 'img/xiaomi.jpg',
    category: 'điện thoại',
    hot: false,
  },
  {
    id: 4,
    name: 'Vivo X30',
    price: 7000000,
    image: 'img/vivo.jpg',
    category: 'điện thoại',
    hot: false,
  },
  {
    id: 5,
    name: 'Macbook Pro 2023',
    price: 55000000,
    image: 'img/macbook.jpg',
    category: 'laptop',
    hot: true,
  },
  {
    id: 6,
    name: 'Dell XPS 13',
    price: 35000000,
    image: 'img/dell.jpg',
    category: 'laptop',
    hot: false,
  },
  {
    id: 7,
    name: 'Asus Zenbook',
    price: 25000000,
    image: 'img/asus.jpg',
    category: 'laptop',
    hot: false,
  },
  {
    id: 8,
    name: 'HP Envy',
    price: 20000000,
    image: 'img/hp.jpg',
    category: 'laptop',
    hot: false,
  },
];

const formatPrice = (price) =>
  price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

function renderProducts(containerId, filterFn = () => true) {
  
}

const renderProducts = (containerId, (filterFn = () => true)) => {
const container = document.getElementById(containerId);
  if (!container) return;

  const html = products
    .filter(filterFn)
    .map(
      (p) => `
      <div class="product">
        <img src="${p.image}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p class="price">${formatPrice(p.price)}</p>
        <button>Thêm vào giỏ</button>
      </div>
    `
    )
    .join('');

  container.innerHTML = html;
}

renderProducts('content');
renderProducts('hot', (p) => p.hot);
renderProducts('phone', (p) => p.category === 'điện thoại');
renderProducts('laptop', (p) => p.category === 'laptop');
