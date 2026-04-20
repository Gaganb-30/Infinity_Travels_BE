const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// GET /api/destinations - List all active destinations with filters
router.get('/', async (req, res) => {
  try {
    const { country, type, tier, season, search, category } = req.query;
    const filter = { isActive: true };

    if (category && (category === 'Domestic' || category === 'International')) {
      filter.category = category;
    }
    if (country && country !== 'All Countries') filter.country = country;
    if (type) filter.type = type;
    if (tier && tier !== 'Any Budget') filter.tier = tier;
    if (season) filter.seasons = { $in: [season] };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const destinations = await Destination.find(filter).sort({ isFeatured: -1, createdAt: -1 });
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/destinations/featured - Featured destinations for homepage
router.get('/featured', async (req, res) => {
  try {
    const destinations = await Destination.find({ isActive: true, isFeatured: true })
      .limit(6)
      .sort({ createdAt: -1 });
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/destinations/countries - Unique country list for filter
router.get('/countries', async (req, res) => {
  try {
    const countries = await Destination.distinct('country', { isActive: true });
    res.json(countries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/destinations/:slug - Single destination
router.get('/:slug', async (req, res) => {
  try {
    const destination = await Destination.findOne({ slug: req.params.slug, isActive: true });
    if (!destination) return res.status(404).json({ error: 'Destination not found' });

    // Also fetch packages for this destination
    const Package = require('../models/Package');
    const packages = await Package.find({ destination: destination._id, isActive: true });

    res.json({ destination, packages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
