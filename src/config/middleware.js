const User = require('../user/user.model');
var jwt = require('jsonwebtoken');


const middleware = async (req, res, next) => {
    let token = req.headers.token;
    if (!token) {
        res.status(401).send({ message: "Token not found" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.id, email: decoded.email, password: decoded.password });
        if (user) {
            req.userId = user._id;
            next();
        } else {
            res.status(401).send({ message: "Invalid token" });
        }
    } catch (error) {
        res.status(401).send({ message: "Operation not allowed" });
        console.log(error);
    }
}

module.exports = middleware;