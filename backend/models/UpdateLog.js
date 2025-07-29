const mongoose = require('mongoose');

const updateLogSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  status: {
    type: String,
    enum: ['initiated', 'in-progress', 'completed', 'failed'],
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
  progress: {
    type: Number, // 0 to 100
    min: 0,
    max: 100,
  }
}, { timestamps: true });

module.exports = mongoose.model('UpdateLog', updateLogSchema);
