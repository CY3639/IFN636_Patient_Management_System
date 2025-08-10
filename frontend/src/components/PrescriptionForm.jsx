import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const PrescriptionForm = ({ prescriptions, createPrescriptions, editingPrescription, setEditingPrescription }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ prescriptionDate: '', medicationName: '', medicationStrength: '', medicationForm: '', directionofUse: '', quantity: '', repeats: '' });

  useEffect(() => {
    if (editingPrescription) {
      setFormData({     
        prescriptionDate: editingPrescription.prescriptionDate,
        medicationName: editingPrescription.medicationName,
        medicationStrength: editingPrescription.medicationStrength,
        medicationForm: editingPrescription.medicationForm,
        directionOfUse: editingPrescription.directionOfUse,
        quantity: editingPrescription.quantity,
        repeats: editingPrescription.repeats,
      });
    } else {
      setFormData({ prescriptionDate: '', medicationName: '', medicationStrength: '', medicationForm: '', medicationFormdirectionofUse: '', quantity: '', repeats: '' });
    }
  }, [editingPrescription]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPrescription) {
        const response = await axiosInstance.put(`/api/prescriptions/${editingPrescription._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        createPrescriptions(prescriptions.map((prescription) => (prescription._id === response.data._id ? response.data : prescription)));
      } else {
        const response = await axiosInstance.post('/api/prescriptions', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        createPrescriptions([...prescriptions, response.data]);
      }
      setEditingPrescription(null);
      setFormData({ prescriptionDate: '', medicationName: '', medicationStrength: '', medicationForm: '', directionofUse: '', quantity: '', repeats: '' });
    } catch (error) {
      alert('Failed to save prescription.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingPrescription ? 'ePrescription: Edit' : 'ePrescription: Create'}</h1>
      <input
        type="date"
        placeholder="Prescription Date"
        value={formData.prescriptionDate}
        onChange={(e) => setFormData({ ...formData, prescriptionDate: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Medication Name"
        value={formData.medicationName}
        onChange={(e) => setFormData({ ...formData, medicationName: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        value={formData.medicationStrength}
        onChange={(e) => setFormData({ ...formData, medicationStrength: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        value={formData.medicationForm}
        onChange={(e) => setFormData({ ...formData, medicationForm: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        value={formData.directionOfUse}
        onChange={(e) => setFormData({ ...formData, directionOfUse: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        value={formData.quantity}
        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        value={formData.repeats}
        onChange={(e) => setFormData({ ...formData, repeats: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingPrescription ? 'Update' : 'Create'}
      </button>
    </form>
  );
};

export default PrescriptionForm;
