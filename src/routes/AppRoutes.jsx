import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import JobSearch from '../pages/JobSearch';
import JobDetails from '../pages/JobDetails';
import Profile from '../pages/Profile';
import Notifications from '../pages/Notifications';
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
      <Route path="/jobs/:id" element={<JobDetails />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/notifications" element={<Notifications />} />
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
