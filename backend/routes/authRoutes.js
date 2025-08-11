
const express = require('express');
const { registerUser, loginUser, updateUserProfile, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);

router.get('/', protect, getPrescriptions);
router.post('/', protect, addPrescription);
router.put('/:id', protect, updatePrescription);
router.delete('/:id', protect, deletePrescription);

module.exports = router;
