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
    const {prescriptionDate, medicationName, medicationStrength, medicationForm, directionOfUse, quantity, repeats} = req.body;
    try {
        const prescription = await Prescription.create({ userId: req.user.id, prescriptionDate, medicationName, medicationStrength, medicationForm, directionOfUse, quantity, repeats});
        res.status(201).json(prescription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePrescription = async (req, res) => {
    const {prescriptionDate, medicationName, medicationStrength, medicationForm, directionOfUse, quantity, repeats, isDispensed} = req.body;
    try {
        const prescription = await Prescription.findById(req.params.id);
        if(!prescription) return res.status(404).json({ message: 'Prescription not found' });
        
        prescription.prescriptionDate = prescriptionDate || prescription.prescriptionDate;
        prescription.medicationName = medicationName || prescription.medicationName;
        prescription.medicationStrength = medicationStrength || prescription.medicationStrength;
        prescription.medicationForm = medicationForm || prescription.medicationForm;
        prescription.directionOfUse = directionOfUse || prescription.directionOfUse;
        prescription.quantity = quantity || prescription.quantity;
        prescription.repeats = repeats || prescription.repeats;
        prescription.isDispensed = isDispensed || prescription.isDispensed;
    
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
        
        await prescription.remove();
        res.json({message: 'Prescription deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = { getPrescriptions, addPrescription, updatePrescription, deletePrescription };