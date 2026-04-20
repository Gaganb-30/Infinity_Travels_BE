const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Destination = require('../models/Destination');
const Package = require('../models/Package');
const Testimonial = require('../models/Testimonial');
const ContactInquiry = require('../models/ContactInquiry');

// All admin routes require authentication
router.use(authMiddleware);

// ========================
// DESTINATIONS CRUD
// ========================

// GET /api/admin/destinations
router.get('/destinations', async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ createdAt: -1 });
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/destinations
router.post('/destinations', async (req, res) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json(destination);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/admin/destinations/:id
router.put('/destinations/:id', async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!destination) return res.status(404).json({ error: 'Destination not found' });
    res.json(destination);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/admin/destinations/:id
router.delete('/destinations/:id', async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) return res.status(404).json({ error: 'Destination not found' });
    res.json({ message: 'Destination deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================
// PACKAGES CRUD
// ========================

// GET /api/admin/packages
router.get('/packages', async (req, res) => {
  try {
    const packages = await Package.find().populate('destination', 'name slug').sort({ createdAt: -1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/packages
router.post('/packages', async (req, res) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json(pkg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/admin/packages/:id
router.put('/packages/:id', async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    res.json(pkg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/admin/packages/:id
router.delete('/packages/:id', async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    res.json({ message: 'Package deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================
// TESTIMONIALS CRUD
// ========================

// GET /api/admin/testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().populate('destination', 'name').sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/testimonials
router.post('/testimonials', async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json(testimonial);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/admin/testimonials/:id
router.put('/testimonials/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' });
    res.json(testimonial);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/admin/testimonials/:id
router.delete('/testimonials/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' });
    res.json({ message: 'Testimonial deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================
// CONTACT INQUIRIES
// ========================

// GET /api/admin/inquiries
router.get('/inquiries', async (req, res) => {
  try {
    const { archived } = req.query;
    const filter = {};
    if (archived === 'true') filter.isArchived = true;
    else filter.isArchived = false;

    const inquiries = await ContactInquiry.find(filter).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/inquiries/:id/read
router.put('/inquiries/:id/read', async (req, res) => {
  try {
    const inquiry = await ContactInquiry.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/inquiries/:id/archive
router.put('/inquiries/:id/archive', async (req, res) => {
  try {
    const inquiry = await ContactInquiry.findByIdAndUpdate(req.params.id, { isArchived: true }, { new: true });
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/inquiries/:id
router.delete('/inquiries/:id', async (req, res) => {
  try {
    const inquiry = await ContactInquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
    res.json({ message: 'Inquiry deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================
// DASHBOARD STATS
// ========================

router.get('/stats', async (req, res) => {
  try {
    const [destinations, packages, testimonials, inquiries, unreadInquiries] = await Promise.all([
      Destination.countDocuments(),
      Package.countDocuments(),
      Testimonial.countDocuments(),
      ContactInquiry.countDocuments({ isArchived: false }),
      ContactInquiry.countDocuments({ isRead: false, isArchived: false }),
    ]);

    res.json({ destinations, packages, testimonials, inquiries, unreadInquiries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
