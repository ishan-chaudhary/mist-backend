const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const PHOTO_PATH = path.join('/uploads/questions');

const questionSchema = new mongoose.Schema({
    content: { type: String, required: true, unique: true },
    answer: { type: String, required: true },
    level: { type: Number, required: true },
    active: { type: Boolean, default: false },
    hint: { type: String, default: "#" },
    haltTime: { type: Number, default: 3 }
})

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', PHOTO_PATH));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

questionSchema.statics.uploadImage = multer({ storage: storage }).single('content');
questionSchema.statics.photoPath = PHOTO_PATH;

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;