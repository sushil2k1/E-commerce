// const exp = require('constants');
const { createToken, verifyToken } = require('../controllers/jwt');
const saveAdmin = require('../controllers/saveAdmin')
const upload = require('../controllers/multer')
const sendMail = require('../model/sendMail');
const { userSchema, productSchema, cartSchema, addressSchema, orderSchema, adminSchema } = require('../model/users');
const session = require('express-session');


const express = require('express');
let app = express.Router();
app.use(session({
    secret: "hello",
    resave: true,
    saveUninitialized: true
}));

app.post("/signupAdmin", upload.none(), async (req, res) => {
    try {
        let { name, username, password, mobile } = req.body;
        let errors = [];

        if (!name || name.length < 3) {
            errors.push({ msg: 'Name must be at least 3 characters long' });
        }

        if (!password || password.length < 6) {
            errors.push({ msg: 'Password must be at least 6 characters long' });
        }
        if (!mobile || !/^\d{10}$/.test(mobile)) {
            errors.push({ msg: 'Invalid mobile number, it must be a 10-digit number' });
        }
        if (!username || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
            errors.push({ msg: 'Invalid email address' });
        }
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        let existingUser = await adminSchema.findOne({ username: req.body.username });
        if (existingUser) {
            console.log("User already exists");
            return res.status(500).send({ msg: "Already exists" });
        }


        let newUser = await saveAdmin(req.body);
        if (newUser) {
            res.status(200).send({ msg: "Admin registered" });

        }


    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send({ msg: "Internal server error" });
    }
});





app.post('/loginAdmin', upload.none(), async (req, res) => {
   try{
    let { logUser, logPass } = req.body;
    let d = await adminSchema.findOne({ username: logUser });
    if (d.password !== logPass) {
        res.status(200).send({ mesg: "Incorrect password" });

    }

    else if (d.password == logPass && d.username == logUser) {
        req.session.AdminisLog = true;
        req.session.LoggedAdmin = logUser;
        // res.redirect('/home');
        res.status(200).send({ mesg: "success" });
    }
    
   }
   catch(err){
    res.status(200).send({ mesg: "failed" })

   }
});

app.get('/adminLogout',(req,res)=>{
    req.session.AdminisLog = false;
        req.session.LoggedAdmin = "";
        res.redirect('/admin');
})

module.exports = app;