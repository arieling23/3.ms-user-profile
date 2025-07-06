const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, 
  name: { type: String, required: true },
  email: { type: String, required: true },
  bio: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  phone: { type: String, default: '' },
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
