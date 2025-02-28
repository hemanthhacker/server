const jwt = require("jsonwebtoken");
const config = require("./config");

const checkToken = (req, res, next) => {
    let token = req.headers['authorization'];  // Correct way to access 'authorization' header
    console.log(token);

    // Check if token exists and remove the 'Bearer ' prefix
    if (token && token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);  // Slice to remove "Bearer " part
    }

    if (token) {
        jwt.verify(token, config.key, (err, decoded) => {
            if (err) {
                return res.json({
                    status: false,
                    msg: "Token is invalid"
                });
            } else {
                req.decoded = decoded;  // Attach the decoded token to the request object
                next();  // Proceed to the next middleware or route handler
            }
        });
    } else {
        return res.json({
            status: false,
            msg: "Token is not provided",
        });
    }
};

module.exports = {
    checkToken: checkToken,
};
