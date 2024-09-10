const mongoose = require('mongoose');

let userObj = {
    name: String,
    username: String,
    password: String,
    mobile: String,
    isVerified: Boolean,
    token: String
};


let productDetails = {
    id: Number,
    name: String,
    details: String,
    quantity: Number,
    price: Number,
    image_url: String
}

let cartDetails = {
    id: Number,
    quantity: Number,
    user: String
}

let addressDetails = {
    name: String,
    contact: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    user: String
}

let orderDetails = {
    user: String,
    id: Number,
    name: String,
    details: String,
    quantity: Number,
    price: Number,
    image_url: String,
    status:String,
    address:Object
}

let adminUserObj = {
    name: String,
    username: String,
    password: String,
    mobile: String,
    isVerified: Boolean,
    token: String
};

// Define schemas
let userSchema = mongoose.Schema(userObj);
let productSchema = mongoose.Schema(productDetails);
let cartSchema = mongoose.Schema(cartDetails);
let addressSchema = mongoose.Schema(addressDetails);
let orderSchema = mongoose.Schema(orderDetails);
let adminSchema=mongoose.Schema(adminUserObj)

// Export models
module.exports = {
    userSchema: mongoose.model('users', userSchema),
    productSchema: mongoose.model('products', productSchema),
    cartSchema: mongoose.model('cartitems', cartSchema),
    addressSchema: mongoose.model('addresses', addressSchema),
    orderSchema: mongoose.model('orders', orderSchema),
    adminSchema: mongoose.model('admins', adminSchema)
};
