
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI, applicationAPI } from '../services/api';

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [applyingJob, setApplyingJob] = useState(null);
  const [applySuccess, setApplySuccess] = useState('');

  const categories = ['All', 'Engineering', 'Design', 'Marketing', 'Sales', 'Finance', 'HR'];
  const jobTypes = ['All', 'Full Time', 'Part Time', 'Contract', 'Internship', 'Remote'];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await jobAPI.getAllJobs();
        setJobs(data);
      } catch (err) {
        setError('Failed to load jobs. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setApplyingJob(jobId);
      await applicationAPI.applyForJob({ jobId });
      setApplySuccess('Successfully applied for job!');
      setTimeout(() => setApplySuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to apply. You may have already applied.');
    } finally {
      setApplyingJob(null);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = (job.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (job.company?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || (job.category?.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesType = selectedType === 'All' || job.jobType === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Find Your Dream Job
          </h1>
          <p className="text-blue-100">Browse {jobs.length} open positions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {applySuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
            {applySuccess}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">🔍</span> Filters
              </h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Job title or company"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <select
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedType('All');
                }}
                className="w-full py-3 px-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing <span className="font-bold text-gray-900">{filteredJobs.length}</span> jobs
              </p>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin text-4xl mb-4">⏳</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Loading jobs...</h3>
                  <p className="text-gray-500">Please wait</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-500">Try adjusting your filters</p>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <div key={job._id || job.id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                        💼
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{job.title || 'Job Title'}</h3>
                            <p className="text-gray-600 font-medium">{job.company || 'Company'}</p>
                          </div>
                          <span className="px-4 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">Hiring</span>
                        </div>
                        <p className="text-gray-500 mt-2 line-clamp-2">{job.description || 'No description'}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                          <span>📍 {job.location || 'Remote'}</span>
                          <span>💼 {job.jobType || 'Full Time'}</span>
                          <span>💰 {job.salary || 'Competitive'}</span>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                            {job.category || 'General'}
                          </span>
                          <button 
                            onClick={() => handleApply(job._id || job.id)}
                            disabled={applyingJob === (job._id || job.id)}
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                          >
                            {applyingJob === (job._id || job.id) ? 'Applying...' : 'Apply Now'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;

