const jwt = require('jsonwebtoken');
const _ = require('lodash');
const config = require('config');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const {User} = require('../models/user');
const router = express.Router();

router.post('/', async (req, res) => {
	//Validate if send data is valid
	const result = validate(req.body);
	if(result.error){ return res.status(400).send(result.error.details[0].message);}

	//Validate email
	let user = await User.findOne({email: req.body.email});
	if(!user) return res.status(400).send('Invalid email or password');

	//Validate password
	const validPassword  = await bcrypt.compare(req.body.password, user.password);
	if(!validPassword) return res.status(400).send('Invalid email or password');

	const token = user.generateAuthToken();
	res.send(token);

});	

function validate(req) {
	const schema = {
		email: Joi.string().min(5).max(255).required().email(),
		password: Joi.string().min(5).max(255).required()
	}
	return Joi.validate(req,schema);
}

module.exports = router;
