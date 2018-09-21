const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const express = require('express');
const app = express();
const morgan = require('morgan');
const winston = require('winston');

module.exports  = function(){
    if(app.get('env') === 'development'){
        app.use(morgan('tiny'));
        startupDebugger('Morgan enabled....');
    };
    winston.info(dbDebugger('DB enabled....'));
}
