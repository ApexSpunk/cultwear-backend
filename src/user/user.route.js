const User = require('./user.model');
const express = require('express');
var jwt = require('jsonwebtoken');

const app = express.Router();

app.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send({ data: users });
    } catch (error) {
        res.status(400).send(error);
    }
});

app.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = jwt.sign({ id: user._id, email: user.email, password: user.password }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).send({ message: "User registered successfully", data: { user, token } });
    } catch (error) {
        res.status(400).send({ message: "User already exists" });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            const token = jwt.sign({ id: user._id, email: user.email, password: user.password }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).send({ message: "User logged in successfully", data: { user, token } });
        } else {
            res.status(401).send({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(400).send({ message: "User not found" });
    }
});

module.exports = app;


