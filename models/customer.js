const mongoose = require('mongoose');
const Joi = require('joi');


const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    }
});

const Customer = mongoose.model('Customer', customerSchema);


function validateCustomer(customer) {
    //object is key:value pairs
    //value here is about that items shape interms of type and limits
    const customer_schema = Joi.object({
        name: Joi.string().min(5).max(255).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(5).max(255).required()
    });

    return customer_schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;

