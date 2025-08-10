import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const PrescriptionList = ({ prescriptions, createPrescriptions, setEditingPrescription }) => {
  const { user } = useAuth();

  const handleDelete = async (prescriptionId) => {
    try {
      await axiosInstance.delete(`/api/prescriptions/${prescriptionId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      createPrescriptions(prescriptions.filter((prescription) => prescription._id !== prescriptionId));
    } catch (error) {
      alert('Failed to delete prescription.');
    }
  };

  return (
    <div>
      {prescriptions.map((prescription) => (
        <div key={prescription._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <p className="text-sm text-gray-500">Script Date: {new Date(prescription.prescriptionDate).toLocaleDateString()}</p>
          <h2 className="font-bold">{prescription.medicationName} {prescription.medicationStrength} {prescription.medicationForm}</h2>
          <p className="text-sm text-gray-500">Direction: {prescription.directionOfUse}</p>
          <p className="text-sm text-gray-500">Quantity: {prescription.quantity} Repeats: {prescription.repeats}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingPrescription(prescription)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(prescription._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrescriptionList;
