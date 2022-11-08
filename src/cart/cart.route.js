const express = require('express');
const Cart = require('./cart.model');
const middleware = require('../config/middleware');

const app = express.Router();

app.get('/', middleware, async (req, res) => {
    const { token } = req.headers;
    const [id] = token.split(':');
    try {
        const cart = await Cart.findOne({ userId: id });
        res.status(200).send({ data: cart });
    }
    catch (error) {
        res.status(400).send(error);
    }
});

app.post('/', middleware, async (req, res) => {
    const { token } = req.headers;
    const [id] = token.split(':');
    try {
        const cart = new Cart({ ...req.body, userId: id });
        await cart.save();
        res.status(200).send({ message: "Item added to cart successfully", data: cart });
    } catch (error) {
        res.status(400).send(error);
    }
});

app.delete('/:id', middleware, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "Item deleted from cart successfully" });
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = app;