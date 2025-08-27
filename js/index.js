
document.addEventListener('DOMContentLoaded', () => {
    //if adds services in future then uncomment this peace of code
    // function renderServices() {
    //     const servicesGrid = document.querySelector('.services-grid-home');
    //     if (!servicesGrid) return;

    //     const allServices = JSON.parse(localStorage.getItem('services')) || [];
    //     const featuredServices = allServices.slice(0, 4); // Show up to 4 services

    //     servicesGrid.innerHTML = '';
    //     featuredServices.forEach(service => {
    //         const serviceCard = document.createElement('div');
    //         serviceCard.className = 'service-card-home'; // Use a unique class for home page
    //         serviceCard.innerHTML = `
    //             <h3>${service.title}</h3>
    //             <p>${service.description}</p>
    //             <a href="services.html" class="service-link">Learn More</a>
    //         `;
    //         servicesGrid.appendChild(serviceCard);
    //     });
    // }


    function renderBestSellers() {
        const productsGrid = document.querySelector('.products-grid');
        const allProducts = JSON.parse(localStorage.getItem('products')) || [];
        const bestSellerIds = JSON.parse(localStorage.getItem('bestSellerIds')) || [];
        const bestSellerProducts = allProducts.filter(product => bestSellerIds.includes(product.id));

        if (!productsGrid) return;
        productsGrid.innerHTML = '';

        if (bestSellerProducts.length === 0) {
            productsGrid.innerHTML = '<p style="text-align: center; width: 100%;">No best sellers have been selected yet. Please check back later!</p>';
            return;
        }

        bestSellerProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            let priceHTML = `<div class="price-container"><p class="price">Rs. ${product.price.toFixed(2)}</p></div>`;
            let discountBadgeHTML = '';
            let stockOverlayHTML = '';
            const isOutOfStock = product.stockStatus === 'out_of_stock';

            if (product.originalPrice && product.originalPrice > product.price) {
                const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
                discountBadgeHTML = `<div class="discount-badge">${discountPercent}% OFF</div>`;
                priceHTML = `
                    <div class="price-container">
                        <p class="price">Rs. ${product.price.toFixed(2)}</p>
                        <p class="original-price">Rs. ${product.originalPrice.toFixed(2)}</p>
                    </div>
                `;
            }
            
            if (isOutOfStock) {
                stockOverlayHTML = `<div class="out-of-stock-overlay"><span class="out-of-stock-label">Out of Stock</span></div>`;
            }

            productCard.innerHTML = `
                ${discountBadgeHTML}
                <a href="product.html?id=${product.id}" class="product-link">
                    ${stockOverlayHTML}
                    <div class="product-image-container">
                        
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        ${priceHTML}
                    </div>
                </a>
                <div class="product-action">
                    <button class="add-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}" ${isOutOfStock ? 'disabled' : ''}>
                        ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            `;
            productsGrid.appendChild(productCard);
        });
        
        attachAddToCartListeners();
    }

    function attachAddToCartListeners() {
        document.querySelectorAll('.add-cart').forEach(button => {
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
            cartCountElement.style.display = totalItems > 0 ? 'block' : 'none';
            cartCountElement.textContent = totalItems;
        }
    }
    
    // Add this new function inside your js/index.js file
    function renderPromotions() {
        const slider = document.getElementById('promotions-slider');
        const allProducts = JSON.parse(localStorage.getItem('products')) || [];
        const promotionIds = JSON.parse(localStorage.getItem('promotionIds')) || [];

        const promoProducts = allProducts.filter(product => promotionIds.includes(product.id));

        if (!slider || promoProducts.length === 0) {
            document.querySelector('.promotions-section')?.remove(); // Hide section if no promos
            return;
        }

        slider.innerHTML = '';
        promoProducts.forEach(product => {
            // We re-use the product card structure
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            // (Insert the same product card innerHTML logic as your best sellers function)
            // ...
            productCard.innerHTML = `
                ${discountBadgeHTML}
                <a href="product.html?id=${product.id}" class="product-link">
                    ${stockOverlayHTML}
                    <div class="product-image-container">
                        
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        ${priceHTML}
                    </div>
                </a>
                <div class="product-action">
                    <button class="add-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}" ${isOutOfStock ? 'disabled' : ''}>
                        ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            `;
            slider.appendChild(productCard);
        });
        
        // Attach cart listeners for the new cards
        attachAddToCartListeners();
        // Setup slider button controls
        setupPromoSliderControls();
    }

    function setupPromoSliderControls() {
        const slider = document.getElementById('promotions-slider');
        const prevBtn = document.getElementById('promo-prev');
        const nextBtn = document.getElementById('promo-next');
        
        if(!slider) return;

        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: 320, behavior: 'smooth' }); // 300px card width + 20px gap
        });

        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -320, behavior: 'smooth' });
        });
    }


    function checkLoginStatus() {
        const loginNavItem = document.getElementById('login-nav-item');
        const profileNavItem = document.getElementById('profile-nav-item');
        const logoutButton = document.getElementById('logout-button');
        const userAvatar = document.querySelector('.user-avatar');
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

        if (loggedInUser) {
            if(loginNavItem) loginNavItem.style.display = 'none';
            if(profileNavItem) profileNavItem.style.display = 'flex';
            if(userAvatar) userAvatar.textContent = loggedInUser.username.charAt(0).toUpperCase();
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
    }
    
    renderPromotions();
    renderBestSellers();
    updateCartIcon();
    checkLoginStatus();
});