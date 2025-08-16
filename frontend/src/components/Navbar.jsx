import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      logout();
    } catch (error) {
      console.error('Error during logout:', error);
      window.location.href = '/';
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-blue-600">
            ePrescription System
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  {user.name} ({user.role})
                </span>
                
                {user.role === 'doctor' && (
                  <>
                    <Link to="/prescriptions" className="text-gray-700 hover:text-blue-600">
                      Prescriptions
                    </Link>
                  </>
                )}
                
                {user.role === 'pharmacy' && (
                  <Link to="/pharmacy" className="text-gray-700 hover:text-blue-600">
                    Pharmacy Portal
                  </Link>
                )}
                
                <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                  Profile
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;