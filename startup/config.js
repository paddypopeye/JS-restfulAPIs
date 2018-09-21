const config = require('config');
const winston = require('winston');

module.exports = function(){
    winston.info(`Application name: ${config.get('name')}`);
    winston.info(`Mail Server: ${config.get('mail.host')}`);
    winston.info(`Mail Password: ${config.get('mail.password')}`);
    
    if (!config.get('jwtPrivatekey')){
        throw new Error('FATAL Error.. jwtPrivateKey not defined');    
    }        
};
