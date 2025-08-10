document.addEventListener('DOMContentLoaded', () => {

    const allProducts = JSON.parse(localStorage.getItem('products')) || [];
    const productDetailContainer = document.getElementById('product-detail-container');
    const reviewsSection = document.getElementById('reviews-section');
    const reviewsList = document.getElementById('reviews-list');
    const reviewFormContainer = document.getElementById('review-form-container');
    const loginForReviewMessage = document.getElementById('login-for-review-message');
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    function renderProductDetails() {
        const productId = new URLSearchParams(window.location.search).get('id');
        const product = allProducts.find(p => p.id === productId);

        if (!product) {
            productDetailContainer.innerHTML = '<p class="loading-message">Product not found.</p>';
            return;
        }

        const images = (product.images && product.images.length > 0) ? product.images : [product.image];
        const description = product.description || 'A beautiful and healthy plant, perfect for your space.';
        const specs = product.specs || { note: 'No specifications provided.' };
        let priceHTML = `<p class="product-price">Rs. ${product.price.toFixed(2)}</p>`;
        const isOutOfStock = product.stockStatus === 'out_of_stock';
        let stockOverlayHTML = isOutOfStock ? `<div class="out-of-stock-overlay"><span class="out-of-stock-label">Out of Stock</span></div>` : '';

        if (product.originalPrice && product.originalPrice > product.price) {
            const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            priceHTML = `
                <div class="product-price-details">
                    <p class="product-price">Rs. ${product.price.toFixed(2)}</p>
                    <p class="product-original-price">Rs. ${product.originalPrice.toFixed(2)}</p>
                    <span class="product-discount-badge">${discountPercent}% OFF</span>
                </div>
            `;
        }

        productDetailContainer.innerHTML = `
            <div class="product-layout">
                <div class="product-images">
                    <div class="main-image-container">
                        ${stockOverlayHTML}
                        <img src="${images[0]}" id="main-product-image" alt="${product.name}">
                    </div>
                    <div class="thumbnail-gallery">
                        ${images.map((img, index) => `
                            <div class="thumbnail-item ${index === 0 ? 'active' : ''}" data-image-src="${img}">
                                <img src="${img}" alt="Thumbnail of ${product.name}">
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="product-details">
                    <h1>${product.name}</h1>
                    ${priceHTML}
                    <p>${description}</p>
                    <div class="product-specs">
                        <h3>Specifications</h3>
                        <ul>${Object.entries(specs).map(([key, value]) => `<li><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> <span>${value}</span></li>`).join('')}</ul>
                    </div>
                    <button class="add-to-cart-btn" data-id="${product.id}" ${isOutOfStock ? 'disabled' : ''}>
                        ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>`;
        
        setupProductEventListeners(product);
        reviewsSection.style.display = 'block';
        renderReviews(productId);
        setupReviewForm(productId);
    }
    
    function renderReviews(productId) {
        reviewsList.innerHTML = '';
        const product = allProducts.find(p => p.id === productId);
        const initialReviews = product.reviews || [];
        const savedReviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || [];
        const allReviews = [...initialReviews, ...savedReviews.filter(saved => !initialReviews.some(init => init.text === saved.text && init.author === saved.author))];

        if (allReviews.length === 0) {
            reviewsList.innerHTML = '<p>No reviews yet. Be the first to write one!</p>';
            return;
        }
        allReviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review-item';
            reviewElement.innerHTML = `
                <div class="review-header">
                    <strong class="review-author">${review.author}</strong>
                    <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                </div>
                <p class="review-text">${review.text}</p>`;
            reviewsList.appendChild(reviewElement);
        });
    }

    function setupReviewForm(productId) {
        if (loggedInUser) {
            reviewFormContainer.style.display = 'block';
            loginForReviewMessage.style.display = 'none';
            const addReviewForm = document.getElementById('add-review-form');
            const ratingStars = addReviewForm.querySelectorAll('.stars span');
            const ratingValueInput = addReviewForm.querySelector('#rating-value');
            ratingStars.forEach(star => {
                star.addEventListener('click', () => {
                    ratingValueInput.value = star.dataset.value;
                    ratingStars.forEach(s => s.classList.remove('selected'));
                    star.classList.add('selected');
                });
            });
            addReviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const reviewText = addReviewForm.querySelector('#review-text').value;
                const rating = ratingValueInput.value;
                if (!rating) {
                    document.getElementById('review-error-message').textContent = 'Please select a rating.'; return;
                }
                const newReview = { author: loggedInUser.username, rating: parseInt(rating), text: reviewText };
                const savedReviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || [];
                savedReviews.push(newReview);
                localStorage.setItem(`reviews_${productId}`, JSON.stringify(savedReviews));
                renderReviews(productId);
                addReviewForm.reset();
                ratingStars.forEach(s => s.classList.remove('selected'));
            });
        } else {
            reviewFormContainer.style.display = 'none';
            loginForReviewMessage.style.display = 'block';
        }
    }

    function setupProductEventListeners(product) {
        document.querySelectorAll('.thumbnail-item').forEach(thumb => {
            thumb.addEventListener('click', () => {
                document.getElementById('main-product-image').src = thumb.dataset.imageSrc;
                document.querySelector('.thumbnail-item.active').classList.remove('active');
                thumb.classList.add('active');
            });
        });
        document.querySelector('.add-to-cart-btn').addEventListener('click', () => addItemToCart(product));
    }
    
    function addItemToCart(item) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            const cartItem = { id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 };
            cart.push(cartItem);
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
    
    function checkLoginStatus() {
        const loginNavItem = document.getElementById('login-nav-item');
        const profileNavItem = document.getElementById('profile-nav-item');
        const logoutButton = document.getElementById('logout-button');
        const userAvatar = document.querySelector('.user-avatar');
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

    renderProductDetails();
    updateCartIcon();
    checkLoginStatus();
});