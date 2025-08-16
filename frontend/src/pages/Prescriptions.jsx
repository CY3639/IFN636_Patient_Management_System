import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import PrescriptionForm from '../components/PrescriptionForm';
import PrescriptionList from '../components/PrescriptionList';
import { useAuth } from '../context/AuthContext';

const Prescriptions = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    dispensed: 0,
    pending: 0
  });

  useEffect(() => {
    fetchPrescriptions();
  }, [user]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/prescriptions', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPrescriptions(response.data);
      
      const dispensed = response.data.filter(p => p.isDispensed).length;
      setStats({
        total: response.data.length,
        dispensed: dispensed,
        pending: response.data.length - dispensed
      });
    } catch (error) {
      alert('Failed to fetch prescriptions.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingPrescription) {
        const response = await axiosInstance.put(
          `/api/prescriptions/${editingPrescription._id}`, 
          formData, 
          { headers: { Authorization: `Bearer ${user.token}` }}
        );
        setPrescriptions(prescriptions.map(p => 
          p._id === response.data._id ? response.data : p
        ));
      } else {
        const response = await axiosInstance.post(
          '/api/prescriptions', 
          formData, 
          { headers: { Authorization: `Bearer ${user.token}` }}
        );
        setPrescriptions([...prescriptions, response.data]);
      }
      setEditingPrescription(null);
      
      fetchPrescriptions();
    } catch (error) {
      alert('Failed to save prescription. ' + (error.response?.data?.message || ''));
    }
  };

  if (user && user.role !== 'doctor') {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p className="font-bold">Access Restricted</p>
          <p>Only doctors can create and manage prescriptions.</p>
          {user.role === 'pharmacy' && (
            <p className="mt-2">
              As a pharmacy, please use the <a href="/pharmacy" className="underline font-medium">Pharmacy Portal</a> to view and dispense prescriptions.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Prescription Management</h1>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">Total Prescriptions</p>
            <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Dispensed</p>
            <p className="text-2xl font-bold text-green-800">{stats.dispensed}</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-600 font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
          </div>
        </div>
      </div>

      <PrescriptionForm
        editingPrescription={editingPrescription}
        onSubmit={handleFormSubmit}
      />
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Your Prescriptions</h2>
        <PrescriptionList 
          prescriptions={prescriptions}
          setPrescriptions={setPrescriptions}
          setEditingPrescription={setEditingPrescription}
        />
      </div>
    </div>
  );
};

export default Prescriptions;