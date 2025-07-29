const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();
const { createUpdatePackage, getAllUpdates, assignUpdateToVehicle } = require('../controllers/updatePackageController');

router.post('/addPackage', verifyToken, createUpdatePackage);
router.get('/updates', verifyToken, getAllUpdates);
router.post('/vehicle/:id', verifyToken, assignUpdateToVehicle);

module.exports = router;
