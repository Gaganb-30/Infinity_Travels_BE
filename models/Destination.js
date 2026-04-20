const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  continent: { type: String, required: true },
  category: { type: String, enum: ['Domestic', 'International'], required: true },
  tier: { type: String, enum: ['Luxury', 'Premium', 'Value'], default: 'Premium' },
  tagline: { type: String },
  description: { type: String },
  type: { type: String, enum: ['Beach', 'Mountain', 'Adventure', 'Nature', 'Urban', 'Cultural', 'Desert', 'Coastal', 'Island', 'Heritage'] },
  heroImage: { type: String },
  galleryImages: [{ type: String }],
  seasons: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Generate slug from name before save
destinationSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

// Text index for search
destinationSchema.index({ name: 'text', country: 'text', description: 'text' });

module.exports = mongoose.model('Destination', destinationSchema);
