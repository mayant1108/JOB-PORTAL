import { useEffect, useMemo, useState } from 'react';
import Button from '../components/Button';
import Icon from '../components/Icon';
import api from '../services/api';
import { normalizeApplication, normalizeJob, splitList } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';

const defaultJobForm = {
  title: '',
  city: '',
  area: '',
  type: 'Full-time',
  workMode: 'On-site',
  experienceLevel: 'Junior',
  salaryMin: '',
  salaryMax: '',
  skills: '',
  description: '',
  requirements: '',
  responsibilities: '',
  benefits: '',
  deadline: '',
  isPromoted: false,
  featured: false,
};

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobForm, setJobForm] = useState(defaultJobForm);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadDashboard = async (jobIdToLoad) => {
    setLoading(true);
    const jobsResponse = await api.getMyJobs();

    if (jobsResponse.success) {
      const normalizedJobs = (jobsResponse.jobs || []).map(normalizeJob);
      setJobs(normalizedJobs);

      const nextSelectedJobId = jobIdToLoad || selectedJobId || normalizedJobs[0]?.id || '';
      setSelectedJobId(nextSelectedJobId);

      if (nextSelectedJobId) {
        const applicationsResponse = await api.getJobApplications(nextSelectedJobId);

        if (applicationsResponse.success) {
          setApplications((applicationsResponse.applications || []).map(normalizeApplication));
        } else {
          setApplications([]);
        }
      } else {
        setApplications([]);
      }
    } else {
      setJobs([]);
      setApplications([]);
      setMessage(jobsResponse.message || 'Unable to load employer data.');
    }

    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (!selectedJobId) {
      return;
    }

    const loadApplications = async () => {
      const applicationsResponse = await api.getJobApplications(selectedJobId);

      if (applicationsResponse.success) {
        setApplications((applicationsResponse.applications || []).map(normalizeApplication));
      } else {
        setApplications([]);
      }
    };

    loadApplications();
  }, [selectedJobId]);

  const stats = useMemo(() => {
    const activeJobs = jobs.filter((job) => job.status === 'active').length;
    const pendingJobs = jobs.filter((job) => job.status === 'pending').length;
    const totalApplications = jobs.reduce((sum, job) => sum + (job.applicants || 0), 0);
    const promotedJobs = jobs.filter((job) => job.promoted).length;

    return [
      { label: 'Active jobs', value: activeJobs, icon: 'briefcase' },
      { label: 'Pending approval', value: pendingJobs, icon: 'shield' },
      { label: 'Applications', value: totalApplications, icon: 'users' },
      { label: 'Promoted jobs', value: promotedJobs, icon: 'trend' },
    ];
  }, [jobs]);

  const handleCreateJob = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    const payload = {
      title: jobForm.title.trim(),
      description: jobForm.description.trim(),
      type: jobForm.type,
      workMode: jobForm.workMode,
      experienceLevel: jobForm.experienceLevel,
      location: {
        city: jobForm.city.trim(),
        area: jobForm.area.trim(),
      },
      salary: {
        min: Number(jobForm.salaryMin || 0),
        max: Number(jobForm.salaryMax || 0),
        period: 'year',
      },
      skills: splitList(jobForm.skills),
      requirements: jobForm.requirements,
      responsibilities: jobForm.responsibilities,
      benefits: jobForm.benefits,
      deadline: jobForm.deadline || undefined,
      isPromoted: jobForm.isPromoted,
      featured: jobForm.featured,
    };

    const response = await api.createJob(payload);

    if (response.success) {
      setMessage(response.message || 'Job created successfully and sent for review.');
      setJobForm(defaultJobForm);
      await loadDashboard(response.job?._id);
    } else {
      setMessage(response.message || 'Failed to create job.');
    }

    setSubmitting(false);
  };

  const handleStatusUpdate = async (applicationId, status) => {
    const response = await api.updateApplicationStatus(applicationId, status);

    if (response.success) {
      await loadDashboard(selectedJobId);
      setMessage('Application status updated.');
    } else {
      setMessage(response.message || 'Failed to update application.');
    }
  };

  if (!user) {
    return (
      <div className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-black text-slate-950">Employer dashboard</h1>
          <p className="mt-2 text-slate-500">Please login with an employer account to manage jobs.</p>
          <Button to="/login" className="mt-6">
            Go to login
          </Button>
        </div>
      </div>
    );
  }

  if (!['recruiter', 'admin'].includes(user.role)) {
    return (
      <div className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-black text-slate-950">Employer dashboard</h1>
          <p className="mt-2 text-slate-500">This dashboard is available only for employer or admin accounts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-orange-600">Employer dashboard</p>
              <h1 className="mt-2 text-4xl font-black text-slate-950">Post jobs, manage applicants, and track approvals</h1>
              <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                Create official job posts from the backend, monitor approvals, and update applicant status from one place.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button to="/candidates" variant="ghost">
                <Icon name="users" className="h-4 w-4" />
                Search profiles
              </Button>
              <Button to="/notifications" variant="accent">
                <Icon name="message" className="h-4 w-4" />
                Notifications
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <Icon name={stat.icon} className="h-5 w-5 text-teal-600" />
                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-3xl font-black text-slate-950">{stat.value}</p>
                </div>
                <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-950">Job posting form</h2>
                <p className="text-sm text-slate-500">New jobs are saved in backend and sent for admin review.</p>
              </div>
            </div>

            {message ? (
              <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-700">
                {message}
              </div>
            ) : null}

            <form onSubmit={handleCreateJob} className="mt-5 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <span className="text-sm font-bold text-slate-700">Job title</span>
                  <input
                    required
                    className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    value={jobForm.title}
                    onChange={(event) => setJobForm((prev) => ({ ...prev, title: event.target.value }))}
                  />
                </label>
                <label>
                  <span className="text-sm font-bold text-slate-700">City</span>
                  <input
                    required
                    className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    value={jobForm.city}
                    onChange={(event) => setJobForm((prev) => ({ ...prev, city: event.target.value }))}
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label>
                  <span className="text-sm font-bold text-slate-700">Area</span>
                  <input
                    className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    value={jobForm.area}
                    onChange={(event) => setJobForm((prev) => ({ ...prev, area: event.target.value }))}
                  />
                </label>
                <label>
                  <span className="text-sm font-bold text-slate-700">Employment type</span>
                  <select
                    className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    value={jobForm.type}
                    onChange={(event) => setJobForm((prev) => ({ ...prev, type: event.target.value }))}
                  >
                    {['Full-time', 'Part-time', 'Freelance', 'Temporary', 'Contract', 'Internship'].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="text-sm font-bold text-slate-700">Work mode</span>
                  <select
                    className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    value={jobForm.workMode}
                    onChange={(event) => setJobForm((prev) => ({ ...prev, workMode: event.target.value }))}
                  >
                    {['On-site', 'Hybrid', 'Remote'].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label>
                  <span className="text-sm font-bold text-slate-700">Experience level</span>
                  <select
                    className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    value={jobForm.experienceLevel}
                    onChange={(event) => setJobForm((prev) => ({ ...prev, experienceLevel: event.target.value }))}
                  >
                    {['Fresher', 'Junior', 'Mid', 'Senior', 'Expert'].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="text-sm font-bold text-slate-700">Salary min</span>
                  <input
                    type="number"
                    className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    value={jobForm.salaryMin}
                    onChange={(event) => setJobForm((prev) => ({ ...prev, salaryMin: event.target.value }))}
                  />
                </label>
                <label>
                  <span className="text-sm font-bold text-slate-700">Salary max</span>
                  <input
                    type="number"
                    className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    value={jobForm.salaryMax}
                    onChange={(event) => setJobForm((prev) => ({ ...prev, salaryMax: event.target.value }))}
                  />
                </label>
              </div>

              <label>
                <span className="text-sm font-bold text-slate-700">Required skills</span>
                <input
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  value={jobForm.skills}
                  onChange={(event) => setJobForm((prev) => ({ ...prev, skills: event.target.value }))}
                  placeholder="React, Node.js, Communication"
                />
              </label>

              <label>
                <span className="text-sm font-bold text-slate-700">Job description</span>
                <textarea
                  required
                  className="mt-2 min-h-28 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  value={jobForm.description}
                  onChange={(event) => setJobForm((prev) => ({ ...prev, description: event.target.value }))}
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <span className="text-sm font-bold text-slate-700">Requirements (one per line)</span>
                  <textarea
                    className="mt-2 min-h-24 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    value={jobForm.requirements}
                    onChange={(event) => setJobForm((prev) => ({ ...prev, requirements: event.target.value }))}
                  />
                </label>
                <label>
                  <span className="text-sm font-bold text-slate-700">Responsibilities (one per line)</span>
                  <textarea
                    className="mt-2 min-h-24 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    value={jobForm.responsibilities}
                    onChange={(event) => setJobForm((prev) => ({ ...prev, responsibilities: event.target.value }))}
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <span className="text-sm font-bold text-slate-700">Benefits</span>
                  <textarea
                    className="mt-2 min-h-20 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    value={jobForm.benefits}
                    onChange={(event) => setJobForm((prev) => ({ ...prev, benefits: event.target.value }))}
                  />
                </label>
                <label>
                  <span className="text-sm font-bold text-slate-700">Application deadline</span>
                  <input
                    type="date"
                    className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    value={jobForm.deadline}
                    onChange={(event) => setJobForm((prev) => ({ ...prev, deadline: event.target.value }))}
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={jobForm.isPromoted}
                    onChange={(event) => setJobForm((prev) => ({ ...prev, isPromoted: event.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  Paid Advertisement
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={jobForm.featured}
                    onChange={(event) => setJobForm((prev) => ({ ...prev, featured: event.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  Mark as urgent
                </label>
                <Button type="submit" variant="accent" disabled={submitting}>
                  <Icon name="shield" className="h-4 w-4" />
                  {submitting ? 'Submitting...' : 'Send to admin'}
                </Button>
              </div>
            </form>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Job management</h2>
              <div className="mt-4 grid gap-3">
                {loading ? (
                  <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">Loading jobs...</div>
                ) : jobs.length ? (
                  jobs.map((job) => (
                    <button
                      key={job.id}
                      type="button"
                      onClick={() => setSelectedJobId(job.id)}
                      className={`rounded-lg border p-4 text-left transition ${
                        selectedJobId === job.id
                          ? 'border-teal-400 bg-teal-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-slate-950">{job.title}</h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {job.applicants} applicants • {job.location}
                          </p>
                        </div>
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                          {job.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-500">{job.salary}</p>
                    </button>
                  ))
                ) : (
                  <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                    No jobs posted yet. Use the form above to create your first job.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Applicant queue</h2>
              <div className="mt-4 grid gap-3">
                {applications.length ? (
                  applications.map((application) => (
                    <div key={application.id} className="rounded-lg bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-slate-950">{application.candidateName || 'Candidate'}</h3>
                          <p className="text-sm text-slate-500">{application.candidateRole || application.position}</p>
                        </div>
                        <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-bold text-teal-700">
                          {application.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{application.note || 'No recruiter note added yet.'}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {['shortlisted', 'interview', 'selected', 'rejected'].map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => handleStatusUpdate(application.id, status)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                    Select a job to view applicants. Applications will appear here once candidates apply.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Dashboard sections</h2>
            <div className="mt-4 grid gap-3">
              {['All Jobs', 'Pending Approval', 'Active Jobs', 'Applicant Queue', 'Notifications', 'Candidate Search'].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm font-bold text-slate-700">
                  {item}
                  <Icon name="check" className="h-4 w-4 text-teal-600" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-orange-200 bg-orange-50 p-5">
            <h2 className="text-xl font-black text-slate-950">Approval workflow</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              New job posts are saved as pending and can be activated by the admin once reviewed.
            </p>
          </div>

          <div className="rounded-lg border border-teal-200 bg-teal-50 p-5">
            <h2 className="text-xl font-black text-slate-950">Candidate chat readiness</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Shortlist or move applications to interview status to keep your recruitment pipeline organized.
            </p>
            <Button to="/candidates" variant="accent" className="mt-4 w-full">
              <Icon name="message" className="h-4 w-4" />
              Explore candidates
            </Button>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default EmployerDashboard;
