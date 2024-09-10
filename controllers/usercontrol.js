// Function to save the user into the MongoDB database 
const { userSchema, productSchema, cartSchema, addressSchema, orderSchema } = require('../model/users');
const { createToken } = require('./jwt');

async function saveUser(val) {
    const { name, username, password, mobile } = val;
    let token = await createToken(username, mobile);
    let newUser = await userSchema.create({
        name: name,
        username: username,
        password: password,
        mobile: mobile,
        isVerified: false,
        token: token
    });
    console.log(newUser);
    return newUser;
}



module.exports=saveUser;