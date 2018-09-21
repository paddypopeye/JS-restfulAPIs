const Joi = require('joi');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const express = require('express');
const router = express.Router();
const {Rental} = require('../models/rentals');
const {Movie} = require('../models/movies');

//Display all returns endpoint.
router.post('/', [auth, validate(validateReturn)], async (req, res) =>{
    
    const rental = await Rental.lookUp(req.body.customerId, req.body.movieId); 
    if(!rental)return res.status(404).send('Rental not found');
    if(rental.dateReturned) return res.status(400).send('Return already processed');

    rental.return();
    await rental.save();

    await Movie.update({_id: rental.movie._id},{
        $inc: { numberInStock: 1 }         
     });

    return res.send(rental);
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