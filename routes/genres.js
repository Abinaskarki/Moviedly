const express = require('express');
const {Genre, validate} = require('../models/genre');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const validateID = require('../middleware/validateObjectId');

// //Getting all the genres
router.get('/',async (req, res, next) =>{
		const genres = await Genre.find().sort({name:1});
		res.send(genres);
});

//Posting a new genres to the array
router.post('/',auth,async (req, res) => {
	//Validate if we have the body
	const result = validate(req.body);
	if(result.error){
		return res.status(400).send(result.error.details[0].message);
	}

	const genre = new Genre({name: req.body.name });

	await genre.save();
	res.send(genre);

});	

//Putting/Updating the existing record
router.put('/:id',async (req, res) => {
	//Validate genre name
	//if invalid, send 400 error
	const result = validate(req.body);
	if(result.error) return res.status(400).send(result.error.details[0].message);

	const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});

	//check if genre id is found or not
	//if not found return 404
	if(!genre) return res.status(404).send('The genre id is not found');

	//Update a genre
	res.send(genre);
});

//Deleting the genre record
router.delete('/:id',[auth,admin],async (req, res) => {

	const genre = await Genre.findByIdAndRemove(req.params.id);
	//check if given id is present
	//if not, return 404 error
	if(!genre) return res.status(404).send('The given genre id is not found');

	res.send(genre);
});

//Getting the genres with specific id
router.get('/:id', validateID, async (req, res) =>{
	//Checking if genre id is found or not

	//if not valid, send 'Not found'
	const genre = await Genre.findById(req.params.id);
	if(!genre) return res.status(404).send('The given id is not found in genres array.');

	res.send(genre);
});

module.exports = router;

