//REGISTERING NEW USER
const _ = require('lodash');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config  = require('config');
const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const {User, validate} = require('../models/user');
const router = express.Router();

router.get('/me',auth,async (req, res) =>{
	const user = await User.findById(req.user._id)
						.select('-password');
	res.send(user);
});

router.post('/', async (req, res) => {
	//Validate if send data is valid
	const result = validate(req.body);
	if(result.error){ return res.status(400).send(result.error.details[0].message);}

	let user = await User.findOne({email: req.body.email});
	if(user) return res.status(400).send('User already registered');

	user = new User( _.pick(req.body,['name','email','password']));
	const salt = await bcrypt.genSalt(10);
	user.password  = await bcrypt.hash(user.password, salt);	

	await user.save();

	const token = user.generateAuthToken();
	res.header('x-auth-token', token).send(_.pick(user,['_id','name', 'email']));

});	

module.exports = router;


// router.get('/', async (req, res) =>{
// 	const users = await User.find();

// 	if(!users) { return res.status(404).send('The users cannot be found.');}
// 	res.send(users);
// });	

// router.put('/:id', async (req, res) => {
// 	const result = validate(req.body);
// 	if(result.error) {return res.status(400).send(result.error.details[0].message);}

// 	const user = await User.findByIdAndUpdate(req.params.id, {
// 		name: req.body.name,
// 		email: req.body.email,
// 		password: req.body.password
// 	}, {new: true});

// 	if(!user) {return res.status(404).send('The given user id is not found.');}

// 	res.send(user);
// });

// router.get('/:id', async (req, res) => {
// 	const user = await User.findById(req.params.id);

// 	if(!user) {return res.status(404).send('The given user id is not found.');}

// 	res.send(user);
// });	

