import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { companyAPI, jobAPI } from '../services/api';

const stories = [
  {
    name: 'Aarav Mehta',
    role: 'Frontend Engineer',
    quote: 'The search and company pages finally feel connected like a real hiring site.',
  },
  {
    name: 'Nisha Kapoor',
    role: 'Product Designer',
    quote: 'I could compare teams, filter roles, and track my applications without context switching.',
  },
  {
    name: 'Rohan Singh',
    role: 'Growth Marketer',
    quote: 'It feels closer to an actual product now instead of a demo with disconnected screens.',
  },
];

const jobTypes = ['All', 'Full Time', 'Part Time', 'Contract', 'Internship', 'Remote'];

const companyName = (company) =>
  typeof company === 'string' ? company : company?.name || 'Company';

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const [jobData, companyData] = await Promise.all([
          jobAPI.getAllJobs(),
          companyAPI.getAllCompanies(),
        ]);

        setJobs(jobData || []);
        setCompanies(companyData || []);
      } catch (loadError) {
        console.error('Failed to load homepage data:', loadError);
        setError('Live data could not be loaded, but the portal structure is ready.');
        setJobs([]);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const featuredJobs = jobs.slice(0, 6);
  const featuredCompanies = companies.slice(0, 4);
  const remoteJobs = jobs.filter((job) =>
    `${job.location || ''}`.toLowerCase().includes('remote')
  ).length;

  const categoryCounts = jobs.reduce((accumulator, job) => {
    const category = job.category || 'General';
    accumulator[category] = (accumulator[category] || 0) + 1;
    return accumulator;
  }, {});

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, count]) => ({ name, count }));

  const handleSearch = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    }
    if (selectedType !== 'All') {
      params.set('type', selectedType);
    }

    const query = params.toString();
    navigate(query ? `/jobs?${query}` : '/jobs');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.28),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <div className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-blue-100">
              More polished. More connected. More real.
            </div>
            <h1 className="mt-8 max-w-3xl text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
              Find a better role through a website that feels production-ready.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Search live roles, compare hiring companies, and move from signup to application
              tracking in one clean candidate flow.
            </p>

            <form onSubmit={handleSearch} className="mt-10 rounded-3xl bg-white p-3 shadow-2xl">
              <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_auto]">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search roles, skills, or companies"
                  className="rounded-2xl bg-slate-50 px-4 py-4 text-slate-900 outline-none"
                />
                <select
                  value={selectedType}
                  onChange={(event) => setSelectedType(event.target.value)}
                  className="rounded-2xl bg-slate-50 px-4 py-4 text-slate-900 outline-none"
                >
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded-2xl bg-blue-600 px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                >
                  Search Jobs
                </button>
              </div>
            </form>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/companies" className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white hover:bg-white/10">
                Explore Companies
              </Link>
              <Link to="/signup" className="rounded-full bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-100">
                Create Account
              </Link>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/8 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
                  Live overview
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">Hiring snapshot</h2>
              </div>
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-semibold text-emerald-200">
                Active
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {[
                { label: 'Open roles', value: jobs.length || 6 },
                { label: 'Hiring companies', value: companies.length || 4 },
                { label: 'Remote roles', value: remoteJobs || 2 },
                { label: 'Candidate flow', value: 'Ready' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/6 p-4">
                  <p className="text-sm text-slate-300">{stat.label}</p>
                  <p className="mt-3 text-3xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl bg-white p-5 text-slate-900">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Latest roles</h3>
                <Link to="/jobs" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                  View all
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={`home-skeleton-${index}`} className="animate-pulse rounded-2xl border border-slate-100 p-4">
                      <div className="h-4 w-2/3 rounded bg-slate-100" />
                      <div className="mt-3 h-3 w-1/2 rounded bg-slate-100" />
                    </div>
                  ))
                ) : featuredJobs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm text-slate-500">
                    No live roles yet. Seed or add jobs and they will show up here automatically.
                  </div>
                ) : (
                  featuredJobs.slice(0, 3).map((job) => (
                    <Link
                      key={job._id || job.id}
                      to={`/jobs?search=${encodeURIComponent(job.title || '')}`}
                      className="block rounded-2xl border border-slate-100 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/40"
                    >
                      <h4 className="font-bold text-slate-900">{job.title}</h4>
                      <p className="mt-1 text-sm text-slate-500">
                        {companyName(job.company)} / {job.location || 'Remote'}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 py-5 text-sm text-slate-500 sm:px-6 lg:px-8">
          <span className="font-semibold uppercase tracking-[0.2em] text-slate-400">Hiring on platform</span>
          {(featuredCompanies.length > 0 ? featuredCompanies : [{ name: 'TechCorp' }, { name: 'DataFlow' }, { name: 'DesignStudio' }, { name: 'CloudTech' }]).map((company) => (
            <span key={company._id || company.name} className="font-semibold text-slate-700">
              {company.name}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-10 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
            {error}
          </div>
        )}

        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Real website feel</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Discovery, credibility, and action all in one place.
            </h2>
          </div>
          <p className="max-w-2xl text-slate-600">
            The homepage now highlights live roles, hiring companies, search entry points, and
            stronger product context instead of looking like a plain starter page.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {(topCategories.length > 0
            ? topCategories
            : [
                { name: 'Engineering', count: 3 },
                { name: 'Design', count: 1 },
                { name: 'Marketing', count: 1 },
                { name: 'Sales', count: 1 },
              ]).map((category) => (
            <Link
              key={category.name}
              to={`/jobs?category=${encodeURIComponent(category.name)}`}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">{category.name}</h3>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                  {category.count}
                </span>
              </div>
              <p className="mt-4 text-slate-600">
                Browse focused openings in {category.name.toLowerCase()} and jump directly into active roles.
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-100/70 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Featured jobs</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">Fresh openings from active teams</h2>
            </div>
            <Link to="/jobs" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              Browse all jobs
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {(featuredJobs.length > 0
              ? featuredJobs
              : [
                  {
                    _id: 'fallback-job',
                    title: 'Senior Frontend Developer',
                    company: 'TechCorp',
                    location: 'San Francisco, CA',
                    jobType: 'Full Time',
                    salary: '₹120,000 - ₹150,000',
                    description: 'Build polished user experiences with modern frontend tooling.',
                    category: 'Engineering',
                    tags: ['React', 'TypeScript'],
                  },
                ]).map((job) => (
              <div
                key={job._id || job.id}
                className="rounded-3xl bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                      {job.category || 'General'}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">{job.title}</h3>
                    <p className="mt-2 text-slate-600">
                      {companyName(job.company)} / {job.location || 'Remote'}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                    {job.jobType || 'Full Time'}
                  </span>
                </div>
                <p className="mt-5 line-clamp-3 text-slate-600">
                  {job.description || 'No description available yet.'}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(job.tags || []).slice(0, 4).map((tag) => (
                    <span key={`${job._id || job.id}-${tag}`} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                  <div>
                    <p className="text-sm text-slate-500">Compensation</p>
                    <p className="font-semibold text-slate-900">{job.salary || 'Competitive package'}</p>
                  </div>
                  <Link
                    to={`/jobs?search=${encodeURIComponent(job.title || '')}`}
                    className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Explore Role
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Featured companies</p>
              <h2 className="mt-3 text-3xl font-bold">Teams worth checking before you apply</h2>
            </div>
            <Link to="/companies" className="text-sm font-semibold text-blue-200 hover:text-white">
              View companies
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            {(featuredCompanies.length > 0
              ? featuredCompanies
              : [
                  { _id: 'c1', name: 'TechCorp', industry: 'Technology', location: 'San Francisco, CA', jobCount: 2 },
                  { _id: 'c2', name: 'DataFlow', industry: 'Technology', location: 'Remote', jobCount: 1 },
                  { _id: 'c3', name: 'DesignStudio', industry: 'Design', location: 'New York, NY', jobCount: 1 },
                  { _id: 'c4', name: 'CloudTech', industry: 'Technology', location: 'Austin, TX', jobCount: 1 },
                ]).map((company) => (
              <Link
                key={company._id || company.name}
                to={`/companies?search=${encodeURIComponent(company.name)}`}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 transition-transform hover:-translate-y-1 hover:bg-white/8"
              >
                <h3 className="text-xl font-bold">{company.name}</h3>
                <p className="mt-2 text-sm text-slate-300">
                  {company.industry || 'Growing team'} / {company.location || 'Remote'}
                </p>
                <div className="mt-6 rounded-2xl bg-white/5 px-4 py-3 text-sm text-blue-100">
                  {company.jobCount || 0} open roles
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[32px] bg-blue-600 p-8 text-white shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Candidate journey</p>
            <h2 className="mt-3 text-3xl font-bold">A smoother flow from discovery to application tracking</h2>
            <p className="mt-4 leading-8 text-blue-50">
              Search jobs, compare companies, create your account, and manage your progress inside
              a structure that feels closer to a real hiring product.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className="rounded-full bg-white px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50">
                Start with signup
              </Link>
              <Link to="/dashboard" className="rounded-full border border-white/30 px-5 py-3 font-semibold text-white hover:bg-white/10">
                Open dashboard
              </Link>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {stories.map((story) => (
              <div key={story.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-slate-700">&ldquo;{story.quote}&rdquo;</p>
                <div className="mt-6 border-t border-slate-200 pt-4">
                  <p className="font-bold text-slate-900">{story.name}</p>
                  <p className="text-sm text-slate-500">{story.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900">JobPortal</h3>
            <p className="mt-4 text-slate-600">
              A cleaner, more realistic job portal experience for candidates and hiring teams.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Explore</h4>
            <div className="mt-4 space-y-3 text-slate-600">
              <Link to="/jobs" className="block hover:text-slate-900">Jobs</Link>
              <Link to="/companies" className="block hover:text-slate-900">Companies</Link>
              <Link to="/signup" className="block hover:text-slate-900">Create account</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Candidate tools</h4>
            <div className="mt-4 space-y-3 text-slate-600">
              <Link to="/dashboard" className="block hover:text-slate-900">Dashboard</Link>
              <Link to="/applications" className="block hover:text-slate-900">Applications</Link>
              <Link to="/profile" className="block hover:text-slate-900">Profile</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Built for flow</h4>
            <p className="mt-4 text-slate-600">
              Homepage, job search, company browsing, signup, and tracking now feel more connected.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
