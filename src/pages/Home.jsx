import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Icon from '../components/Icon';
import JobCard from '../components/JobCard';
import { useLocale } from '../context/LocaleContext';
import { candidateProfiles, jobCategories, jobs, platformStats } from '../data/mockData';

const workflowItems = [
  {
    title: 'Candidates',
    detail: 'Create a verified profile, search jobs, export CV, save jobs, and apply after login.',
    icon: 'users',
  },
  {
    title: 'Employers',
    detail: 'Register with OTP, post jobs, promote ads, search blurred candidate previews, and unlock contacts.',
    icon: 'briefcase',
  },
  {
    title: 'Admins',
    detail: 'Approve job posts, verify profiles, moderate duplicates, and monitor city-wise activity.',
    icon: 'shield',
  },
];

const Home = () => {
  const featuredJobs = jobs.slice(0, 3);
  const { t } = useLocale();

  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-bold text-teal-700">
              <Icon name="shield" className="h-4 w-4" />
              {t.home.badge}
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              JobPortal
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              {t.home.description}
            </p>

            <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                <label className="relative">
                  <span className="sr-only">Search keyword</span>
                  <Icon name="search" className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t.home.keyword}
                    className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </label>
                <label className="relative">
                  <span className="sr-only">Search location</span>
                  <Icon name="map" className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t.home.location}
                    className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </label>
                <Button to="/jobs" variant="accent" className="h-12 px-6">
                  <Icon name="search" className="h-4 w-4" />
                  {t.home.search}
                </Button>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Button to="/jobs" variant="ghost" className="justify-start">
                  <Icon name="users" className="h-4 w-4 text-teal-600" />
                  {t.home.seeking}
                </Button>
                <Button to="/candidates" variant="ghost" className="justify-start">
                  <Icon name="briefcase" className="h-4 w-4 text-orange-500" />
                  {t.home.hiring}
                </Button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {platformStats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-2xl font-black text-slate-950">{stat.value}</p>
                  <p className="mt-1 text-sm font-bold text-slate-700">{stat.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-lg border border-slate-200 bg-slate-950 p-4 text-white shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-slate-300">Live hiring board</p>
                  <h2 className="text-xl font-bold">Bengaluru - Product Roles</h2>
                </div>
                <span className="rounded-md bg-teal-500 px-2.5 py-1 text-xs font-bold text-white">Live</span>
              </div>

              <div className="mt-4 grid gap-3">
                {featuredJobs.map((job) => (
                  <div key={job.id} className="rounded-lg bg-white p-4 text-slate-900">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold">{job.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{job.company}</p>
                      </div>
                      <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-bold text-teal-700">
                        {job.fitScore}% fit
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/10 p-4">
                  <p className="text-2xl font-black">{candidateProfiles.length * 1600}+</p>
                  <p className="text-sm text-slate-300">profiles searchable</p>
                </div>
                <div className="rounded-lg bg-white/10 p-4">
                  <p className="text-2xl font-black">OTP</p>
                  <p className="text-sm text-slate-300">phone login ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-orange-600">{t.home.featuredEyebrow}</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">{t.home.featuredTitle}</h2>
            </div>
            <Button to="/jobs" variant="ghost">
              {t.home.viewAll}
              <Icon name="search" className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-teal-700">{t.home.modulesEyebrow}</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">{t.home.modulesTitle}</h2>
            <p className="mt-4 leading-7 text-slate-600">{t.home.modulesBody}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {workflowItems.map((item) => (
              <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-900">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {jobCategories.map((category) => (
              <Link
                key={category.title}
                to="/jobs"
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <Icon name={category.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold text-slate-950">{category.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{category.count.toLocaleString()} open roles</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
