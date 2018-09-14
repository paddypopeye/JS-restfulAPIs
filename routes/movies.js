const { Movie, validateMovie } = require('../models/movies');
const { Genre } = require('../models/genres');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

//Display all movies endpoint
router.get('/', async (req,res) =>{
    const movies = await Movie.find().sort('name');
    res.send(movies);
});

//Display a single movie endpoint
router.get('/:id', async (req,res) =>{
    const movie = await Movie.findById(req.params.id);
    if (!movie) res.status(404).send('The movie was not found...');

    res.send(movie);
});

//Create a new movie
router.post('/', auth, async (req, res) => {
    const { error } = validateMovie(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');
  
    let movie = new Movie({ 
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    });
    movie = await movie.save();
    
    res.send(movie);
  });

//Update a movie
router.put('/:id', auth, async (req, res) => {
    const { error } = validateMovie(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');
  
    const movie = await Movie.findByIdAndUpdate(req.params.id,
      { 
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
      }, { new: true });
  
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');
    
    res.send(movie);
  });

//Delete movie endpoint
router.delete('/:id', auth, async (req, res) => {
    const movie =  await Movie.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');
    
    res.send(movie);

});
module.exports = router;