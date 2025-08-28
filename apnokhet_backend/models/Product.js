const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { type: String, required: true },
    stockStatus: { type: String, default: 'in_stock' },
    image: { type: String, required: true },
    images: [String],
    description: { type: String },
    isBestSeller: { type: Boolean, default: false },
    isPromotion: { type: Boolean, default: false }
});

const Product = mongoose.model('product', ProductSchema);
module.exports = Product;