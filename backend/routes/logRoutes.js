const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middleware/authMiddleware');
const { logUpdateStatus, getLogsByVehicle } = require('../controllers/logController');

router.patch('/status/vehicle/:id', verifyToken, logUpdateStatus);
router.get('/vehicle/:id', verifyToken, getLogsByVehicle);

module.exports = router;
