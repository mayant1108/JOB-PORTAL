import { useMemo, useState } from 'react';
import Button from '../components/Button';
import Icon from '../components/Icon';
import JobCard from '../components/JobCard';
import { jobs } from '../data/mockData';

const jobTypes = ['All', 'Full-time', 'Part-time', 'Freelance', 'Temporary'];
const cities = ['All', 'Bengaluru', 'Delhi', 'Mumbai', 'Pune'];

const JobSearch = () => {
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('All');
  const [type, setType] = useState('All');
  const [salaryOnly, setSalaryOnly] = useState(false);

  const filteredJobs = useMemo(() => {
    const value = keyword.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesKeyword =
        !value ||
        [job.title, job.company, job.description, ...job.skills].some((field) =>
          field.toLowerCase().includes(value),
        );
      const matchesCity = city === 'All' || job.city === city;
      const matchesType = type === 'All' || job.type === type;
      const matchesSalary = !salaryOnly || job.salary.toLowerCase().includes('lpa');

      return matchesKeyword && matchesCity && matchesType && matchesSalary;
    });
  }, [city, keyword, salaryOnly, type]);

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Job search</p>
              <h1 className="mt-2 text-4xl font-black text-slate-950">Find verified jobs by skill, city, and salary</h1>
              <p className="mt-4 leading-7 text-slate-600">
                Candidates can search listings, save jobs, view fit scores, activate WhatsApp alerts, and apply after login.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="relative">
                  <span className="sr-only">Keyword</span>
                  <Icon name="search" className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    placeholder="Search title, company, or skill"
                  />
                </label>
                <label className="relative">
                  <span className="sr-only">City</span>
                  <Icon name="map" className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <select
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className="h-12 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  >
                    {cities.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {jobTypes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setType(item)}
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                      type === item
                        ? 'border-slate-950 bg-slate-950 text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item}
                  </button>
                ))}
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={salaryOnly}
                    onChange={(event) => setSalaryOnly(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  LPA salaries
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div>
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-black text-slate-950">{filteredJobs.length} matching jobs</h2>
              <p className="text-sm text-slate-500">Admin-approved listings with fit score and quick apply CTA</p>
            </div>
            <Button to="/candidate-dashboard" variant="ghost">
              <Icon name="star" className="h-4 w-4" />
              Saved jobs
            </Button>
          </div>

          <div className="grid gap-5">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {filteredJobs.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
              <h3 className="text-lg font-bold text-slate-950">No jobs found</h3>
              <p className="mt-2 text-sm text-slate-500">Try a different city, role, or employment type.</p>
            </div>
          ) : null}
        </div>

        <aside className="space-y-5">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-950">Candidate tools</h3>
            <div className="mt-4 space-y-3">
              {['WhatsApp job alerts', 'Auto apply premium', 'Passive job mode', 'Preferred 3 cities'].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-50 text-teal-700">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-orange-200 bg-orange-50 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white">
                <Icon name="lock" className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold text-slate-950">Login required</h3>
                <p className="text-sm text-slate-600">Applications and employer chat open after sign in.</p>
              </div>
            </div>
            <Button to="/login" variant="warning" className="mt-4 w-full">
              Login to apply
            </Button>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default JobSearch;
