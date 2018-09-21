const {Customer, validateCustomer} = require('../models/customers');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
//Display all customers endpoint
router.get('/', async (req,res) =>{
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

//Display a single customer endpoint
router.get('/:id', async (req,res) =>{
    const customer = await Customer.findById(req.params.id);
    if (!customer) res.status(404).send('The customer was not found...');

    res.send(customer);
});

//Create customer endpoint
router.post('/', auth, async (req, res) =>{
    try{
        const { error } = validateCustomer(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    let customer = new Customer({ 
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
     });

    customer = await customer.save();
    res.send(customer);
    }catch (err){
        console.log(err);
    }
    
});

//Update customer endpoint
router.put('/:id', auth, async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    }, {
        new: true
    })
   
   if(!customer) return res.status(404).send("The customer was not found");
   res.send(customer);

});

//Delete customer endpoint
router.delete('/:id', auth, async (req, res) => {
    const customer =  await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
    
    res.send(customer);

  });

module.exports = router;