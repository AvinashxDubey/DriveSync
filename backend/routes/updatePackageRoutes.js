const express = require('express');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();
const { createUpdatePackage, getAllUpdates, assignUpdateToVehicle, getUserAssignedUpdateCount, getAdminCreatedUpdateCount } = require('../controllers/updatePackageController');

router.get('/updates', verifyToken, getAllUpdates);
router.post('/addPackage', verifyToken, isAdmin, createUpdatePackage);
router.post('/vehicle/:id', verifyToken, isAdmin, assignUpdateToVehicle);
router.get('/my-updates/count', verifyToken, getUserAssignedUpdateCount);
router.get('/admin-updates/count', verifyToken, isAdmin, getAdminCreatedUpdateCount);

module.exports = router;
