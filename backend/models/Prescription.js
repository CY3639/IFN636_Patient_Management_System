const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prescriptionDate: { type: Date, requried: true },
    medicationName: { type: String, required: true },
    medicationStrength: { type: String, required: true },
    directionOfUse: { type: String , required: true },
    quantity: { type: Number, required: true },
    repeats: { type: Number, required: true }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);