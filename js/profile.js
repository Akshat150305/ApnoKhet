document.addEventListener('DOMContentLoaded', () => {
    
    // --- Get User and Page Elements ---
    let loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    const welcomeMessage = document.getElementById('welcome-message');

    // --- Modal Elements ---
    const editProfileModal = document.getElementById('edit-profile-modal');
    const closeModalBtn = document.getElementById('modal-close-btn');
    const editProfileForm = document.getElementById('edit-profile-form');
    const editPhotoPreview = document.getElementById('edit-profile-photo-preview');

    // --- Card Elements ---
    const ordersCard = document.getElementById('orders-card');
    const editProfileCard = document.getElementById('edit-profile-card');
    const logoutCard = document.getElementById('logout-card');

    // --- Authentication Check ---
    if (!loggedInUser) {
        window.location.href = 'login.html';
        return; // Stop the script from running further
    }

    // --- Populate User Details ---
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${loggedInUser.username}!`;
    }

    // --- Card Click Listeners ---
    if(ordersCard) {
        ordersCard.addEventListener('click', () => {
            alert('This would navigate to a dedicated order history page (functionality to be built).');
            // In the future, this would be: window.location.href = 'orders.html';
        });
    }

    if(editProfileCard) {
        editProfileCard.addEventListener('click', () => openEditModal());
    }

    if(logoutCard) {
        logoutCard.addEventListener('click', () => {
            if (confirm('Are you sure you want to log out?')) {
                sessionStorage.removeItem('loggedInUser');
                alert('You have been logged out.');
                window.location.href = 'index.html';
            }
        });
    }

    // --- Modal Logic ---
    function openEditModal() {
        if (!editProfileModal) return;
        // Pre-fill the form with current user data
        editProfileForm.username.value = loggedInUser.username;
        editProfileForm.email.value = loggedInUser.email;
        editPhotoPreview.src = loggedInUser.photo || 'https://i.imgur.com/AOLyM2T.png';
        editProfileModal.style.display = 'flex';
    }

    function closeEditModal() {
        if (!editProfileModal) return;
        editProfileModal.style.display = 'none';
    }
    
    if(closeModalBtn) {
        closeModalBtn.addEventListener('click', closeEditModal);
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === editProfileModal) {
            closeEditModal();
        }
    });

    // Handle photo preview in the modal
    if(editProfileForm && editProfileForm.photo) {
        editProfileForm.photo.addEventListener('change', () => {
            const file = editProfileForm.photo.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if(editPhotoPreview) editPhotoPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Handle form submission
    if(editProfileForm) {
        editProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newUsername = editProfileForm.username.value;
            const newEmail = editProfileForm.email.value;
            const newPhotoFile = editProfileForm.photo.files[0];

            // This identifier is used to find the user in localStorage, even if they change their username
            const originalUsername = loggedInUser.username; 
            
            // Update the user object
            loggedInUser.username = newUsername;
            loggedInUser.email = newEmail;
            
            const updateUserStorage = (photoData) => {
                if (photoData) {
                    loggedInUser.photo = photoData; // Add new photo data if it exists
                }
                
                // Update sessionStorage for the current session
                sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

                // Update localStorage for persistence
                let allUsers = JSON.parse(localStorage.getItem('users')) || [];
                const userIndex = allUsers.findIndex(user => user.username === originalUsername);
                if (userIndex !== -1) {
                    allUsers[userIndex] = loggedInUser;
                }
                localStorage.setItem('users', JSON.stringify(allUsers));
                
                // Update the welcome message immediately
                if (welcomeMessage) welcomeMessage.textContent = `Welcome, ${loggedInUser.username}!`;
                
                closeEditModal();
                alert('Profile updated successfully!');
                window.location.reload(); // Reload to update nav avatar
            };
            
            if (newPhotoFile) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    updateUserStorage(reader.result); // Save photo as base64 string
                };
                reader.readAsDataURL(newPhotoFile);
            } else {
                updateUserStorage(null); // No new photo was selected
            }
        });
    }

    // --- Shared Nav Bar Logic (for consistency) ---
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

        if (loggedInUser) {
            if(loginNavItem) loginNavItem.style.display = 'none';
            if(profileNavItem) profileNavItem.style.display = 'flex';
            if(userAvatar) userAvatar.textContent = loggedInUser.username.charAt(0).toUpperCase();
        } else {
            if(loginNavItem) loginNavItem.style.display = 'block';
            if(profileNavItem) profileNavItem.style.display = 'none';
        }
    }

    // --- Initialize Page ---
    updateCartIcon();
    checkLoginStatus();
});