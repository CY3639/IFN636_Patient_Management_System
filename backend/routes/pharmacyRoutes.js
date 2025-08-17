const express = require('express');
const { 
    getPharmacyPrescriptions,
    getAllPrescriptions,
    getPrescriptionsByPatient,
    dispensePrescription,
    updateDispenseLog,
    getDispenseHistory
} = require('../controllers/pharmacyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/prescriptions', protect, getPharmacyPrescriptions);
router.get('/prescriptions/all', protect, getAllPrescriptions);
router.get('/prescriptions/patient/:patientEmail', protect, getPrescriptionsByPatient);
router.post('/dispense/:prescriptionId', protect, dispensePrescription);
router.put('/dispense/:prescriptionId/log/:logId', protect, updateDispenseLog);
router.get('/dispense-history', protect, getDispenseHistory);

module.exports = router;
