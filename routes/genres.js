const { Genre, validateGenre } = require('../models/genres');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//Display all genres endpoint
router.get('/', async (req, res, next) =>{
    //throw new Error('Testing winston is working');
    const genres = await Genre.find().sort('name');
    res.send(genres);    
});

//Display a single genre endpoint
router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);
  
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
    res.send(genre);
  });

//Create genre endpoint
router.post('/', auth, async (req, res) =>{
    try{
        const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({ name: req.body.name });

    genre = await genre.save();
    res.send(genre);
    }catch(ex){
        res.status(500).send('Something Failed...!!!');
    }   
});

//Update genre endpoint
router.put('/:id',[auth, validateObjectId], auth, async (req, res) => { 
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    }, {
        new: true
    })
   
   if(!genre) return res.status(404).send("The genre was not found");
   res.send(genre);

});

//Delete genre endpoint
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    try{
        const genre =  await Genre.findByIdAndRemove(req.params.id);
        res.send(genre);
    }
    catch(ex){
        if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    }
});

module.exports = router;