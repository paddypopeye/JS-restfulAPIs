const Joi = require('joi');
const bcrypt  = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const {User, userSchema} = require('../models/users');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send('Invalid...');

    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid mail or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');
    const token = user.generateAuthToken();
    res.send(token);
});
function validate(req){
    schema ={
         email:Joi.string().required().min(7).max(255),
        password: Joi.string().required().min(8).max(1024)
    }

    return Joi.validate(req, schema);
};
module.exports = router;