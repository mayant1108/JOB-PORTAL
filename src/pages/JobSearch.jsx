import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard';
import Button from '../components/Button';
import Icon from '../components/Icon';
import toast from 'react-hot-toast';
import api from '../services/api';
import { formatCompactNumber, normalizeJob } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';

const JobSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    salaryMin: searchParams.get('salaryMin') || '',
    page: Number.parseInt(searchParams.get('page') || '1', 10),
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);

      const response = await api.getJobs({
        search: filters.keyword,
        location: filters.location,
        type: filters.type,
        minSalary: filters.salaryMin,
        page: filters.page,
      });

      if (response.success) {
        setJobs((response.jobs || []).map(normalizeJob));
        setPagination(response.pagination || { page: 1, pages: 1, total: response.jobs?.length || 0 });
      } else {
        toast.error(response.message || 'Failed to load jobs');
        setJobs([]);
      }

      setLoading(false);
    };

    fetchJobs();
  }, [filters]);

  const handleApply = async (jobId) => {
    if (!user) {
      toast('Please login to apply');
      return;
    }

    if (user.role !== 'candidate') {
      toast.error('Only candidate accounts can apply for jobs');
      return;
    }

    const response = await api.applyJob(jobId);

    if (response.success) {
      toast.success(response.message || 'Application submitted!');
    } else {
      toast.error(response.message || 'Failed to apply');
    }
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => {
      const nextFilters = {
        ...prev,
        [key]: value,
        page: key === 'page' ? value : 1,
      };

      const params = new URLSearchParams();
      Object.entries(nextFilters).forEach(([paramKey, paramValue]) => {
        if (paramValue) {
          params.set(paramKey, String(paramValue));
        }
      });
      setSearchParams(params);

      return nextFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      keyword: '',
      location: '',
      type: '',
      salaryMin: '',
      page: 1,
    });
    setSearchParams(new URLSearchParams());
  };

  const activeFilters = useMemo(
    () =>
      [
        filters.keyword ? { key: 'keyword', label: `Keyword: ${filters.keyword}` } : null,
        filters.location ? { key: 'location', label: `Location: ${filters.location}` } : null,
        filters.type ? { key: 'type', label: `Type: ${filters.type}` } : null,
        filters.salaryMin ? { key: 'salaryMin', label: `Min salary: ${filters.salaryMin}` } : null,
      ].filter(Boolean),
    [filters.keyword, filters.location, filters.salaryMin, filters.type],
  );

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="page-bg py-10 sm:py-12">
      <div className="section-shell">
        <section className="surface-card hero-spotlight overflow-hidden px-6 py-8 sm:px-8 sm:py-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="eyebrow">Search jobs</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Find roles with cleaner filters and clearer signals.
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                Browse verified openings, narrow by city or job type, and apply without losing context.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px]">
              <div className="hero-stat">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Available now</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{formatCompactNumber(pagination.total)}</p>
                <p className="mt-2 text-sm text-slate-500">Live jobs in the current result set</p>
              </div>
              <div className="hero-stat">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Current page</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{pagination.page}</p>
                <p className="mt-2 text-sm text-slate-500">of {Math.max(pagination.pages || 1, 1)} total pages</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[320px_1fr]">
          <aside className="xl:sticky xl:top-28 xl:self-start">
            <div className="filter-shell">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Filters</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Refine your search</h2>
                </div>
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm font-bold text-sky-700 transition hover:text-sky-800"
                  >
                    Clear all
                  </button>
                ) : null}
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="field-label">Keyword</label>
                  <div className="relative mt-2">
                    <Icon name="search" className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      value={filters.keyword}
                      onChange={(event) => updateFilter('keyword', event.target.value)}
                      className="input-control input-with-icon"
                      placeholder="Job title or skill"
                    />
                  </div>
                </div>

                <div>
                  <label className="field-label">Location</label>
                  <div className="relative mt-2">
                    <Icon name="map" className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      value={filters.location}
                      onChange={(event) => updateFilter('location', event.target.value)}
                      className="input-control input-with-icon"
                      placeholder="City or area"
                    />
                  </div>
                </div>

                <div>
                  <label className="field-label">Job Type</label>
                  <select
                    value={filters.type}
                    onChange={(event) => updateFilter('type', event.target.value)}
                    className="input-control mt-2"
                  >
                    <option value="">All types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Temporary">Temporary</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="field-label">Minimum Salary</label>
                  <div className="relative mt-2">
                    <Icon name="rupee" className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      value={filters.salaryMin}
                      onChange={(event) => updateFilter('salaryMin', event.target.value)}
                      className="input-control input-with-icon"
                      placeholder="e.g. 500000"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <Button type="button" onClick={() => updateFilter('page', 1)} className="rounded-full">
                  <Icon name="search" className="h-4 w-4" />
                  Search Jobs
                </Button>
                <div className="rounded-[24px] bg-slate-950 px-4 py-4 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-300">Tip</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    Search updates live as you type. Use one or two filters first to keep results broad enough.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <section className="results-shell">
            <div className="flex flex-col gap-4 border-b border-slate-200/70 pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Result feed</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{pagination.total} jobs found</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {hasActiveFilters ? 'Showing jobs matching your current filters.' : 'Showing the latest jobs available on the platform.'}
                </p>
              </div>

              {hasActiveFilters ? (
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter) => (
                    <button
                      key={filter.key}
                      type="button"
                      onClick={() => updateFilter(filter.key, '')}
                      className="chip transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                    >
                      {filter.label}
                      <Icon name="close" className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="mt-6">
              {loading ? (
                <div className="grid gap-5 xl:grid-cols-2">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="h-72 rounded-[28px] bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 bg-[length:200%_100%] p-6 animate-shimmer"
                    />
                  ))}
                </div>
              ) : jobs.length ? (
                <div className="grid gap-5 xl:grid-cols-2">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onApply={user?.role === 'candidate' ? handleApply : null}
                      applyLabel="Apply"
                    />
                  ))}
                </div>
              ) : (
                <div className="surface-card px-6 py-12 text-center">
                  <Icon name="search" className="mx-auto h-10 w-10 text-slate-400" />
                  <h3 className="mt-4 text-2xl font-black text-slate-950">No jobs found</h3>
                  <p className="mt-2 text-slate-500">Try changing keyword, location, or salary filters.</p>
                  <Button type="button" onClick={clearFilters} variant="ghost" className="mt-5 rounded-full px-5">
                    Reset filters
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-slate-200/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Page {pagination.page} of {Math.max(pagination.pages || 1, 1)}
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  className="rounded-full px-5"
                  disabled={pagination.page <= 1}
                  onClick={() => updateFilter('page', pagination.page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  className="rounded-full px-5"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => updateFilter('page', pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
