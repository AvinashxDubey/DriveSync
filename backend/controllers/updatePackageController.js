const UpdatePackage = require('../models/UpdatePackage');
const Vehicle = require('../models/Vehicle');

// Create a new update package
const createUpdatePackage = async (req, res) => {
  try {
    const { version, description, files } = req.body;

    if (!version || !files) {
      return res.status(400).json({ message: 'Version and files are required.' });
    }

    const existing = await UpdatePackage.findOne({ version });
    if (existing) {
      return res.status(409).json({ message: 'Update with this version already exists.' });
    }

    const update = new UpdatePackage({ version, description, files, createdBy: req.user.id });
    await update.save();
    res.status(201).json(update);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all update packages
const getAllUpdates = async (req, res) => {
  try {
    const updates = await UpdatePackage.find();
    res.json(updates);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Assign an update to a vehicle
const assignUpdateToVehicle = async (req, res) => {
  try {
    const id = req.params.id; // Vehicle ID from the URL
    const { updateId } = req.body;

    const vehicle = await Vehicle.findById(id);
    const update = await UpdatePackage.findById(updateId);

    if (!vehicle || !update) {
      return res.status(404).json({ message: 'Vehicle or update not found.' });
    }

    vehicle.assignedUpdate = update._id;
    await vehicle.save();

    res.json({ message: `Update ${update.version} assigned to vehicle with VIN ${vehicle.vin}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getUserAssignedUpdateCount = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user.id }).select('assignedUpdate');

    const assignedUpdateIds = vehicles
      .map(vehicle => vehicle.assignedUpdate)
      .filter(Boolean);

    const uniqueUpdateIds = [...new Set(assignedUpdateIds.map(id => id.toString()))];

    res.json({ count: uniqueUpdateIds.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const getAdminCreatedUpdateCount = async (req, res) => {
  try {
    const count = await UpdatePackage.countDocuments({ createdBy: req.user.id });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


module.exports = {
  createUpdatePackage,
  getAllUpdates,
  assignUpdateToVehicle,
  getUserAssignedUpdateCount,
  getAdminCreatedUpdateCount
};
