document.addEventListener('DOMContentLoaded', () => {

    // --- DATA MANAGEMENT ---
    let allProducts = JSON.parse(localStorage.getItem('products')) || [];

    function saveProducts() {
        localStorage.setItem('products', JSON.stringify(allProducts));
    }

    // --- DOM ELEMENTS ---
    const sections = document.querySelectorAll('.admin-section');
    const navLinks = document.querySelectorAll('.admin-nav li[data-target]');
    const productsTableBody = document.getElementById('products-table-body');
    const usersTableBody = document.getElementById('users-table-body');
    const productForm = document.getElementById('product-form');
    const productFormTitle = document.getElementById('product-form-title');
    const bestsellerForm = document.getElementById('bestseller-form');
    const bestsellerListContainer = document.getElementById('bestseller-list-container');

    // --- NAVIGATION ---
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
            const targetSection = link.getAttribute('data-target');
            sections.forEach(sec => {
                sec.style.display = sec.id === targetSection ? 'block' : 'none';
            });
        });
    });

    // --- Helper function to switch back to the main product view ---
    function showProductsView() {
        const productsSection = document.getElementById('products-section');
        const productsNavLink = document.querySelector('.admin-nav li[data-target="products-section"]');
        
        sections.forEach(sec => sec.style.display = 'none');
        if (productsSection) productsSection.style.display = 'block';

        navLinks.forEach(nav => nav.classList.remove('active'));
        if (productsNavLink) productsNavLink.classList.add('active');
    }

    // --- PRODUCT MANAGEMENT (CRUD) ---
    function renderProducts() {
        productsTableBody.innerHTML = '';
        allProducts.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" width="50" height="50" style="object-fit: cover;"></td>
                <td>${product.name}</td>
                <td>Rs. ${product.price.toFixed(2)}</td>
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
            renderBestSellersManagement();
        }
    }

    function showProductForm(title, product = {}) {
        productFormTitle.textContent = title;
        productForm.elements.id.value = product.id || '';
        productForm.elements.name.value = product.name || '';
        productForm.elements.price.value = product.price || '';
        productForm.elements.originalPrice.value = product.originalPrice || '';
        productForm.elements.category.value = product.category || 'indoor';
        productForm.elements.image.value = product.image || '';
        productForm.elements.description.value = product.description || '';
        productForm.elements.images.value = product.images ? product.images.join(', ') : '';
        productForm.elements.id.readOnly = !!product.id;
        navLinks.forEach(nav => nav.classList.remove('active'));
        sections.forEach(sec => sec.style.display = 'none');
        document.getElementById('product-form-section').style.display = 'block';
    }

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(productForm);
        const productData = Object.fromEntries(formData.entries());
        productData.price = parseFloat(productData.price);
        productData.originalPrice = productData.originalPrice ? parseFloat(productData.originalPrice) : null;
        const additionalImages = productData.images.split(',').map(img => img.trim()).filter(img => img);
        productData.images = [productData.image, ...additionalImages];
        productData.images = [...new Set(productData.images)];

        if (productForm.elements.id.readOnly) {
            allProducts = allProducts.map(p => p.id === productData.id ? productData : p);
        } else {
            productData.id = 'prod' + Date.now();
            allProducts.push(productData);
        }
        
        saveProducts();
        renderProducts();
        renderBestSellersManagement();
        showProductsView();
    });
    
    document.getElementById('cancel-form').addEventListener('click', () => {
        showProductsView();
    });
    
    document.getElementById('add-new-product').addEventListener('click', () => {
        showProductForm('Add New Product');
    });

    // --- BEST SELLER MANAGEMENT ---
    function renderBestSellersManagement() {
        bestsellerListContainer.innerHTML = '';
        const currentProducts = JSON.parse(localStorage.getItem('products')) || [];
        const bestSellerIds = JSON.parse(localStorage.getItem('bestSellerIds')) || [];
        currentProducts.forEach(product => {
            const isChecked = bestSellerIds.includes(product.id);
            const item = document.createElement('div');
            item.className = 'bestseller-item';
            item.innerHTML = `
                <input type="checkbox" id="bestseller-${product.id}" value="${product.id}" ${isChecked ? 'checked' : ''}>
                <img src="${product.image}" alt="${product.name}">
                <label for="bestseller-${product.id}" class="bestseller-info">
                    <strong>${product.name}</strong>
                    <span>ID: ${product.id}</span>
                </label>
            `;
            bestsellerListContainer.appendChild(item);
        });
    }

    bestsellerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedCheckboxes = bestsellerForm.querySelectorAll('input[type="checkbox"]:checked');
        const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.value);
        localStorage.setItem('bestSellerIds', JSON.stringify(selectedIds));
        alert('Best sellers have been updated successfully!');
    });

    // --- USER MANAGEMENT ---
    function renderUsers() {
        const allUsers = JSON.parse(localStorage.getItem('users')) || [];
        usersTableBody.innerHTML = '';
        allUsers.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${user.username}</td><td>${user.email}</td>`;
            usersTableBody.appendChild(row);
        });
    }

    // --- INITIALIZATION ---
    function init() {
        document.querySelector('.admin-nav li[data-target="products-section"]').click();
        renderProducts();
        renderUsers();
        renderBestSellersManagement();
    }

    init();
});