const express=require('express');
const router=express.Router();
const  { reduceQuantity, getUserCart }=require('../controllers/cartControl')

const { userSchema, productSchema, cartSchema, addressSchema, orderSchema } = require('../model/users');


async function increaseQuantity(id, LoggedUser) {
    try {
        let p = await productSchema.findOne({ id: id });
        if (p.quantity > 0) {
            await productSchema.updateOne({ id: id }, {
                $set: {
                    quantity: p.quantity - 1
                }
            })
            let c = await cartSchema.findOne({ id: id, user: LoggedUser });
            // console.log("increase quantity", c);
            const filter = { id: id };
            const updateDoc = {
                $set: {
                    quantity: c.quantity + 1
                }
            };
            let d = await cartSchema.updateOne(filter, updateDoc);
            // console.log(d);
            return await getUserCart(LoggedUser);
        }
        else {
            return 'over';
        }
    } catch (err) {
        console.error(`Error increasing quantity for product ID: ${id}`, err);
        throw err;
    }
}
async function decreaseQuantity(id, LoggedUser) {
    try {
        let p = await productSchema.findOne({ id: id });
        let c = await cartSchema.findOne({ id: id, user: LoggedUser });

        if (c) {
            if (c.quantity > 1) {
                await productSchema.updateOne({ id: id }, {
                    $set: {
                        quantity: p.quantity + 1
                    }
                });
                const filter = { id: id, user: LoggedUser };
                const updateDoc = {
                    $set: {
                        quantity: c.quantity - 1
                    }
                };
                let d = await cartSchema.updateOne(filter, updateDoc);
                // console.log(d);
                return await getUserCart(LoggedUser);
            } else {
                // Remove the item from the cart if the quantity reaches zero
                await productSchema.updateOne({ id: id }, {
                    $set: {
                        quantity: p.quantity + 1
                    }
                });
                const filter = { id: id, user: LoggedUser };
                let d = await cartSchema.deleteOne(filter);
                console.log(d);
                return await getUserCart(LoggedUser);
            }
        } else {
            throw new Error("Product not found in cart");
        }
    } catch (err) {
        console.error(`Error decreasing quantity for product ID: ${id}`, err);
        throw err;
    }
}


module.exports={increaseQuantity,decreaseQuantity}