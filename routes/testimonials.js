const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');

// GET /api/testimonials - List all active testimonials
router.get('/', async (req, res) => {
  try {
    const { limit } = req.query;
    let query = Testimonial.find({ isActive: true })
      .populate('destination', 'name slug')
      .sort({ createdAt: -1 });
    
    if (limit) query = query.limit(parseInt(limit));
    
    const testimonials = await query;
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
