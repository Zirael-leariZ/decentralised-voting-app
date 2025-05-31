// models/pollModel.js
const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: [true, 'Poll domain must be provided'],
    },
    num_participants: {
      type: Number,
      required: [true, 'Number of participants must be provided'],
      min: [1, 'At least one participant required'],
    },
    options: {
      type: [String],
      validate: {
        validator: function(arr) {
          // Ensure at least two non-empty strings
          return Array.isArray(arr) && arr.filter(Boolean).length >= 2;
        },
        message: 'At least two non-empty options are required',
      },
      required: [true, 'Poll options must be provided'],
    },
    description: {
      type: String,
      required: [true, 'Poll description must be provided'],
    },
    expiration_date: {
      type: Date,
      required: [true, 'Expiration date must be provided'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // (optional) you can store the on‐chain transaction hash here if you want:
    txHash: {
      type: String,
      default: null,
    },
  },
  {
    collection: 'polls',
  }
);

module.exports = mongoose.model('Poll', PollSchema);
