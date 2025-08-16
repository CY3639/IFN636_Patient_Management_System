import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const DispenseModal = ({ prescription, onClose, onSuccess }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    quantityDispensed: prescription.quantity,
    notes: '',
    status: 'Dispensed'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `http://localhost:5001/api/pharmacy/dispense/${prescription._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );

      if (response.ok) {
        onSuccess();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to dispense prescription');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Dispense Prescription</h2>
        
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="font-medium">{prescription.medicationName}</p>
          <p className="text-sm text-gray-600">
            Patient: {prescription.patientName} ({prescription.patientEmail})
          </p>
          <p className="text-sm text-gray-600">
            Quantity Prescribed: {prescription.quantity}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Quantity to Dispense
            </label>
            <input
              type="number"
              min="1"
              max={prescription.quantity}
              value={formData.quantityDispensed}
              onChange={(e) => setFormData({
                ...formData, 
                quantityDispensed: parseInt(e.target.value)
              })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Dispense Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="Dispensed">Fully Dispensed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm Dispense'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DispenseModal;