const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const destinationRoutes = require('./routes/destinations');
const packageRoutes = require('./routes/packages');
const testimonialRoutes = require('./routes/testimonials');
const contactRoutes = require('./routes/contact');
const searchRoutes = require('./routes/search');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const sitemapRoutes = require('./routes/sitemap');

app.use('/api/destinations', destinationRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// Sitemap & robots.txt (served at root, not under /api)
app.use(sitemapRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WhatsApp config endpoint
app.get('/api/config/whatsapp', (req, res) => {
  res.json({ whatsappNumber: process.env.WHATSAPP_NUMBER || '919310798965' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
