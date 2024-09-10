let mongoose=require('mongoose');
module.exports.init=async function(){
    await mongoose.connect('mongodb+srv://s****lsoni281:********@cluster0.d8d2gtv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
} 
