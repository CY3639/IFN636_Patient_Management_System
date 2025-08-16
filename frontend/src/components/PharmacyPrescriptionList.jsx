import React, { useState } from 'react';
import DispenseModal from './DispenseModal';
import { useAuth } from '../context/AuthContext';

const PharmacyPrescriptionList = ({ prescriptions, onDispenseUpdate }) => {
  const { token } = useAuth();
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDispenseModal, setShowDispenseModal] = useState(false);
  const [viewDetails, setViewDetails] = useState(null);

  const handleDispense = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDispenseModal(true);
  };

  const handleViewHistory = async (prescriptionId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/pharmacy/dispense-history/${prescriptionId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      setViewDetails(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  return (
    <div>
      {prescriptions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No prescriptions found</p>
      ) : (
        <div className="grid gap-4">
          {prescriptions.map((prescription) => (
            <div key={prescription._id} className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{prescription.medicationName}</h3>
                    <span className={`px-2 py-1 text-xs rounded ${
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
                  {!prescription.isDispensed && (
                    <button
                      onClick={() => handleDispense(prescription)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Dispense
                    </button>
                  )}
                  <button
                    onClick={() => handleViewHistory(prescription._id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    View History
                  </button>
                </div>
              </div>

              {viewDetails && viewDetails.prescription.id === prescription._id && (
                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <h4 className="font-semibold mb-2">Dispense History</h4>
                  {viewDetails.dispenseLog.length === 0 ? (
                    <p className="text-sm text-gray-600">No dispense history</p>
                  ) : (
                    <div className="space-y-2">
                      {viewDetails.dispenseLog.map((log, index) => (
                        <div key={index} className="text-sm border-l-2 border-blue-300 pl-3">
                          <div className="font-medium">
                            {new Date(log.dispensedDate).toLocaleString()}
                          </div>
                          <div>By: {log.dispensedByName}</div>
                          <div>Quantity: {log.quantityDispensed}</div>
                          <div>Status: {log.status}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => setViewDetails(null)}
                    className="mt-2 text-sm text-blue-600 hover:underline"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showDispenseModal && (
        <DispenseModal
          prescription={selectedPrescription}
          onClose={() => {
            setShowDispenseModal(false);
            setSelectedPrescription(null);
          }}
          onSuccess={() => {
            setShowDispenseModal(false);
            setSelectedPrescription(null);
            onDispenseUpdate();
          }}
        />
      )}
    </div>
  );
};

export default PharmacyPrescriptionList;