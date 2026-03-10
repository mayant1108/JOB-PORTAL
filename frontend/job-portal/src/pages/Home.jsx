import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobAPI } from '../services/api';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const jobs = await jobAPI.getAllJobs();
        // Get first 4 jobs as featured
        setFeaturedJobs(jobs.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        // Fallback to empty array - will show message
        setFeaturedJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedJobs();
  }, []);

  const features = [
    {
      icon: '🔍',
      title: 'Smart Job Search',
      description: 'Find jobs that match your skills and preferences with our advanced search algorithm.'
    },
    {
      icon: '📱',
      title: 'Easy Applications',
      description: 'Apply to multiple jobs with just a few clicks. Track your applications in one place.'
    },
    {
      icon: '📊',
      title: 'Resume Builder',
      description: 'Create professional resumes with our easy-to-use builder and templates.'
    },
    {
      icon: '🔔',
      title: 'Job Alerts',
      description: 'Get notified instantly when new jobs matching your criteria are posted.'
    },
    {
      icon: '💼',
      title: 'Company Reviews',
      description: 'Read honest reviews from employees to find the perfect workplace.'
    },
    {
      icon: '🤝',
      title: 'Networking',
      description: 'Connect with recruiters and professionals in your industry.'
    }
  ];

  const stats = [
    { number: '10k+', label: 'Active Jobs' },
    { number: '5k+', label: 'Companies' },
    { number: '50k+', label: 'Job Seekers' },
    { number: '25k+', label: 'Placements' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 animate-fade-in">
              Find Your Dream Job
              <span className="block text-yellow-300 mt-2">Today!</span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Discover thousands of job opportunities from top companies. 
              Your next career move starts here.
            </p>

            {/* Search Box */}
            <div className="bg-white rounded-2xl p-2 shadow-2xl max-w-4xl mx-auto transform hover:scale-[1.02] transition-transform duration-300">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-3">
                  <span className="text-gray-400 mr-3 text-xl">🔍</span>
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-3">
                  <span className="text-gray-400 mr-3 text-xl">📍</span>
                  <input
                    type="text"
                    placeholder="City, state, or remote"
                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>
                <Link
                  to="/jobs"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold py-4 px-8 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <span>Search Jobs</span>
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white">{stat.number}</div>
                  <div className="text-blue-200 text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose JobPortal?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We provide all the tools you need to land your perfect job
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Featured Jobs
              </h2>
              <p className="text-gray-600">Handpicked jobs from top companies</p>
            </div>
            <Link
              to="/jobs"
              className="hidden md:flex items-center space-x-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              <span>View All Jobs</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                    {job.logo}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 font-medium">{job.company}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
                      <span className="flex items-center">
                        <span className="mr-1">📍</span> {job.location}
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">💼</span> {job.type}
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">💰</span> {job.salary}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    {job.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">{job.posted}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              to="/jobs"
              className="inline-flex items-center space-x-2 text-blue-600 font-semibold"
            >
              <span>View All Jobs</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-300 rounded-full blur-3xl"></div>
          </div>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Career?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who found their dream jobs through JobPortal
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                Sign Up Free
              </Link>
              <Link
                to="/jobs"
                className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white/10 transition-colors"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">For Job Seekers</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Job Alerts</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resume Services</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">For Employers</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Post a Job</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Search Candidates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  📘
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  🐦
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  💼
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>© 2024 JobPortal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

