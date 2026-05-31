const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  restaurantName: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  visitDate: {
    type: Date,
    required: true
  },
  observations: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
