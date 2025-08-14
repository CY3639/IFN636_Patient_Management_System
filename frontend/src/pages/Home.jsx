import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  if (user) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              ePrescription & Medication Management
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Streamlining healthcare through digital prescription management
            </p>
            <p className="text-lg mb-8 max-w-3xl mx-auto text-blue-50">
              Connect doctors, patients, and pharmacies in a secure, efficient digital ecosystem 
              for prescription tracking and medication management.
            </p>
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          For All Healthcare Stakeholders
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Doctors */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Doctors</h3>
            <p className="text-gray-600 mb-4">
              Create and manage digital prescriptions. 
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Digital prescription creation</li>
            </ul>
          </div>

          {/* Patients */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Patients</h3>
            <p className="text-gray-600 mb-4">
              Access your prescriptions digitally via email.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Digital prescription access</li>
            </ul>
          </div>

          {/* Pharmacies */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>  
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Pharmacies</h3>
            <p className="text-gray-600 mb-4">
              <strong>Future Release</strong> - Receive and fulfill digital prescriptions. Manage inventory and patient consultation records.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Digital prescription dispensing</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How It Works 
          </h2>
          
          {/* change grid-cols-3 back to grid-cols-4 when Track & Monitor releases */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Doctor Prescribes</h3>
              <p className="text-sm text-gray-600">Doctor creates digital prescription in the system</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Patient Receives</h3>
              <p className="text-sm text-gray-600">Patient gets instant access to prescription</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Pharmacy Fulfills</h3>
              <p className="text-sm text-gray-600">Pharmacy receives and processes the prescription</p>
            </div>
            
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Digitise Your Healthcare Experience?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of healthcare professionals already using our platform
          </p>
          <Link
            to="/register"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
          >
            Start Your Account
          </Link>
        </div>
      </div>
    </div>
  );
};


const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
        <p className="font-bold">Welcome back!</p>
        <p>Here you can access your profile and prescriptions from the navigation.</p>
      </div>
    </div>
  );
};

export default Home;