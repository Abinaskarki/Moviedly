const express = require('express');
const error = require('../middleware/error');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');

module.exports = function(app){
	app.use(express.json());

	//Using genres.js 
	app.use('/api/genres',genres);

	//Using customers.js
	app.use('/api/customers', customers);

	//Using movies.js
	app.use('/api/movies', movies);

	//Using rentals.js
	app.use('/api/rentals', rentals);

	//Using users.js
	app.use('/api/users', users);

	//Using auth.js
	app.use('/api/auth', auth);

	app.use(error);	
}

