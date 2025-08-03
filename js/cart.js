document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalPriceElement = document.getElementById('cart-total-price');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to render cart items on the page
    function renderCartItems() {
        cartItemsContainer.innerHTML = ''; // Clear existing items
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p class="cart-item-price">₹${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <input type="number" value="${item.quantity}" min="1" data-id="${item.id}">
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">Remove</button>
                `;
                cartItemsContainer.appendChild(cartItemElement);
                totalPrice += item.price * item.quantity;
            });
        }
        cartTotalPriceElement.textContent = `₹${totalPrice.toFixed(2)}`;
    }

    // Function to update cart in local storage
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
    }

    // Event listener for quantity changes and removing items
    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item-btn')) {
            const itemId = event.target.getAttribute('data-id');
            cart = cart.filter(item => item.id !== itemId);
            updateCart();
        }
    });

    cartItemsContainer.addEventListener('change', (event) => {
        if (event.target.type === 'number') {
            const itemId = event.target.getAttribute('data-id');
            const newQuantity = parseInt(event.target.value);
            const itemInCart = cart.find(item => item.id === itemId);

            if (itemInCart && newQuantity > 0) {
                itemInCart.quantity = newQuantity;
                updateCart();
            }
        }
    });

    renderCartItems();
});

// Function to be called from your shop.html to add items to the cart
function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        item.quantity = 1;
        cart.push(item);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${item.name} has been added to your cart.`);
}