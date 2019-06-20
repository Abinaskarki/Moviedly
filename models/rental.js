const Joi = require('joi');
const mongoose = require('mongoose');


const rentalSchema = new mongoose.Schema({
	customer:{
		type: new mongoose.Schema({
			name:{
				type: String,
				required: true,
				minlength: 3,
				maxlength: 50
			},
			phone: {
				type: String,
				required: true,
				minlength: 5,
				maxlength: 50
			},
			isGold:{
				type: Boolean,
				default:false
			}
		}),
		required: true
	},
	movie: {
		type: new mongoose.Schema({
			title:{
				type: String,
				required: true,
				minlength: 5,
				maxlength: 50
			},
			numberInStock:{
				type: Number,
				required: true,
				min:0,
				max:255
			},
			dailyRentalsRate:{
				type: Number,
				required: true,
				min: 0,
				max: 255
			}
		}),
		required: true
	},
	dateOut:{
		type:Date,
		default: Date.now,
		required: true
	},
	dateReturned:{
		type: Date,
	},
	rentalFee:{
		type: Number,
		min: 0
	}
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateSchema(rental){
	const schema = {
		customerId: Joi.objectId().required(),
		movieId: Joi.objectId().required()
	}

	return Joi.validate(rental, schema);
}

module.exports.Rental = Rental;
module.exports.validate = validateSchema;