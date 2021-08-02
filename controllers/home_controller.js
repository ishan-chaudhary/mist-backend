const Ques = require('../models/question');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

async function fetchAllMemes() {
    try{
        let folderPath = path.join(__dirname, '..', 'assests/images/memes');
        let files = fs.readdirSync(folderPath);
        return _.shuffle(files);
    }catch(err){
        console.log(err);
        throw new Error(err);
    }
}

module.exports.home = async (req, res) => {
    try {
        let memes = await fetchAllMemes();
        if (!req.user) {
            return res.render('index', { questions: [], memes: memes });
        } else {
            let questions = await Ques.find({ $and: [{ level: { $lte: req.user.levelUnlocked } }, { active: true }] }).sort({ level: -1 });
            let totalQuestions = await Ques.find({}).countDocuments();
            return res.render('index', { questions: questions, memes: memes , totalQuestions : totalQuestions });
        }
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}