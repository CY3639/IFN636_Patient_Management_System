import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import PharmacyPrescriptionList from '../components/PharmacyPrescriptionList';
import DispenseHistory from '../components/DispenseHistory';

const PharmacyDashboard = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('assigned'); // assigned, all, search, history
  const [searchEmail, setSearchEmail] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'pharmacy') {
      window.location.href = '/';
    }
  }, [user]);

  const fetchPrescriptions = useCallback( async (endpoint) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/pharmacy${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setPrescriptions(data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
    setLoading(false);
  }, [token]);

    useEffect(() => {
    if (activeTab === 'assigned') {
        fetchPrescriptions('/prescriptions');
    } else if (activeTab === 'all') {
        fetchPrescriptions('/prescriptions/all');
    }
    }, [activeTab, fetchPrescriptions]);

//   useEffect(() => {
//     if (activeTab === 'assigned') {
//       fetchPrescriptions('/prescriptions');
//     } else if (activeTab === 'all') {
//       fetchPrescriptions('/prescriptions/all');
//     }
//   }, [activeTab, token]);

  const handleSearch = () => {
    if (searchEmail) {
      fetchPrescriptions(`/prescriptions/patient/${searchEmail}`);
    }
  };

  const handleDispenseUpdate = () => {
    if (activeTab === 'assigned') {
      fetchPrescriptions('/prescriptions');
    } else if (activeTab === 'all') {
      fetchPrescriptions('/prescriptions/all');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pharmacy Dashboard</h1>
      
      <div className="flex space-x-1 mb-6 border-b">
        <button
          onClick={() => setActiveTab('assigned')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'assigned' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Assigned to This Pharmacy
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'all' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          All Prescriptions
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'search' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Search Patient
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'history' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Dispense History
        </button>
      </div>

      {activeTab === 'search' && (
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter patient email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          {(activeTab === 'assigned' || activeTab === 'all' || activeTab === 'search') && (
            <PharmacyPrescriptionList 
              prescriptions={prescriptions} 
              onDispenseUpdate={handleDispenseUpdate}
            />
          )}
          
          {activeTab === 'history' && (
            <DispenseHistory />
          )}
        </>
      )}
    </div>
  );
};

export default PharmacyDashboard;