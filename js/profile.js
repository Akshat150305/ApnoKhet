document.addEventListener('DOMContentLoaded', async () => {
    
    // --- Get User and Page Elements ---
    const welcomeMessage = document.getElementById('welcome-message');
    const token = localStorage.getItem('authtoken');
    const userAvatar = document.querySelector('.user-avatar');

    // --- Modal Elements ---
    const editProfileModal = document.getElementById('edit-profile-modal');
    const closeModalBtn = document.getElementById('modal-close-btn');
    const editProfileForm = document.getElementById('edit-profile-form');
    const editPhotoPreview = document.getElementById('edit-profile-photo-preview');

    // --- Card Elements ---
    const ordersCard = document.getElementById('orders-card');
    const editProfileCard = document.getElementById('edit-profile-card');
    const logoutCard = document.getElementById('logout-card');

    const API_BASE_URL = 'http://localhost:3000';

    // --- Authentication Check ---
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // --- Fetch and Display User Data ---
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/getuser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'auth-token': token }
        });

        if (response.ok) {
            const user = await response.json();
            if (welcomeMessage) welcomeMessage.textContent = `Welcome, ${user.name}!`;
            if (editProfileForm) {
                editProfileForm.username.value = user.name;
                editProfileForm.email.value = user.email;
            }
            if (userAvatar) {
                if (user.photo) {
                    userAvatar.style.backgroundImage = `url(${user.photo})`;
                    userAvatar.textContent = '';
                } else if (user.name) {
                    userAvatar.textContent = user.name.charAt(0).toUpperCase();
                }
            }
        } else {
            localStorage.removeItem('authtoken');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('authtoken');
        window.location.href = 'login.html';
    }

    // --- Card Click Listeners ---
    if (ordersCard) {
        ordersCard.addEventListener('click', () => {
            alert('This would navigate to a dedicated order history page.');
        });
    }

    if (editProfileCard) {
        editProfileCard.addEventListener('click', () => openEditModal());
    }

    if (logoutCard) {
        logoutCard.addEventListener('click', () => {
            if (confirm('Are you sure you want to log out?')) {
                localStorage.removeItem('authtoken');
                alert('You have been logged out.');
                window.location.href = 'index.html';
            }
        });
    }

    // --- Modal Logic ---
    function openEditModal() {
        if (editProfileModal) editProfileModal.style.display = 'flex';
    }

    function closeEditModal() {
        if (editProfileModal) editProfileModal.style.display = 'none';
    }
    
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeEditModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === editProfileModal) closeEditModal();
    });

    // Handle photo preview in the modal
    if (editProfileForm && editProfileForm.photo) {
        editProfileForm.photo.addEventListener('change', () => {
            const file = editProfileForm.photo.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (editPhotoPreview) editPhotoPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- UPDATE PROFILE FORM SUBMISSION ---
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const newName = editProfileForm.username.value;
            const newEmail = editProfileForm.email.value;
            const newPhotoFile = editProfileForm.photo.files[0];

            const updateUser = (photoData) => {
                const updatedData = {
                    name: newName,
                    email: newEmail,
                };
                if (photoData) {
                    updatedData.photo = photoData;
                }

                fetch(`${API_BASE_URL}/api/auth/updateuser`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    },
                    body: JSON.stringify(updatedData)
                }).then(res => res.json()).then(data => {
                    if (data.success) {
                        alert('Profile updated successfully!');
                        window.location.reload(); // Reload to see changes
                    } else {
                        alert('Error updating profile: ' + (data.error || 'Unknown error'));
                    }
                }).catch(err => {
                    console.error("Update error:", err);
                    alert("Could not connect to the server to update profile.");
                });
            };
            
            if (newPhotoFile) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    updateUser(reader.result); // Save photo as base64 string
                };
                reader.readAsDataURL(newPhotoFile);
            } else {
                updateUser(null); // No new photo was selected
            }
        });
    }
});