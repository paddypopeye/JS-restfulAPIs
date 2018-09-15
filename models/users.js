const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

//Create  mongoose schema/model
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    email:{
        type: String,
        required: true,
        unique: true,
        minlength: 7,
        maxlength: 255
    },
    password:{
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },

    isAdmin:{
        type: Boolean,
        default: true
    }
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivatekey'));
    return token;
}

//Function for user validation
function validateUser(user){
    const schema = {
            name: Joi.string().min(5).max(255).required(),
            isAdmin: Joi.boolean().optional(),
            email: Joi.string().min(7).max(255).email().required(),
            password: Joi.string().required().min(8).max(1024)};
    return Joi.validate(user, schema);
}
const User = mongoose.model('User', userSchema );
exports.User = User;
exports.validateUser = validateUser;
