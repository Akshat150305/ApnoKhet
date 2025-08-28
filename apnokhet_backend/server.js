// This is the complete server.js file

const express = require('express');
const path = require('path');
const cors = require('cors');
const connectToMongo = require('./db');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order'); // Import the Order model
const fetchuser = require('./middleware/fetchuser'); // Import fetchuser middleware

// Immediately connect to MongoDB
connectToMongo();

const app = express();
const PORT = 3000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders')); // ADD THIS LINE FOR ORDERS

// --- Razorpay and Payment Verification ---
// Add your actual Razorpay keys here
const RAZORPAY_KEY_ID = 'YOUR_KEY_ID';       // IMPORTANT: Replace with your Key ID
const RAZORPAY_KEY_SECRET = 'YOUR_KEY_SECRET'; // IMPORTANT: Replace with your Key Secret

const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
});

// Endpoint to create a Razorpay order
app.post('/create-order', async (req, res) => {
    const { amount } = req.body;
    const options = {
        amount: Math.round(amount * 100), // amount in the smallest currency unit
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).send("Error creating order");
    }
});


// Endpoint to verify payment and create an order in the database
app.post('/verify-payment', fetchuser, async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, products, amount, address } = req.body;
    const secret = RAZORPAY_KEY_SECRET;

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
        // Payment is legitimate
        try {
            const newOrder = new Order({
                user: req.user.id, // Get user ID from fetchuser middleware
                products: products,
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                amount: amount,
                address: address,
                status: 'Processing'
            });

            await newOrder.save();
            
            // In a real app, you would also clear the user's cart here
            
            res.json({ success: true, message: "Payment verified and order created successfully." });

        } catch (dbError) {
            console.error("Database Error:", dbError);
            res.status(500).json({ success: false, message: "Error saving order to database." });
        }
    } else {
        // Payment signature does not match
        res.status(400).json({ success: false, message: "Invalid payment signature." });
    }
});


// --- Serve Frontend Files ---
app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'index.html'));
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});