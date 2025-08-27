document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const loginPanel = document.getElementById('loginPanel');
    const signupPanel = document.getElementById('signupPanel');
    
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    const loginError = document.getElementById('login-error-message');
    const signupError = document.getElementById('signup-error-message');

    // --- Visual Toggling Logic ---
    function setActivePanel(panelName) {
        if (panelName === 'login') {
            loginPanel.classList.add('active');
            loginPanel.classList.remove('inactive');
            signupPanel.classList.add('inactive');
            signupPanel.classList.remove('active');
            loginBtn.classList.add('active');
            signupBtn.classList.remove('active');
        } else {
            signupPanel.classList.add('active');
            signupPanel.classList.remove('inactive');
            loginPanel.classList.add('inactive');
            loginPanel.classList.remove('active');
            signupBtn.classList.add('active');
            loginBtn.classList.remove('active');
        }
    }

    loginBtn.addEventListener('click', () => setActivePanel('login'));
    signupBtn.addEventListener('click', () => setActivePanel('signup'));

    // --- Sign-Up Form Logic ---
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
        setActivePanel('login'); // Switch back to the login form
        signupForm.reset(); // Clear the signup form fields
    });

    // --- Login Form Logic ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loginError.textContent = ''; // Clear previous errors

        const identifier = loginForm.querySelector('#login-email').value; // Using email field as identifier
        const password = loginForm.querySelector('#login-password').value;
        const role = loginForm.querySelector('#login-role').value;

        if (role === 'admin') {
            // Hardcoded admin check
            if (identifier === 'apnokhet@gmail.com' && password === 'admin123') {
                alert('Admin login successful!');
                window.location.href = 'admin.html';
            } else {
                loginError.textContent = 'Invalid admin credentials.';
            }
        } else {
            // Dynamic user check
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if identifier matches either username or email
            const validUser = users.find(user => 
                (user.username === identifier || user.email === identifier) && user.password === password
            );

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