const Joi = require('joi');
const moment = require('moment');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const {Rental} = require('../models/rentals');
const {Movie} = require('../models/movies');

//Display all returns endpoint
router.post('/', [auth], async (req, res) =>{
    const { error } = validateReturn(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId
    });
    if(!rental)return res.status(404).send('Rental not found');
    
    if(rental.dateReturned) return res.status(400).send('Return already processed');

    rental.dateReturned = new Date();
    const rentalDays = moment().diff(rental.dateOut, 'days');
    rental.rentalFee =  rentalDays * rental.movie.dailyRentalRate;
    await rental.save();

    await Movie.update({_id: rental.movie._id},{
        $inc: { numberInStock: 1 }         
     });

    return res.status(200).send(rental);
});

//Function for Return validation
function validateReturn(req){
    const schema = {
            customerId:Joi.objectId().required(),
            movieId:Joi.objectId().required()
        };

    return Joi.validate(req,schema);
};

module.exports = router; 