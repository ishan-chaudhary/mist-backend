const Ques = require('../models/question');
const User = require('../models/user');
const Lodash = require('lodash');
const Moment = require('moment');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

const inCorrectArray = ['You are the reason God created the middle finger', 'There’s only one problem with your face, we can see it', 'And I thought, braindead was an insult. Turns out, it’s an adjective for you', 'Tum toh bade heavy driver ho bhai', 'Sharaab pikar type naa karein', ' I was having a good day before I got this answer to read', ' I just think you have bad luck, when you are thinking. Not calling you stupid', 'Turns out there is a level zero', 'Your answer is so stupid, it made a happy meal cry', 'Tauba Tauba, Saara Mood Kharab kardiya', 'Tu wahi hai na Vro, Jo khud ko genius samajhta hai', 'Galat answer dene ke liye Azadi dilayi thi - Mahatma Gandhi'];

const correctArray = ['Tum to bade heavy driver ho Bhai.', 'Bete re bete mauj karadi', ' You set a score, now beat it as your dad did to your face.', 'You beat your score, you finally have something to be proud of.NOICE']

async function unlockLevel(userId, level) {
    try {
        let temp = {
            level: level,
            endTime: new Date()
        }
        await User.findByIdAndUpdate(userId, { $push: { attempts: temp }, $inc: { levelUnlocked: 1 }, $set: { lastAnswered: new Date() } });
    } catch (err) {
        console.log(err); throw new Error(err);
    }
}

function stopHasteAnswer(attempts, haltTime) {
    if (attempts.length == 0) { return true };
    let lastAnswerTime = Moment(attempts[attempts.length - 1].endTime);
    let today = Moment(new Date())
    if (today.diff(lastAnswerTime, 'minute') >= haltTime) {
        return true;
    } else {
        return false;
    }
}

module.exports.checkAnswer = async (req, res) => {
    try {
        return res.status(200).json({
            isCorrect: false,
            message: 'The submission time is over. Thank you for participating.'
        })
        // let answer = `${req.body.answer}`;
        // answer = answer.toString().trim().toLowerCase();
        // let ques = await Ques.findById(req.params.id);
        // if (ques) {
        //     let correctAnswer = ques.answer;
        //     correctAnswer = correctAnswer.toString().trim().toLowerCase();
        //     if (ques.level != req.user.levelUnlocked) {
        //         return res.status(200).json({
        //             isCorrect: false,
        //             message: 'Abey backchodi mat kar'
        //         });
        //     }
        //     if (answer === correctAnswer) {
        //         let proceed = stopHasteAnswer(req.user.attempts, ques.haltTime);
        //         if (proceed) {
        //             await unlockLevel(req.user._id, ques.level);
        //             return res.status(200).json({
        //                 isCorrect: true,
        //                 message: Lodash.sample(correctArray, 1)
        //             });
        //         } else {
        //             let user = await User.findOneAndUpdate({ _id: req.user._id }, { $inc: { numPrompt: 1 } }, { runValidators: true, new: true });
        //             // if(user.numPrompt > 5){
        //             //  user.disqualified = true
        //             //  await user.save();
        //             // }
        //             return res.status(200).json({
        //                 isCorrect: false,
        //                 message: `Itni jaldi kya hai, kisne bataya answer? Strike - ${user.numPrompt}`
        //             });
        //         }
        //     } else {
        //         return res.status(200).json({
        //             isCorrect: false,
        //             message: Lodash.sample(inCorrectArray, 1)
        //         })
        //     }
        // } else {
        //     return res.status(400).json({
        //         isCorrect: false,
        //         message: 'Abey backchodi mat kar'
        //     });
        // }
    } catch (err) {
        console.log(err); throw new Error(err);
    }
}

module.exports.leaderboard = async (req, res) => {
    try {
        let data = await User.find({ disqualified: false }).sort({ levelUnlocked: -1, lastAnswered: 1, _id: 1 }).select('email name levelUnlocked lastAnswered');
        return res.render('leaderboard', { data: data, moment: moment });
    } catch (err) {
        console.log(err); throw new Error(err);
    }
}

module.exports.editTable = async (req, res) => {
    try {
        let data = await Ques.find().sort({ level: 1 });
        return res.render('editTable', { data: data });
    } catch (err) {
        console.log(err); throw new Error(err)
    }
}

module.exports.editForm = async (req, res) => {
    try {
        let data = await Ques.findById(req.params.id).lean();
        return res.render('editForm', { data: data });
    } catch (err) {
        console.log(err); throw new Error(err);
    }
}

module.exports.edit = async (req, res) => {
    try {
        delete req.body._id;
        let question = await Ques.findById(req.params.id);
        Ques.uploadImage(req, res, async function (err) {
            if (err) {
                console.log('Multer err', err)
                throw new Error(err);
            }
            if (req.file) {
                fs.unlinkSync(path.join(__dirname, "..", question.content));
                question.content = Ques.photoPath + "/" + req.file.filename;
            }
            question.hint = req.body.hint;
            question.answer = req.body.answer;
            question.active = req.body.active;
            question.haltTime = req.body.haltTime;
            await question.save();
            req.flash('success', 'Updated Question');
            return res.redirect('/editTable');
        })
    } catch (err) {
        console.log(err); throw new Error(err);
    }
}

module.exports.addForm = async (req, res) => {
    try {
        return res.render('addForm')
    } catch (err) {
        console.log(err); throw new Error(err);
    }
}

module.exports.add = async (req, res) => {
    try {
        Ques.uploadImage(req, res, async function (err) {
            if (err) {
                console.log('Multer err', err)
                throw new Error(err);
            }
            if (req.file) {
                req.body.content = Ques.photoPath + "/" + req.file.filename;
            }
            let question = new Ques({
                ...req.body
            })
            await question.save();
            req.flash('success', 'Added Question');
            return res.redirect('/editTable');
        })
    } catch (err) {
        console.log(err); throw new Error(err);
    }
}