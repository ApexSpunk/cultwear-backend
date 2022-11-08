const express = require('express');
require('dotenv').config()
const PORT = process.env.PORT;
const app = express();
const connect = require('./config/connect');
const userRoute = require('./user/user.route');
const productRoute = require('./products/product.route');
const cartRoute = require('./cart/cart.route');


app.use(express.json())

app.use('/user', userRoute);
app.use('/products', productRoute);
app.use('/cart', cartRoute);

app.get('/', (req, res) => {
    res.status(200).send({ message: "Welcome to the CultWear API" });
});



app.listen(PORT, async () => {
    await connect();
    console.log(`server on http://localhost:${PORT}`)
})