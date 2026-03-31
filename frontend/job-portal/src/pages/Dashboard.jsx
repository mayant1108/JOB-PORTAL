import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { applicationAPI, authAPI } from '../services/api';
import { getApplicationStatusClass, isInterviewStatus } from '../utils/applicationStatus';
import { getStoredUser, hasActiveSession, saveAuthSession } from '../utils/auth';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(() => getStoredUser());
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!hasActiveSession()) {
        navigate('/login');
        return;
      }

      try {
        const [profileResponse, applicationResponse] = await Promise.all([
          authAPI.getProfile(),
          applicationAPI.getMyApplications(),
        ]);

        const currentUser = profileResponse?.user || profileResponse;
        setUser(currentUser);
        saveAuthSession(profileResponse);
        setApplications(applicationResponse || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setUser(getStoredUser());
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const profileCompletion = useMemo(() => {
    const fields = [user?.name, user?.email, user?.location, user?.title, user?.about];
    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  }, [user]);

  const interviewCount = applications.filter((application) =>
    isInterviewStatus(application.status)
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-4xl animate-spin">⏳</div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  const userName = user?.name || 'User';
  const firstName = userName.split(' ')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-4xl backdrop-blur-sm">
                👤
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Welcome back, {firstName}!</h1>
                <p className="text-blue-100">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
            <div className="mt-4 flex space-x-3 md:mt-0">
              <Link
                to="/profile"
                className="rounded-xl bg-white/20 px-6 py-3 font-medium text-white transition-colors hover:bg-white/30"
              >
                Edit Profile
              </Link>
              <Link
                to="/jobs"
                className="rounded-xl bg-white px-6 py-3 font-bold text-blue-600 transition-colors hover:bg-blue-50"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100/20 text-2xl text-blue-600">
                📋
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-900">{applications.length}</h3>
              <p className="text-gray-600">Total Applications</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100/20 text-2xl text-indigo-600">
                👀
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-900">{profileCompletion}%</h3>
              <p className="text-gray-600">Profile Completion</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100/20 text-2xl text-green-600">
                💼
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-900">{applications.length}</h3>
              <p className="text-gray-600">Active Applications</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100/20 text-2xl text-yellow-600">
                ✅
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-900">{interviewCount}</h3>
              <p className="text-gray-600">Interview / Hired</p>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-2xl bg-white shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'applications', 'saved', 'interviews'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`border-b-2 px-2 py-4 text-sm font-medium capitalize transition-colors ${
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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                <Link to="/applications" className="font-medium text-blue-600 hover:text-blue-700">
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {applications.length > 0 ? (
                  applications.slice(0, 5).map((application) => (
                    <div
                      key={application._id || application.id}
                      className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl">
                          {application.job?.logo || '💼'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {application.job?.title || 'Job Title'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {typeof application.job?.company === 'string'
                              ? application.job.company
                              : application.job?.company?.name || 'Company'}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-4 py-1.5 text-sm font-medium ${getApplicationStatusClass(application.status)}`}
                      >
                        {application.status || 'Applied'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">No applications yet</p>
                    <Link to="/jobs" className="font-medium text-blue-600 hover:underline">
                      Browse jobs and apply
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-6 text-xl font-bold text-gray-900">Your Job Search Progress</h2>
              <div className="space-y-6">
                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-gray-600">Profile Completion</span>
                    <span className="font-semibold text-gray-900">{profileCompletion}%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gray-200">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-gray-600">Applications Sent</span>
                    <span className="font-semibold text-gray-900">{applications.length}</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gray-200">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-green-400 to-green-500"
                      style={{ width: `${Math.min(applications.length * 10, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              <Link
                to="/profile"
                className="mt-6 block w-full rounded-xl bg-blue-50 py-3 text-center font-semibold text-blue-600 transition-colors hover:bg-blue-100"
              >
                Complete Your Profile
              </Link>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-6 text-xl font-bold text-gray-900">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 rounded-xl p-3 transition-colors hover:bg-gray-50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                    📝
                  </span>
                  <span className="font-medium text-gray-700">Update Resume</span>
                </Link>
                <Link
                  to="/jobs"
                  className="flex items-center space-x-3 rounded-xl p-3 transition-colors hover:bg-gray-50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                    🔍
                  </span>
                  <span className="font-medium text-gray-700">Search Jobs</span>
                </Link>
                <Link
                  to="/applications"
                  className="flex items-center space-x-3 rounded-xl p-3 transition-colors hover:bg-gray-50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                    📬
                  </span>
                  <span className="font-medium text-gray-700">Track Applications</span>
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
