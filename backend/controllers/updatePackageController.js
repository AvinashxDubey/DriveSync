const UpdatePackage = require('../models/UpdatePackage');
const Vehicle = require('../models/Vehicle');
const UpdateLog = require('../models/UpdateLog');

// Create a new update package
const createUpdatePackage = async (req, res) => {
  try {
    const { version, description, files } = req.body;
    if (!version || !files) {
      return res.status(400).json({ message: 'Version and files are required.' });
    }

    const existing = await UpdatePackage.findOne({ version });
    if (existing) return res.status(409).json({ message: 'Version already exists.' });

    const update = new UpdatePackage({
      version,
      description,
      files,
      createdBy: req.user.id
    });
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
const getVehiclesWithAssignedUpdates = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ assignedUpdate: { $exists: true, $ne: null } })
      .populate('assignedUpdate', 'version description');
    res.json(vehicles);
  } catch (err) {
    console.error('Error fetching vehicles with assigned updates:', err);
    res.status(500).json({ message: 'Server error fetching vehicles with assigned updates', error: err.message });
  }
};


// Assign an update to a vehicle
const assignUpdateToVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { updateId } = req.body;

    console.log('Assign update request:', { id, updateId });

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found.' });

    const update = await UpdatePackage.findById(updateId);
    if (!update) return res.status(404).json({ message: 'Update package not found.' });

    vehicle.assignedUpdate = update._id;

    await vehicle.save();

    res.json({ message: `Update ${update.version} assigned to vehicle ${vehicle.vin}` });
  } catch (err) {
    console.error('Error in assignUpdateToVehicle:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const startUpdateForVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Starting update for vehicle id:', id);

    const vehicle = await Vehicle.findById(id).populate('assignedUpdate');
    console.log('Vehicle found:', vehicle);

    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found.' });
    if (!vehicle.assignedUpdate) {
      return res.status(400).json({ message: 'No update assigned.' });
    }
    if (vehicle.updateInProgress) {
      return res.status(400).json({ message: 'Update already in progress.' });
    }

    vehicle.updateInProgress = true;
    await vehicle.save();
    console.log('Vehicle updated to updateInProgress = true');

    const log = new UpdateLog({
      vehicle: vehicle._id,
      status: 'started',
      message: `Update ${vehicle.assignedUpdate.version} started`,
      progress: 0
    });
    await log.save();
    console.log('Update log saved');

    res.json({ message: 'Update started', log });
  } catch (err) {
    console.error('Error in startUpdateForVehicle:', err);
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
  startUpdateForVehicle,
  getUserAssignedUpdateCount,
  getAdminCreatedUpdateCount,
   getVehiclesWithAssignedUpdates,
};
