const express = require('express');
const router = express.Router();
const Package = require('../models/Package');

// GET /api/packages - List all active packages with filters
router.get('/', async (req, res) => {
  try {
    const { type, minBudget, maxBudget, duration, search, destination } = req.query;
    const filter = { isActive: true };

    if (type) filter.type = type;
    if (destination) filter.destination = destination;
    if (minBudget) filter['priceRange.min'] = { $gte: parseInt(minBudget) };
    if (maxBudget) filter['priceRange.max'] = { $lte: parseInt(maxBudget) };
    if (duration) {
      // duration: "1-4", "5-10", "11+"
      if (duration === '1-4') filter.days = { $gte: 1, $lte: 4 };
      else if (duration === '5-10') filter.days = { $gte: 5, $lte: 10 };
      else if (duration === '11+') filter.days = { $gte: 11 };
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const packages = await Package.find(filter)
      .populate('destination', 'name slug country')
      .sort({ isPopular: -1, isFeatured: -1, createdAt: -1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/packages/popular - Popular packages for homepage
router.get('/popular', async (req, res) => {
  try {
    const packages = await Package.find({ isActive: true, isPopular: true })
      .populate('destination', 'name slug country')
      .limit(6)
      .sort({ rating: -1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/packages/:slug - Single package detail
router.get('/:slug', async (req, res) => {
  try {
    const pkg = await Package.findOne({ slug: req.params.slug, isActive: true })
      .populate('destination');
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
