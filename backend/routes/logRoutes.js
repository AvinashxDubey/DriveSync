const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middleware/authMiddleware');
const { logUpdateStatus, getLogsByVehicle, getUserUpdateLogCount} = require('../controllers/logController');

router.post('/status/:vin', verifyToken, logUpdateStatus);
router.get('/logs/:vin', verifyToken, getLogsByVehicle);
router.get('/count', verifyToken, getUserUpdateLogCount);

module.exports = router;
