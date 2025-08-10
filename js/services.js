document.addEventListener('DOMContentLoaded', () => {

    const serviceButtons = document.querySelectorAll('.service-btn');

    serviceButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Ask for the user's location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showUnavailableMessage, showError);
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        });
    });

    function showUnavailableMessage(position) {
        // We have the location, but for this feature, we just show the message
        alert("Thank you for your interest! We are not currently available in your area, but we hope to expand soon.");
    }

    function showError(error) {
        // Handle different error cases
        switch(error.code) {
            case error.PERMISSION_DENIED:
                alert("You denied the request for Geolocation. To check availability, please allow location access in your browser settings.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
        }
    }

    // --- Shared Nav Bar Logic (for consistency) ---
    function updateCartIcon() { /* ... (Copy this function from another JS file) ... */ }
    function checkLoginStatus() { /* ... (Copy this function from another JS file) ... */ }

    // --- Initialize Page ---
    // You can call updateCartIcon() and checkLoginStatus() here to make the nav bar dynamic.
});