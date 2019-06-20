const express = require('express');
const Fawn  = require('fawn');
const mongoose = require('mongoose');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');
const {Rental, validate} = require('../models/rental');
const router = express.Router();

Fawn.init(mongoose);

//Get all rentals 
router.get('/', async (req, res) => {
	const rental = await Rental.find().sort({dateOut: -1});
	res.send(rental);
});

//post/add new rentals
router.post('/', async (req, res)=>{
	//Check if given data is valid or not
	const result = validate(req.body);
	if(result.error){ return res.status(400).send(result.error.details[0].message);}

	//Check if given customer id is valid
	const customer = await Customer.findById(req.body.customerId);
	if(!customer){ return res.status(404).send('The given customer id is not found.');}

	//Check if given movie id is valid
	const movie = await Movie.findById(req.body.movieId);
	if(!movie){ return res.status(404).send('The given movie id is not found.');}

	//check if movie is in stock
	if(movie.numberInStock <= 0){return res.status(400).send('Out of Stock...'); }

	let rental = new Rental({
		customer: {
			_id: customer._id,
			name:customer.name,
			phone: customer.phone,
			isGold:customer.isGold
		},
		movie:{
			_id: movie._id,
			title: movie.title,
			numberInStock:movie.numberInStock,
			dailyRentalsRate: movie.dailyRentalsRate
		}
	});

	try{
		new Fawn.Task()
			.save('rentals', rental)
			.update('movies', {_id: movie._id},{
				$inc:{numberInStock : -1}
			})
			.run();
		res.send(rental);	
	}
	catch(ex){
		res.status(500).send('Something failed...');
	}
	
});

//Get rentals record by id
router.get('/:id', async (req, res)=>{
	const rental = await Rental.findById(req.params.id);
	if(!rental){ return res.status(404).send('The given rental id is not found.');}

	res.send(rental);
});

module.exports = router;