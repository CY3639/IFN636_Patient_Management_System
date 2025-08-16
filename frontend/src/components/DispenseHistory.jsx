import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const DispenseHistory = () => {
  const { user } = useAuth();
  const [searchId, setSearchId] = useState('');
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [editFormData, setEditFormData] = useState({});

if (!user?.token) {
    return <div>Please log in to access dispense history.</div>;
  }
  const fetchHistory = async () => {
    if (!searchId) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5001/api/pharmacy/dispense-history/${searchId}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      } else {
        alert('Prescription not found');
        setHistory(null);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      alert('Error fetching history');
    }
    setLoading(false);
  };

  const handleEdit = (log) => {
    setEditingLog(log._id);
    setEditFormData({
      quantityDispensed: log.quantityDispensed,
      notes: log.notes,
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
        fetchHistory();
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

  return (
    <div>
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter prescription ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={fetchHistory}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </div>

      {history && (
        <div className="bg-white border rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">{history.prescription.medicationName}</h3>
            <p className="text-gray-600">
              Patient: {history.prescription.patientName} ({history.prescription.patientEmail})
            </p>
          </div>

          <h4 className="font-semibold mb-3">Dispense Log</h4>
          
          {history.dispenseLog.length === 0 ? (
            <p className="text-gray-500">No dispense history</p>
          ) : (
            <div className="space-y-3">
              {history.dispenseLog.map((log) => (
                <div key={log._id} className="border rounded p-3">

                  {editingLog === log._id ? (
                    <div className="space-y-2">
                      <input
                        type="number"
                        value={editFormData.quantityDispensed}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          quantityDispensed: e.target.value
                        })}
                        className="w-full p-1 border rounded"
                        placeholder="Quantity"
                      />
                      <select
                        value={editFormData.status}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          status: e.target.value
                        })}
                        className="w-full p-1 border rounded"
                      >
                        <option value="Dispensed">Dispensed</option>
                        <option value="pending">Pending</option>
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(history.prescription.id, log._id)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingLog(null);
                            setEditFormData({});
                          }}
                          className="px-3 py-1 bg-gray-400 text-white rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {new Date(log.dispensedDate).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">By: {log.dispensedByName}</p>
                          <p className="text-sm">Quantity: {log.quantityDispensed}</p>
                          <p className="text-sm">
                            Status: <span className={`font-medium ${
                              log.status === 'fully-dispensed' ? 'text-green-600' :
                              log.status === 'partially-dispensed' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>{log.status}</span>
                          </p>
                          {log.notes && <p className="text-sm mt-1">Notes: {log.notes}</p>}
                        </div>
                        <button
                          onClick={() => handleEdit(log)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DispenseHistory;