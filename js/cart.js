document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalPriceElement = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const API_BASE_URL = 'http://localhost:3000'; // Your backend server URL

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

    // ========== UPDATED RAZORPAY PAYMENT LOGIC ==========
    checkoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('authtoken');
        if (!token) {
            alert('You must be logged in to check out.');
            window.location.href = '/html/login.html';
            return;
        }

        const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Step 1: Create a Razorpay order from your backend
        const orderResponse = await fetch(`${API_BASE_URL}/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: totalAmount })
        });
        
        if (!orderResponse.ok) {
            alert("Failed to create payment order. Please try again later.");
            return;
        }
        const order = await orderResponse.json();

        // Step 2: Fetch logged-in user's details for pre-filling Razorpay form
        let user = {};
        try {
            const userResponse = await fetch(`${API_BASE_URL}/api/auth/getuser`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'auth-token': token }
            });
            if (userResponse.ok) {
                user = await userResponse.json();
            }
        } catch (err) {
            console.error("Could not fetch user details for checkout", err);
        }

        // Step 3: Open the Razorpay checkout modal
        const options = {
            "key": "rzp_test_5Vf8Z1Z7Z1Y5Jg", // Using a test key for now
            "amount": order.amount,
            "currency": "INR",
            "name": "Apno Khet",
            "description": "Transaction for plants and services",
            "image": "https://i.imgur.com/2cvD3bB.png", 
            "order_id": order.id,
            
            // Step 4: After payment, send details to backend for verification
            "handler": async function (response){
                const data = {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    products: cart.map(item => ({ productId: item.id, name: item.name, quantity: item.quantity, price: item.price })),
                    amount: totalAmount,
                    address: "Jaipur, Rajasthan" // Placeholder address
                };

                const verificationResponse = await fetch(`${API_BASE_URL}/verify-payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    },
                    body: JSON.stringify(data)
                });

                const result = await verificationResponse.json();
                if (result.success) {
                    alert('Payment successful! Your order has been placed.');
                    localStorage.removeItem('cart');
                    window.location.href = '/html/orders.html'; // Redirect to orders page
                } else {
                    alert('Payment verification failed. Please contact support.');
                }
            },
            "prefill": {
                "name": user.name || "Guest User",
                "email": user.email || ""
            },
            "theme": { "color": "#465806" },
            "modal": {
                "ondismiss": function() {
                    alert("Payment was not completed. Your items are still in the cart.");
                }
            }
        };
        
        const rzp1 = new Razorpay(options);
        rzp1.open();
    });

    // --- INITIALIZE THE PAGE ---
    renderCartItems();
});