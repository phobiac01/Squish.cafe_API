var logge = require('logger').createLogger('dev.log');
var objectConstructor = ({}).constructor;



function logger(data, level) {
    switch (level) {
        case 'info':
            logge.info(data);
            break;
        case 'debug':
            logge.debug(data);
            break;
        case 'warn':
            logge.warn(data);
            break;
        case 'error':
            logge.error(data);
            break;
        default:
            logge.info(data);
            break;
    }

    if (data.constructor === objectConstructor) 
        console.log(JSON.stringify(data));
    else
        console.log(data);
}

async function generateNewShort() {
    return "AAAAA";
}

module.exports = { logger, generateNewShort };