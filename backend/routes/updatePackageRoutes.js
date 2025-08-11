const express = require('express');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();
const { createUpdatePackage, getAllUpdates, assignUpdateToVehicle, startUpdateForVehicle, getUserAssignedUpdateCount, getAdminCreatedUpdateCount } = require('../controllers/updatePackageController');
const { getVehiclesWithAssignedUpdates } = require('../controllers/updatePackageController');

router.get('/updates', verifyToken, getAllUpdates);
router.post('/addPackage', verifyToken, isAdmin, createUpdatePackage);
router.patch('/vehicle/:id', verifyToken, isAdmin, assignUpdateToVehicle);
router.patch('/start-update/vehicle/:id', verifyToken, startUpdateForVehicle);
router.get('/my-updates/count', verifyToken, getUserAssignedUpdateCount);
router.get('/admin-updates/count', verifyToken, isAdmin, getAdminCreatedUpdateCount);
router.get('/vehicles-assigned-update', verifyToken, getVehiclesWithAssignedUpdates);


module.exports = router;
