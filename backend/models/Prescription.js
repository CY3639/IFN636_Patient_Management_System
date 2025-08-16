const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // doctor who created the script
    prescriptionDate: { type: Date, required: true },
    medicationName: { type: String, required: true },
    medicationStrength: { type: String, required: true },
    medicationForm: { type: String, required: true },
    directionOfUse: { type: String, required: true },
    quantity: { type: Number, required: true },
    repeats: { type: Number, required: true },
    isDispensed: { type: Boolean, default: false },
    
    patientEmail: { type: String, required: true },
    patientName: { type: String, required: true },
    pharmacyEmail: { type: String },
    
    dispenseLog: [{
        dispensedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        dispensedByName: { type: String },
        dispensedDate: { type: Date, default: Date.now },
        quantityDispensed: { type: Number },
        status: { 
            type: String, 
            enum: ['Pending', 'Dispensed'], 
            default: 'Pending' 
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Prescription', prescriptionSchema);