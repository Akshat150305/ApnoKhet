
    document.addEventListener('DOMContentLoaded', () => {

        // --- FIXED "ADD TO CART" LOGIC ---
        // 1. We now select all "Add to Cart" buttons at once.
        const addToCartButtons = document.querySelectorAll('.add-cart');

        // 2. We loop through each button and add a click event listener.
        // This is a more robust way than using `onclick` in the HTML.
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 3. On click, we get the product data from the `data-` attributes on the button.
                const product = {
                    id: button.dataset.id,
                    name: button.dataset.name,
                    price: parseFloat(button.dataset.price),
                    image: button.dataset.image
                };
                
                // 4. Call the function to add the product to the cart.
                addItemToCart(product);
            });
        });

        // This function adds an item to the cart in localStorage
        function addItemToCart(item) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(cartItem => cartItem.id === item.id);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                item.quantity = 1;
                cart.push(item);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartIcon();
            alert(`${item.name} has been added to your cart.`);
        }

        // This function updates the number on the cart icon
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

        // Update the cart icon as soon as the page loads to show existing items
        updateCartIcon();
    });
