// ========== CHANGE 2: NEW LOGIN STATUS & LOGOUT LOGIC ==========
    document.addEventListener('DOMContentLoaded', () => {    
// ========== CHANGE 2: UPDATED LOGIN & AVATAR LOGIC ==========
        
        const loginNavItem = document.getElementById('login-nav-item');
        const profileNavItem = document.getElementById('profile-nav-item');
        const logoutButton = document.getElementById('logout-button');
        const userAvatar = document.querySelector('.user-avatar'); // Get the new avatar div

        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

        if (loggedInUser && loggedInUser.username) {
            // If a user is logged in:
            // 1. Hide the "Login" link and show the profile section.
            loginNavItem.style.display = 'none';
            profileNavItem.style.display = 'flex';

            // 2. Get the first letter of the username.
            const firstLetter = loggedInUser.username.charAt(0);
            
            // 3. Set the text inside the avatar div to that letter.
            userAvatar.textContent = firstLetter;

        } else {
            // If no user is logged in, show the "Login" link.
            loginNavItem.style.display = 'block';
            profileNavItem.style.display = 'none';
        }

        // Add logout functionality
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('loggedInUser');
            alert('You have been logged out.');
            window.location.reload();
        });
        // ==================== END OF CHANGE 2 ====================
    });