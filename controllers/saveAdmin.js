// Function to save the user into the MongoDB database 
const { userSchema, productSchema, cartSchema, addressSchema, orderSchema, adminSchema } = require('../model/users');
const { createToken } = require('./jwt');

async function saveUser(val) {
    const { name, username, password, mobile } = val;
    let newUser = await adminSchema.create({
        name: name,
        username: username,
        password: password,
        mobile: mobile
    
    });
    console.log(newUser);
    return newUser;
}



module.exports = saveUser;