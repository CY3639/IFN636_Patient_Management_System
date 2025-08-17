const Prescription = require('../models/Prescription');
const User = require('../models/User');

const getPharmacyPrescriptions = async (req, res) => {
    try {
        if (req.user.role !== 'pharmacy') {
            return res.status(403).json({ message: 'Access denied. Pharmacy only.' });
        }

        const prescriptions = await Prescription.find({ 
            pharmacyEmail: req.user.email 
        }).populate('userId', 'name email clinic');
        
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllPrescriptions = async (req, res) => {
    try {
        if (req.user.role !== 'pharmacy') {
            return res.status(403).json({ message: 'Access denied. Pharmacy only.' });
        }

        const prescriptions = await Prescription.find({ 
            isDispensed: false 
        }).populate('userId', 'name email clinic');
        
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPrescriptionsByPatient = async (req, res) => {
    try {
        if (req.user.role !== 'pharmacy') {
            return res.status(403).json({ message: 'Access denied. Pharmacy only.' });
        }

        const { patientEmail } = req.params;
        
        const prescriptions = await Prescription.find({ 
            patientEmail: patientEmail,
            $or: [
                { pharmacyEmail: req.user.email },
                { pharmacyEmail: { $exists: false } },
                { pharmacyEmail: '' }
            ]
        }).populate('userId', 'name email clinic');
        
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const dispensePrescription = async (req, res) => {
    try {
        if (req.user.role !== 'pharmacy') {
            return res.status(403).json({ message: 'Access denied. Pharmacy only.' });
        }

        const { prescriptionId } = req.params;
        const { quantityDispensed, status } = req.body;

        const prescription = await Prescription.findById(prescriptionId);
        
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        const dispenseEntry = {
            dispensedBy: req.user.id,
            dispensedByName: req.user.name,
            dispensedDate: new Date(),
            quantityDispensed: quantityDispensed || prescription.quantity,
            status: status || 'Dispensed'
        };

        prescription.dispenseLog.push(dispenseEntry);
        
        if (status === 'Dispensed') {
            prescription.isDispensed = true;
        }

        await prescription.save();
        
        res.json({ 
            message: 'Prescription dispensed successfully', 
            prescription 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDispenseLog = async (req, res) => {
    try {
        if (req.user.role !== 'pharmacy') {
            return res.status(403).json({ message: 'Access denied. Pharmacy only.' });
        }

        const { prescriptionId, logId } = req.params;
        const { quantityDispensed, status } = req.body;

        const prescription = await Prescription.findById(prescriptionId);
        
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        const logEntry = prescription.dispenseLog.id(logId);
        
        if (!logEntry) {
            return res.status(404).json({ message: 'Dispense log entry not found' });
        }

        if (logEntry.dispensedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You can only edit your own dispense logs' });
        }

        if (quantityDispensed !== undefined) logEntry.quantityDispensed = quantityDispensed;
        if (status !== undefined) {
            logEntry.status = status;
            
            if (status === 'Dispensed') {
                prescription.isDispensed = true;
            } else {
                prescription.isDispensed = false;
            }
        }

        await prescription.save();
        
        res.json({ 
            message: 'Dispense log updated successfully', 
            prescription 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDispenseHistory = async (req, res) => {
    try {
        if (req.user.role !== 'pharmacy') {
            return res.status(403).json({ message: 'Access denied. Pharmacy only.' });
        }

        const prescriptions = await Prescription.find({ 
            pharmacyEmail: req.user.email,
            isDispensed: true 
        }).populate('userId', 'name email');
        
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPharmacyPrescriptions,
    getAllPrescriptions,
    getPrescriptionsByPatient,
    dispensePrescription,
    updateDispenseLog,
    getDispenseHistory
};