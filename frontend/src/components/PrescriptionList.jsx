import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const PrescriptionList = ({ prescriptions, setPrescriptions, setEditingPrescription }) => {
  const { user } = useAuth();

  const handleDelete = async (prescriptionId) => {
    try {
      await axiosInstance.delete(`/api/prescriptions/${prescriptionId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPrescriptions(prescriptions.filter((prescription) => prescription._id !== prescriptionId));
    } catch (error) {
      alert('Failed to delete prescription.');
    }
  };

  return (
    <div>
      {prescriptions.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No prescriptions found. Create one to get started.</p>
      ) : (
        prescriptions.map((prescription) => (
          <div key={prescription._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="font-bold text-lg">
                  {prescription.medicationName} {prescription.medicationStrength} {prescription.medicationForm}
                </h2>
                <p className="text-sm text-gray-500">
                  Script Date: {new Date(prescription.prescriptionDate).toLocaleDateString()}
                </p>
              </div>
              
              <span className={`px-3 py-1 rounded text-sm font-medium ${
                prescription.isDispensed 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
              }`}>
                {prescription.isDispensed ? '✓ Dispensed' : '⏳ Pending'}
              </span>
            </div>

            {(prescription.patientName || prescription.patientEmail) && (
              <div className="bg-white p-2 rounded mb-2">
                <p className="text-sm font-medium text-gray-700">Patient Information:</p>
                {prescription.patientName && (
                  <p className="text-sm text-gray-600">Name: {prescription.patientName}</p>
                )}
                {prescription.patientEmail && (
                  <p className="text-sm text-gray-600">Email: {prescription.patientEmail}</p>
                )}
              </div>
            )}

            {prescription.pharmacyEmail && (
              <div className="bg-blue-50 p-2 rounded mb-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Assigned to Pharmacy:</span> {prescription.pharmacyEmail}
                </p>
              </div>
            )}

            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Direction:</span> {prescription.directionOfUse}</p>
              <p>
                <span className="font-medium">Quantity:</span> {prescription.quantity} | 
                <span className="font-medium ml-2">Repeats:</span> {prescription.repeats}
              </p>
            </div>

            {prescription.dispenseLog && prescription.dispenseLog.length > 0 && (
              <div className="mt-2 p-2 bg-green-50 rounded">
                <p className="text-xs font-medium text-green-800">Latest Dispense Activity:</p>
                <p className="text-xs text-green-700">
                  {new Date(prescription.dispenseLog[prescription.dispenseLog.length - 1].dispensedDate).toLocaleDateString()} - 
                  {' '}{prescription.dispenseLog[prescription.dispenseLog.length - 1].status.replace('-', ' ')}
                  {prescription.dispenseLog[prescription.dispenseLog.length - 1].dispensedByName && 
                    ` by ${prescription.dispenseLog[prescription.dispenseLog.length - 1].dispensedByName}`}
                </p>
              </div>
            )}

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setEditingPrescription(prescription)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(prescription._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PrescriptionList;