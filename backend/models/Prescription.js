const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prescriptionDate: { type: Date, required: true },
    medicationName: { type: String, required: true },
    medicationStrength: { type: String, required: true },
    medicationForm: { type: String, required: true },
    directionOfUse: { type: String, required: true },
    quantity: { type: Number, required: true },
    repeats: { type: Number, required: true },
    isDispensed: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Prescription', prescriptionSchema);