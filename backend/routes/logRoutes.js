const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { logUpdateStatus, getLogsByVehicle} = require('../controllers/logController');

router.post('/status', verifyToken, logUpdateStatus);
router.get('/logs/:vehicleId', verifyToken, getLogsByVehicle);

module.exports = router;
