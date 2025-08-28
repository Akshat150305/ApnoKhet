document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const loginPanel = document.getElementById('loginPanel');
    const signupPanel = document.getElementById('signupPanel');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginError = document.getElementById('login-error-message');
    const signupError = document.getElementById('signup-error-message');

    // The full URL to your running backend server
    const API_BASE_URL = 'http://localhost:3000';

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

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        signupError.textContent = '';
        const name = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/createuser`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const json = await response.json();
            if (response.ok && json.authtoken) {
                localStorage.setItem('authtoken', json.authtoken);
                alert('Account created successfully!');
                window.location.href = '/html/index.html';
            } else {
                signupError.textContent = json.errors ? json.errors[0].msg : (json.error || 'Could not sign up.');
            }
        } catch (err) {
            signupError.textContent = "Cannot connect to the server. Is it running?";
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.textContent = '';
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const json = await response.json();
            if (response.ok && json.authtoken) {
                localStorage.setItem('authtoken', json.authtoken);
                alert('Login successful!');
                window.location.href = '/html/index.html';
            } else {
                loginError.textContent = json.errors ? json.errors[0].msg : (json.error || 'Invalid credentials.');
            }
        } catch (err) {
            loginError.textContent = "Cannot connect to the server. Is it running?";
        }
    });
});