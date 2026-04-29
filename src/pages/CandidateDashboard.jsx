import { useEffect, useMemo, useState } from 'react';
import Button from '../components/Button';
import Icon from '../components/Icon';
import api from '../services/api';
import { calculateProfileCompletion, normalizeApplication, normalizeJob } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';

const statusClass = {
  'Interview Scheduled': 'bg-emerald-50 text-emerald-700',
  'Application Received': 'bg-blue-50 text-blue-700',
  Shortlisted: 'bg-orange-50 text-orange-700',
  'Under Review': 'bg-amber-50 text-amber-700',
  Selected: 'bg-teal-50 text-teal-700',
  Rejected: 'bg-red-50 text-red-700',
};

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      const [profileResponse, applicationResponse, jobsResponse] = await Promise.all([
        api.getProfile(),
        api.getMyApplications(),
        api.getJobs({ limit: 3 }),
      ]);

      if (profileResponse.success) {
        setProfile(profileResponse.user);
      }

      if (applicationResponse.success) {
        setApplications((applicationResponse.applications || []).map(normalizeApplication));
      }

      if (jobsResponse.success) {
        setRecommendedJobs((jobsResponse.jobs || []).map(normalizeJob).slice(0, 3));
      }

      setLoading(false);
    };

    loadDashboard();
  }, []);

  const completion = useMemo(() => calculateProfileCompletion(profile), [profile]);
  const locationLabel = [profile?.profile?.location?.city, profile?.profile?.location?.area].filter(Boolean).join(', ');
  const profileChecklist = [
    { label: 'Personal information', done: Boolean(profile?.name && profile?.email) },
    { label: 'Professional headline', done: Boolean(profile?.profile?.headline) },
    { label: 'Skills updated', done: Boolean(profile?.profile?.skills?.length) },
    { label: 'Preferred city added', done: Boolean(profile?.profile?.location?.city) },
    { label: 'Resume uploaded', done: Boolean(profile?.profile?.resume) },
  ];

  if (!user) {
    return (
      <div className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-black text-slate-950">Candidate dashboard</h1>
          <p className="mt-2 text-slate-500">Please login with a candidate account to manage applications.</p>
          <Button to="/login" className="mt-6">
            Go to login
          </Button>
        </div>
      </div>
    );
  }

  if (user.role !== 'candidate') {
    return (
      <div className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-black text-slate-950">Candidate dashboard</h1>
          <p className="mt-2 text-slate-500">This dashboard is available only for candidate accounts.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-32 animate-pulse rounded-lg bg-slate-200" />
            ))}
          </div>
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
              <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Candidate dashboard</p>
              <h1 className="mt-2 text-4xl font-black text-slate-950">Profile, jobs, CV, and applications</h1>
              <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                Track job applications, keep your profile updated, and upload your resume to apply for more roles.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button to="/jobs" variant="accent">
                <Icon name="search" className="h-4 w-4" />
                Find jobs
              </Button>
              <Button to="/profile" variant="ghost">
                <Icon name="upload" className="h-4 w-4" />
                Update profile
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: 'Applied jobs', value: applications.length, icon: 'briefcase' },
              { label: 'Recommended jobs', value: recommendedJobs.length, icon: 'star' },
              { label: 'Profile score', value: `${completion}%`, icon: 'shield' },
              { label: 'Resume ready', value: profile?.profile?.resume ? 'Yes' : 'No', icon: 'upload' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <Icon name={stat.icon} className="h-5 w-5 text-teal-600" />
                <p className="mt-4 text-3xl font-black text-slate-950">{stat.value}</p>
                <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-950">Recent applications</h2>
                <p className="text-sm text-slate-500">Track status and recruiter responses</p>
              </div>
              <Button to="/notifications" variant="ghost">
                <Icon name="message" className="h-4 w-4" />
                Notifications
              </Button>
            </div>

            <div className="mt-5 grid gap-4">
              {applications.length ? (
                applications.map((application) => (
                  <div key={application.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-950 font-bold text-white">
                          {application.company?.[0] || 'J'}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-950">{application.position}</h3>
                          <p className="mt-1 text-sm text-slate-500">{application.company} - {application.date}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${statusClass[application.status] || 'bg-slate-100 text-slate-700'}`}>
                          {application.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg bg-slate-50 p-6 text-sm text-slate-500">
                  No applications yet. Start applying to jobs from the search page.
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Recommended jobs</h2>
              <div className="mt-4 grid gap-3">
                {recommendedJobs.map((job) => (
                  <div key={job.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-950">{job.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{job.company} - {job.location}</p>
                      </div>
                      <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-bold text-teal-700">
                        {job.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Preferred profile summary</h2>
              <div className="mt-4 grid gap-3">
                {[
                  profile?.profile?.headline || 'Add your professional headline',
                  locationLabel || 'Add your preferred city',
                  profile?.profile?.salaryExpectation || 'Add expected salary',
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <Icon name="map" className="h-4 w-4 text-teal-600" />
                      <span className="text-sm font-bold text-slate-700">{item}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Profile completion</h2>
            <div className="mt-4 h-3 rounded-full bg-slate-100">
              <div className="h-3 rounded-full bg-teal-600" style={{ width: `${completion}%` }} />
            </div>
            <p className="mt-2 text-sm font-bold text-slate-700">{completion}% complete</p>
            <div className="mt-5 space-y-3">
              {profileChecklist.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                  <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                  <Icon name={item.done ? 'check' : 'plus'} className={`h-4 w-4 ${item.done ? 'text-teal-600' : 'text-orange-500'}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Resume and links</h2>
            <div className="mt-4 grid gap-3">
              {[
                profile?.profile?.resume ? 'Resume uploaded' : 'Resume missing',
                profile?.profile?.linkedin ? 'LinkedIn added' : 'LinkedIn missing',
                profile?.profile?.portfolio ? 'Portfolio added' : 'Portfolio optional',
              ].map((feature) => (
                <div key={feature} className="rounded-lg bg-slate-50 p-3 text-sm font-bold text-slate-700">
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-teal-200 bg-teal-50 p-5">
            <h2 className="text-xl font-black text-slate-950">CV readiness</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Keep your profile and resume updated so employers can review your application faster.
            </p>
            <Button to="/profile" variant="accent" className="mt-4 w-full">
              <Icon name="upload" className="h-4 w-4" />
              Update my profile
            </Button>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default CandidateDashboard;
