document.addEventListener('DOMContentLoaded', async () => {
    const ordersList = document.getElementById('orders-list');
    const token = localStorage.getItem('authtoken');
    const API_BASE_URL = 'http://localhost:3000';

    if (!token) {
        window.location.href = '/html/login.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/orders/myorders`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            }
        });

        if (response.ok) {
            const orders = await response.json();
            ordersList.innerHTML = ''; // Clear the "Loading..." message

            if (orders.length === 0) {
                ordersList.innerHTML = '<p>You have not placed any orders yet.</p>';
            } else {
                orders.forEach(order => {
                    const orderCard = document.createElement('div');
                    orderCard.className = 'order-card';

                    const orderDate = new Date(order.date).toLocaleDateString();

                    let productsHtml = '';
                    order.products.forEach(p => {
                        productsHtml += `<div class="product-item"><span>${p.name} (Qty: ${p.quantity})</span><span>₹${p.price.toFixed(2)}</span></div>`;
                    });

                    orderCard.innerHTML = `
                        <div class="order-header">
                            <div><strong>Order Placed:</strong> ${orderDate}</div>
                            <div><strong>Total:</strong> ₹${order.amount.toFixed(2)}</div>
                        </div>
                        <div class="order-body">
                            <div class="order-details">
                                <h3>Order ID: ${order.orderId}</h3>
                                ${productsHtml}
                            </div>
                        </div>
                    `;
                    ordersList.appendChild(orderCard);
                });
            }
        } else {
            ordersList.innerHTML = '<p>Could not fetch your orders. Please try again later.</p>';
        }
    } catch (error) {
        console.error("Error fetching orders:", error);
        ordersList.innerHTML = '<p>An error occurred. Please check your connection.</p>';
    }
});