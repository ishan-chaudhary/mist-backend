const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');


passport.use(new googleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK
},
    async function (accessToken, refreshToken, profile, done) {
        // console.log(accessToken);
        // console.log('Profile',profile);
        User.findOne({ email: profile.emails[0].value }).exec(function (err, user) {
            if (err) { console.log("error in google-passport", err); return; }
            if (user) {
                if (user.disqualified) {
                    return done(null, false);
                } else {
                    return done(null, user);
                }
            } else {
                User.create({
                    name: (profile.displayName).split(" ", 2)[0] + " " + (profile.displayName).split(" ", 2)[1],
                    email: profile.emails[0].value
                }, function (err, user) {
                    if (err) { console.log("error in creating user", err); return; }
                    return done(null, user);
                })
            }
        });
    }
))

passport.serializeUser(function (user, done) {
    return done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
    let user = await User.findById(id);
    return done(null, user);
});

//check if user is authenticated or not
passport.checkAuthentication = function (req, res, next) {
    if (req.isAuthenticated() && !req.user.disqualified) {
        return next();
    } else {
        if (req.xhr) {
            return res.status(403).json({
                message: 'You have been disqualified!!'
            })
        } else {
            req.flash('error', 'Permission Denied!! Login In to Proceed');
            return res.redirect('/');
        }
    }
};

passport.checkRole = function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    } else {
        req.flash('error', 'You are not authorized');
        return res.redirect('/');
    }
};


//set the user for the views
passport.setAuthenticatedUser = async function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    return next();
};

module.exports = passport;