const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersController = require('../controllers/user_controller');
const homeController = require('../controllers/home_controller');
const quizController = require('../controllers/quiz_controller');
//Limiting NUmber of requests from a single IP
const rateLimit = require("express-rate-limit");
const apiLimiter = rateLimit({
    windowMs: 1000,
    max: 10,
    message: 'Kyu be, kis baat ki jaldi hai !!!'
});

//Logging Requests for production diagnostics
// const logger = require('../logger'); No longer needed do you use of morgan

router.use("/answer/:id", apiLimiter);

//Common Routes
router.get('/', homeController.home);

//Quiz Routes; 
router.post('/answer/:id', passport.checkAuthentication, quizController.checkAnswer);
router.get('/leaderboard', quizController.leaderboard);
router.get('/add', passport.checkAuthentication, passport.checkRole, quizController.addForm);
router.post('/add', passport.checkAuthentication, passport.checkRole, quizController.add);
router.get('/editTable', passport.checkAuthentication, passport.checkRole, quizController.editTable);
router.get('/edit/:id', passport.checkAuthentication, passport.checkRole, quizController.editForm);
router.post('/edit/:id', passport.checkAuthentication, passport.checkRole, quizController.edit)

//User Routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: 'https://mist.ieeedtu.in/', failureFlash: "You have been disqualifed.",
    successFlash: "Logged you in!"
}), usersController.create_session);
router.get('/user/editTable', passport.checkAuthentication, passport.checkRole, usersController.editTable);
router.get('/user/edit/:id', passport.checkAuthentication, passport.checkRole, usersController.edit);
router.get('/logout', passport.checkAuthentication, usersController.destroySession);


// router.get('/auth/bypass', (req, res) => { return res.render('login') });
// router.post('/auth/bypass', passport.authenticate('local', {
//     failureRedirect: './', failureFlash: "Unable To Proceed Further",
//     successFlash: "Logged you in!"
// }), usersController.create_session);

module.exports = router;