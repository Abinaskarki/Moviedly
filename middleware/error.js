const winston = require('winston');

module.exports = function(err,req, res, next){
	winston.error(err.message, err);
	//logging error levels 
	//1. error, 2. warn, 3.info, 4.verbose, 5.debug, 6.silly
	res.status(500).send('Something failed.');
}