import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { companyAPI, jobAPI } from '../services/api';

const Companies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');
  const [selectedIndustry, setSelectedIndustry] = useState(
    () => searchParams.get('industry') || 'All'
  );
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  const industries = ['All', 'Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing'];

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const data = await companyAPI.getAllCompanies();
        setCompanies(data);
      } catch (err) {
        setError('Failed to load companies. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setSelectedIndustry(searchParams.get('industry') || 'All');
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

  const handleCompanyClick = async (company) => {
    setSelectedCompany(company);
    try {
      setJobsLoading(true);
      const jobs = await jobAPI.getJobsByCompany(company.name);
      setCompanyJobs(jobs);
    } catch (err) {
      console.error('Failed to fetch company jobs:', err);
      setCompanyJobs([]);
    } finally {
      setJobsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedCompany(null);
    setCompanyJobs([]);
    setJobsLoading(false);
  };

  const filteredCompanies = companies.filter(company => {
    const normalizedSearch = searchTerm.toLowerCase();
    const matchesSearch =
      !normalizedSearch ||
      [company.name, company.description, company.location]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch));
    const matchesIndustry =
      selectedIndustry === 'All' ||
      company.industry?.toLowerCase().includes(selectedIndustry.toLowerCase());
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Browse Companies
          </h1>
          <p className="text-blue-100">Discover {companies.length} great companies hiring now</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 px-4 py-4 backdrop-blur-sm">
              <p className="text-sm text-blue-100">Hiring teams</p>
              <p className="mt-2 text-2xl font-bold text-white">{companies.length || 0}</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-4 backdrop-blur-sm">
              <p className="text-sm text-blue-100">Open jobs listed</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {companies.reduce((total, company) => total + (company.jobCount || 0), 0)}
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-4 backdrop-blur-sm">
              <p className="text-sm text-blue-100">Industries covered</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {new Set(companies.map((company) => company.industry).filter(Boolean)).size || 1}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">🔍</span> Filters
              </h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Company name or location"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => updateQueryParam('search', e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={selectedIndustry}
                  onChange={(e) => updateQueryParam('industry', e.target.value)}
                >
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setSearchParams(new URLSearchParams(), { replace: true });
                }}
                className="w-full py-3 px-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Companies Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-600">
                  Showing <span className="font-bold text-gray-900">{filteredCompanies.length}</span> companies
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                      Search: {searchTerm}
                    </span>
                  )}
                  {selectedIndustry !== 'All' && (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                      Industry: {selectedIndustry}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin text-4xl mb-4">⏳</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Loading companies...</h3>
                <p className="text-gray-500">Please wait</p>
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏢</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No companies found</h3>
                <p className="text-gray-500">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCompanies.map((company) => (
                  <div 
                    key={company._id || company.id}
                    onClick={() => handleCompanyClick(company)}
                    className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100 cursor-pointer group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                        {company.logo || '🏢'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {company.name}
                        </h3>
                        <p className="text-gray-600 font-medium">{company.industry || 'Technology'}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <span className="mr-1">📍</span> {company.location || 'Remote'}
                          </span>
                          <span className="flex items-center">
                            <span className="mr-1">💼</span> {company.jobCount || 0} open jobs
                          </span>
                        </div>
                      </div>
                    </div>
                    {company.description && (
                      <p className="text-gray-500 mt-4 text-sm line-clamp-2">
                        {company.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      {company.website && (
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Visit Website →
                        </a>
                      )}
                      <button className="ml-auto px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors">
                        View Jobs ({company.jobCount || 0})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Company Details Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
              onClick={closeModal}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl">
                      {selectedCompany.logo || '🏢'}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedCompany.name}</h2>
                      <p className="text-blue-100">{selectedCompany.industry || 'Technology'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={closeModal}
                    className="text-white hover:text-gray-200 text-2xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{selectedCompany.jobCount || 0}</div>
                    <div className="text-sm text-gray-500">Open Jobs</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{selectedCompany.location || 'N/A'}</div>
                    <div className="text-sm text-gray-500">Location</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{selectedCompany.companySize || 'N/A'}</div>
                    <div className="text-sm text-gray-500">Company Size</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{selectedCompany.foundedYear || 'N/A'}</div>
                    <div className="text-sm text-gray-500">Founded</div>
                  </div>
                </div>

                {selectedCompany.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">About</h3>
                    <p className="text-gray-600">{selectedCompany.description}</p>
                  </div>
                )}

                {selectedCompany.website && (
                  <div className="mb-6">
                    <a 
                      href={selectedCompany.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {/* Jobs at this company */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Open Positions ({companyJobs.length})
                  </h3>
                  {jobsLoading ? (
                    <p className="py-4 text-center text-gray-500">Loading open positions...</p>
                  ) : companyJobs.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No open positions at the moment</p>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {companyJobs.map((job) => (
                        <div key={job._id || job.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-gray-900">{job.title}</h4>
                              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                <span>📍 {job.location}</span>
                                <span>💼 {job.jobType || job.type}</span>
                                <span>💰 {job.salary}</span>
                              </div>
                            </div>
                            <Link 
                              to={`/jobs?search=${encodeURIComponent(job.title || selectedCompany.name)}`}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;

