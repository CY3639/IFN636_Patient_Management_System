import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const PrescriptionForm = ({ editingPrescription, onSubmit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    prescriptionDate: '',
    medicationName: '',
    medicationStrength: '',
    medicationForm: '',
    directionOfUse: '',
    quantity: '',
    repeats: '',
    patientName: '',
    patientEmail: '',
    pharmacyEmail: ''
  });

  useEffect(() => {
    if (editingPrescription) {
      setFormData({
        prescriptionDate: editingPrescription.prescriptionDate?.split('T')[0] || '',
        medicationName: editingPrescription.medicationName || '',
        medicationStrength: editingPrescription.medicationStrength || '',
        medicationForm: editingPrescription.medicationForm || '',
        directionOfUse: editingPrescription.directionOfUse || '',
        quantity: editingPrescription.quantity || '',
        repeats: editingPrescription.repeats || '',
        patientName: editingPrescription.patientName || '',
        patientEmail: editingPrescription.patientEmail || '',
        pharmacyEmail: editingPrescription.pharmacyEmail || ''
      });
    } else {
      setFormData({
        prescriptionDate: '',
        medicationName: '',
        medicationStrength: '',
        medicationForm: '',
        directionOfUse: '',
        quantity: '',
        repeats: '',
        patientName: '',
        patientEmail: '',
        pharmacyEmail: ''
      });
    }
  }, [editingPrescription]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.patientName || !formData.patientEmail) {
      alert('Patient name and email are required');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h2 className="text-2xl font-bold mb-4">
        {editingPrescription ? 'Edit Prescription' : 'Create New Prescription'}
      </h2>
      
      <div className="mb-4 p-3 bg-blue-50 rounded">
        <h3 className="font-semibold text-blue-800 mb-2">Patient Information</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Patient Name *"
            value={formData.patientName}
            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Patient Email *"
            value={formData.patientEmail}
            onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="mb-4 p-3 bg-green-50 rounded">
        <h3 className="font-semibold text-green-800 mb-2">Pharmacy Assignment (Optional)</h3>
        <input
          type="email"
          placeholder="Pharmacy Email (leave blank for patient choice)"
          value={formData.pharmacyEmail}
          onChange={(e) => setFormData({ ...formData, pharmacyEmail: e.target.value })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="space-y-3">
        <input
          type="date"
          placeholder="Prescription Date"
          value={formData.prescriptionDate}
          onChange={(e) => setFormData({ ...formData, prescriptionDate: e.target.value })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        
        <input
          type="text"
          placeholder="Medication Name *"
          value={formData.medicationName}
          onChange={(e) => setFormData({ ...formData, medicationName: e.target.value })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Strength (e.g., 500mg) *"
            value={formData.medicationStrength}
            onChange={(e) => setFormData({ ...formData, medicationStrength: e.target.value })}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Form (tablet, capsule, etc.) *"
            value={formData.medicationForm}
            onChange={(e) => setFormData({ ...formData, medicationForm: e.target.value })}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <textarea
          placeholder="Directions for Use *"
          value={formData.directionOfUse}
          onChange={(e) => setFormData({ ...formData, directionOfUse: e.target.value })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="2"
          required
        />
        
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Quantity *"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            required
          />
          <input
            type="number"
            placeholder="Repeats"
            value={formData.repeats}
            onChange={(e) => setFormData({ ...formData, repeats: e.target.value })}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>
      </div>

      <button 
        type="submit" 
        className="w-full mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition font-medium"
      >
        {editingPrescription ? 'Update Prescription' : 'Create Prescription'}
      </button>
    </form>
  );
};

export default PrescriptionForm;