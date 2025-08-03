document.addEventListener('DOMContentLoaded', () => {

    // --- Product Data (with reviews and detailed specs) ---
    // In a real application, this data would come from a server.
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


    // --- Get Elements from the DOM ---
    const productDetailContainer = document.getElementById('product-detail-container');
    const reviewsSection = document.getElementById('reviews-section');
    const reviewsList = document.getElementById('reviews-list');
    const reviewFormContainer = document.getElementById('review-form-container');
    const loginForReviewMessage = document.getElementById('login-for-review-message');
    
    // Get user session info
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    // --- RENDER THE MAIN PRODUCT DETAILS ---
    function renderProductDetails() {
        const productId = new URLSearchParams(window.location.search).get('id');
        const product = allProducts.find(p => p.id === productId);

        if (!product) {
            productDetailContainer.innerHTML = '<p class="loading-message">Product not found.</p>';
            return;
        }

        // Populate the main product container
        productDetailContainer.innerHTML = `
            <div class="product-layout">
                <div class="product-images">
                    <div class="main-image-container">
                        <img src="${product.images[0]}" id="main-product-image" alt="${product.name}">
                    </div>
                    <div class="thumbnail-gallery">
                        ${product.images.map((img, index) => `
                            <div class="thumbnail-item ${index === 0 ? 'active' : ''}" data-image-src="${img}">
                                <img src="${img}" alt="Thumbnail of ${product.name}">
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="product-details">
                    <h1>${product.name}</h1>
                    <p class="product-price">Rs. ${product.price.toFixed(2)}</p>
                    <p>${product.description || 'A beautiful and healthy plant, perfect for your space.'}</p>
                    <div class="product-specs">
                        <h3>Specifications</h3>
                        <ul>${Object.entries(product.specs).map(([key, value]) => `<li><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> <span>${value}</span></li>`).join('')}</ul>
                    </div>
                    <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>`;
        
        // Setup listeners for the newly created elements (thumbnails, add to cart)
        setupProductEventListeners(product);
        
        // Show the reviews section and populate it
        reviewsSection.style.display = 'block';
        renderReviews(productId);
        setupReviewForm(productId);
    }
    
    // --- RENDER AND MANAGE REVIEWS ---
    function renderReviews(productId) {
        reviewsList.innerHTML = '';
        const product = allProducts.find(p => p.id === productId);
        const savedReviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || product.reviews || [];

        if (savedReviews.length === 0) {
            reviewsList.innerHTML = '<p>No reviews yet. Be the first to write one!</p>';
            return;
        }
        savedReviews.forEach(review => {
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
                const product = allProducts.find(p => p.id === productId);
                const savedReviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || product.reviews || [];
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
    
    // --- SHARED NAVIGATION/CART LOGIC ---
    function addItemToCart(item) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            // Create a clean item object for the cart to avoid saving all details
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
                alert('You have been logged out.');
                window.location.reload();
            });
        }
    }

    // --- INITIALIZE THE PAGE ---
    renderProductDetails();
    updateCartIcon();
    checkLoginStatus();
});