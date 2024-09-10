const express=require('express');
const app=express.Router();
const { userSchema, productSchema, cartSchema, addressSchema, orderSchema } = require('../model/users');
const  { reduceQuantity, getUserCart }=require('../controllers/cartControl')
const upload = require('../controllers/multer');
const saveOrder = require('../controllers/orderControl');




// confirming order 
app.post('/order', upload.none(), async (req, res) => {
    
    let { name, contact, address, city, state, zip, country, user } = req.body;
    let newOrder = {
        name: name,
        contact: contact,
        address: address,
        city: city,
        state: state,
        zip: zip,
        country: country,
        user: user
    };

    try {
        let existingOrder = await addressSchema.findOne({ user: user });

        if (existingOrder) {
            await addressSchema.updateOne({ user: user }, {
                $set: newOrder
            });
            let cart = await getUserCart(req.session.LoggedUser);
            console.log("user's cart", cart);
            await saveOrder(cart, req.session.LoggedUser, newOrder);
            res.status(200).json({ message: 'Order updated successfully' });
        } else {
            await addressSchema.create(newOrder);
            res.status(200).json({ message: 'Order added successfully' });
        }

    } catch (err) {
        console.error('Error handling order:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/trackOrders', async (req, res) => {
    console.log("i am track orders");``
    if (!req.session.isLog) {
        res.redirect('/');
    }
    let d = await orderSchema.find({ user: req.session.LoggedUser });
    console.log("i am track orders", d);
    res.status(200).send(d);
})

// route for handling track orders
app.get('/track', (req, res) => {
    if (req.session.isLog) {
        let a = req.session.LoggedUser;
        if (req.session.isLog) {
            res.render('track', { user: a });
        }
    }
    else {
        res.redirect('/');
    }
})


module.exports=app;