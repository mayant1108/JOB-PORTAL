import { useEffect, useMemo, useState } from 'react';
import Button from '../components/Button';
import Icon from '../components/Icon';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    const response = await api.getAdminStats();

    if (response.success) {
      setStats(response.stats);
      setMessage('');
    } else {
      setStats(null);
      setMessage(response.message || 'Admin access required to view this dashboard.');
    }

    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const pendingJobs = useMemo(
    () => (stats?.recentJobs || []).filter((job) => job.status === 'pending'),
    [stats],
  );

  const handleApprove = async (jobId) => {
    const response = await api.approveJob(jobId);
    setMessage(response.message || 'Job updated.');
    await loadStats();
  };

  const handleDelete = async (jobId) => {
    const response = await api.deleteAdminJob(jobId);
    setMessage(response.message || 'Job deleted.');
    await loadStats();
  };

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Admin panel</p>
              <h1 className="mt-2 text-4xl font-black text-slate-950">Verify, moderate, and monitor the platform</h1>
              <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                Review pending job postings, monitor user growth, and track application flow with live backend stats.
              </p>
            </div>
            <Button type="button" variant="accent" onClick={loadStats}>
              <Icon name="shield" className="h-4 w-4" />
              Refresh data
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="space-y-6">
          {message ? (
            <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-700">
              {message}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: 'Total jobs', value: stats?.totalJobs || 0, trend: `${stats?.activeJobs || 0} active` },
              { label: 'Pending jobs', value: stats?.pendingJobs || 0, trend: 'Awaiting approval' },
              { label: 'Users', value: stats?.totalUsers || 0, trend: `${stats?.totalCandidates || 0} candidates` },
              { label: 'Applications', value: stats?.totalApplications || 0, trend: 'Platform-wide' },
            ].map((metric) => (
              <div key={metric.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-3xl font-black text-slate-950">{loading ? '...' : metric.value}</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-500">{metric.label}</p>
                  <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-bold text-teal-700">
                    {metric.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-950">Job verification queue</h2>
                <p className="text-sm text-slate-500">Approve or remove pending listings before they go live</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              {loading ? (
                <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">Loading queue...</div>
              ) : pendingJobs.length ? (
                pendingJobs.map((job) => (
                  <article key={job._id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-slate-950">{job.title}</h3>
                          <span className="rounded-md bg-orange-100 px-2 py-1 text-xs font-bold text-orange-700">
                            pending
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          {job.company?.name || 'Company'} - {job.location?.city || 'Unknown city'}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(job.skills || []).slice(0, 3).map((skill) => (
                            <span key={skill} className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
                              <Icon name="check" className="h-3.5 w-3.5 text-teal-600" />
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" variant="ghost" onClick={() => handleDelete(job._id)}>
                          Reject
                        </Button>
                        <Button type="button" variant="accent" onClick={() => handleApprove(job._id)}>
                          Approve
                        </Button>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                  No pending jobs in the verification queue.
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">City insights</h2>
              <div className="mt-4 grid gap-3">
                {(stats?.cityInsights || []).map((city) => {
                  const width = `${Math.min(100, (city.count || 0) * 10)}%`;
                  return (
                    <div key={city._id || 'unknown'} className="rounded-lg border border-slate-200 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-950">{city._id || 'Unspecified'}</h3>
                        <p className="text-sm font-bold text-slate-600">{city.count} jobs</p>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-slate-100">
                        <div className="h-2 rounded-full bg-teal-600" style={{ width }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Recent users</h2>
              <div className="mt-4 grid gap-3">
                {(stats?.recentUsers || []).slice(0, 5).map((user) => (
                  <div key={user._id} className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                    <div>
                      <p className="font-bold text-slate-950">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                    <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-slate-700">
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">System activity</h2>
            <div className="mt-4 space-y-3">
              {[
                `${stats?.totalCandidates || 0} candidate profiles in platform`,
                `${stats?.totalRecruiters || 0} recruiter accounts active`,
                `${stats?.closedJobs || 0} closed jobs archived`,
                `${stats?.pendingJobs || 0} jobs need review`,
              ].map((item) => (
                <div key={item} className="rounded-lg bg-slate-50 p-3 text-sm font-semibold leading-6 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-orange-200 bg-orange-50 p-5">
            <h2 className="text-xl font-black text-slate-950">Reports snapshot</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Admin controls are now connected to live totals, pending approvals, and city-wise job activity.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default AdminDashboard;
