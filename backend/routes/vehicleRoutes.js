const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { registerVehicle,
    getAllVehicles,
    getVehicleByVin,
    updateVehicle,
    deleteVehicle,
    getUserVehicleCount } = require('../controllers/vehicleController');

router.post('/register', verifyToken, registerVehicle);
router.get('/vehicles', verifyToken, getAllVehicles);
router.get('/getVehicle/:vin', verifyToken, getVehicleByVin);
router.put('/update/:vin', verifyToken, updateVehicle);
router.delete('/delete/:vin', verifyToken, deleteVehicle);
router.get('/count', verifyToken, getUserVehicleCount);

module.exports = router;