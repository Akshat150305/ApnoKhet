document.addEventListener('DOMContentLoaded', () => {

    // --- DATA MANAGEMENT ---
    let allProducts = JSON.parse(localStorage.getItem('products')) || [];
    let allServices = JSON.parse(localStorage.getItem('services')) || [];

    function saveProducts() { localStorage.setItem('products', JSON.stringify(allProducts)); }
    function saveServices() { localStorage.setItem('services', JSON.stringify(allServices)); }

    // --- DOM ELEMENTS ---
    const sections = document.querySelectorAll('.admin-section');
    const navLinks = document.querySelectorAll('.admin-nav li[data-target]');
    const productsTableBody = document.getElementById('products-table-body');
    const usersTableBody = document.getElementById('users-table-body');
    const servicesTableBody = document.getElementById('services-table-body');
    const productForm = document.getElementById('product-form');
    const serviceForm = document.getElementById('service-form');
    const productFormTitle = document.getElementById('product-form-title');
    const serviceFormTitle = document.getElementById('service-form-title');
    const bestsellerForm = document.getElementById('bestseller-form');
    const bestsellerListContainer = document.getElementById('bestseller-list-container');
    const promotionForm = document.getElementById('promotion-form');
    const promotionListContainer = document.getElementById('promotion-list-container');
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

    function showView(sectionId) {
        document.querySelector(`.admin-nav li[data-target="${sectionId}"]`).click();
    }

    // --- PRODUCT MANAGEMENT (CRUD) ---
    function renderProducts() {
        productsTableBody.innerHTML = '';
        allProducts.forEach(product => {
            const row = document.createElement('tr');
            const isInStock = product.stockStatus !== 'out_of_stock';
            const statusClass = isInStock ? 'status-in-stock' : 'status-out-of-stock';
            const statusText = isInStock ? 'In Stock' : 'Out of Stock';
            row.innerHTML = `
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" width="50" height="50" style="object-fit: cover;"></td>
                <td>${product.name}</td>
                <td>Rs. ${product.price.toFixed(2)}</td>
                <td>${product.category}</td>
                <td><span class="${statusClass}">${statusText}</span></td>
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
        productForm.elements.stockStatus.value = product.stockStatus || 'in_stock';
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
        showView('products-section');
    });
    
    document.getElementById('cancel-form').addEventListener('click', () => showView('products-section'));
    document.getElementById('add-new-product').addEventListener('click', () => showProductForm('Add New Product'));

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
                <label for="bestseller-${product.id}" class="bestseller-info"><strong>${product.name}</strong><span>ID: ${product.id}</span></label>
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


    //Promotion Management
    function renderPromotionsManagement() {
        promotionListContainer.innerHTML = '';
        const currentProducts = JSON.parse(localStorage.getItem('products')) || [];
        const promotionIds = JSON.parse(localStorage.getItem('promotionIds')) || [];

        currentProducts.forEach(product => {
            const isChecked = promotionIds.includes(product.id);
            const item = document.createElement('div');
            item.className = 'promotion-item';
            item.innerHTML = `
                <input type="checkbox" id="promo-${product.id}" value="${product.id}" ${isChecked ? 'checked' : ''}>
                <img src="${product.image}" alt="${product.name}">
                <label for="promo-${product.id}" class="promotion-info">
                    <strong>${product.name}</strong>
                    <span>ID: ${product.id}</span>
                </label>
            `;
            promotionListContainer.appendChild(item);
        });
    }
    promotionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedCheckboxes = promotionForm.querySelectorAll('input[type="checkbox"]:checked');
        const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.value);
        
        localStorage.setItem('promotionIds', JSON.stringify(selectedIds));
        alert('Home page promotions have been updated successfully!');
    });

    // --- SERVICE MANAGEMENT (CRUD) ---
    function renderServices() {
        servicesTableBody.innerHTML = '';
        allServices.forEach(service => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${service.id}</td>
                <td><img src="${service.image}" alt="${service.title}" class="service-image"></td>
                <td>${service.title}</td>
                <td>${service.description}</td>
                <td class="table-actions">
                    <button class="edit-service-btn" data-id="${service.id}">Edit</button>
                    <button class="delete-service-btn" data-id="${service.id}">Delete</button>
                </td>
            `;
            servicesTableBody.appendChild(row);
        });
        attachServiceActionListeners();
    }

    function attachServiceActionListeners() {
        document.querySelectorAll('.edit-service-btn').forEach(btn => btn.addEventListener('click', handleEditService));
        document.querySelectorAll('.delete-service-btn').forEach(btn => btn.addEventListener('click', handleDeleteService));
    }

    function handleEditService(e) {
        const serviceId = e.target.getAttribute('data-id');
        const service = allServices.find(s => s.id === serviceId);
        showServiceForm('Edit Service', service);
    }

    function handleDeleteService(e) {
        const serviceId = e.target.getAttribute('data-id');
        if (confirm(`Are you sure you want to delete service ${serviceId}?`)) {
            allServices = allServices.filter(s => s.id !== serviceId);
            saveServices();
            renderServices();
        }
    }
    
    function showServiceForm(title, service = {}) {
        serviceFormTitle.textContent = title;
        serviceForm.elements.id.value = service.id || '';
        serviceForm.elements.title.value = service.title || '';
        serviceForm.elements.image.value = service.image || '';
        serviceForm.elements.description.value = service.description || '';
        serviceForm.elements.id.readOnly = !!service.id;
        sections.forEach(sec => sec.style.display = 'none');
        document.getElementById('service-form-section').style.display = 'block';
    }

    serviceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(serviceForm);
        const serviceData = Object.fromEntries(formData.entries());
        if (serviceForm.elements.id.readOnly) {
            allServices = allServices.map(s => s.id === serviceData.id ? serviceData : s);
        } else {
            serviceData.id = 'serv' + Date.now();
            allServices.push(serviceData);
        }
        saveServices();
        renderServices();
        showView('services-section');
    });

    document.getElementById('cancel-service-form').addEventListener('click', () => showView('services-section'));
    document.getElementById('add-new-service').addEventListener('click', () => showServiceForm('Add New Service'));

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
        showView('products-section');
        renderProducts();
        renderBestSellersManagement();
        renderPromotionsManagement();
        renderServices();
        renderUsers();
    }

    init();
});