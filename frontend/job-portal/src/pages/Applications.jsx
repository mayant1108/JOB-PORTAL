import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { applicationAPI } from '../services/api';
import {
  getApplicationStatusClass,
  isInterviewStatus,
  isReviewStatus,
} from '../utils/applicationStatus';
import { getStoredUser, hasActiveSession } from '../utils/auth';

const Applications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getStoredUser();

  useEffect(() => {
    const fetchApplications = async () => {
      if (!hasActiveSession()) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        setError('');
        const data = await applicationAPI.getMyApplications();
        setApplications(data || []);
      } catch (err) {
        setError(err.message || 'Unable to load your applications right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  const underReviewCount = applications.filter((application) =>
    isReviewStatus(application.status)
  ).length;
  const interviewCount = applications.filter((application) =>
    isInterviewStatus(application.status)
  ).length;
  const rejectedCount = applications.filter(
    (application) => application.status === 'Rejected'
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white md:text-4xl">Your Applications</h1>
          <p className="mt-2 text-blue-100">
            Track every role you have applied for in one place.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-gray-500">Total Applications</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">{applications.length}</h2>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-gray-500">Under Review</p>
            <h2 className="mt-3 text-3xl font-bold text-amber-700">{underReviewCount}</h2>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-gray-500">Interview / Hired</p>
            <h2 className="mt-3 text-3xl font-bold text-violet-700">{interviewCount}</h2>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-gray-500">Rejected</p>
            <h2 className="mt-3 text-3xl font-bold text-rose-700">{rejectedCount}</h2>
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-md">
          <div className="flex flex-col gap-3 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {user?.name ? `${user.name}'s application history` : 'Application history'}
              </h2>
              <p className="text-sm text-gray-500">
                Keep an eye on status changes from recruiters and companies.
              </p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Browse More Jobs
            </Link>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="mb-4 text-4xl animate-spin">⏳</div>
              <p className="text-gray-500">Loading your applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mb-4 text-6xl">📝</div>
              <h3 className="text-xl font-bold text-gray-900">No applications yet</h3>
              <p className="mt-2 text-gray-500">
                Start applying to roles and they will appear here automatically.
              </p>
              <Link
                to="/jobs"
                className="mt-6 inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Find Jobs
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {applications.map((application) => {
                const job = application.job || {};

                return (
                  <div
                    key={application._id || application.id}
                    className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                        {job.logo || '💼'}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {job.title || 'Untitled role'}
                        </h3>
                        <p className="font-medium text-gray-600">
                          {typeof job.company === 'string'
                            ? job.company
                            : job.company?.name || 'Company'}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                          <span>📍 {job.location || 'Remote'}</span>
                          <span>💼 {job.jobType || job.type || 'Full Time'}</span>
                          <span>🕒 Applied on {new Date(application.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      <span
                        className={`rounded-full px-4 py-1.5 text-sm font-medium ${getApplicationStatusClass(application.status)}`}
                      >
                        {application.status || 'Applied'}
                      </span>
                      <Link
                        to={`/jobs?search=${encodeURIComponent(job.title || '')}`}
                        className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                      >
                        View Similar Jobs →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applications;
