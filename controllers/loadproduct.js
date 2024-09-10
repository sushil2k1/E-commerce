const express = require('express');
const router = express.Router();
const app = express();
const multer=require('multer');
const { userSchema, productSchema, cartSchema, addressSchema, orderSchema } = require('../model/users');
const fs = require('fs');
router.use(express.static('public'));


async function loadProduct(page, limit) {
    let offset = (page - 1) * limit;
    let d = await productSchema.find().skip(offset).limit(limit);
    return d;
}

function deleteImage(filePath) {
    fs.unlink(`./product_image/${filePath}`, (err) => {
        if (err) {
            console.error('Error deleting the file:', err);
            return;
        }
        console.log('File deleted successfully');
    });
}

module.exports={loadProduct,deleteImage};