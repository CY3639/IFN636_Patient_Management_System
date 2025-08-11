import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import PrescriptionForm from '../components/PrescriptionForm';
import PrescriptionList from '../components/PrescriptionList';
import { useAuth } from '../context/AuthContext';

const Prescriptions = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [editingPrescription, setEditingPrescription] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axiosInstance.get('/api/prescriptions', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPrescriptions(response.data);
      } catch (error) {
        alert('Failed to fetch prescriptions.');
      }
    };

    fetchPrescriptions();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <PrescriptionForm
        prescriptions={prescriptions}
        setPrescriptions={setPrescriptions}
        editingPrescription={editingPrescription}
        setEditingPrescription={setEditingPrescription}
      />
      <PrescriptionList 
        prescriptions={prescriptions}
        setPrescriptions={setPrescriptions}
        editingPrescription={editingPrescription}
        setEditingPrescription={setEditingPrescription} />
    </div>
  );
};

export default Prescriptions;
