import Button from '../components/Button';
import Icon from '../components/Icon';
import { activityMetrics, adminQueue, cityInsights } from '../data/mockData';

const AdminDashboard = () => {
  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Admin panel</p>
              <h1 className="mt-2 text-4xl font-black text-slate-950">Verify, moderate, and monitor the platform</h1>
              <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                Approve job postings, manage employers and candidates, detect fake or duplicate content, and track
                activity across jobs, cities, salaries, and advertisements.
              </p>
            </div>
            <Button variant="accent">
              <Icon name="shield" className="h-4 w-4" />
              Review queue
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {activityMetrics.map((metric) => (
              <div key={metric.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-3xl font-black text-slate-950">{metric.value}</p>
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
                <p className="text-sm text-slate-500">Approve or reject listings before they go live</p>
              </div>
              <Button variant="ghost">
                <Icon name="search" className="h-4 w-4" />
                Filter queue
              </Button>
            </div>

            <div className="mt-5 grid gap-4">
              {adminQueue.map((item) => (
                <article key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black text-slate-950">{item.title}</h3>
                        <span className={`rounded-md px-2 py-1 text-xs font-bold ${item.risk === 'Low' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                          {item.risk} risk
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{item.company} - {item.submitted}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.checks.map((check) => (
                          <span key={check} className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
                            <Icon name="check" className="h-3.5 w-3.5 text-teal-600" />
                            {check}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost">
                        Reject
                      </Button>
                      <Button variant="accent">
                        Approve
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">City insights</h2>
              <div className="mt-4 grid gap-3">
                {cityInsights.map((city) => {
                  const width = `${Math.min(100, city.jobs / 4.2)}%`;
                  return (
                    <div key={city.city} className="rounded-lg border border-slate-200 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-950">{city.city}</h3>
                        <p className="text-sm font-bold text-slate-600">{city.jobs} jobs</p>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-slate-100">
                        <div className="h-2 rounded-full bg-teal-600" style={{ width }} />
                      </div>
                      <p className="mt-2 text-sm text-slate-500">{city.candidates.toLocaleString()} active candidates</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Moderation controls</h2>
              <div className="mt-4 grid gap-3">
                {['Fake job detection', 'Duplicate posting scan', 'Employer account review', 'Candidate profile approval', 'Premium service audit'].map((item) => (
                  <button key={item} type="button" className="flex items-center justify-between rounded-lg bg-slate-50 p-4 text-left text-sm font-bold text-slate-700 hover:bg-slate-100">
                    {item}
                    <Icon name="shield" className="h-4 w-4 text-teal-600" />
                  </button>
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
                'Candidate: job profile, city, salary range',
                'Employer: organization type, city, posts per employee',
                'Job: most posted, most applied, city-wise jobs',
                'Jobs with fewer applicants flagged for promotion',
              ].map((item) => (
                <div key={item} className="rounded-lg bg-slate-50 p-3 text-sm font-semibold leading-6 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-orange-200 bg-orange-50 p-5">
            <h2 className="text-xl font-black text-slate-950">Ads and premium</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Manage promoted jobs, profile highlights, auto-apply subscriptions, and employer contact unlock payments.
            </p>
            <Button variant="warning" className="mt-4 w-full">
              <Icon name="trend" className="h-4 w-4" />
              Manage revenue
            </Button>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default AdminDashboard;
