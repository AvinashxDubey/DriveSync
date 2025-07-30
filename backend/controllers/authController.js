const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const user = require('../models/User.js');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  });
}; 

// Register user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await user.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new user({ name, email, password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(existingUser);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    if (!req.user.id) return res.status(400).json({ message: 'Invalid user ID in token' });

    const foundUser = await user.findById(req.user.id).select('-password');
    if (!foundUser) return res.status(404).json({ message: 'User not found' });

    res.json(foundUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}


module.exports = { register, login, getProfile };