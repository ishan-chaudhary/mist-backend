const Winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

var transport = new DailyRotateFile({
    filename: 'mist2021-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    dirname:'logs'
});

const Logger = new Winston.createLogger({
    level: 'info',
    transports: [
        transport
    ],
    exitOnError: false
});

module.exports = Logger;