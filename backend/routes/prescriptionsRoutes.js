const express = require('express');
const { getPrescriptions, getPrescriptionById, addPrescription, updatePrescription, deletePrescription } = require('../controllers/prescriptionController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getPrescriptions);
router.get('/:id', protect, getPrescriptionById);
router.post('/', protect, addPrescription);
router.put('/:id', protect, updatePrescription);
router.delete('/:id', protect, deletePrescription);

module.exports = router;