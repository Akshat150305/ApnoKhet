document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalPriceElement = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // --- RENDER CART ITEMS ---
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            checkoutBtn.disabled = true;
            checkoutBtn.style.backgroundColor = '#ccc';
        } else {
            checkoutBtn.disabled = false;
            checkoutBtn.style.backgroundColor = '#27ae60';
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p class="cart-item-price">Rs. ${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="quantity-input">
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">Remove</button>
                `;
                cartItemsContainer.appendChild(cartItemElement);
                totalPrice += item.price * item.quantity;
            });
        }
        cartTotalPriceElement.textContent = `Rs. ${totalPrice.toFixed(2)}`;
    }

    // --- UPDATE CART ---
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
    }

    // --- EVENT LISTENERS for quantity and remove ---
    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item-btn')) {
            const itemId = event.target.getAttribute('data-id');
            cart = cart.filter(item => item.id !== itemId);
            updateCart();
        }
    });
    cartItemsContainer.addEventListener('change', (event) => {
        if (event.target.classList.contains('quantity-input')) {
            const itemId = event.target.getAttribute('data-id');
            const newQuantity = parseInt(event.target.value);
            const itemInCart = cart.find(item => item.id === itemId);
            if (itemInCart && newQuantity > 0) {
                itemInCart.quantity = newQuantity;
                updateCart();
            }
        }
    });

    // ========== LIVE RAZORPAY PAYMENT LOGIC ==========
    checkoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

        // Step A: Ask your backend to create a Razorpay order
        const response = await fetch('/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: totalAmount })
        });
        
        if (!response.ok) {
            alert("Failed to create payment order. Please try again later.");
            return;
        }
        const order = await response.json();

        // Step C & D: The backend sends back the order details to open Razorpay
        const options = {
            "key": "rzp_live_8XfqVEwOh0FURq", // IMPORTANT: Replace with your LIVE Key ID
            "amount": order.amount,
            "currency": "INR",
            "name": "Apno Khet",
            "description": "Transaction for plants and services",
            "image": "https://i.imgur.com/2cvD3bB.png", // A link to your logo
            "order_id": order.id,
            
            // Step E: After payment, send the details to your backend for verification
            "handler": async function (response){
                const verificationResponse = await fetch('/verify-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    })
                });

                const result = await verificationResponse.json();
                if (result.success) {
                    alert('Payment successful! Your order has been placed.');
                    localStorage.removeItem('cart');
                    window.location.href = 'index.html';
                } else {
                    alert('Payment verification failed. Please contact support.');
                }
            },
            "prefill": {
                "name": loggedInUser ? loggedInUser.username : "Guest User",
                "email": loggedInUser ? loggedInUser.email : ""
            },
            "theme": { "color": "#465806" }
        };

        options.modal = {
            ondismiss: function() {
                alert("Payment was not completed. Your items are still in the cart.");
            }
        };
        
        const rzp1 = new Razorpay(options);
        rzp1.open();
    });

    // --- INITIALIZE THE PAGE ---
    renderCartItems();
});