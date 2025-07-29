const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vin: {
        type: String,
        required: true,
        unique: true
    },
    model: {
        type: String,
        required: true
    },
    assignedUpdate: {
        type: mongoose.Schema.Types.ObjectId, ref: 'UpdatePackage'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
