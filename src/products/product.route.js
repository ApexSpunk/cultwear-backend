const express = require('express');
const Product = require('./product.model');
const middleware = require('../config/middleware');

const app = express.Router();

app.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).send({data: products});
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).send({data: product});
    } catch (error) {
        res.status(400).send(error);
    }
});

app.post('/', middleware, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(200).send({ message: "Product created successfully", data: product });
    } catch (error) {
        res.status(400).send(error);
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