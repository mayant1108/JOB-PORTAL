import Button from '../components/Button';
import Icon from '../components/Icon';
import { applications, jobs, profileChecklist } from '../data/mockData';

const statusClass = {
  'Interview Scheduled': 'bg-emerald-50 text-emerald-700',
  'Application Received': 'bg-blue-50 text-blue-700',
  Shortlisted: 'bg-orange-50 text-orange-700',
};

const CandidateDashboard = () => {
  const completion = Math.round((profileChecklist.filter((item) => item.done).length / profileChecklist.length) * 100);

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Candidate dashboard</p>
              <h1 className="mt-2 text-4xl font-black text-slate-950">Profile, jobs, CV, and applications</h1>
              <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                Manage preferred locations, track applications, generate CV, enable premium visibility, and chat with
                employers after response.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button to="/jobs" variant="accent">
                <Icon name="search" className="h-4 w-4" />
                Find jobs
              </Button>
              <Button variant="ghost">
                <Icon name="upload" className="h-4 w-4" />
                Export CV
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
              { label: 'Saved jobs', value: 12, icon: 'star' },
              { label: 'Best fit', value: '92%', icon: 'trend' },
              { label: 'Profile score', value: `${completion}%`, icon: 'shield' },
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
                <p className="text-sm text-slate-500">Track status, fit score, and employer responses</p>
              </div>
              <Button variant="ghost">
                <Icon name="message" className="h-4 w-4" />
                Chat inbox
              </Button>
            </div>

            <div className="mt-5 grid gap-4">
              {applications.map((app) => (
                <div key={app.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-950 font-bold text-white">
                        {app.company[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-950">{app.position}</h3>
                        <p className="mt-1 text-sm text-slate-500">{app.company} - {app.date}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${statusClass[app.status]}`}>
                        {app.status}
                      </span>
                      <span className="rounded-md bg-white px-2.5 py-1 text-xs font-bold text-slate-700">
                        {app.fitScore}% fit
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Saved and recommended jobs</h2>
              <div className="mt-4 grid gap-3">
                {jobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-950">{job.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{job.company} - {job.location}</p>
                      </div>
                      <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-bold text-teal-700">
                        {job.fitScore}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Preferred job locations</h2>
              <div className="mt-4 grid gap-3">
                {['Bengaluru - Indiranagar', 'Pune - Hinjewadi', 'Remote - India'].map((location, index) => (
                  <div key={location} className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <Icon name="map" className="h-4 w-4 text-teal-600" />
                      <span className="text-sm font-bold text-slate-700">{location}</span>
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
            <h2 className="text-xl font-black text-slate-950">Premium features</h2>
            <div className="mt-4 grid gap-3">
              {['Profile Highlight', 'Auto Apply for Jobs', 'Passive Job Mode'].map((feature) => (
                <label key={feature} className="flex cursor-pointer items-center justify-between rounded-lg bg-slate-50 p-3">
                  <span className="text-sm font-bold text-slate-700">{feature}</span>
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-teal-200 bg-teal-50 p-5">
            <h2 className="text-xl font-black text-slate-950">CV preview</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Profile data is ready for a downloadable CV and shareable link after admin approval.
            </p>
            <Button variant="accent" className="mt-4 w-full">
              <Icon name="upload" className="h-4 w-4" />
              Download CV
            </Button>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default CandidateDashboard;
