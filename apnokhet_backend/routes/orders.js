const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Order = require('../models/Order');

// ROUTE 1: Get all orders for a logged-in user using: GET "/api/orders/myorders". Login required
router.get('/myorders', fetchuser, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ date: -1 }); // Sort by newest first
        res.json(orders);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;