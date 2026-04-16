import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import JobSearch from '../pages/JobSearch';
import EmployerDashboard from '../pages/EmployerDashboard';
import CandidateDashboard from '../pages/CandidateDashboard';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import CandidateSearch from '../pages/CandidateSearch';
import AdminDashboard from '../pages/AdminDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jobs" element={<JobSearch />} />
      <Route path="/candidates" element={<CandidateSearch />} />
      <Route path="/employer-dashboard" element={<EmployerDashboard />} />
      <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
