const Vehicle = require('../models/Vehicle');

// Register a new vehicle
const registerVehicle = async (req, res) => {
  try {
    const { vin, model } = req.body;

    if (!vin || !model) {
      return res.status(400).json({ message: 'VIN and model are required.' });
    }

    const existing = await Vehicle.findOne({ vin });
    if (existing) {
      return res.status(409).json({ message: 'Vehicle already registered.' });
    }

    const vehicle = new Vehicle({ vin, model, owner: req.user.id });

    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all vehicles registered by user
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({owner: req.user.id}).populate('assignedUpdate');
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get a specific vehicle by VIN
const getVehicleByVin = async (req, res) => {
  try {
    const { vin } = req.params;
    const vehicle = await Vehicle.findOne({ vin, owner: req.user.id }).populate('assignedUpdate');

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }

    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update vehicle data
const updateVehicle = async (req, res) => {
  try {
    const { vin } = req.params;
    const updates = req.body;

    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { owner: req.user.id },
      { $set: updates },
      { new: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }

    res.json(updatedVehicle);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a vehicle by VIN
const deleteVehicle = async (req, res) => {
  try {
    const { vin } = req.params;
    const result = await Vehicle.findOneAndDelete({ vin, owner: req.user.id });

    if (!result) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }

    res.json({ message: 'Vehicle deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getUserVehicleCount = async (req, res) => {
  try {
    const count = await Vehicle.countDocuments({ owner: req.user.id });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


module.exports = {
  registerVehicle,
  getAllVehicles,
  getVehicleByVin,
  updateVehicle,
  deleteVehicle,
  getUserVehicleCount
};
