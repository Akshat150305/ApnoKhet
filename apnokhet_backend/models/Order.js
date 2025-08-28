const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    products: [{
        productId: { type: String },
        name: { type: String },
        quantity: { type: Number },
        price: { type: Number }
    }],
    orderId: { // From Razorpay
        type: String,
        required: true
    },
    paymentId: { // From Razorpay
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        // In a real app, this would be a more detailed object
    },
    status: {
        type: String,
        default: 'Processing'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('order', OrderSchema);
module.exports = Order;