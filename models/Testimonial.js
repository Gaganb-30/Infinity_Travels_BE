const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  avatar: { type: String },
  quote: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  travelDate: { type: String },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
