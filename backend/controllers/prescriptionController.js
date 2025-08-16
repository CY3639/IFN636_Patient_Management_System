const Prescription = require('../models/Prescription');

const getPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ userId: req.user.id });
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addPrescription = async (req, res) => {
    const {
        prescriptionDate, 
        medicationName, 
        medicationStrength, 
        medicationForm, 
        directionOfUse, 
        quantity, 
        repeats, 
        isDispensed,
        patientEmail,
        patientName,
        pharmacyEmail  
    } = req.body;
    
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Only doctors can create prescriptions' });
        }

        const prescription = await Prescription.create({ 
            userId: req.user.id, 
            prescriptionDate, 
            medicationName, 
            medicationStrength, 
            medicationForm, 
            directionOfUse, 
            quantity, 
            repeats,
            isDispensed: false,
            patientEmail,
            patientName,
            pharmacyEmail,
            dispenseLog: []
        });
        res.status(201).json(prescription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePrescription = async (req, res) => {
    const {
        prescriptionDate, 
        medicationName, 
        medicationStrength, 
        medicationForm, 
        directionOfUse, 
        quantity, 
        repeats, 
        isDispensed,
        patientEmail,
        patientName,
        pharmacyEmail
    } = req.body;
    
    try {
        const prescription = await Prescription.findById(req.params.id);
        if(!prescription) return res.status(404).json({ message: 'Prescription not found' });
        
        if(prescription.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorised to update this prescription' });
        }
        
        prescription.prescriptionDate = prescriptionDate || prescription.prescriptionDate;
        prescription.medicationName = medicationName || prescription.medicationName;
        prescription.medicationStrength = medicationStrength || prescription.medicationStrength;
        prescription.medicationForm = medicationForm || prescription.medicationForm;
        prescription.directionOfUse = directionOfUse || prescription.directionOfUse;
        prescription.quantity = quantity || prescription.quantity;
        prescription.repeats = repeats || prescription.repeats;
        prescription.isDispensed = isDispensed || prescription.isDispensed;
        prescription.patientEmail = patientEmail || prescription.patientEmail;
        prescription.patientName = patientName || prescription.patientName;
        if (req.body.pharmacyEmail !== undefined) prescription.pharmacyEmail = req.body.pharmacyEmail;
    
        const updatedPrescription = await prescription.save();
        res.json(updatedPrescription);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id);
        if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
        
        if(prescription.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorised to delete this prescription' });
        }
        
        await Prescription.findByIdAndDelete(req.params.id);
        res.json({message: 'Prescription deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = { getPrescriptions, addPrescription, updatePrescription, deletePrescription };