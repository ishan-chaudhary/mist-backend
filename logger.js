/* ------------------------ \
This is Made Just for basic understanding of logging . 
Refer to winston.js file to learn how to save logs.        
\---------------------------- */


const chalk = require("chalk");
const { log } = require("util");


const red = chalk.redBright;
const green = chalk.greenBright;
const yellow = chalk.yellowBright;
const cyan = chalk.cyanBright.bold;
const bgRed = chalk.bgRedBright;
const bgGreen = chalk.bgGreenBright;
const bgYellow = chalk.bgYellow;

module.exports.requestLogger = (req, res, next) => {
    log(green(`${req.method} ${req.originalUrl}`));
    const start = new Date().getTime();
    res.on("finish", () => {
        const elapsed = new Date().getTime() - start;
        reqConsoleLogger({
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            time: elapsed
        });
    });
    next();
};


const reqConsoleLogger = (logValue) => {
    let { status, method, url, time } = logValue;
    if (status < 400) {
        log(green(`${method} ${url} -> `) + bgGreen(`${status}`) + cyan(` ${time}ms`));
    } else if (status < 500) {
        log(yellow(`${method} ${url} -> `) + bgYellow(`${status}`) + cyan(` ${time}ms`));
    } else {
        log(red(`${method} ${url} -> `) + bgRed(`${status}`) + cyan(` ${time}ms`));
    }
}
