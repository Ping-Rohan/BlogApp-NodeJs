const jwt = require('jsonwebtoken');

// signing json web token
module.exports = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SCERET, {
        expiresIn: process.env.JWT_EXPIRES,
    });
    return token;
};
