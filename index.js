const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Customer = require('./models/customer');
const { url } = require('inspector');
const Address = require('./models/addressModel');
const Product = require('./models/product');
const Category = require('./models/category');
const Order = require('./models/order');
const methodOverride = require('method-override');

mongoose.connect('mongodb://127.0.0.1:27017/onlineShop',{useNewUrlParser:true})
    .then(()=>{
        console.log(" MONGO CONNECTION OPEN");
    })
    .catch(err=>{
        console.log(err);
    });


app.use(methodOverride('_method'));
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({extended:true}));

app.get('/customers',async (req,res)=>{
    const customers = await Customer.find({}).populate('addresses');
    res.render('customer/customer.ejs', {customers});
})

app.get('/customers/new', (req,res)=>{
    res.render('customer/customerForm.ejs');
})

app.post('/customers', async(req,res)=>{
    const {name, phoneNumber, email, city, state, zipCode, street} = req.body;
    const newCustomer = new Customer({name, phoneNumber,email});
    const newAddress = new Address({street, city, state, zipCode});
    newCustomer.addresses.push(newAddress);
    newAddress.customer = newCustomer;
    await newAddress.save();
    await newCustomer.save();
    res.redirect('/customers')
})

app.get('/customers/:id/edit', async(req,res)=>{
    const {id} = req.params;
    const customer = await Customer.findById(id)
    .populate('addresses');

    res.render("customer/edit.ejs" ,{customer});
})

app.put('/customers/:id', async (req, res) => {
    const { id } = req.params;
    const { name, phoneNumber, email, city, state, zipCode, street } = req.body;

    try {
        // Update customer details
        const updatedCustomer = await Customer.findByIdAndUpdate(id, { name, phoneNumber, email }, { new: true });

        // Update customer's address if available
        if (updatedCustomer) {
            await Address.findByIdAndUpdate(updatedCustomer.addresses[0]._id, {city, state, zipCode, street}, { new: true });
        }

        res.redirect("/customers");
    } catch (error) {
        res.status(500).send("Error updating customer details");
    }
});

app.delete('/customers/:id', async(req,res)=>{
    const {id} = req.params;
    await Customer.findByIdAndDelete(id);
    res.redirect("/customers");
})

app.get('/products',async (req,res)=>{
    const products = await Product.find({}).populate('category');
    res.render('product/product.ejs', {products});
})

app.get('/products/new',async(req,res)=>{
    const categories = await Category.find({});
    res.render('product/productForm.ejs', {categories});
})

app.post('/products', async(req,res)=>{
    const product = new Product(req.body);
    await product.save();
    res.redirect('/products');
})

app.get('/products/:id/edit', async(req,res)=>{
    const {id} = req.params;
    const product = await Product.findById(id)
    .populate('category');
    const categories = await Category.find({});

    res.render("product/edit.ejs" ,{product, categories});
})

app.put('/products/:id',async(req,res)=>{
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });

    await product.save()
    res.redirect('/products')
})

app.delete('/products/:id', async(req,res)=>{
    const {id} = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/products");
})

app.get('/categories', async(req,res)=>{
    const categories = await Category.find({});
    res.render('category/category.ejs', {categories});
})

app.get('/categories/new', (req,res)=>{
    res.render('category/categoryForm.ejs');
})

app.post('/categories', async(req,res)=>{
    const category = new Category(req.body);
    await category.save();
    res.redirect("/categories");
})

app.get('/categories/:id/edit', async(req,res)=>{
    const {id} = req.params;
    const category = await Category.findById(id);

    res.render("category/edit.ejs" ,{category});
})

app.put('/categories/:id',async(req,res)=>{
    const {id} = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true });

    await category.save()
    res.redirect('/categories')
})

app.delete('/categories/:id', async(req,res)=>{
    const {id} = req.params;
    await Category.findByIdAndDelete(id);
    res.redirect("/categories");
})

app.get('/orders/:id', async(req,res)=>{
    const order = await Order.findById(req.params.id)
    .populate('customer')
    .populate('products');
    res.render('order/show.ejs',{order});
})

app.get('/orders', async(req,res)=>{
    const orders = await Order.find({}).populate('customer');
    res.render('order/order.ejs', {orders});
})

app.get('/orders/new', async(req,res)=>{
    const products = await Product.find({});
    const customers = await Customer.find({});
    res.render('order/orderForm.ejs', {products,customers});
})

app.post('/orders', async(req,res)=>{
    const order = new Order(req.body);
    await order.save();
    res.redirect("/orders");
})

app.get('/orders/:id/edit', async(req,res)=>{
    const {id} = req.params;
    const order = await Order.findById(id);

    res.render("order/edit.ejs" ,{order});
})

app.put('/orders/:id',async(req,res)=>{
    const {id} = req.params;
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true });

    await order.save()
    res.redirect('/orders')
})

app.delete('/orders/:id', async(req,res)=>{
    const {id} = req.params;
    await Order.findByIdAndDelete(id);
    res.redirect("/orders");
})



app.listen(3000, ()=>{
    console.log("App Is Working in http://localhost:3000/customers");
});