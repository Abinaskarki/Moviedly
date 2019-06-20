const express = require('express');
const {Movie, validate} = require('../models/movie');
const mongoose = require('mongoose');
const {Genre} = require('../models/genre');
const auth = require('../middleware/auth');
const router = express.Router();

//Get all the movie record
router.get('/',async (req, res) =>{
	const movies = await Movie.find().sort({name:1});
	res.send(movies);
});

//Post the new movie record
router.post('/',auth,async (req, res) => {
	//validate if data sent is correct
	const result = validate(req.body);
	if(result.error){ return res.status(400).send(result.error.details[0].message);}

	const genre = await Genre.findById(req.body.genreId);
	if(!genre) { return res.status(404).send('The genreId is not found.');}

	//Create a new movie
	const movie = new Movie({
		title: req.body.title,
		genre: {
			_id: genre._id,
			name: genre.name
		},
		numberInStock: req.body.numberInStock,
		dailyRentalsRate: req.body.dailyRentalsRate
	});

	await movie.save();
	res.send(movie);
});

//Put/Update the movie record
router.put('/:id', async(req, res) => {
	//Check if given data passed is valid
	const result = validate(req.body);
	if(result.error){ return res.status(404).send(result.error.details[0].message);}


	const genre = await Genre.findById(req.body.genreId);
	if(!genre) { return res.status(404).send('The genreId is not found.');}

	const movie = await Movie.findByIdAndUpdate(req.params.id, 
	{
		title: req.body.title,
		genre: {
			_id	: genre._id,
			name: genre.name
		},
		numberInStock: req.body.numberInStock,
		dailyRentalsRate: req.body.dailyRentalsRate
	},
	{new: true})

	//check if movie is valid
	if(!movie) {return res.status(404).send('The movie with given id is not found.');}

	res.send(movie);

});

//Delete movie record
router.delete('/:id', async (req, res) => {
	const movie = await Movie.findByIdAndRemove(req.params.id);

	if(!movie) {return res.status(404).send('The movie with given id is not found.');}

	res.send(movie);	
});

//Get the movie by id
router.get('/:id', async (req, res) => {
	const movie = await Movie.findById(req.params.id);

	if(!movie){return res.status(404).send('The movie with given id is not found.');}

	res.send(movie);
});

module.exports = router;