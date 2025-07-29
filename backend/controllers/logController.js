const UpdateLog = require('../models/UpdateLog');
const Vehicle = require('../models/Vehicle');

// Log update progress from a vehicle
const logUpdateStatus = async (req, res) => {
  try {
    const { vin } = req.params;
    const { status, message, progress } = req.body;

    const vehicle = await Vehicle.findOne({ vin });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }

    const log = new UpdateLog({
      vehicle: vehicle._id,
      status,
      message,
      progress,
    });

    await log.save();
    res.status(201).json({ message: 'Log saved', log });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all logs for a specific vehicle
const getLogsByVehicle = async (req, res) => {
  try {
    const { vin } = req.params;

    const vehicle = await Vehicle.findOne({ vin });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }

    const logs = await UpdateLog.find({ vehicle: vehicle._id }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  logUpdateStatus,
  getLogsByVehicle,
};
