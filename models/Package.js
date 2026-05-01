const mongoose = require('mongoose');

const highlightSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
}, { _id: false });

const itineraryDaySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  tags: [{ type: String }],
}, { _id: false });

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
  location: { type: String },
  description: { type: String },
  duration: { type: String }, // e.g. "8D/7N"
  days: { type: Number },
  nights: { type: Number },
  priceRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    currency: { type: String, default: '₹' },
  },
  image: { type: String },
  galleryImages: [{ type: String }],
  badge: { type: String }, // "Best Seller", "New", "Trending"
  highlights: [highlightSchema],
  itinerary: [itineraryDaySchema],
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  tags: [{ type: String }],
  hotelStandards: [{
    tier: { type: String },
    priceAdjustmentPercent: { type: Number, default: 0 },
    priceMin: { type: Number },
    priceMax: { type: Number },
  }],
  type: { type: String, enum: ['Coastal', 'Mountain', 'Urban', 'Desert', 'Forest', 'Cultural', 'Adventure', 'Island', 'Heritage', 'Nature'] },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isPopular: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

packageSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

packageSchema.index({ name: 'text', location: 'text', description: 'text' });

module.exports = mongoose.model('Package', packageSchema);
