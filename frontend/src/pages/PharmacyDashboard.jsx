import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PharmacyPrescriptionList from '../components/PharmacyPrescriptionList';
import DispenseHistory from '../components/DispenseHistory';

const PharmacyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('assigned');
  const [searchEmail, setSearchEmail] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPrescriptions = useCallback(async (endpoint) => {
    if (!user?.token) return;
  
    setLoading(true);
    try {
      const response = await fetch(`/api/pharmacy${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data);
      } else {
        console.error('Failed to fetch prescriptions');
        setPrescriptions([]);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      setPrescriptions([]);
    }
    setLoading(false);
  }, [user?.token]);

  useEffect(() => {
    if (user && user.role === 'pharmacy') {
      if (activeTab === 'assigned') {
        fetchPrescriptions('/prescriptions');
      } else if (activeTab === 'all') {
        fetchPrescriptions('/prescriptions/all');
      } else if (activeTab === 'search') {
        setPrescriptions([]);
      }
    }
  }, [activeTab, fetchPrescriptions, user]);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    if (user.role !== 'pharmacy') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

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
      } else if (activeTab === 'search' && searchEmail) {
        fetchPrescriptions(`/prescriptions/patient/${searchEmail}`);
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
              onClick={() => navigate('/')}
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
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={!searchEmail || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {prescriptions.length === 0 && !loading && activeTab === 'search' && (
            <p className="mt-2 text-sm text-gray-600">
              Enter a patient email address and click Search to find their prescriptions.
            </p>
          )}
        </div>
      )}

      {activeTab === 'history' ? (
        <DispenseHistory />
      ) : (
        <div>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading prescriptions...</p>
            </div>
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