document.addEventListener('DOMContentLoaded', () => {

    // --- Product Data ---
    // In a real application, this data would come from a server/database.
    const allProducts = [
        { id: 'prod1', name: 'Indoor Flower Kit', price: 350, image: '../images/ayuglow.jpg', category: 'kits' },
        { id: 'prod2', name: 'Gifting Flower', price: 499, image: '../images/indoor.jpg', category: 'flowering' },
        { id: 'prod3', name: 'Assorted Plants', price: 599, image: '../images/indoorkit.jpg', category: 'indoor' },
        { id: 'prod4', name: 'Butterfly Pea', price: 625, image: '../images/butterfly.jpg', category: 'flowering' },
        { id: 'prod5', name: 'Peace Lily', price: 450, image: '../images/flowering.jpg', category: 'flowering' },
        { id: 'prod6', name: 'Laurentii Plant', price: 550, image: '../images/laurentii.jpg', category: 'indoor' },
        { id: 'prod7', name: 'Herbal Pot', price: 399, image: '../images/herbal.jpg', category: 'indoor' },
        { id: 'prod8', name: 'Fresh Tea Leaves', price: 250, image: '../images/sustainability.png', category: 'kits' }
    ];

    const shopGrid = document.querySelector('.shop-grid');
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');

    // --- Function to Render Products ---
    function renderProducts(productsToRender) {
        shopGrid.innerHTML = ''; // Clear the grid
        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            // The card itself is now a link to the product page
            productCard.innerHTML = `
                <a href="product.html?id=${product.id}" class="product-link">
                    <div class="product-image-container">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="price">Rs. ${product.price.toFixed(2)}</p>
                    </div>
                </a>
                <div class="product-action">
                    <button class="add-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Add to Cart</button>
                </div>
            `;
            shopGrid.appendChild(productCard);
        });
        
        attachAddToCartListeners();
    }
    // --- Filtering and Sorting Logic ---
    function applyFiltersAndSorting() {
        let filteredProducts = [...allProducts];

        const selectedCategory = categoryFilter.value;
        if (selectedCategory !== 'all') {
            filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
        }

        const sortValue = sortBy.value;
        switch (sortValue) {
            case 'price-asc': filteredProducts.sort((a, b) => a.price - b.price); break;
            case 'price-desc': filteredProducts.sort((a, b) => b.price - a.price); break;
            case 'name-asc': filteredProducts.sort((a, b) => a.name.localeCompare(b.name)); break;
        }

        renderProducts(filteredProducts);
    }
    
    // Add event listeners to the filter and sort dropdowns
    if(categoryFilter) categoryFilter.addEventListener('change', applyFiltersAndSorting);
    if(sortBy) sortBy.addEventListener('change', applyFiltersAndSorting);

    // --- Cart and Login Status Logic ---
    function attachAddToCartListeners() {
        document.querySelectorAll('.add-cart').forEach(button => {
            // This was the line that was broken. It is now complete.
            button.addEventListener('click', () => {
                const product = {
                    id: button.dataset.id,
                    name: button.dataset.name,
                    price: parseFloat(button.dataset.price),
                    image: button.dataset.image
                };
                addItemToCart(product);
            });
        });
    }

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
    
    // Check login status and update the nav bar
    const loginNavItem = document.getElementById('login-nav-item');
    const profileNavItem = document.getElementById('profile-nav-item');
    const logoutButton = document.getElementById('logout-button');
    const userAvatar = document.querySelector('.user-avatar');
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        if(loginNavItem) loginNavItem.style.display = 'none';
        if(profileNavItem) profileNavItem.style.display = 'flex';
        if(userAvatar) userAvatar.textContent = loggedInUser.username.charAt(0);
    } else {
        if(loginNavItem) loginNavItem.style.display = 'block';
        if(profileNavItem) profileNavItem.style.display = 'none';
    }

    if(logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('loggedInUser');
            window.location.reload();
        });
    }
    
    // --- Initial Render on page load ---
    applyFiltersAndSorting();
    updateCartIcon();
});