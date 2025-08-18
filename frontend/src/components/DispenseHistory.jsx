import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const DispenseHistory = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLog, setEditingLog] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    if (user?.token) {
      const fetchAllDispenseHistory = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `http://localhost:5001/api/pharmacy/dispense-history`,
            {
              headers: {
                'Authorization': `Bearer ${user.token}`
              }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            setPrescriptions(Array.isArray(data) ? data : []);
          } else {
            console.error('Error fetching dispense history');
            setPrescriptions([]);
          }
        } catch (error) {
          console.error('Error fetching history:', error);
          setPrescriptions([]);
        }
        setLoading(false);
      };

      fetchAllDispenseHistory();
    }
  }, [user?.token]);

  if (!user?.token) {
    return <div>Please log in to access dispense history.</div>;
  }

  const handleEdit = (log) => {
    setEditingLog(log._id);
    setEditFormData({
      quantityDispensed: log.quantityDispensed,
      status: log.status
    });
  };

  const handleUpdate = async (prescriptionId, logId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/pharmacy/dispense/${prescriptionId}/log/${logId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(editFormData)
        }
      );

      if (response.ok) {
        setLoading(true);
        try {
          const refreshResponse = await fetch(
            `http://localhost:5001/api/pharmacy/dispense-history`,
            {
              headers: {
                'Authorization': `Bearer ${user.token}`
              }
            }
          );
          
          if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            setPrescriptions(Array.isArray(data) ? data : []);
          } else {
            setPrescriptions([]);
          }
        } catch (error) {
          console.error('Error refreshing:', error);
        }
        setLoading(false);
        
        setEditingLog(null);
        setEditFormData({});
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update');
      }
    } catch (error) {
      console.error('Error updating log:', error);
      alert('Error updating log');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className="text-center py-4">Loading dispense history...</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">All Dispensed Prescriptions</h3>
        <p className="text-gray-600">Showing {Array.isArray(prescriptions) ? prescriptions.length : 0} dispensed prescription(s)</p>
      </div>

      {!Array.isArray(prescriptions) || prescriptions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No dispensed prescriptions found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.isArray(prescriptions) && prescriptions.map((prescription) => (
            <div key={prescription._id} className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-lg text-blue-600">
                    {prescription.medicationName}
                  </h4>
                </div>
                <div>
                  <p><strong>Patient:</strong> {prescription.patientName}</p>
                  <p><strong>Email:</strong> {prescription.patientEmail}</p>
                </div>
                <div>
                  <p><strong>Prescribed by:</strong> {prescription.userId?.name}</p>
                  <p><strong>Date:</strong> {formatDate(prescription.prescriptionDate)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded">
                <div>
                  <p><strong>Strength:</strong> {prescription.medicationStrength}</p>
                </div>
                <div>
                  <p><strong>Form:</strong> {prescription.medicationForm}</p>
                </div>
                <div>
                  <p><strong>Quantity:</strong> {prescription.quantity}</p>
                </div>
                <div>
                  <p><strong>Repeats:</strong> {prescription.repeats}</p>
                </div>
              </div>

              <div className="mb-4">
                <p><strong>Directions:</strong> {prescription.directionOfUse}</p>
              </div>

              <div className="border-t pt-4">
                <h5 className="font-semibold mb-3">Dispense Log History:</h5>
                {prescription.dispenseLog && prescription.dispenseLog.length > 0 ? (
                  <div className="space-y-3">
                    {prescription.dispenseLog.map((log) => (
                      <div key={log._id} className="border rounded p-3 bg-blue-50">
                        {editingLog === log._id ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                              <input
                                type="number"
                                value={editFormData.quantityDispensed}
                                onChange={(e) => setEditFormData({
                                  ...editFormData,
                                  quantityDispensed: e.target.value
                                })}
                                className="p-1 border rounded"
                                placeholder="Quantity"
                              />
                              <select
                                value={editFormData.status}
                                onChange={(e) => setEditFormData({
                                  ...editFormData,
                                  status: e.target.value
                                })}
                                className="p-1 border rounded"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Dispensed">Dispensed</option>
                              </select>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdate(prescription._id, log._id)}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingLog(null)}
                                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                              <p><strong>Dispensed by:</strong> {log.dispensedByName}</p>
                              <p><strong>Date:</strong> {formatDate(log.dispensedDate)}</p>
                              <p><strong>Quantity:</strong> {log.quantityDispensed}</p>
                              <p><strong>Status:</strong> 
                                <span className={`ml-1 px-2 py-1 rounded text-xs ${
                                  log.status === 'Dispensed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {log.status}
                                </span>
                              </p>
                            </div>
                            <button
                              onClick={() => handleEdit(log)}
                              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No dispense log entries found.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DispenseHistory;