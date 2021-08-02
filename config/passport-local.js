const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new localStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, function (req, email, password, done) {
    User.findOne({ email: email }, function (err, user) {
        if (err) {
            console.log('error in finding-->passport');
            return done(err);
        }
        return done(null, user);
    });
}
));
 

module.exports = passport;