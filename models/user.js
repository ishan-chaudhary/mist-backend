const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  levelUnlocked: { type: Number, default: 1 },
  attempts: [
    {
      level: Number,
      endTime: Date
    }
  ],
  role: { type: String, default: 'player', enum: ['player', 'admin'] },
  lastAnswered: Date,
  disqualified: { type: Boolean, default: false },
  numPrompt: { type: Number, default: 0 }
}, {
  timestamps: true
})

const User = mongoose.model('User', userSchema);

module.exports = User;