import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Prescriptions from './pages/Prescriptions';
import PharmacyDashboard from './pages/PharmacyDashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/pharmacy" element={<PharmacyDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
