document.addEventListener('DOMContentLoaded', async () => {
    // Get the navigation elements from the page
    const loginNavItem = document.getElementById('login-nav-item');
    const profileNavItem = document.getElementById('profile-nav-item');
    const userAvatar = document.querySelector('.user-avatar');
    
    // Retrieve the authentication token from the browser's local storage
    const token = localStorage.getItem('authtoken');
    
    // Define the base URL for your backend API
    const API_BASE_URL = 'http://localhost:3000';

    if (token) {
        // --- If a token exists, assume the user is logged in ---

        // Hide the "Login" button and show the profile icon
        if (loginNavItem) loginNavItem.style.display = 'none';
        if (profileNavItem) profileNavItem.style.display = 'flex';

        // Fetch the user's details to personalize the profile icon
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/getuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token // Send the token for verification
                }
            });

            if (response.ok) {
                const user = await response.json();
                // Display the first letter of the user's name in the avatar circle
                if (userAvatar && user.name) {
                    userAvatar.textContent = user.name.charAt(0).toUpperCase();
                }
            } else {
                // If the token is invalid or expired, log the user out
                localStorage.removeItem('authtoken');
                if (loginNavItem) loginNavItem.style.display = 'block';
                if (profileNavItem) profileNavItem.style.display = 'none';
            }
        } catch (error) {
            console.error('Could not fetch user data for nav bar:', error);
            // If the server is down, show the login button as a fallback
            if (loginNavItem) loginNavItem.style.display = 'block';
            if (profileNavItem) profileNavItem.style.display = 'none';
        }

    } else {
        // --- If no token exists, the user is logged out ---

        // Show the "Login" button and hide the profile icon
        if (loginNavItem) loginNavItem.style.display = 'block';
        if (profileNavItem) profileNavItem.style.display = 'none';
    }
});