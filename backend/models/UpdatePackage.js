const mongoose = require('mongoose');

const updatePackageSchema = new mongoose.Schema({
  version: {
    type: String,
    required: true,
  },
  description: String,
  files: {
    type: [String],  // Array of file URLs or paths
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('UpdatePackage', updatePackageSchema);
