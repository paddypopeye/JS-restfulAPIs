const express = require('express');
const app = express();
const winston = require('winston');

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/debugging')();
require('./startup/prod')(app);

//Set PORT envVariable
const port = process.env.PORT || 3000;
winston.info(process.env.PORT);
//Start serve
const server = app.listen(port, () => winston.info(`Listening on port ${port}....`));

//app.set('view engine', 'pug');
//app.set('views', './views');
module.exports = server;
