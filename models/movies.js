const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('./genres');
//Create  mongoose schema/model

const Movie = mongoose.model('Movie', new mongoose.Schema({
    //TODO properties of Movie schema
    title:{
        type: String,
        required: true,
        trim:true,
        minlength: 5,
        maxlength: 255
    },
    genre:{
       type: genreSchema,
       required: true
    },
    numberInStock:{
        type: Number,
        required: true,
        min: 1,
        max: 255
    },
    dailyRentalRate:{
        type: Number,
        required: true,
        min: 1,
        max: 255
    }
}));

//Function for Movie validation
function validateMovie(movie){
    const schema = {
            title: Joi.string().min(5).max(255).required(),
            genreId: Joi.objectId().required(),
            numberInStock: Joi.number().min(1).max(255).required(),
            dailyRentalRate: Joi.number().min(1).max(255).required()
    }
    return Joi.validate(movie, schema);
};
exports.Movie = Movie;
exports.validateMovie = validateMovie;