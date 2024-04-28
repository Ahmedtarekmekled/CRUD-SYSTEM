const mongoose = require('mongoose');
const Address = require('./addressModel');

const customerSchema =new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
    },
    phoneNumber:{
        type: Number
    },
    addresses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address' 
    }]
})

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;