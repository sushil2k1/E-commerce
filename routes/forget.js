const express = require('express');
const router = express.Router();
const app = express();
const mongoose = require('mongoose');

router.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

const { userSchema, productSchema, cartSchema, addressSchema, orderSchema } = require('../model/users');
const { createToken, verifyToken } = require('../controllers/jwt');
const sendMail = require('../model/sendMail.js');
const { findSourceMap } = require('module');

router.get('/forgot', (req, res) => {
    console.log("forgot");
    res.render('forget');
});

router.post('/forgotPassword', async (req, res) => {
    try {
        const { username } = req.body;
        console.log(req.body);
        const user = await userSchema.findOne({ username: username });
        
        if (user) {
            const token = await createToken(username, user.mobile);
            await userSchema.updateOne({ username: user.username }, { $set: { token: token } });
            await sendMail(user.username, token, `<h1><a href="http://localhost:2000/verifyForgot/${token}?username=${username}">Click here to reset your password</a></h1><br><p>Thank you</p>`, (err, data) => {
                if (!err) {
                    res.render('forget2',{user:user.username});
                } else {
                    res.status(500).send("Error sending email");
                }
            });
            // res.render('forget2');
        } else {
            res.status(400).send("User not found");
        }
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).send("Internal server error");
    }
});

router.get('/verifyForgot/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const username = req.query.username;
        const decoded = await verifyToken(token);
        console.log(decoded);
        
        const user = await userSchema.findOne({ token: token, username: username });
        if (decoded.name === username) {
            res.render('forget2',{user:user.username});
        } else {
            res.status(400).send("Invalid token or username");
        }
    } catch (error) {
        console.error("Error in verifyForgot:", error);
        res.status(500).send("Internal server error");
 
    }
});

router.post('/updatePassword', async (req, res) => {
    try {
        const { username, password, confirmPassword } = req.body;
        console.log('updatePassword');
        console.log(username, password, confirmPassword);
        
        if (password !== confirmPassword) {
            return res.status(400).send({ msg: "Passwords do not match" });
        }

        console.log(`Searching for user with username: ${username}`);
        const user = await userSchema.findOne({ username:username});
        console.log("user", user);

        if (user) {
            const updatedUser = await userSchema.updateOne({ username: username }, { $set: { password: password, token: null } });
            console.log("updatedUser", updatedUser);

            if (updatedUser.modifiedCount !== 0) {
                res.send({ msg: "Password changed successfully" });
            } else {
                res.status(500).send({ msg: "Error while changing password" });
            }
        } else {
            res.status(400).send({ msg: "User not found" });
        }
    } catch (error) {
        console.error("Error in updatePassword:", error);
        res.status(500).send("Internal server error");
    }
});


module.exports = router;
