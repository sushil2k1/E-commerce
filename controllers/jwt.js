    const jwt = require('jsonwebtoken');
    const secret = "secret@123";

    async function createToken(username, mobile) {
        let obj = { name: username, mobile: mobile };
        return new Promise((resolve, reject) => {
            jwt.sign(obj, secret, { expiresIn: '4h' }, (err, token) => {
                if (err) {
                    console.error("Error occurred while creating token:", err);
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }

    function verifyToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    console.error("Error verifying token:", err);
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }

    module.exports = {
        createToken,
        verifyToken
    };