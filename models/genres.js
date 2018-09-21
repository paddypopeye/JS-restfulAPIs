const mongoose = require('mongoose');
const Joi = require('joi');

//Create  mongoose schema/model
const genreSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
        }
});

//Function for Genre validation
function validateGenre(genre){
    const schema = {
            name: Joi.string().min(5).max(50).required()};
    return Joi.validate(genre, schema);
};
const Genre = mongoose.model('Genre', genreSchema);

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validateGenre = validateGenre;