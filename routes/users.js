const {User, validateUser} = require('../models/users');
const mongoose = require('mongoose');
const express = require('express');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Fawn = require('fawn');
const _ = require('lodash');


router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

//Display all users endpoint
router.get('/', async (req,res) =>{
    const users = await User.find();
    res.send(users);
});

//Display a single user endpoint
router.get('/:id', async (req,res) =>{
    const user = await User.findById(req.params.id);
    if (!user) res.status(404).send('The user was not found...');

    res.send(user);
});

//Create user endpoint
router.post('/', auth, async (req, res) =>{
    try{
    const { error } = validateUser(req.body);
    if (error) return res.status(404).send(error.details[0].message);
    
    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User already exists..!');
    

    user = new User(_.pick(req.body, [ 'name', 'email', 'password', 'isAdmin']));   
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    
    await user.save();
    
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user,['_id', 'name', 'email', 'password','isAdmin']));
    }
    catch(ex){
        res.status(500).send('Something went wrong..!!');
    }    
});

//Update user endpoint
router.put('/:id', auth, async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.phone,
        password: req.body.password,
        isAdmin: req.body.isAdmin
    }, {new: true})
   
   if(!user) return res.status(404).send("The user was not found");
   res.send(user);

});

//Delete user endpoint
router.delete('/:id', auth, async (req, res) => {
    const user =  await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send('The user with the given ID was not found.');
    
    res.send(user);

  });

module.exports = router;