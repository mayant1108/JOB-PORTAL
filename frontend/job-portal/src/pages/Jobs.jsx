import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { applicationAPI, jobAPI } from '../services/api';
import { hasActiveSession } from '../utils/auth';

const Jobs = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    () => searchParams.get('category') || 'All'
  );
  const [selectedType, setSelectedType] = useState(
    () => searchParams.get('type') || 'All'
  );
  const [applyingJob, setApplyingJob] = useState(null);
  const [applySuccess, setApplySuccess] = useState('');
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  const searchTerm = searchParams.get('search') || '';
  const categories = ['All', 'Engineering', 'Design', 'Marketing', 'Sales', 'Finance', 'HR'];
  const jobTypes = ['All', 'Full Time', 'Part Time', 'Contract', 'Internship', 'Remote'];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await jobAPI.getAllJobs();
        setJobs(data);

        if (hasActiveSession()) {
          try {
            const myApplications = await applicationAPI.getMyApplications();
            setAppliedJobIds(
              (myApplications || [])
                .map((application) => application.job?._id || application.job?.id)
                .filter(Boolean)
            );
          } catch (applicationError) {
            console.error('Failed to load application status:', applicationError);
            setAppliedJobIds([]);
          }
        } else {
          setAppliedJobIds([]);
        }
      } catch (err) {
        setError('Failed to load jobs. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
    setSelectedType(searchParams.get('type') || 'All');
  }, [searchParams]);

  const updateQueryParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);

    if (!value || value === 'All') {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }

    setSearchParams(nextParams, { replace: true });
  };

  const handleSearchChange = (value) => {
    updateQueryParam('search', value.trim() ? value : '');
  };

  const handleApply = async (jobId) => {
    if (!hasActiveSession()) {
      navigate('/login');
      return;
    }

    try {
      setError('');
      setApplyingJob(jobId);
      await applicationAPI.applyForJob({ jobId });
      setAppliedJobIds((currentIds) =>
        currentIds.includes(jobId) ? currentIds : [...currentIds, jobId]
      );
      setApplySuccess('Successfully applied for job!');
      window.setTimeout(() => setApplySuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to apply. You may have already applied.');
    } finally {
      setApplyingJob(null);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const companyName =
      typeof job.company === 'string' ? job.company : job.company?.name || '';
    const matchesSearch =
      !normalizedSearch ||
      [job.title, companyName, job.location, job.category]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch));

    const matchesCategory =
      selectedCategory === 'All' ||
      job.category?.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesType = selectedType === 'All' || job.jobType === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">Find Your Dream Job</h1>
          <p className="text-blue-100">Browse {jobs.length} open positions</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}
        {applySuccess && (
          <div className="mb-4 rounded-lg border border-green-400 bg-green-100 px-4 py-3 text-green-700">
            {applySuccess}
          </div>
        )}

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-1/4">
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-md">
              <h3 className="mb-6 flex items-center text-lg font-bold text-gray-900">
                <span className="mr-2">🔍</span> Filters
              </h3>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Search</label>
                <input
                  type="text"
                  placeholder="Job title or company"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Job Type</label>
                <select
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedType}
                  onChange={(e) => updateQueryParam('type', e.target.value)}
                >
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
                <select
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedCategory}
                  onChange={(e) => updateQueryParam('category', e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSearchParams(new URLSearchParams(), { replace: true });
                }}
                className="w-full rounded-xl bg-gray-100 px-4 py-3 font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="lg:w-3/4">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-gray-600">
                  Showing <span className="font-bold text-gray-900">{filteredJobs.length}</span>{' '}
                  jobs
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                      Search: {searchTerm}
                    </span>
                  )}
                  {selectedCategory !== 'All' && (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                      Category: {selectedCategory}
                    </span>
                  )}
                  {selectedType !== 'All' && (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                      Type: {selectedType}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="py-16 text-center">
                  <div className="mb-4 text-4xl animate-spin">⏳</div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Loading jobs...</h3>
                  <p className="text-gray-500">Please wait</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="mb-4 text-6xl">🔍</div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">No jobs found</h3>
                  <p className="text-gray-500">Try adjusting your filters</p>
                </div>
              ) : (
                filteredJobs.map((job) => {
                  const jobId = job._id || job.id;
                  const alreadyApplied = appliedJobIds.includes(jobId);

                  return (
                    <div
                      key={jobId}
                      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all hover:shadow-xl"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 text-3xl">
                          {job.logo || '💼'}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">
                                {job.title || 'Job Title'}
                              </h3>
                              <p className="font-medium text-gray-600">
                                {typeof job.company === 'string'
                                  ? job.company
                                  : job.company?.name || 'Company'}
                              </p>
                            </div>
                            <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">
                              Hiring
                            </span>
                          </div>

                          <p className="mt-2 line-clamp-2 text-gray-500">
                            {job.description || 'No description'}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span>📍 {job.location || 'Remote'}</span>
                            <span>💼 {job.jobType || 'Full Time'}</span>
                            <span>💰 {job.salary || 'Competitive'}</span>
                            <span>🕒 {job.posted || 'Recently posted'}</span>
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                              {job.category || 'General'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleApply(jobId)}
                              disabled={alreadyApplied || applyingJob === jobId}
                              className="rounded-xl bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300"
                            >
                              {alreadyApplied
                                ? 'Applied'
                                : applyingJob === jobId
                                  ? 'Applying...'
                                  : 'Apply Now'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
