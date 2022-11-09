const express = require('express');
const Product = require('./product.model');
const middleware = require('../config/middleware');
const multer = require('multer');
const path = require('path');

const app = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({ storage: storage })

var multipleUpload = upload.fields([{ name: 'images', maxCount: 5 }, { name: 'thumbnail', maxCount: 1 }])

app.get('/', async (req, res) => {
    const { q, category, price, color } = req.query;
    let query = {};
    if (q) {
        query = { ...query, title: { $regex: q, $options: 'i' } };
    }
    if (category) {
        query = { ...query, category };
    }
    if (price) {
        query = { ...query, price: { $lte: price } };
    }
    if (color) {
        query = { ...query, color };
    }
    try {
        const products = await Product.find(query);
        res.status(200).send({ data: products });
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).send({ data: product });
    } catch (error) {
        res.status(400).send(error);
    }
});

app.post('/', middleware, multipleUpload, async (req, res) => {
    try {
        const product = new Product(req.body);
        product.images = req.files.images.map(file => `https://cultwear.onrender.com/public/${file.path}`);
        await product.save();
        res.status(200).send({ message: "Product added successfully", data: product });
    } catch (error) {
        res.status(400).send({error: error.message});
    }
});

app.put('/:id', middleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send({ message: "Product updated successfully", data: product });
    } catch (error) {
        res.status(400).send(error);
    }
});

app.delete('/:id', middleware, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = app;