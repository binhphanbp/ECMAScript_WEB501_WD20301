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

const contentDiv = document.getElementById('content');
let html = '';
products.forEach((product) => {
  html += `
    <div>
      <img src='${product.image}'>
      <h4>${product.name}</h4>
      <p>Giá: ${product.price} đ</p>
    </div>
  `;
});
contentDiv.innerHTML = html;
