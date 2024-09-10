const  { reduceQuantity, getUserCart }=require('../controllers/cartControl')
const { userSchema, productSchema, cartSchema, addressSchema, orderSchema } = require('../model/users');


async function saveOrder(cart, user, obj) {
    try {
        for (let e of cart) {
            await orderSchema.create({
                user: user,
                id: e._doc.id,
                name: e._doc.name,
                details: e._doc.details,
                quantity: e.quantity,
                price: e._doc.price,
                image_url: e._doc.image_url,
                status: "Order confirmed..",
                address: obj
            });
            await cartSchema.deleteOne({
                user: user,
                id: e._doc.id
            });
        }
    } catch (err) {
        console.error('Error saving order:', err);
        throw err;
    }
}
module.exports=saveOrder;