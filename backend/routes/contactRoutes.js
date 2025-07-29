const express = require('express');
const ContactUs = require('../models/ContactUs.js');
const router = express.Router();

router.post('/contact-us', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = await ContactUs.create({ name, email, message });
    res.status(201).json({ message: 'Message received', data: newMessage });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
