document.addEventListener('DOMContentLoaded', () => {
    // Get all the necessary elements from the DOM
    const loginBox = document.getElementById('login-box');
    const signupBox = document.getElementById('signup-box');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    const loginError = document.getElementById('login-error-message');
    const signupError = document.getElementById('signup-error-message');

    // --- Toggle between Login and Sign-up forms ---
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginBox.style.display = 'none';
        signupBox.style.display = 'block';
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginBox.style.display = 'block';
        signupBox.style.display = 'none';
    });

    // --- Sign-Up Form Logic (no changes needed here) ---
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        signupError.textContent = ''; // Clear previous errors

        const username = signupForm.querySelector('#signup-username').value;
        const email = signupForm.querySelector('#signup-email').value;
        const password = signupForm.querySelector('#signup-password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];

        const userExists = users.some(user => user.username === username || user.email === email);
        if (userExists) {
            signupError.textContent = 'Username or email already exists.';
            return;
        }

        users.push({ username, email, password });
        localStorage.setItem('users', JSON.stringify(users));

        alert('Account created successfully! Please log in.');
        showLoginLink.click();
        signupForm.reset();
    });

    // --- Login Form Logic ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loginError.textContent = '';

        // ========== CHANGE: GET IDENTIFIER INSTEAD OF JUST USERNAME ==========
        const identifier = loginForm.querySelector('#login-identifier').value; // This can be a username or an email
        const password = loginForm.querySelector('#login-password').value;
        const role = loginForm.querySelector('#login-role').value;

        if (role === 'admin') {
            // Admin check remains the same
            if (identifier === 'admin' && password === 'admin123') {
                alert('Admin login successful!');
                window.location.href = 'admin.html';
            } else {
                loginError.textContent = 'Invalid admin credentials.';
            }
        } else {
            // Dynamic user check
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // ========== CHANGE: UPDATED FIND LOGIC ==========
            // The `find` method now checks if the identifier matches either the user's username OR their email.
            const validUser = users.find(user => 
                (user.username === identifier || user.email === identifier) && user.password === password
            );
            // ===============================================

            if (validUser) {
                alert('Login successful!');
                sessionStorage.setItem('loggedInUser', JSON.stringify(validUser));
                window.location.href = 'index.html';
            } else {
                loginError.textContent = 'Invalid credentials. Please try again.';
            }
        }
    });
});