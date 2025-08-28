const express = require('express');
const router = express.Router();
const fetchadmin = require('../middleware/fetchadmin');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Service = require('../models/Service');

// --- User and Order Routes (Read-Only) ---

router.get('/users', fetchadmin, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

router.get('/orders', fetchadmin, async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').sort({ date: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});


// --- Product Management Routes (CRUD) ---

// Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// Add a new product
router.post('/products', fetchadmin, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.json(savedProduct);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// Update a product
router.put('/products/:id', fetchadmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// Delete a product
router.delete('/products/:id', fetchadmin, async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.params.id });
        res.json({ success: true, message: "Product deleted" });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// --- Service Management Routes (CRUD) ---

// Get all services
router.get('/services', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// Add a new service
router.post('/services', fetchadmin, async (req, res) => {
    try {
        const newService = new Service(req.body);
        await newService.save();
        res.json(newService);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// Update a service
router.put('/services/:id', fetchadmin, async (req, res) => {
    try {
        const updatedService = await Service.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        res.json(updatedService);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// Delete a service
router.delete('/services/:id', fetchadmin, async (req, res) => {
    try {
        await Service.findOneAndDelete({ id: req.params.id });
        res.json({ success: true, message: "Service deleted" });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;