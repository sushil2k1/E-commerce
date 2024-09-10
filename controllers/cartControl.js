const { userSchema, productSchema, cartSchema, addressSchema, orderSchema } = require('../model/users');

async function reduceQuantity(id) {
    try {
        let d = await productSchema.findOne({ id: id });
        // console.log("reduce quantity", d.quantity);
        //    let c=await productSchema.findOneAndReplace({quantity:d.quantity-1},{id:id});
        const filter = { id: id };
        const updateDoc = {
            $set: {
                quantity: d.quantity - 1
            }
        };
        let c = await productSchema.updateOne(filter, updateDoc);
        // console.log("update item", c);

    } catch (err) {
        console.error(`Error processing product quantity for product ID: ${id}`, err);
    }
}

async function getUserCart(user) {
    try {
        // console.log("i am getuserCart 266");
        let cartItems = await cartSchema.find();
        let products = await productSchema.find();

        // console.log("i am cartItem", cartItems);
        // console.log("i am products", products);



        // Filter the cart items for the logged-in user
        let userCartItems = cartItems.filter(e => e.user === user);

        // Enrich the cart items with product details, maintaining the cart's quantity
        let userProduct = userCartItems.map(cartItem => {
            let product = products.find(p => p.id === cartItem.id);
            return {
                ...product,
                quantity: cartItem.quantity //cart's quantity
            };
        });
        console.log(userProduct);
        return userProduct;
    } catch (err) {
        console.error("Error in getUserCart:", err);
        return [];
    }
}

module.exports = { reduceQuantity, getUserCart }

