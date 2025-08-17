import React, { useState, useMemo } from 'react';
import DispenseModal from './DispenseModal';
import { useAuth } from '../context/AuthContext';

const PharmacyPrescriptionList = ({ prescriptions, onDispenseUpdate }) => {
  const { user } = useAuth();
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDispenseModal, setShowDispenseModal] = useState(false);
  const [viewDetails, setViewDetails] = useState(null);

  const API_BASE_URL = useMemo(() => {
    return process.env.REACT_APP_API_URL || 
      (window.location.hostname === 'localhost' ? 
        'http://localhost:5001' : 
        `${window.location.protocol}//${window.location.hostname}:5001`
      );
  }, []);

  if (!user?.token) {
    return <div>Please log in to access pharmacy features.</div>;
  }

  const handleDispense = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDispenseModal(true);
  };

  const handleViewHistory = async (prescriptionId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/pharmacy/dispense-history/${prescriptionId}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );
      const data = await response.json();
      setViewDetails(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleCloseModal = () => {
    setShowDispenseModal(false);
    setSelectedPrescription(null);
  };

  const handleDispenseSuccess = () => {
    setShowDispenseModal(false);
    setSelectedPrescription(null);
    if (onDispenseUpdate) {
      onDispenseUpdate();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
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
                    <div className="mt-4 p-3 bg-gray-50 rounded">
                      <h4 className="font-medium text-sm mb-2">Dispense History:</h4>
                      {prescription.dispenseLog.map((log, index) => (
                        <div key={index} className="text-xs text-gray-600 mb-1">
                          <span className="font-medium">
                            {formatDate(log.dispensedDate)}
                          </span> - 
                          Qty: {log.quantityDispensed} by {log.dispensedByName} 
                          <span className={`ml-2 px-1 py-0.5 rounded ${
                            log.status === 'Dispensed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {log.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  {!prescription.isDispensed && (
                    <button
                      onClick={() => handleDispense(prescription)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Dispense
                    </button>
                  )}
                  <button
                    onClick={() => handleViewHistory(prescription._id)}
                    className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                  >
                    View History
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDispenseModal && selectedPrescription && (
        <DispenseModal
          prescription={selectedPrescription}
          onClose={handleCloseModal}
          onSuccess={handleDispenseSuccess}
        />
      )}

      {viewDetails && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Prescription Details
              </h3>
              <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(viewDetails, null, 2)}
              </pre>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setViewDetails(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyPrescriptionList;