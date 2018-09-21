const express = require('express');
const genres = require('../routes/genres');
const users = require('../routes/users');
const movies = require('../routes/movies');
const customers = require('../routes/customers');
const rentals = require('../routes/rentals');
const auth = require('../routes/auth');
const home = require('../routes/home');
const returns = require('../routes/returns');
const error = require('../middleware/error');
const helmet = require('helmet');

module.exports = function(app){

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));
    app.use(helmet());
    app.use('/api/auth', auth);
    app.use('/api/genres', genres);
    app.use('/api/returns', returns);
    app.use('/api/users', users);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/', home);
    app.use(error);
};