const User = require('./user.model');
const express = require('express');

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
        res.status(200).send({ message: "User registered successfully", data: user });
    } catch (error) {
        res.status(400).send({ message: "User already exists" });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        console.log(user, 'user');
        if (user) {
            let token = `${user._id}:${user.email}:${user.password}`;
            res.status(200).send({ message: "User logged in successfully", token });
        } else {
            res.status(401).send({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(400).send({ message: "User not found" });
    }
});

module.exports = app;


