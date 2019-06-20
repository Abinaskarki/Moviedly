const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/jwtconfig')();
require('./startup/routes')(app);
require('./startup/dbconnect')();
require('./startup/validation')();

//Taking existing port using environment variable if exist else use 3000
const port = process.env.PORT || 3000;

const server = app.listen(port, () => winston.info(`Listening to port ${port} ...`));

module.exports = server;
