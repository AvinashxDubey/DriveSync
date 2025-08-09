const UpdateLog = require('../models/UpdateLog');
const Vehicle = require('../models/Vehicle');

const logUpdateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message, progress } = req.body;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found.' });

    if (!vehicle.assignedUpdate) {
      return res.status(400).json({ message: 'No update assigned to this vehicle.' });
    }

    if (!vehicle.updateInProgress) {
      return res.status(400).json({ message: 'Update already completed.' });
    }

    const log = new UpdateLog({
      vehicle: vehicle._id,
      status,
      message,
      progress
    });
    await log.save();

    if (progress === 100 && status.toLowerCase() === 'completed') {
      vehicle.updateInProgress = false;
      await vehicle.save();
    }

    res.status(201).json({ message: 'Log saved', log });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getLogsByVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found.' });

    const logs = await UpdateLog.find({ vehicle: vehicle._id }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { logUpdateStatus, getLogsByVehicle };
