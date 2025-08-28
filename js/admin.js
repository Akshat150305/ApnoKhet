document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION & STATE ---
    const API_BASE_URL = 'http://localhost:3000';
    const token = localStorage.getItem('authtoken');
    let allProducts = [];
    let allServices = [];

    // --- DOM ELEMENT SELECTORS ---
    const sections = document.querySelectorAll('.admin-section');
    const navLinks = document.querySelectorAll('.admin-nav li[data-target]');
    
    // Tables
    const productsTableBody = document.getElementById('products-table-body');
    const servicesTableBody = document.getElementById('services-table-body');
    const usersTableBody = document.getElementById('users-table-body');
    const ordersTableBody = document.getElementById('orders-table-body');

    // Forms & Sections
    const productFormSection = document.getElementById('product-form-section');
    const productForm = document.getElementById('product-form');
    const productFormTitle = document.getElementById('product-form-title');
    const serviceFormSection = document.getElementById('service-form-section');
    const serviceForm = document.getElementById('service-form');
    const serviceFormTitle = document.getElementById('service-form-title');
    
    // Buttons
    const addNewProductBtn = document.getElementById('add-new-product');
    const cancelProductFormBtn = document.getElementById('cancel-form');
    const addNewServiceBtn = document.getElementById('add-new-service');
    const cancelServiceFormBtn = document.getElementById('cancel-service-form');

    // Best Sellers & Promotions
    const bestsellerForm = document.getElementById('bestseller-form');
    const promotionForm = document.getElementById('promotion-form');

    // --- AUTHENTICATION ---
    if (!token) {
        alert('Access Denied. Please log in as an admin.');
        window.location.href = '/html/login.html';
        return;
    }

    // --- NAVIGATION LOGIC ---
    function showSection(sectionId) {
        navLinks.forEach(nav => {
            nav.classList.toggle('active', nav.getAttribute('data-target') === sectionId);
        });
        sections.forEach(sec => {
            sec.style.display = sec.id === sectionId ? 'block' : 'none';
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('data-target');
            // Hide form sections when navigating away
            productFormSection.style.display = 'none';
            serviceFormSection.style.display = 'none';
            showSection(targetId);
        });
    });

    // --- API HELPER FUNCTIONS ---
    const api = {
        get: (endpoint) => fetch(`${API_BASE_URL}${endpoint}`, { headers: { 'auth-token': token } }),
        post: (endpoint, body) => fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'auth-token': token },
            body: JSON.stringify(body)
        }),
        put: (endpoint, body) => fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'auth-token': token },
            body: JSON.stringify(body)
        }),
        delete: (endpoint) => fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: { 'auth-token': token }
        })
    };

    // --- PRODUCT MANAGEMENT ---
    async function fetchAndRenderProducts() {
        try {
            const res = await api.get('/api/admin/products');
            if (!res.ok) throw new Error('Could not fetch products');
            allProducts = await res.json();
            
            productsTableBody.innerHTML = '';
            allProducts.forEach(product => {
                const row = productsTableBody.insertRow();
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td><img src="${product.image}" alt="${product.name}" width="50"></td>
                    <td>${product.name}</td>
                    <td>₹${product.price.toFixed(2)}</td>
                    <td>${product.category}</td>
                    <td><span class="status-${product.stockStatus.replace('_','-')}">${product.stockStatus.replace('_', ' ')}</span></td>
                    <td class="table-actions">
                        <button class="edit-btn" data-id="${product.id}">Edit</button>
                        <button class="delete-btn" data-id="${product.id}">Delete</button>
                    </td>
                `;
            });
        } catch(err) {
            productsTableBody.innerHTML = `<tr><td colspan="7" class="error">${err.message}</td></tr>`;
        }
    }

    // --- SERVICE MANAGEMENT ---
    async function fetchAndRenderServices() {
        try {
            const res = await api.get('/api/admin/services');
            if (!res.ok) throw new Error('Could not fetch services');
            allServices = await res.json();
            
            servicesTableBody.innerHTML = '';
            allServices.forEach(service => {
                const row = servicesTableBody.insertRow();
                row.innerHTML = `
                    <td>${service.id}</td>
                    <td><img src="${service.image}" alt="${service.title}" width="50"></td>
                    <td>${service.title}</td>
                    <td>${service.description}</td>
                    <td class="table-actions">
                        <button class="edit-service-btn" data-id="${service.id}">Edit</button>
                        <button class="delete-service-btn" data-id="${service.id}">Delete</button>
                    </td>
                `;
            });
        } catch(err) {
            servicesTableBody.innerHTML = `<tr><td colspan="5" class="error">${err.message}</td></tr>`;
        }
    }

    // --- USER & ORDER MANAGEMENT ---
    async function fetchAndRenderUsers() {
        try {
            const res = await api.get('/api/admin/users');
            if (!res.ok) throw new Error('Could not fetch users');
            const users = await res.json();
            usersTableBody.innerHTML = '';
            users.forEach(user => {
                const row = usersTableBody.insertRow();
                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                `;
            });
        } catch(err) {
            usersTableBody.innerHTML = `<tr><td colspan="3" class="error">${err.message}</td></tr>`;
        }
    }
    
    async function fetchAndRenderOrders() {
        try {
            const res = await api.get('/api/admin/orders');
            if (!res.ok) throw new Error('Could not fetch orders');
            const orders = await res.json();
            ordersTableBody.innerHTML = '';
            orders.forEach(order => {
                const row = ordersTableBody.insertRow();
                row.innerHTML = `
                    <td>${order.orderId}</td>
                    <td>${order.user ? order.user.name : 'N/A'}</td>
                    <td>₹${order.amount.toFixed(2)}</td>
                    <td>${new Date(order.date).toLocaleDateString()}</td>
                    <td>${order.status}</td>
                `;
            });
        } catch(err) {
            ordersTableBody.innerHTML = `<tr><td colspan="5" class="error">${err.message}</td></tr>`;
        }
    }

    // --- EVENT LISTENERS & FORM HANDLING ---
    // (Add listeners for other CRUD operations)

    // --- INITIALIZATION ---
    async function init() {
        showSection('products-section');
        await Promise.all([
            fetchAndRenderProducts(),
            fetchAndRenderServices(),
            fetchAndRenderUsers(),
            fetchAndRenderOrders()
        ]);
        // After fetching products, populate bestsellers/promotions
        renderBestSellersManagement(); 
        renderPromotionsManagement();
    }

    init();
});