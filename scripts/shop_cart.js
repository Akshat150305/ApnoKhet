// --- Shopping Cart Logic ---

    // Function to add an item to the cart
    function addToCart(item) {
        // Get the current cart from localStorage or create a new one
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if the item is already in the cart
        const existingItem = cart.find(cartItem => cartItem.id === item.id);

        if (existingItem) {
            // If it exists, just increase the quantity
            existingItem.quantity++;
        } else {
            // If it's a new item, add it to the cart with a quantity of 1
            item.quantity = 1;
            cart.push(item);
        }

        // Save the updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update the cart icon count and alert the user
        updateCartIcon();
        alert(`${item.name} has been added to your cart.`);
    }

    // Function to update the number on the cart icon
    function updateCartIcon() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCountElement = document.querySelector('.cart-item-count');
        
        if (cartCountElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            if (totalItems > 0) {
                cartCountElement.textContent = totalItems;
                cartCountElement.style.display = 'block';
            } else {
                cartCountElement.style.display = 'none';
            }
        }
    }

    // Update the cart icon when the page loads
    document.addEventListener('DOMContentLoaded', updateCartIcon);