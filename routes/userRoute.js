// const exp = require('constants');
const {createToken,verifyToken}=require('../controllers/jwt');
const saveUser=require('../controllers/usercontrol')
const upload=require('../controllers/multer')
const sendMail=require('../model/sendMail');
const { userSchema, productSchema, cartSchema, addressSchema, orderSchema } = require('../model/users');
const session = require('express-session');


const express=require('express');
let app=express.Router();
app.use(session({
    secret: "hello",
    resave: true,
    saveUninitialized: true
}));


app.post("/signup", upload.none(), async (req, res) => {
    try {
        console.log('Received signup request:', req.body);
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

        // Check if the user already exists
        let existingUser = await userSchema.findOne({ username });
        if (existingUser) {
            console.log("User already exists");
            return res.status(409).json({ msg: "Already exists" });  
        }

        let newUser = await saveUser(req.body);

        // Send verification email
        sendMail(newUser.username, newUser.token, 
            `<h1><a href="http://localhost:2000/verify/${newUser.token}?username=${newUser.username}">Click here to verify</a></h1><br><p>Thank you</p>`, 
            (err, data) => {
                if (err) {
                    console.log("Error sending email:", err);
                    return res.status(500).json({ msg: "Error sending email" });
                }
                console.log("Email sent:", data);
                return res.status(200).json({ msg: "User registered successfully, verification email sent" });
            }
        );

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});


app.get('/verify/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const username = req.query.username;
        let user = await userSchema.findOne({ token: token, username: username });
        if (!user) {
            return res.status(400).send("Invalid token or username.");
        }

        let decodedToken = await verifyToken(token);

        if (decodedToken && decodedToken.name === user.username && decodedToken.mobile === user.mobile) {
            await userSchema.updateOne({ token: token, username: username }, { $set: { isVerified: true } });
            res.send(`User verified successfully. <h3>Go to login page </h3><a href="http://localhost:2000/">Login</a>`);
        } else {
            res.status(400).send("Token verification failed.");
        }
    } catch (error) {
        console.error("Error during verification:", error);
        res.status(500).send("Internal server error.");
    }
});



// app.post('/login', upload.none(), async (req, res) => {
//     let { logUser, logPass } = req.body;

//     console.log(logPass)
//     let d = await userSchema.findOne({ username: logUser });
//     if (d.isVerified == false) {
//         return res.status(500).send({ mesg: "Verify your acount through email" });

//     }
//     // console.log(d);
//     if (d.password == logPass && d.username == logUser && d.isVerified) {
//         req.session.isLog = true;
//         req.session.LoggedUser = logUser;
//         // res.redirect('/home');
//         res.status(200).send({ mesg: "success" });
//     }
//     else {
//         res.status(200).send({ mesg: "failed" })

//     }
// });

app.post('/login', upload.none(), async (req, res) => {
    try {
        let { logUser, logPass } = req.body;

        let user = await userSchema.findOne({ username: logUser });

        if (!user) {
            return res.status(404).json({ mesg: "failed" });  // 404 for "User not found"
        }

        if (!user.isVerified) {
            return res.status(403).json({ mesg: "Verify your account through email" });  // 403 for "Forbidden"
        }

        if (user.password === logPass) {  
            req.session.isLog = true;
            req.session.LoggedUser = logUser;

            //  success response
            return res.status(200).json({ mesg: "success" });
        } else {
            // If password does not match, send failed message
            return res.status(401).json({ mesg: "failed" });  
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ mesg: "Internal server error" });
    }
});

module.exports=app;