let mongoose=require('mongoose');
module.exports.init=async function(){
    await mongoose.connect('mongodb+srv://sushilsoni281:no1cares@cluster0.d8d2gtv.mongodb.net/e-shop?retryWrites=true&w=majority&appName=Cluster0')
} 