import Button from '../components/Button';
import Icon from '../components/Icon';
import { applicantQueue, employerJobs } from '../data/mockData';

const EmployerDashboard = () => {
  const stats = [
    { label: 'Active jobs', value: 12, change: '+2', icon: 'briefcase' },
    { label: 'Applications', value: 156, change: '+12%', icon: 'users' },
    { label: 'Interviews', value: 23, change: '+5', icon: 'message' },
    { label: 'Paid ad days', value: 18, change: '+4', icon: 'trend' },
  ];

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-orange-600">Employer dashboard</p>
              <h1 className="mt-2 text-4xl font-black text-slate-950">Post jobs, manage applicants, and promote ads</h1>
              <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                Job posts can be previewed, marked as urgent or paid ads, sent to admin verification, and managed after
                approval.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button to="/candidates" variant="ghost">
                <Icon name="users" className="h-4 w-4" />
                Search profiles
              </Button>
              <Button variant="accent">
                <Icon name="plus" className="h-4 w-4" />
                Post new job
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
                  <span className="text-sm font-bold text-emerald-600">{stat.change}</span>
                </div>
                <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-950">Job posting form</h2>
                <p className="text-sm text-slate-500">Includes AI-assisted description and admin submission controls</p>
              </div>
              <Button variant="warning">
                <Icon name="star" className="h-4 w-4" />
                Generate description
              </Button>
            </div>

            <form className="mt-5 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <span className="text-sm font-bold text-slate-700">Job title</span>
                  <input className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" defaultValue="Support Team Lead" />
                </label>
                <label>
                  <span className="text-sm font-bold text-slate-700">Location</span>
                  <input className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" defaultValue="Delhi, Saket" />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <label>
                  <span className="text-sm font-bold text-slate-700">Employment type</span>
                  <select className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" defaultValue="Full-time">
                    <option>Full-time</option>
                    <option>Temporary</option>
                    <option>Freelance</option>
                    <option>Part-time</option>
                  </select>
                </label>
                <label>
                  <span className="text-sm font-bold text-slate-700">Salary range</span>
                  <input className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" defaultValue="Rs 45k - Rs 65k / month" />
                </label>
                <label>
                  <span className="text-sm font-bold text-slate-700">Required skills</span>
                  <input className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" defaultValue="CRM, Hindi, Excel" />
                </label>
              </div>
              <label>
                <span className="text-sm font-bold text-slate-700">Job description</span>
                <textarea className="mt-2 min-h-28 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" defaultValue="Lead a support team, manage call quality, resolve escalations, and coordinate hiring handoffs with city teams." />
              </label>
              <div className="flex flex-wrap gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                  Paid Advertisement
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                  Urgent Hiring
                </label>
                <Button variant="ghost">
                  <Icon name="search" className="h-4 w-4" />
                  Preview
                </Button>
                <Button variant="accent">
                  <Icon name="shield" className="h-4 w-4" />
                  Send to admin
                </Button>
              </div>
            </form>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Job management</h2>
              <div className="mt-4 grid gap-3">
                {employerJobs.map((job) => (
                  <div key={job.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-950">{job.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {job.applicants} applicants - {job.shortlisted} shortlisted
                        </p>
                      </div>
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                        {job.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">{job.budget} - {job.expires}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Applicant queue</h2>
              <div className="mt-4 grid gap-3">
                {applicantQueue.map((applicant) => (
                  <div key={applicant.id} className="rounded-lg bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-950">{applicant.name}</h3>
                        <p className="text-sm text-slate-500">{applicant.role}</p>
                      </div>
                      <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-bold text-teal-700">
                        {applicant.stage}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">Note: {applicant.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Dashboard sections</h2>
            <div className="mt-4 grid gap-3">
              {['All Jobs', 'Active Jobs', 'Closed Jobs', 'Applicants', 'Payment History', 'Advertisement Management', 'Chat support'].map((item) => (
                <button key={item} type="button" className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-100">
                  {item}
                  <Icon name="check" className="h-4 w-4 text-teal-600" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-orange-200 bg-orange-50 p-5">
            <h2 className="text-xl font-black text-slate-950">Advertisement management</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Promote job posts as paid advertisements by selecting active days and urgency.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[7, 14, 30].map((days) => (
                <button key={days} type="button" className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm">
                  {days} days
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-teal-200 bg-teal-50 p-5">
            <h2 className="text-xl font-black text-slate-950">Chat support</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Candidate chat unlocks for applicants who respond or are shortlisted by your hiring team.
            </p>
            <Button variant="accent" className="mt-4 w-full">
              <Icon name="message" className="h-4 w-4" />
              Open chat
            </Button>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default EmployerDashboard;
