document.addEventListener('DOMContentLoaded', () => {

    // --- DATA MANAGEMENT ---
    // In a real app, this would be on a server. For now, localStorage is our database.
    let allProducts = JSON.parse(localStorage.getItem('products')) || [
        { id: 'prod1', name: 'Indoor Flower Kit', price: 350, image: '../images/ayuglow.jpg', category: 'kits' },
        { id: 'prod2', name: 'Gifting Flower', price: 499, image: '../images/indoor.jpg', category: 'flowering' },
        { id: 'prod3', name: 'Assorted Plants', price: 599, image: '../images/indoorkit.jpg', category: 'indoor' },
        { id: 'prod4', name: 'Butterfly Pea', price: 625, image: '../images/butterfly.jpg', category: 'flowering' }
    ];

    function saveProducts() {
        localStorage.setItem('products', JSON.stringify(allProducts));
    }

    // --- DOM ELEMENTS ---
    const sections = document.querySelectorAll('.admin-section');
    const navLinks = document.querySelectorAll('.admin-nav li');
    const productsTableBody = document.getElementById('products-table-body');
    const usersTableBody = document.getElementById('users-table-body');
    const productForm = document.getElementById('product-form');
    const productFormTitle = document.getElementById('product-form-title');

    // --- NAVIGATION ---
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Manage active states for nav links
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
            
            // Show the correct section
            const targetSection = link.getAttribute('data-target');
            sections.forEach(sec => {
                sec.style.display = sec.id === targetSection ? 'block' : 'none';
            });
        });
    });

    // --- PRODUCT MANAGEMENT ---
    function renderProducts() {
        productsTableBody.innerHTML = '';
        allProducts.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" width="50"></td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.category}</td>
                <td class="table-actions">
                    <button class="edit-btn" data-id="${product.id}">Edit</button>
                    <button class="delete-btn" data-id="${product.id}">Delete</button>
                </td>
            `;
            productsTableBody.appendChild(row);
        });
        attachProductActionListeners();
    }

    function attachProductActionListeners() {
        document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', handleEditProduct));
        document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', handleDeleteProduct));
    }

    function handleEditProduct(e) {
        const productId = e.target.getAttribute('data-id');
        const product = allProducts.find(p => p.id === productId);
        showProductForm('Edit Product', product);
    }

    function handleDeleteProduct(e) {
        const productId = e.target.getAttribute('data-id');
        if (confirm(`Are you sure you want to delete product ${productId}?`)) {
            allProducts = allProducts.filter(p => p.id !== productId);
            saveProducts();
            renderProducts();
        }
    }

    function showProductForm(title, product = {}) {
        productFormTitle.textContent = title;
        productForm.elements.id.value = product.id || '';
        productForm.elements.name.value = product.name || '';
        productForm.elements.price.value = product.price || '';
        productForm.elements.category.value = product.category || 'indoor';
        productForm.elements.image.value = product.image || '';

        // Make ID field readonly when editing
        productForm.elements.id.readOnly = !!product.id;

        document.getElementById('products-section').style.display = 'none';
        document.getElementById('product-form-section').style.display = 'block';
    }

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(productForm);
        const product = Object.fromEntries(formData.entries());
        product.price = parseFloat(product.price); // Ensure price is a number

        if (productForm.elements.id.readOnly) { // Editing existing product
            allProducts = allProducts.map(p => p.id === product.id ? product : p);
        } else { // Adding new product
            product.id = 'prod' + Date.now(); // Generate a unique ID
            allProducts.push(product);
        }
        
        saveProducts();
        renderProducts();
        document.getElementById('product-form-section').style.display = 'none';
        document.getElementById('products-section').style.display = 'block';
    });
    
    document.getElementById('cancel-form').addEventListener('click', () => {
        document.getElementById('product-form-section').style.display = 'none';
        document.getElementById('products-section').style.display = 'block';
    });
    
    document.getElementById('add-new-product').addEventListener('click', () => {
        showProductForm('Add New Product');
    });

    // --- USER MANAGEMENT ---
    function renderUsers() {
        const allUsers = JSON.parse(localStorage.getItem('users')) || [];
        usersTableBody.innerHTML = '';
        allUsers.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.email}</td>
            `;
            usersTableBody.appendChild(row);
        });
    }

    // --- INITIALIZATION ---
    function init() {
        // Set default view to Products
        document.querySelector('.admin-nav li[data-target="products-section"]').click();
        renderProducts();
        renderUsers();
    }

    init();
});