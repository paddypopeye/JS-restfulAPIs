const { Customer } = require('../models/customers');
const { Movie } = require('../models/movies');
const { Rental, validateRental } = require('../models/rentals');
const { Genre } = require('../models/genres');
const mongoose = require('mongoose');
const express = require('express');
const auth = require('../middleware/auth');
const Fawn = require('fawn');
const router = express.Router();

Fawn.init(mongoose);    

//Display all rentals endpoint
router.get('/', async (req,res) =>{
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

//Display a single rental endpoint
router.get('/:id', async (req,res) =>{
    try{
        const rental = await Rental.findById(req.params.id);
        if (!rental) return res.status(404).send('The rental was not found...');
        res.send(rental);
    }catch(ex){
        console.log(ex);
    }
});

//Create a new rental
router.post('/', auth, async (req, res) => {
    const { error } = validateRental(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer.');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid Movie');

    if (movie.numberInStock === 0) return res.status(400).send('Movie is out of stock');
    

    let rental = new Rental({ 
        customer: {
            _id: customer._id,
            name: customer.name, 
            phone: customer.phone
          },
          movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
          }
    });
    try{
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {_id: movie._id},
            {$inc:{numberInStock:-1}})
            .run();    
        }
        catch(ex){
            res.status(500).send('Something went wrong..!!');
        }    
    res.send(rental);
  });

//Delete rental endpoint
router.delete('/:id', auth, async (req, res) => {
    const rental =  await Rental.findByIdAndRemove(req.params.id);
    if (!rental) return res.status(404).send('The rental with the given ID was not found.');
    
    res.send(rental);

});
module.exports = router;