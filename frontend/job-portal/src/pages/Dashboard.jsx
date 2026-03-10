
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, applicationAPI } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        const userData = await authAPI.getProfile();
        setUser(userData);
        
        const apps = await applicationAPI.getMyApplications();
        setApplications(apps || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        // Use mock data on error
        setUser({ name: 'John Doe', email: 'john@example.com' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      accepted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      default: 'bg-blue-100 text-blue-700'
    };
    return colors[status?.toLowerCase()] || colors.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  const userName = user?.name || 'User';
  const firstName = userName.split(' ')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl">
                👤
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Welcome back, {firstName}!</h1>
                <p className="text-blue-100">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link to="/profile" className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors font-medium">
                Edit Profile
              </Link>
              <Link to="/jobs" className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-bold">
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-blue-100 bg-opacity-20 text-blue-600">
                📋
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-900">{applications.length}</h3>
              <p className="text-gray-600">Total Applications</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-purple-100 bg-opacity-20 text-purple-600">
                👀
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-900">0</h3>
              <p className="text-gray-600">Profile Views</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-green-100 bg-opacity-20 text-green-600">
                💼
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-900">0</h3>
              <p className="text-gray-600">Saved Jobs</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-yellow-100 bg-opacity-20 text-yellow-600">
                ✅
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-900">
                {applications.filter(a => a.status === 'accepted').length}
              </h3>
              <p className="text-gray-600">Interviews</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'applications', 'saved', 'interviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Applications */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                <Link to="/jobs" className="text-blue-600 font-medium hover:text-blue-700">
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {applications.length > 0 ? (
                  applications.slice(0, 5).map((app) => (
                    <div key={app._id || app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl">
                          💼
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{app.job?.title || 'Job Title'}</h3>
                          <p className="text-sm text-gray-500">{app.job?.company || 'Company'}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                        {app.status || 'Pending'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No applications yet</p>
                    <Link to="/jobs" className="text-blue-600 font-medium hover:underline">
                      Browse jobs and apply
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Job Search Progress */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your Job Search Progress</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Profile Completion</span>
                    <span className="font-semibold text-gray-900">{user ? '100%' : '50%'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" style={{ width: user ? '100%' : '50%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Applications Sent</span>
                    <span className="font-semibold text-gray-900">{applications.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full" style={{ width: `${Math.min(applications.length * 10, 100)}%` }}></div>
                  </div>
                </div>
              </div>
              <Link to="/profile" className="mt-6 block w-full py-3 text-center bg-blue-50 text-blue-600 font-semibold rounded-xl hover:bg-blue-100 transition-colors">
                Complete Your Profile
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/profile" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <span className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">📝</span>
                  <span className="font-medium text-gray-700">Update Resume</span>
                </Link>
                <Link to="/jobs" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <span className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">🔍</span>
                  <span className="font-medium text-gray-700">Search Jobs</span>
                </Link>
                <Link to="/profile" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <span className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">👤</span>
                  <span className="font-medium text-gray-700">Edit Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

