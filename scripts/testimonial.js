
  // Wait for the HTML document to be fully loaded before running the script
  document.addEventListener('DOMContentLoaded', function() {
    
    // Select the elements for the slider
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.testimonial-nav.prev');
    const nextBtn = document.querySelector('.testimonial-nav.next');

    // Check if all the necessary elements exist on the page
    if (slides.length > 0 && prevBtn && nextBtn) {
      let currentSlide = 0;

      // This function shows the correct slide and hides the others
      function showSlide(n) {
        // First, remove the 'active' class from all slides
        slides.forEach(function(slide) {
          slide.classList.remove('active');
        });
        // Then, add the 'active' class to the slide we want to show
        slides[n].classList.add('active');
      }

      // This function moves to the next slide
      function nextSlide() {
        // The '%' operator ensures the count loops back to 0 after the last slide
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      }

      // This function moves to the previous slide
      function prevSlide() {
        // This calculation handles looping correctly when going backwards
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
      }

      // Add click event listeners to the navigation buttons
      nextBtn.addEventListener('click', nextSlide);
      prevBtn.addEventListener('click', prevSlide);
      
      // To make the slider change automatically every 5 seconds, uncomment the line below
      setInterval(nextSlide, 3000); 

    } // End of the 'if' statement
    
  }); // End of the 'DOMContentLoaded' event listener
