const express = require('express');
const router = express.Router();
const app = express();
const multer = require('multer');
router.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
const { loadProduct, deleteImage } = require('../controllers/loadproduct');
const { userSchema, productSchema, cartSchema, addressSchema, orderSchema } = require('../model/users');
const { route } = require('./forget');
const upload = require('../controllers/multer')


router.get('/orders', async (req, res) => {
    // res.send("i am orders");
    if(req.session.AdminisLog){

        res.render('orders');
    }
    else{
        res.redirect('/admin')
    }
})

// handling admin form data for storing the product in db
router.post('/saveProduct', upload.single('image'), async (req, res) => {
    const { id, name, details, quantity, price } = req.body;
    const image_url = req.file.filename;
    const product = { id, name, details, quantity, price, image_url };
    let d = await productSchema.create(product)
    console.log(d);
    res.send(d);
});

// handling window onload request 
router.get('/loadProduct', async (req, res) => {
    console.log("i am load product");
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 15;
        let data = await loadProduct(page, limit);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to load products" });
    }
});

// showing admin pannel
router.get('/admin', (req, res) => {
    if (req.session.AdminisLog) {
        res.render('admin');
    }
    else {
        res.render('adminroot', { err: "" })

    }
})

// handeler for removing product through admin
router.post('/removeProduct', async (req, res) => {
    console.log(req.body);
    let { id } = req.body;
    let c = await productSchema.findOne({ id: id });
    let d = await productSchema.deleteOne({ id: id });
    console.log(c);
    deleteImage(c.image_url)
    res.end();
})
//update product details 
router.post('/updateProduct', upload.none(), async (req, res) => {
    let { name, details, quantity, price, id } = req.body;
    // console.log(name,details,quantity,price,id);
    let c = await productSchema.updateOne({ id: id }, {
        $set: {
            id: id,
            price: price,
            quantity: quantity,
            details: details,
            name: name
        }
    });
    if (c != null) {
        res.status(200).send("updated successfully");
    }
    else {
        res.status(500).send("Not updated successfully");
    }

})

router.get('/getOrders', async (req, res) => {
    let d = await orderSchema.find();
    console.log("orders", d);
    res.status(200).send(JSON.stringify(d));
})


router.post('/updateOrderStatus/:id', async (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;

    let d = await orderSchema.findOne({ id: orderId });
    let c = await orderSchema.updateOne({ id: orderId }, {
        $set: {
            status: status
        }
    })
    // console.log(orderId);
    res.end();
});

module.exports = router;