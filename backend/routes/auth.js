const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // Validate input
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    if (username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase().trim() }, 
        { username: username.trim() }
      ] 
    });
    
    if (existingUser) {
      if (existingUser.email === email.toLowerCase().trim()) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      if (existingUser.username === username.trim()) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ 
      email: email.toLowerCase().trim(), 
      username: username.trim(), 
      password: hashedPassword 
    });
    
    await user.save();
    
    // Generate token for immediate login after signup
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    
    // Validate input
    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: 'Email/username and password are required' });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase().trim() },
        { username: emailOrUsername.trim() }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '7d' }
    );

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      },
      message: 'Login successful'
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Get current user (verify token)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout (optional: could be used for token blacklisting in the future)
router.post('/logout', auth, async (req, res) => {
  try {
    // For now, logout is handled on frontend by removing token
    // In a production app, you might want to implement token blacklisting
    res.json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
