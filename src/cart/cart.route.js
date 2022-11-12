const express = require('express');
const Cart = require('./cart.model');
const middleware = require('../config/middleware');

const app = express.Router();

app.get('/', middleware, async (req, res) => {
    const id = req.userId;
    try {
        const cart = await Cart.find({ userId: id }).populate('productId');
        res.status(200).send({ data: cart });
    }
    catch (error) {
        res.status(400).send(error);
    }
});

app.post('/', middleware, async (req, res) => {
    const id = req.userId;
    let cartItem = await Cart.findOne({ userId: id, productId: req.body.productId });
    if (cartItem) {
        cartItem.quantity = cartItem.quantity + req.body.quantity;
        cartItem = await cartItem.save().then(() => { return cartItem.populate('productId')});
    }
    else {
        const cart = new Cart(req.body);
        cart.userId = id;
        cartItem = await cart.save().then(() => { return cart.populate('productId')});
    }
    res.status(200).send({ message: "Cart updated successfully", data: cartItem });

});

app.put('/:id', middleware, async (req, res) => {
    const id = req.userId;
    try {
        const cart = await Cart.findOneAndUpdate({ userId: id, _id: req.params.id }, req.body, { new: true });
        res.status(200).send({ data: cart });
    }
    catch (error) {
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