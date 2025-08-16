import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import PharmacyPrescriptionList from '../components/PharmacyPrescriptionList';
import DispenseHistory from '../components/DispenseHistory';

const PharmacyDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('assigned'); // assigned, all, search, history
  const [searchEmail, setSearchEmail] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPrescriptions = useCallback(async (endpoint) => {
    if (!user?.token) return;
  
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/pharmacy${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();
      setPrescriptions(data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
    setLoading(false);
  }, [user?.token]);

  useEffect(() => {
    if (!user) {
      window.location.href = '/';
      return;
    }
    if (user.role !== 'pharmacy') {
      window.location.href = '/';
      return;
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === 'pharmacy') {
      if (activeTab === 'assigned') {
        fetchPrescriptions('/prescriptions');
      } else if (activeTab === 'all') {
        fetchPrescriptions('/prescriptions/all');
      }
    }
  }, [activeTab, fetchPrescriptions, user]);

  const handleSearch = () => {
    if (searchEmail && user?.role === 'pharmacy') {
      fetchPrescriptions(`/prescriptions/patient/${searchEmail}`);
    }
  };

  const handleDispenseUpdate = () => {
    if (user?.role === 'pharmacy') {
      if (activeTab === 'assigned') {
        fetchPrescriptions('/prescriptions');
      } else if (activeTab === 'all') {
        fetchPrescriptions('/prescriptions/all');
      }
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p>Redirecting to home...</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'pharmacy') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p className="font-bold">Access Restricted</p>
          <p>Only pharmacy users can access this dashboard.</p>
          <div className="mt-4">
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          Search by Patient
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

      {activeTab === 'history' ? (
        <DispenseHistory />
      ) : (
        <div>
          {loading ? (
            <div className="text-center py-8">Loading prescriptions...</div>
          ) : (
            <PharmacyPrescriptionList 
              prescriptions={prescriptions} 
              onDispenseUpdate={handleDispenseUpdate}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PharmacyDashboard;