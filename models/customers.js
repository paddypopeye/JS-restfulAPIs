const mongoose = require('mongoose');
const Joi = require('joi');

//Create  mongoose schema/model
const Customer = mongoose.model('Customer', new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    phone:{
        type: Number,
        required: true,
    },
    isGold:{
        type: Boolean,
        default: false
    }
}));

//Function for customer validation
function validateCustomer(customer){
    const schema = {
            name: Joi.string().min(3).max(255).required(),
            isGold: Joi.boolean().optional(),
            phone: Joi.number().optional()};
    return Joi.validate(customer, schema);
}


exports.Customer = Customer;
exports.validateCustomer = validateCustomer;