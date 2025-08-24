import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const PharmacyPrescriptionList = ({ prescriptions, onDispenseUpdate }) => {
  const { user } = useAuth();
  
  const [dispensingPrescription, setDispensingPrescription] = useState(null);
  const [dispensing, setDispensing] = useState(false);
  const [dispenseError, setDispenseError] = useState('');
  
  const [dispenseForm, setDispenseForm] = useState({
    quantityDispensed: '',
    status: 'Dispensed'
  });

  const handleDispense = (prescription) => {
    setDispensingPrescription(prescription._id);
    setDispenseForm({
      quantityDispensed: prescription.quantity,
      status: 'Dispensed'
    });
    setDispenseError('');
  };

  const handleCancelDispense = () => {
    setDispensingPrescription(null);
    setDispenseForm({ quantityDispensed: '', status: 'Dispensed' });
    setDispenseError('');
  };

  const handleSubmitDispense = async (prescriptionId) => {
    setDispensing(true);
    setDispenseError('');

    try {
      const response = await axiosInstance.post(`/api/pharmacy/dispense/${prescriptionId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(dispenseForm)
        }
      );

      if (response.ok) {
        setDispensingPrescription(null);
        onDispenseUpdate();
      } else {
        const data = await response.json();
        setDispenseError(data.message || 'Failed to dispense prescription');
      }
    } catch (err) {
      setDispenseError('Network error. Please try again.');
    } finally {
      setDispensing(false);
    }
  };

  if (!Array.isArray(prescriptions) || prescriptions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No prescriptions found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {prescriptions.map((prescription) => (
          <div key={prescription._id} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-blue-600">
                    {prescription.medicationName}
                  </h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    prescription.isDispensed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {prescription.isDispensed ? 'Dispensed' : 'Pending'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Patient:</span> {prescription.patientName}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {prescription.patientEmail}
                  </div>
                  <div>
                    <span className="font-medium">Strength:</span> {prescription.medicationStrength}
                  </div>
                  <div>
                    <span className="font-medium">Form:</span> {prescription.medicationForm}
                  </div>
                  <div>
                    <span className="font-medium">Quantity:</span> {prescription.quantity}
                  </div>
                  <div>
                    <span className="font-medium">Repeats:</span> {prescription.repeats}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Directions:</span> {prescription.directionOfUse}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Prescribed by:</span> Dr. {prescription.userId?.name || 'Unknown'}
                    {prescription.userId?.clinic && ` - ${prescription.userId.clinic}`}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span> {new Date(prescription.prescriptionDate).toLocaleDateString()}
                  </div>
                </div>

                {prescription.dispenseLog && prescription.dispenseLog.length > 0 && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                    <span className="font-medium">Last Dispensed:</span> {
                      new Date(prescription.dispenseLog[prescription.dispenseLog.length - 1].dispensedDate).toLocaleDateString()
                    } - {prescription.dispenseLog[prescription.dispenseLog.length - 1].status}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 ml-4">
                {!prescription.isDispensed && dispensingPrescription !== prescription._id && (
                  <button
                    onClick={() => handleDispense(prescription)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Dispense
                  </button>
                )}
              </div>
            </div>

            {dispensingPrescription === prescription._id && (
              <div className="mt-4 p-4 bg-blue-50 border rounded">
                <h4 className="font-bold mb-3">Dispense Prescription</h4>
                
                {dispenseError && (
                  <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm">
                    {dispenseError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Quantity to Dispense
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={prescription.quantity}
                      value={dispenseForm.quantityDispensed}
                      onChange={(e) => setDispenseForm({
                        ...dispenseForm, 
                        quantityDispensed: parseInt(e.target.value)
                      })}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum: {prescription.quantity}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Status
                    </label>
                    <select
                      value={dispenseForm.status}
                      onChange={(e) => setDispenseForm({...dispenseForm, status: e.target.value})}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Dispensed">Dispensed</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleSubmitDispense(prescription._id)}
                    disabled={dispensing}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {dispensing ? 'Processing...' : 'Confirm Dispense'}
                  </button>
                  
                  <button
                    onClick={handleCancelDispense}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PharmacyPrescriptionList;