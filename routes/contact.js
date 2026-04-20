const express = require('express');
const router = express.Router();
const ContactInquiry = require('../models/ContactInquiry');

// POST /api/contact - Submit a contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const inquiry = await ContactInquiry.create({ name, email, phone, subject, message });
    res.status(201).json({ message: 'Your inquiry has been submitted successfully!', id: inquiry._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
