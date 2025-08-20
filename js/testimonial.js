document.addEventListener('DOMContentLoaded', () => {
    
    // --- RENDER BEST SELLERS ---
    function renderBestSellers() {
        const productsGrid = document.querySelector('.products-grid');
        const allProducts = JSON.parse(localStorage.getItem('products')) || [];
        const bestSellerIds = JSON.parse(localStorage.getItem('bestSellerIds')) || [];
        const bestSellerProducts = allProducts.filter(product => bestSellerIds.includes(product.id));

        if (!productsGrid) return;
        productsGrid.innerHTML = '';

        if (bestSellerProducts.length === 0) {
            productsGrid.innerHTML = '<p style="text-align: center; width: 100%;">No best sellers have been selected yet!</p>';
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
                priceHTML = `<div class="price-container"><p class="price">Rs. ${product.price.toFixed(2)}</p><p class="original-price">Rs. ${product.originalPrice.toFixed(2)}</p></div>`;
            }
            if (isOutOfStock) {
                stockOverlayHTML = `<div class="out-of-stock-overlay"><span class="out-of-stock-label">Out of Stock</span></div>`;
            }

            productCard.innerHTML = `
                ${discountBadgeHTML}
                <a href="product.html?id=${product.id}" class="product-link">
                    <div class="product-image-container">${stockOverlayHTML}<img src="${product.image}" alt="${product.name}"></div>
                    <div class="product-info"><h3>${product.name}</h3>${priceHTML}</div>
                </a>
                <div class="product-action">
                    <button class="add-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}" ${isOutOfStock ? 'disabled' : ''}>
                        ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>`;
            productsGrid.appendChild(productCard);
        });
        
        attachAddToCartListeners();
    }

    // --- DYNAMIC TESTIMONIALS LOGIC ---
    function renderDynamicTestimonials() {
        const googleReviews = [
            { author: 'Priya S.', rating: 5, text: 'Fantastic nursery with a huge variety of healthy plants. The staff is knowledgeable and so helpful!' },
            { author: 'Vikram R.', rating: 5, text: 'Apno Khet is my go-to for all my gardening needs. Excellent quality and great service every time.' }
        ];
        const productReviews = [];
        const allProducts = JSON.parse(localStorage.getItem('products')) || [];
        allProducts.forEach(product => {
            const savedReviews = JSON.parse(localStorage.getItem(`reviews_${product.id}`)) || [];
            if (savedReviews.length > 0) {
                productReviews.push(...savedReviews);
            }
        });
        const allReviews = [...googleReviews, ...productReviews];
        const topReviews = allReviews.filter(review => review.rating >= 4);
        const sliderContainer = document.querySelector('.testimonial-slider-container');
        if (!sliderContainer) return;
        sliderContainer.innerHTML = '';

        if (topReviews.length === 0) {
            sliderContainer.innerHTML = '<p>No top reviews to display yet.</p>';
            return;
        }

        topReviews.forEach((review, index) => {
            const slide = document.createElement('div');
            slide.className = 'testimonial-slide';
            if (index === 0) slide.classList.add('active');
            slide.innerHTML = `<div class="testimonial-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div><p class="testimonial-text">"${review.text}"</p><p class="testimonial-author">- ${review.author}</p>`;
            sliderContainer.appendChild(slide);
        });
        setupSliderControls();
    }

    function setupSliderControls() {
        const slides = document.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.testimonial-nav.prev');
        const nextBtn = document.querySelector('.testimonial-nav.next');
        let currentSlide = 0;
        let slideInterval;

        if (slides.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            return;
        }

        function showSlide(index) {
            slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
        }
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        function startSlider() {
            slideInterval = setInterval(nextSlide, 4000);
        }
        function resetSlider() {
            clearInterval(slideInterval);
            startSlider();
        }
        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetSlider(); });
        if (prevBtn) prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
            resetSlider();
        });
        startSlider();
    }

    // --- SHARED HELPER FUNCTIONS (CART & LOGIN) ---
    function attachAddToCartListeners() {
        document.querySelectorAll('.add-cart').forEach(button => {
            button.addEventListener('click', () => {
                const product = { id: button.dataset.id, name: button.dataset.name, price: parseFloat(button.dataset.price), image: button.dataset.image };
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
    
    function checkLoginStatus() {
        const loginNavItem = document.getElementById('login-nav-item');
        const profileNavItem = document.getElementById('profile-nav-item');
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
    }
    
    // --- INITIALIZE THE PAGE ---
    renderBestSellers();
    renderDynamicTestimonials();
    updateCartIcon();
    checkLoginStatus();
});