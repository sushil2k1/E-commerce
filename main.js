const fs = require('fs').promises;
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const sendMail = require('./model/sendMail');
const db = require('./DB');
const { json } = require('stream/consumers');
const { ok } = require('assert');
const { userSchema, productSchema, cartSchema, addressSchema, orderSchema,adminSchema } = require('./model/users');

// requiring router
const forget = require('./routes/forget');
const admin = require('./routes/adminRoute');
const user = require('./routes/userRoute');
const cart=require('./routes/cartroute');
const order=require('./routes/orderRoute');
const adminUser=require('./routes/adminuserRoute');
const app = express();

app.use('/', forget);
app.use('/',adminUser);
app.use('/', admin);
app.use('/', user);
app.use('/',cart);
app.use('/',order);
app.set('view engine', 'ejs');
app.use('/product_image', express.static('product_image'));
app.use(session({
    secret: "hello",
    resave: true,
    saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get("/", (req, res) => {
    if (req.session.isLog) {
        res.redirect('/home');
    } else {
        res.render('root', { err: "" });
    }
});

app.get('/home', (req, res) => {
    if (req.session.isLog) {
        let a = req.session.LoggedUser;
        if (req.session.isLog) {
            res.render('home', { user: a });
        }
    }
    else {
        res.redirect('/');
    }
});

// logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('connect.sid')
    res.redirect('/');
})

db.init()
    .then(function () {
        console.log('database connected');
        app.listen(2000, () => {
            console.log(`this app is running on port http://localhost:2000/`);
        });
    })
    .catch((err) => {
        console.log(err);
    })

app.get('/cart', (req, res) => {
    let a = req.session.LoggedUser;
    if (req.session.isLog) {
        res.render('cart', { user: a });
    }
    else{
        res.redirect('/');
    }
})


app.get('*', function (req, res) {
    res.redirect('/');
});
