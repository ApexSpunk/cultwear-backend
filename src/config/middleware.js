const User = require('../user/user.model');

const middleware = async (req, res, next) => {
    let token = req.headers.token;
    if (!token) {
        res.status(401).send({ message: "Token not found" });
        return;
    }
    let [id, email, password] = token.split(":");
    try {
        const user = await User.findOne({ _id: id, email: email, password: password });
        if (user) {
            req.userId = id;
            next();
        } else {
            res.status(401).send({ message: "Operation not allowed" });
        }
    } catch (error) {
        res.status(401).send({ message: "Operation not allowed" });
    }
}

module.exports = middleware;