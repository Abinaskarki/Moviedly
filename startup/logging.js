require('express-async-errors');
const winston = require('winston');
//require('winston-mongodb');


module.exports = function(){
	winston.handleExceptions(
		new winston.transports.Console({colorize:true, prettyPrint:true}),
		new winston.transports.File({filename: 'uncaughtExceptions.log'}));

	process.on('unhandledRejection', (ex) =>{
		throw ex;
	});
	// process.on('unhandledRejection', (ex) =>{
	// 	console.log('WE GOT AN UNHANDLED EXCEPTION.');
	// 	winston.error(ex.message,ex);
	// });
	winston.add(winston.transports.File, {filename: 'logfile.log'});
	// winston.add(winston.transports.MongoDB, 
	// 	{db:'mongodb://localhost/Film-Genres',
	// 	level:'error'}
	// 	);

	// const p = Promise.reject(new Error('Something failed miserably!'));
	// p.then(()=>console.log('DONE.'));

}
