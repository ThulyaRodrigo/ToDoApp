const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  password: { 
    type: String, 
    required: true,
    minlength: [6, 'Password must be at least 6 characters long']
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
