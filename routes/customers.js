const express = require('express');
const {Customer,validate} = require('../models/customer');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

//Getting all the customers
router.get('/', async (req, res) => {
	const customers = await Customer.find().sort({name: 1});
	res.send(customers);
});

//Posting a new Customer to the MongoDB
router.post('/',auth, async (req, res) => {
	//Validate if we have the body
	const result = validate(req.body);
	if(result.error){ return res.status(400).send(result.error.details[0].message);}

	const customer = new Customer({
		name: req.body.name,
		phone: req.body.phone,
		isGold: req.body.isGold
	});
	await customer.save();
	res.send(customer);
});

//Putting/Updating the existing record

router.put('/:id', async (req, res) =>{
	//Validate genre name
	//if invalid, send 400 error
	const result = validate(req.body);
	if(result.error){return res.status(400).send(result.error.details[0].message);}

	//Get genre using id
	let customer = await Customer.findByIdAndUpdate(
		req.params.id,
 		{ 
 			name: req.body.name, 
 			isGold: req.body.isGold,
 			phone: req.body.phone
 		},
 		{new: true}
		);

	//Check if customer id is found and customer is valid
	if(!customer){
		return res.status(404).send('The customer id is not found');
	}

	res.send(customer);

});

//Deleting the customer record
router.delete('/:id', async (req, res)=>{
	const customer = await Customer.findByIdAndRemove(req.params.id);

	if(!customer){
		return res.status(404).send('The customer id is not found.');
	}
	res.send(customer);
});

//Getting the customer with specified id
router.get('/:id', async (req, res) => {
	const customer = await Customer.findById(req.params.id);

	//Checking if customer is valid, else send 'Not found 404'
	if(!customer){ return res.status(404).send('The customer id is not found.');}

	res.send(customer);

});


module.exports = router;