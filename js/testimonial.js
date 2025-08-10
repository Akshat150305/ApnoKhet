
        // ========== DYNAMIC TESTIMONIALS LOGIC ==========
document.addEventListener('DOMContentLoaded', () => {
        
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
                if (index === 0) {
                    slide.classList.add('active');
                }
                slide.innerHTML = `
                    <div class="testimonial-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                    <p class="testimonial-text">"${review.text}"</p>
                    <p class="testimonial-author">- ${review.author}</p>
                `;
                sliderContainer.appendChild(slide);
            });

            setupSliderControls();
        }

        // ========== UPDATED SLIDER CONTROLS WITH TIMER ==========
        function setupSliderControls() {
            const slides = document.querySelectorAll('.testimonial-slide');
            const prevBtn = document.querySelector('.testimonial-nav.prev');
            const nextBtn = document.querySelector('.testimonial-nav.next');
            let currentSlide = 0;
            let slideInterval; // Variable to hold our timer

            if (slides.length <= 1) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
                return;
            }

            function showSlide(index) {
                slides.forEach((slide, i) => {
                    slide.classList.toggle('active', i === index);
                });
            }
            
            function nextSlide() {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            }

            // --- NEW: TIMER LOGIC ---
            // Function to start the automatic slide transition
            function startSlider() {
                // `setInterval` calls the `nextSlide` function every 4000 milliseconds (4 seconds)
                slideInterval = setInterval(nextSlide, 4000);
            }

            // Function to reset the timer when a user clicks the controls
            function resetSlider() {
                clearInterval(slideInterval); // Stop the current timer
                startSlider(); // Start a new one
            }

            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetSlider(); // Reset timer on manual click
            });

            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(currentSlide);
                resetSlider(); // Reset timer on manual click
            });
            
            // Start the slider automatically when the page loads
            startSlider();
        }

        // Initialize the testimonials section
        renderDynamicTestimonials();
 });