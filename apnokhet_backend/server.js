// server.js (This is your complete backend server)

const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const path = require('path'); // Needed to serve your frontend files

const app = express();
app.use(express.json());

// --- IMPORTANT: CONFIGURE YOUR KEYS ---
// Store these in a secure .env file in a real project, not directly in the code.
const RAZORPAY_KEY_ID = ''; // Replace with your LIVE Key ID from Razorpay
const RAZORPAY_KEY_SECRET = ''; // Replace with your LIVE Key Secret

// Initialize Razorpay with your live keys
const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
});

// --- API ENDPOINTS ---

// Endpoint to create a payment order
app.post('/create-order', async (req, res) => {
    const { amount } = req.body;
    const options = {
        amount: Math.round(amount * 100), // Amount in the smallest currency unit (paise)
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order); // Send the order details back to the frontend
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).send("Error creating order");
    }
});

// Endpoint to verify the payment after the user completes it
app.post('/verify-payment', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const secret = RAZORPAY_KEY_SECRET;

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razoray_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
        // The payment is legitimate and verified.
        console.log("Payment verification successful for Payment ID:", razorpay_payment_id);
        // In a real application, you would now:
        // 1. Save the successful order details to your database.
        // 2. Fulfill the order (e.g., send a confirmation email).
        res.json({ success: true, message: "Payment verified successfully." });
    } else {
        // The payment signature does not match. This could be a fraudulent attempt.
        console.error("Payment verification failed.");
        res.status(400).json({ success: false, message: "Invalid payment signature." });
    }
});

// --- SERVE YOUR FRONTEND ---
// This tells the server where to find your HTML, CSS, and JS files.
app.use(express.static(path.join(__dirname, '..'))); // Serves files from the parent directory (apnokhet)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'index.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Ensure you have replaced placeholder Razorpay keys with your LIVE keys.');
});