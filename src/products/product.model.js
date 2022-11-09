const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    images: { type: Array, required: true },
    category: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;