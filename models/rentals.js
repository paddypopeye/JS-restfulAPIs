const Joi = require('joi');
const mongoose = require('mongoose');

const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer:{
        type: new mongoose.Schema({
            name:{
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255
            },
            isGold:{
                type: Boolean,
                required: true,
                default: false
            },
            phone:{
                type: String,
                required: true,
                minlength: 1,
                maxlength: 255
            }
            
        }),
        required: true,
    },
    movie:{
        type: new mongoose.Schema({
            title:{
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255
            },
            dailyRentalRate:{
                type: Number,
                required: true
            }
        }),
        required:true,
    },
    dateOut:{
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned:{
        type: Date
    },
    rentalFee:{
        type: Number,
        min: 0
    }
}));

async function validateRental(rental) {
        const schema   = {
            customerId: Joi.objectId().required(),
            movieId: Joi.objectId().required()
        }
        return Joi.validate(rental, schema);
};
exports.Rental  = Rental;
exports.validateRental = validateRental;