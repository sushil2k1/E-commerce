const express=require('express');
const app=express.Router();
const { userSchema, productSchema, cartSchema, addressSchema, orderSchema } = require('../model/users');
const { increaseQuantity, decreaseQuantity } = require('../controllers/productControl');
const  { reduceQuantity, getUserCart }=require('../controllers/cartControl')


app.post('/cartProduct', async (req, res) => {
    let c = await cartSchema.findOne({ id: req.body.id, user: req.session.LoggedUser });
    // console.log(c);
    if (c == null) {
        let d = await cartSchema.create({
            id: req.body.id,
            quantity: 1,
            user: req.session.LoggedUser
        });
        // console.log("from cartProduct", d);
        reduceQuantity(req.body.id)
        res.status(200).send("Product added to cart");
    }
    else {
        res.status(303).send("Product already added to cart");
    }

});

// removing from cart and updating
app.post('/removeFromCart', async (req, res) => {
    const { id } = req.body;
    // console.log('Product ID to remove:', id);

    try {
        let d = await cartSchema.findOne({ id: id });
        let q = await productSchema.findOne({ id: id });
        let sum = d.quantity + q.quantity;

        const filter = { id: id };
        const updateDoc = {
            $set: {
                quantity: sum
            }
        };
        let e = await cartSchema.deleteOne({ id: id });
        let c = await productSchema.updateOne(filter, updateDoc);
        let userCart = await getUserCart(req.session.LoggedUser)
        res.status(200).send(userCart);


    } catch (err) {
        console.error(`Error processing the cart for product ID: ${id}`, err);
        res.status(500).send("An error occurred while removing the product from the cart");
    }
});

app.post('/updateCartQuantity', async (req, res) => {
    let { id, action } = req.body;
    // console.log(id, action);
    let d;
    if (action == 'increase') {
        d = await increaseQuantity(id, req.session.LoggedUser);
        if (d == 'over') {
            res.status(200).send({ mesg: "over" });
        }
        else {
            res.status(200).send(d);

        }
    }
    else {
        d = await decreaseQuantity(id, req.session.LoggedUser);
        res.status(200).send(d);

    }
})

app.get('/loadCart', async (req, res) => {
    try {
        let userCart = await getUserCart(req.session.LoggedUser);
        console.log('loadcart', userCart);
        res.status(200).send(JSON.stringify(userCart));
    } catch (err) {
        console.error("Error loading cart:", err);
        res.status(500).send({ error: "Failed to load cart" });
    }
});

module.exports=app;