/* style.css */

/* Reset và cơ bản */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Roboto', sans-serif;
    background-color: #f4f7fa;
    color: #333;
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

header {
    background-color: #ffffff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px 0;
}

header h1 {
    font-size: 24px;
    color: #4a90e2;
}

header nav a {
    margin-left: 20px;
    text-decoration: none;
    color: #333;
    font-weight: 500;
}

header nav a:hover {
    color: #4a90e2;
}

/* Cart Page */
.cart-page {
    padding: 40px 0;
    display: flex;
}

.cart-page .container {
    display: flex;
    gap: 40px;
}

.cart-left {
    flex: 2;
    background-color: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.cart-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

.cart-table th, .cart-table td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
}

.cart-table img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    margin-right: 10px;
    border-radius: 8px;
}

.cart-table input[type="number"] {
    width: 60px;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.remove-btn {
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.remove-btn:hover {
    background-color: #e60000;
}

.continue-shopping {
    display: inline-block;
    margin-top: 20px;
    color: #4a90e2;
    text-decoration: none;
    font-weight: 500;
}

.continue-shopping:hover {
    text-decoration: underline;
}

.cart-right {
    flex: 1;
    background-color: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 20px;
    height: fit-content;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    font-size: 16px;
}

.summary-item input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-top: 5px;
}

.summary-item.total {
    font-weight: bold;
    font-size: 18px;
    border-top: 1px solid #eee;
    padding-top: 15px;
}

.checkout-btn {
    display: block;
    background-color: #4a90e2;
    color: white;
    text-align: center;
    padding: 15px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: bold;
    transition: background-color 0.3s;
}

.checkout-btn:hover {
    background-color: #357abd;
}

/* Checkout Page */
.checkout-page {
    padding: 40px 0;
}

.checkout-page .container {
    display: flex;
    gap: 40px;
}

.checkout-left {
    flex: 2;
    background-color: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.checkout-left label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
}

.checkout-left input, .checkout-left select, .checkout-left textarea {
    width: 100%;
    padding: 12px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
}

.checkout-left textarea {
    height: 100px;
    resize: vertical;
}

.checkout-right {
    flex: 1;
    background-color: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 20px;
    height: fit-content;
}

.checkout-right select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-top: 5px;
}

.place-order-btn {
    display: block;
    width: 100%;
    background-color: #4a90e2;
    color: white;
    padding: 15px;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
}

.place-order-btn:hover {
    background-color: #357abd;
}

/* Order Confirmation */
.order-confirmation {
    padding: 40px 0;
    background-color: #f9f9f9;
}

.order-detail {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.order-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

.order-table td {
    padding: 10px;
    border-bottom: 1px solid #eee;
}

.order-detail.total {
    font-weight: bold;
    font-size: 18px;
}

/* Footer */
footer {
    background-color: #ffffff;
    padding: 20px 0;
    text-align: center;
    border-top: 1px solid #eee;
}

/* Responsive */
@media (max-width: 768px) {
    .cart-page .container, .checkout-page .container {
        flex-direction: column;
    }

    .cart-right, .checkout-right {
        position: static;
    }
}