const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const Package = require('../models/Package');

// GET /api/search?q=... - Search destinations and packages
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json({ destinations: [], packages: [] });
    }

    const searchRegex = { $regex: q, $options: 'i' };

    const [destinations, packages] = await Promise.all([
      Destination.find({
        isActive: true,
        $or: [
          { name: searchRegex },
          { country: searchRegex },
          { description: searchRegex },
        ],
      }).limit(5).select('name slug country heroImage tier'),
      
      Package.find({
        isActive: true,
        $or: [
          { name: searchRegex },
          { location: searchRegex },
          { description: searchRegex },
        ],
      }).limit(5).select('name slug location image priceRange duration'),
    ]);

    res.json({ destinations, packages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
