const express = require('express');
const path = require('path');
const port = 8000;
const compression = require('compression');
const helmet = require('helmet');

const app = express();

const Morgan = require('morgan');
const Logger = require('./winston');

//Compression using gzip
app.use(compression());

//Adding Extra headers for security
app.use(helmet(
  {
    contentSecurityPolicy: false,
    dnsPrefetchControl: false,
    referrerPolicy: ["origin", "unsafe-url"],
  }
));

//Declaring static files
app.use(express.static(path.join(__dirname, 'assests')));
app.use("/uploads", express.static(__dirname + "/uploads"));

const session = require('express-session');
const flash = require('connect-flash');
const db = require('./config/mongoose');


const passport = require('passport');
const strategy_Google = require('./config/passport-google-strategy');
const localStrategy = require('./config/passport-local')

const mongoStore = require('connect-mongo')(session);

app.use(session({
  name: 'IEEE-DTU',
  secret: 'utt4MOOxHZwzmZBtEWoY1ByGUDBYqlZb',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: (1000 * 60 * 100 * 10)
  },
  store: new mongoStore({
    mongooseConnection: db,
    autoRemove: 'disbaled'
  })
},
))

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(function (req, res, next) {
  res.locals.flash = {
    'success': req.flash('success'),
    'error': req.flash('error')
  }
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded());

//Logging of errors using winston and morgan 

app.use(Morgan("dev", { 
  stream: Logger.stream.write ,
}))

app.use('/', require('./routes'));

app.use(function (err, req, res, next) {
  Logger.error(`${req.method} - ${err.message}  - ${req.originalUrl} - ${req.ip}`);
  next(err)
})

app.listen(port, function (err) {
  if (err) {
    console.log('Error in opening server');
    return;
  }
  console.log('server is serving', port);
  return;
})